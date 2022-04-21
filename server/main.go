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
	"io/ioutil"
	"log"
	_ "net"
	"net/http"
)

var MysqlDb *sql.DB
var MysqlDbErr error

var (
	config = &struct {
		Server            string
		Username          string
		Password          string
		Database          string
		Charset           string
		SMTPserver        string
		SMTPport          string
		SMTPusername      string
		SMTPpassword      string
		SMTPshowname      string
		Verifycodetimeout int
	}{"127.0.0.1:3306", "root", "123456",
		"monibuca", "utf8", "", "", "", "", "", 300}
	ConfigRaw []byte
)

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
		if cfg, ok := cg["Options"]; ok {
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
		log.Println(err)
	}
	//设置数据库最大连接数
	MysqlDb.SetConnMaxLifetime(10)
	//设置上数据库最大闲置连接数
	MysqlDb.SetMaxIdleConns(5)
	//验证连接
	if err := MysqlDb.Ping(); err != nil {
		log.Println(err)
	}
}

func main() {
	//util.SendMailUsingTLS(config.SMTPserver, config.SMTPport, config.SMTPshowname, "pg830616@163.com",
	//	"hello", config.SMTPpassword, config.SMTPusername, "注册验证码")
	defer MysqlDb.Close()
	showProcessList := util.QueryAndParseRows(MysqlDb, "select * from user")
	util.Print("多行数据-进程信息:%v\n", util.Data2Json(showProcessList))

	util.Print("server is ", config.Server)

	fmt.Println("start server at 9999")
	http.HandleFunc("/api/user/register", register)
	http.HandleFunc("/api/user/getVerifyCode", getVerifyCode)
	http.HandleFunc("/api/user/login", login)
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
登录
*/
func login(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v", formData)
	mail := formData["mail"]
	password := formData["password"]
	datacount, err := util.QueryCountSql(MysqlDb, "select * from user where mail=? and password=md5(?)", mail, password)
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if datacount > 0 {
		go func() {
			util.QueryCountSql(MysqlDb, "update user set lastlogintime=now() where mail=?", mail)
		}()
		w.Write(util.ErrJson(util.OK))
		return
	}
}

/**
获取验证码
*/
func getVerifyCode(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	mail := formData["mail"]
	verifycode := util.RandNumStr(6)
	err := util.SendMailUsingTLS(config.SMTPserver, config.SMTPport, config.SMTPshowname, fmt.Sprintf("%v", mail), "hello", config.SMTPpassword, config.SMTPusername, "注册验证码")
	if err != nil {
		log.Println("send mail err is ", err)
		w.Write(util.ErrJson(util.ErrSendMailError))
		return
	}
	result, err := MysqlDb.Exec("insert into verifycode(mail,verifycode,createtime) values(?,?,now())", mail, verifycode)
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	} else {
		rowsaffected, _ := result.RowsAffected()
		if rowsaffected > 0 {
			w.Write(util.ErrJson(util.OK))
			return
		} else {
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
	}
}

/**
注册
*/
func register(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v", formData)
	mail := formData["mail"]
	password := formData["password"]
	verifycode := formData["verifycode"]
	datacount, err := util.QueryCountSql(MysqlDb, "select * from user where mail=?", mail)
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if datacount > 0 { //有用户数据，不需要注册，直接登录
		w.Write(util.ErrJson(util.ErrUserHasRegister))
		return
	} else { //没有该邮箱，需要注册，先校验验证码，然后建立用户数据
		ret, err := util.QueryCountSql(MysqlDb, "select * from verifycode where NOW()<=DATE_ADD(createtime,INTERVAL ? MINUTE) and "+
			" verifycode=? and mail=?", config.Verifycodetimeout, verifycode, mail)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
		if ret == 0 {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrValidation))
			return
		}
		result, err := MysqlDb.Exec("insert INTO user(mail,password,createtime) values(?,md5(?),now())", mail, password)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		} else {
			rowsaffected, _ := result.RowsAffected()
			if rowsaffected > 0 {
				w.Write(util.ErrJson(util.OK))
				return
			} else {
				w.Write(util.ErrJson(util.ErrDatabase))
				return
			}
		}
	}
}

// CORS 允许跨域调用/**
func CORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	origin := r.Header["Origin"]
	if len(origin) == 0 {
		w.Header().Set("Access-Control-Allow-Origin", "*")
	} else {
		w.Header().Set("Access-Control-Allow-Origin", origin[0])
	}
}

/**
解析request数据，返回map
*/
func getDataFromHttpRequest(w http.ResponseWriter, r *http.Request) (formData map[string]interface{}) {
	CORS(w, r)
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal("parse form error ", err)
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	fmt.Println("json:", string(body))
	// 初始化请求变量结构
	// 调用json包的解析，解析请求body
	if err = json.Unmarshal(body, &formData); err != nil {
		fmt.Printf("Unmarshal err, %v\n", err)
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	fmt.Printf("formData is %+v", formData)
	return formData
}
