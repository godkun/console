package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"strings"
	"time"

	"gitee.com/console/server/util"
	"golang.org/x/net/websocket"
)

var wsv1 = websocket.Handler(func(w *websocket.Conn) {
	var secret string
	var err error
	connect := false
	remoteAddr := w.Request().RemoteAddr
	fmt.Println("客户端获取到的ip为:" + remoteAddr)
	for {
		//只支持string类型
		var reply string
		if err = websocket.Message.Receive(w, &reply); err != nil {
			log.Println("websocket出现异常", err)
			break
		}
		fmt.Println("收到客户端消息:" + reply)
		//replyJson := make(map[string]string)
		//json.Unmarshal([]byte(reply), &replyJson)
		//secret = replyJson["secret"]
		secret = reply
		totalcount, err := db.QueryCountSql( "select count(1) from instance where secret = ?", secret)
		if err != nil {
			fmt.Println(err)
			if err = websocket.Message.Send(w, util.ErrJson(util.ErrDatabase)); err != nil {
				log.Println("websocket出现异常", err)
			}
			break
		}
		if totalcount > 0 {
			instance := NewInstance("", secret)
			instance.lastAccessedTime = time.Now()
			instance.W = w
			instances.Set(secret, instance)
			if err = websocket.Message.Send(w, util.ErrJson(util.OK())); err != nil {
				log.Println("websocket出现异常", err)
				break
			}
			connect = true
			remoteIP, _, _ := strings.Cut(remoteAddr, ":")
			go db.Exec("update instance set RemoteIP=?,online='1'  where secret=? ", remoteIP, secret)
			break
		} else {
			if err = websocket.Message.Send(w, util.ErrJson(util.ErrSecretWrong)); err != nil {
				log.Println("websocket出现异常", err)
			}
			break
		}
		//msg := reply + ", 我是服务端"
		//fmt.Println("发送客户端消息:" + msg)
		//if error = websocket.Message.Send(w, msg); error != nil {
		//	log.Println("websocket出现异常", error)
		//	break
		//}
	}
	defer wsClose(w, secret)
	instance := instances.Get(secret)
	if instance == nil {
		w.Write(util.ErrJson(util.ErrInstanceNotConnect))
		return
	}
	delay := time.NewTimer(time.Second)
	defer delay.Stop()
	for connect {
		delay.Reset(time.Second)
		select {
		case <-delay.C:
			if err = websocket.Message.Send(instance.W, "/api/sysinfo\n"); err != nil {
				log.Println("websocket出现异常", err)
				return
			} else {
				var reply string
				if err = websocket.Message.Receive(w, &reply); err != nil {
					log.Println("websocket出现异常", err)
					return
				}
			}
		case rw := <-instance.Ch:
			body, _ := ioutil.ReadAll(rw.R.Body)
			if len(body) > 0 {
				fmt.Printf("body is %+v\n", string(body))
			}
			if err = websocket.Message.Send(instance.W, rw.R.RequestURI+"\n"+string(body)); err != nil {
				log.Println("websocket出现异常", err)
				connect = false
			} else {
				var reply string
				if err = websocket.Message.Receive(w, &reply); err != nil {
					log.Println("websocket出现异常", err)
					connect = false
				} else if rw.R.Context().Err() == nil {
					rw.W.Write([]byte(reply))
				}
				fmt.Println("收到客户端消息1111:" + reply)
			}
			rw.Done()
		}
	}
})

/*
*
ws链接关闭时清理缓存
*/
func wsClose(w *websocket.Conn, secret string) {
	fmt.Println("nothing")
	if len(secret) > 0 {
		go func() {
			db.Exec("update instance set online='0'  where secret=? ", secret)
		}()
		instances.Delete(secret)
		fmt.Println("delete ws,secret is" + secret)
	} else {
		fmt.Println("into else")
	}
	fmt.Println("websocket is closes 1111,secret is " + secret)
	w.Close()
}
