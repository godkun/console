package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"gitee.com/console/server/util"
	"github.com/BurntSushi/toml"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
	"github.com/jordan-wright/email"
	"io/ioutil"
	"log"
	"net/http"
	"net/smtp"
)

var MysqlDb *sql.DB
var MysqlDbErr error

var (
	config = &struct {
		Server       string
		Username     string
		Password     string
		Database     string
		Charset      string
		SMTPserver   string
		SMTPport     string
		SMTPusername string
		SMTPpassword string
	}{"127.0.0.1:3306", "root", "123456",
		"monibuca", "utf8", "", "", "", ""}
	ConfigRaw []byte
)

func sendEmail() {
	//创建一个电子邮件
	e := email.NewEmail()
	//设置发送方邮件
	e.From = "pg830616@163.com"
	//设置接收方得邮件
	e.To = []string{"pg@monibuca.com"}
	//设置主题
	e.Subject = "中国"
	//设置文件发送内容
	e.Text = []byte("北京是个好地方")
	//设置服务器相关的配置
	err := e.Send(config.SMTPserver+":"+config.SMTPport,
		smtp.PlainAuth("", config.SMTPusername, config.SMTPpassword, config.SMTPserver))
	if err != nil {
		log.Fatal(err)
	}
}

func init() {

	var err error
	addr := flag.String("c", "config.toml", "config file")
	flag.Parse()
	if err := util.CreateShutdownScript(); err != nil {
		util.Print("create shutdown script error:", err)
	}

	if ConfigRaw, err = ioutil.ReadFile(*addr); err != nil {
		util.Print("read config file error:", err)
		return
	}

	var cg map[string]interface{}

	if _, err = toml.Decode(string(ConfigRaw), &cg); err == nil {
		if cfg, ok := cg["Mysql"]; ok {
			b, _ := json.Marshal(cfg)
			if err = json.Unmarshal(b, config); err != nil {
				log.Println(err)
			}
		}
		if cfg, ok := cg["Mail"]; ok {
			b, _ := json.Marshal(cfg)
			if err = json.Unmarshal(b, config); err != nil {
				log.Println(err)
			}
		}
	} else {
		util.Print("decode config file error:", err)
	}

	//Golang数据连接："用户名:密码@tcp(IP:端口号)/数据库名?charset=utf8"
	dbDSN := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=%s", config.Username, config.Password, config.Server, config.Database, config.Charset)
	//打开数据库,前者是驱动名，所以要导入： _ "github.com/go-sql-driver/mysql"
	MysqlDb, err = sql.Open("mysql", dbDSN)
	if err != nil {
		//如果打开数据库错误，直接panic
		panic(err)
	}
	//设置数据库最大连接数
	MysqlDb.SetConnMaxLifetime(10)
	//设置上数据库最大闲置连接数
	MysqlDb.SetMaxIdleConns(5)
	//验证连接
	if err := MysqlDb.Ping(); err != nil {
		panic(err)
	}
}

func main() {
	sendEmail()
	defer MysqlDb.Close()
	showProcessList := util.QueryAndParseRows(MysqlDb, "select * from user")
	util.Print("多行数据-进程信息:%v\n", util.Data2Json(showProcessList))

	util.Print("server is ", config.Server)

	fmt.Println("start server at 9999")
	http.HandleFunc("/register", register)
	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("start server at 9999")
		conn, _, _, err := ws.UpgradeHTTP(r, w)
		if err != nil {
			// handle error
		}
		go func() {
			defer conn.Close()

			for {
				msg, op, err := wsutil.ReadClientData(conn)
				fmt.Println("read msg is " + string(msg))
				if err != nil {
				}
				err = wsutil.WriteServerMessage(conn, op, msg)
				if err != nil {
					// handle error
				}
			}
		}()
	})
	log.Fatal(http.ListenAndServe(":9999", nil))
}

/**
注册
*/
func register(w http.ResponseWriter, r *http.Request) {

	resultData := make(map[string]string)
	resultData["code"] = "-1"
	resultData["msg"] = "注册失败"
	jsonData, _ := json.Marshal(resultData)

	CORS(w, r)
	err := r.ParseForm()
	if err != nil {
		log.Fatal("parse form error ", err)
	}
	// 初始化请求变量结构
	formData := make(map[string]interface{})
	// 调用json包的解析，解析请求body
	json.NewDecoder(r.Body).Decode(&formData)
	userName := formData["username"]
	password := formData["password"]
	mail := formData["mail"]
	ret, err := MysqlDb.Exec("insert INTO user(mail,username,password,createtime) values(?,?,md5(?),now())", mail, userName, password)
	if err != nil {
		fmt.Println(err)
		w.Write(jsonData)
		return
	}
	//影响行数
	rowsaffected, _ := ret.RowsAffected()
	fmt.Println("RowsAffected:", rowsaffected)
	if rowsaffected > 0 {
		resultData := make(map[string]string)
		resultData["code"] = "0"
		resultData["msg"] = "注册成功"
		jsonData, _ = json.Marshal(resultData)
		w.Write(jsonData)
	}
}

func CORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	origin := r.Header["Origin"]
	if len(origin) == 0 {
		w.Header().Set("Access-Control-Allow-Origin", "*")
	} else {
		w.Header().Set("Access-Control-Allow-Origin", origin[0])
	}
}
