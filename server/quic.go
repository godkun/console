package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"github.com/Monibuca/console/server/util"
	"strings"
	"time"

	"github.com/quic-go/quic-go"
	"gopkg.in/yaml.v3"
)

func startQuic() error {
	if nothasStartTime {
		startTime = time.Now()
		nothasStartTime = false
	}
	listener, err := quic.ListenAddr(config.QuicPort, generateTLSConfig(), &quic.Config{
		EnableDatagrams: true,
	})
	if err != nil {
		return err
	}
	fmt.Println("start quic  server at :4242")
	for {
		conn, err := listener.Accept(ctxBack)
		if err != nil {
			return err
		}
		remoteAddr := conn.RemoteAddr().String()
		fmt.Println("客户端获取到的ip为:", remoteAddr)
		stream, err := conn.AcceptStream(ctxBack)
		if err != nil {
			fmt.Println("AcceptStream error:", err)
			continue
		}
		var version byte
		var secret string
		r := bufio.NewReader(stream)
		version, err = r.ReadByte()
		if err != nil {
			fmt.Println("readversion error:", err)
			continue
		}
		secret, err = r.ReadString('\n')
		if version > 10 {
			secret = string(version) + secret
			version = 0
		}
		if err != nil {
			fmt.Println("readsecret error:", err)
			continue
		}
		secret = secret[:len(secret)-1]
		data := db.QueryAndParseJsonRows("select * from instance where secret = ?", secret)
		if len(data) > 0 {
			instance := NewInstance("", secret)
			instance.id = data[0]["id"]
			instance.lastAccessedTime = time.Now()
			instance.Quic = conn
			instances.Set(secret, instance)
			json.NewEncoder(stream).Encode(map[string]any{"code": 0, "msg": "ok", "enableReport": data[0]["report"] == "1", "instanceId": instance.id})
			remoteIP, _, _ := strings.Cut(remoteAddr, ":")
			if version > 0 {
				stream.Write([]byte{0})
			} else {
				stream.Close()
			}
			go func() {
				fmt.Println("client online:", remoteAddr)
				db.Exec("update instance set RemoteIP=?,online='1'  where secret=? ", remoteIP, secret)
				for {
					data, err := r.ReadBytes(0)
					if err != nil {
						fmt.Println(err)
						break
					}
					var msg = make(map[string]any)
					yaml.Unmarshal(data[:len(data)-1], &msg)
					fmt.Println(msg)
					switch msg["type"].(string) {
					case "create":
					case "close":
					case "pulse":
					case "addtrack":
					}
				}
				if instances.Get(secret) == instance {
					fmt.Println("client offline:", remoteAddr)
					db.Exec("update instance set online='0' where id=? ", instance.id)
					instances.Delete(secret)
				}
			}()
		} else {
			stream.Write(util.ErrJson(util.ErrSecretWrong))
			stream.Close()
		}
	}
}
