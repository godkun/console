package util

import (
	"crypto/tls"
	"fmt"
	"net"
	"net/smtp"
)

func dial(addr string) (*smtp.Client, error) {
	//todo 没有就跳过证书,需要参数 &tls.Config{InsecureSkipVerify:true}
	conn, err := tls.Dial("tcp", addr, nil)
	if err != nil {
		fmt.Println("Dialing Error:", err)
		return nil, err
	}
	//分解主机端口字符串
	host, _, _ := net.SplitHostPort(addr)
	return smtp.NewClient(conn, host)
}

// SendMailUsingTLS 参考net/smtp的func SendMail()
//使用net.Dial连接tls(ssl)端口时,smtp.NewClient()会卡住且不提示err
//len(to)>1时,to[1]开始提示是密送
func SendMailUsingTLS(server string, port string, from string, to string, body string, password string, username string, subject string) (err error) {
	fmt.Println("start SendMailUsingTLS... ")

	header := make(map[string]string)
	header["From"] = from + "<" + username + ">"
	header["To"] = to
	header["Subject"] = subject
	header["Content-Type"] = "text/html;chartset=UTF-8"
	message := ""
	for k, v := range header {
		message += fmt.Sprintf("%s:%s\r\n", k, v)
	}
	message += "\r\n" + body

	auth := smtp.PlainAuth("", username, password, server)
	//create smtp client
	c, err := dial(server + port)
	fmt.Println("c:", c)
	if err != nil {
		fmt.Println("Create smpt client error:", err)
		return err
	}
	defer c.Close()
	if auth != nil {
		if ok, param := c.Extension("AUTH"); ok {
			fmt.Println("ok:", ok)
			fmt.Println("param:", param)
			if err = c.Auth(auth); err != nil {
				fmt.Println("Error during AUTH:", err)
				return err
			}
		}
	}
	if err = c.Mail(username); err != nil {
		fmt.Println(err)
		return err
	}

	//for _, addr := range to {
	if err = c.Rcpt(to); err != nil {
		fmt.Println(err)
		return err
	}
	//}

	w, err := c.Data()
	if err != nil {
		fmt.Println(err)
		return err
	}

	_, err = w.Write([]byte(message))
	if err != nil {
		fmt.Println(err)
		return err
	}

	err = w.Close()
	if err != nil {
		fmt.Println(err)
		return err
	}
	return c.Quit()
}
