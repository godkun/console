package pkg

import (
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/Monibuca/console/server/pkg/util"

	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
)

func (instance *Instance) relayQuic(w http.ResponseWriter, r *http.Request) {
	relayURL := r.URL.EscapedPath()
	if r.URL.RawQuery != "" {
		relayURL += "?" + r.URL.RawQuery
	}
	fmt.Println("relayQuic", relayURL)
	s, err := instance.Quic.OpenStream()
	if r.Header.Get("Accept") == "text/event-stream" {
		header := w.Header()
		header.Set("Content-Type", "text/event-stream")
		header.Set("Cache-Control", "no-cache")
		header.Set("Connection", "keep-alive")
		header.Set("X-Accel-Buffering", "no")
		header.Set("Access-Control-Allow-Origin", "*")
		s.Write([]byte(relayURL + "\r\n"))
		r.Header.Write(s)
		s.Write([]byte("\r\n"))
		b := make([]byte, 1024)
		defer s.Close()
		for r.Context().Err() == nil {
			if n, err := s.Read(b); err == nil {
				if _, err = w.Write(b[:n]); err == nil {
					w.(http.Flusher).Flush()
				} else {
					return
				}
			} else {
				return
			}
		}
	} else if r.Header.Get("Upgrade") == "websocket" {
		conn, _, _, err := ws.UpgradeHTTP(r, w)
		s.Write([]byte(relayURL + "\r\n"))
		r.Header.Write(s)
		s.Write([]byte("\r\n"))

		// b := make([]byte, 1024)
		defer s.Close()
		go func() {
			var msg []byte
			var err error
			for err == nil {
				msg, err = wsutil.ReadServerText(s)
				fmt.Println("server:", string(msg))
				if err == nil {
					err = wsutil.WriteServerText(conn, msg)
				}
			}
		}()
		var msg []byte
		for err == nil {
			msg, err = wsutil.ReadClientText(conn)
			fmt.Println("client:", string(msg))
			if err == nil {
				err = wsutil.WriteClientText(s, msg)
			}
		}
		if err != nil {
			fmt.Println(err)
		}

		// for r.Context().Err() == nil {
		// 	if n, err := s.Read(b); err == nil {
		// 		if _, err = w.Write(b[:n]); err == nil {
		// 			w.(http.Flusher).Flush()
		// 		} else {
		// 			return
		// 		}
		// 	} else {
		// 		return
		// 	}
		// }
	} else {
		if err == nil {
			s.Write([]byte(relayURL + "\r\n"))
			r.Header.Write(s)
			s.Write([]byte("\r\n"))
			io.Copy(s, r.Body)
			s.Close()
			io.Copy(w, s)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}
func relay(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	if sessionV == nil {
		http.Error(w, "session error", http.StatusInternalServerError)
		return
	}
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	}
	var instance *Instance
	//formData := getDataFromHttpRequest(w, r)
	//fmt.Printf("formData is %+v\n", formData)
	// fmt.Printf("Header is %+v\n", r.Header["M7sid"])
	pass := r.Header.Get("Pass")
	instanceId, _, err := decodePass(pass)
	if err != nil {
		id := r.Header.Get("M7sid")
		if id == "" {
			id = r.URL.Query().Get("m7sid")
		}
		// fmt.Printf("m7sid is %+v\n", id)
		instance = instances.FindByIdAndMail(id, mail.(string))
		if instance == nil {
			secretData := db.QueryAndParse("select * from instance where id = ? and mail= ?", id, mail)
			secret := secretData["secret"]
			if len(secret) > 0 {
				instance = instances.Get(secret)
				if instance == nil {
					w.Write(util.ErrJson(util.ErrInstanceNotConnect))
					return
				} else {
					instance.mail = mail.(string)
					instance.id = id
				}

			} else {
				w.Write(util.ErrJson(util.ErrSecretWrong))
				return
			}
		}
	} else {
		instance = instances.FindById(instanceId)
		if instance == nil {
			http.Error(w, "instance not found", http.StatusNotFound)
			return
		}
	}

	instance.lastAccessedTime = time.Now()
	if instance.Quic != nil {
		instance.relayQuic(w, r)
	} else {
		var rq IncomingRequest
		rq.W = w
		rq.R = r
		rq.Add(1)
		instance.Ch <- &rq
		rq.Wait()
	}
}
