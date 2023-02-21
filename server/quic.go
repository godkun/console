package main

import (
	"bufio"
	"fmt"
	"strings"
	"time"

	"gitee.com/console/server/util"
	"github.com/quic-go/quic-go"
)

func startQuic() error {
	listener, err := quic.ListenAddr(":4242", generateTLSConfig(), nil)
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
		secret, err := bufio.NewReader(stream).ReadString('\n')
		if err != nil {
			fmt.Println("readsecret error:", err)
			continue
		}
		secret = secret[:len(secret)-1]
		totalcount, err := util.QueryCountSql(MysqlDb, "select count(1) from instance where secret = ?", secret)
		if err != nil {
			fmt.Println(err)
			stream.Write(util.ErrJson(util.ErrDatabase))
		} else if totalcount > 0 {
			instance := NewInstance("", secret)
			instance.lastAccessedTime = time.Now()
			instance.Quic = conn
			instances.Set(secret, instance)
			stream.Write(util.ErrJson(util.OK()))
			remoteIP, _, _ := strings.Cut(remoteAddr, ":")
			go func() {
				fmt.Println("client online:", remoteAddr)
				MysqlDb.Exec("update instance set RemoteIP=?,online='1'  where secret=? ", remoteIP, secret)
				<-conn.Context().Done()
				if instances.Get(secret) == instance {
					fmt.Println("client offline:", remoteAddr)
					MysqlDb.Exec("update instance set online='0' where secret=? ", secret)
					instances.Delete(secret)
				}
			}()
		} else {
			stream.Write(util.ErrJson(util.ErrSecretWrong))
		}
		stream.Close()
	}
}
