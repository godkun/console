package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"gitee.com/console/server/sessions"
	"gitee.com/console/server/util"
	"github.com/BurntSushi/toml"
	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/net/websocket"
	"io/ioutil"
	"log"
	"mime"
	_ "net"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

var MysqlDb *sql.DB
var MysqlDbErr error
var mailtxt string
var resetpwdtxt string
var sessionM *sessions.SessionManager
var instances = NewConcurInstances()
var commandChannel = make(chan string, 10)
var ch = make(chan string, 1)

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
		ServerPort        string
		Secret            string
		HostName          string
	}{"127.0.0.1:3306", "root", "123456",
		"monibuca", "utf8", "", "", "", "",
		"", 300, ":9999", "Monibuca#!4", "http://localhost/"}
	ConfigRaw []byte
)

func init() {
	sessionM = sessions.NewSessionMange() //建议把这个放在你的公共区域，用的时候只调用一次就行了，初始化
	var err error
	addr := flag.String("c", "config.toml", "config file")

	var mailtxtbyte []byte
	if mailtxtbyte, err = ioutil.ReadFile("registermailtxt"); err != nil {
		util.Print("read config file error:", err)
		return
	}
	mailtxt = string(mailtxtbyte)

	var resetpwdtxtbyte []byte
	if resetpwdtxtbyte, err = ioutil.ReadFile("resetpwdtxt"); err != nil {
		util.Print("read config file error:", err)
		return
	}
	resetpwdtxt = string(resetpwdtxtbyte)

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

const maxUploadSize = 2 * 1024 * 2014 // 2 MB
const uploadPath = "./files"

func main() {
	//util.SendMailUsingTLS(config.SMTPserver, config.SMTPport, config.SMTPshowname, "pg830616@163.com",
	//	"hello", config.SMTPpassword, config.SMTPusername, "注册验证码")
	defer MysqlDb.Close()

	fmt.Println("start server at ", config.ServerPort)
	http.Handle("/api/upload/", http.StripPrefix("/api/upload/", http.FileServer(http.Dir("./static"))))
	http.HandleFunc("/api/user/register", userRegister)
	http.HandleFunc("/api/user/getverifycode", getVerifyCode)
	http.HandleFunc("/api/user/login", userLogin)
	http.HandleFunc("/api/user/logout", userLogout)
	http.HandleFunc("/api/user/changepassword", changePassword)
	http.HandleFunc("/api/user/sendresetpwdmail", sendResetPwdMail)
	http.HandleFunc("/api/user/resetpwd", resetPwd)
	http.HandleFunc("/api/instance/list", instanceList)
	http.HandleFunc("/api/instance/add", instanceAdd)
	http.HandleFunc("/api/instance/del", instanceDel)
	http.HandleFunc("/api/instance/update", instanceUpdate)
	http.HandleFunc("/api/uploadFile", uploadFileHandler())
	fs := http.FileServer(http.Dir(uploadPath))
	http.Handle("/files/", http.StripPrefix("/files", fs))
	//http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
	//	fmt.Println("start server at 9999")
	//	conn, _, _, err := ws.UpgradeHTTP(r, w)
	//	if err != nil {
	//		// handle error
	//	}
	//	go func() {
	//		defer conn.Close()
	//
	//		for {
	//			msg, op, err := wsutil.ReadClientData(conn)
	//			fmt.Println("read msg is " + string(msg))
	//			if err != nil {
	//			}
	//			err = wsutil.WriteServerMessage(conn, op, msg)
	//			if err != nil {
	//				// handle error
	//			}
	//		}
	//	}()
	//})
	http.Handle("/api/files/", http.StripPrefix("/api/files", fs))
	http.Handle("/ws/v1", websocket.Handler(func(w *websocket.Conn) {
		var secret string
		var error error
		connect := false
		fmt.Println("客户端获取到的ip为:" + w.Request().RemoteAddr)
		for {
			//只支持string类型
			var reply string
			if error = websocket.Message.Receive(w, &reply); error != nil {
				log.Println("websocket出现异常", error)
				break
			}
			fmt.Println("收到客户端消息:" + reply)
			//replyJson := make(map[string]string)
			//json.Unmarshal([]byte(reply), &replyJson)
			//secret = replyJson["secret"]
			secret := reply
			totalcount, err := util.QueryCountSql(MysqlDb, "select count(1) from instance where secret = ?", secret)
			if err != nil {
				fmt.Println(err)
				if error = websocket.Message.Send(w, util.ErrJson(util.ErrDatabase)); error != nil {
					log.Println("websocket出现异常", error)
				}
				break
			}
			if totalcount > 0 {
				instance := NewInstance("", secret)
				instance.lastAccessedTime = time.Now()
				instance.W = w
				instances.Set(secret, instance)
				if error = websocket.Message.Send(w, util.ErrJson(util.OK())); error != nil {
					log.Println("websocket出现异常", error)
					break
				}
				connect = true
				go func() {
					MysqlDb.Exec("update instance set RemoteIP=?  where secret=? ", w.RemoteAddr().String(), secret)
				}()
				break
			} else {
				if error = websocket.Message.Send(w, util.ErrJson(util.ErrSecretWrong)); error != nil {
					log.Println("websocket出现异常", error)
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
		if connect {
			for {
				var reply string
				if error = websocket.Message.Receive(w, &reply); error != nil {
					log.Println("websocket出现异常", error)
					break
				}
				fmt.Println("收到客户端消息1111:" + reply)
				ch <- reply
			}
		}
	}))
	//http.HandleFunc("/api/instance/sendCommand", sendCommand)
	http.HandleFunc("/api/summary", summaryCommand)
	http.HandleFunc("/api/plugins", pluginsCommand)
	http.HandleFunc("/api/stream", streamCommand)
	http.HandleFunc("/api/sysinfo", sysinfoCommand)
	http.HandleFunc("/api/stopstream", stopstreamCommand)
	http.HandleFunc("/api/getconfig", getconfigCommand)
	http.HandleFunc("/api/modifyconfig", modifyconfigCommand)
	http.HandleFunc("/api/updateconfig", updateconfigCommand)
	go func() {
		clearTimeOutInstance()
	}()
	log.Fatal(http.ListenAndServeTLS(config.ServerPort, "console.monibuca.com_bundle.crt", "console.monibuca.com.key", nil))
	//log.Fatal(http.ListenAndServe(config.ServerPort, nil))
}

func updateconfigCommand(w http.ResponseWriter, r *http.Request) {
	execCommand(w, r, "/api/updateconfig")
}

func modifyconfigCommand(w http.ResponseWriter, r *http.Request) {
	execCommand(w, r, "/api/modifyconfig")
}

func getconfigCommand(w http.ResponseWriter, r *http.Request) {
	execCommand(w, r, "/api/getconfig")
}
func stopstreamCommand(w http.ResponseWriter, r *http.Request) {
	execCommand(w, r, "/api/stopstream")
}

func sysinfoCommand(w http.ResponseWriter, r *http.Request) {
	execCommand(w, r, "/api/sysinfo")
}
func streamCommand(w http.ResponseWriter, r *http.Request) {
	execCommand(w, r, "/api/stream")
}
func pluginsCommand(w http.ResponseWriter, r *http.Request) {
	execCommand(w, r, "/api/plugins")
}
func summaryCommand(w http.ResponseWriter, r *http.Request) {
	execCommand(w, r, "/api/summary")
}

func execCommand(w http.ResponseWriter, r *http.Request, command string) {
	sessionV := sessionM.BeginSession(w, r)
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	}
	//formData := getDataFromHttpRequest(w, r)
	//fmt.Printf("formData is %+v\n", formData)
	fmt.Printf("Header is %+v\n", r.Header["M7sid"])
	id := r.Header["M7sid"][0]
	fmt.Printf("m7sid is %+v\n", id)
	secretData := util.QueryAndParse(MysqlDb, "select * from instance where id = ? and mail= ?", id, mail)
	if secretData != nil {
		secret := secretData["secret"]
		if len(secret) > 0 {
			instance := instances.Get(secret)
			if instance == nil {
				w.Write(util.ErrJson(util.ErrInstanceNotConnect))
				return
			}
			instance.lastAccessedTime = time.Now()
			instances.Set(secret, instance)
			timer := time.NewTimer(time.Second * 5)
			defer timer.Stop()
			switch command {
			case "/api/summary":
				if error := websocket.Message.Send(instance.W, "/api/summary?json=1\n"); error != nil {
					log.Println("websocket出现异常", error)
				}
				break
			case "/api/plugins":
				if error := websocket.Message.Send(instance.W, "/api/plugins\n"); error != nil {
					log.Println("websocket出现异常", error)
				}
				break
			case "/api/stream":
				streamPath := r.URL.Query().Get("streamPath")
				if len(streamPath) > 0 {
					if error := websocket.Message.Send(instance.W, "/api/stream?streamPath="+streamPath+"\n"); error != nil {
						log.Println("websocket出现异常", error)
					}
					break
				} else {
					w.Write(util.ErrJson(util.ErrRequestParamError))
					return
				}
			case "/api/sysinfo":
				if error := websocket.Message.Send(instance.W, "/api/sysinfo\n"); error != nil {
					log.Println("websocket出现异常", error)
				}
				break
			case "/api/stopstream":
				streamPath := r.URL.Query().Get("streamPath")
				if len(streamPath) > 0 {
					if error := websocket.Message.Send(instance.W, "/api/stopstream?streamPath="+streamPath+"\n"); error != nil {
						log.Println("websocket出现异常", error)
					}
					break
				} else {
					w.Write(util.ErrJson(util.ErrRequestParamError))
					return
				}
				break
			case "/api/getconfig":
				name := r.URL.Query().Get("name")
				url := "/api/getconfig"
				if name != "" {
					url += "?name=" + name + "\n"
				} else {
					url += "\n"
				}
				if error := websocket.Message.Send(instance.W, url); error != nil {
					log.Println("websocket出现异常", error)
				}
				break
			case "/api/modifyconfig":
				name := r.URL.Query().Get("name")
				url := "/api/modifyconfig"
				if name != "" {
					url += "?name=" + name + "\n"
				} else {
					url += "\n"
				}
				body, _ := ioutil.ReadAll(r.Body)
				fmt.Printf("body is %+v\n", string(body))
				fmt.Printf("name is %+v\n", name)
				if error := websocket.Message.Send(instance.W, url+string(body)); error != nil {
					log.Println("websocket出现异常", error)
				}
				break
			case "/api/updateconfig":
				name := r.URL.Query().Get("name")
				url := "/api/updateconfig"
				if name != "" {
					url += "?name=" + name + "\n"
				} else {
					url += "\n"
				}
				if error := websocket.Message.Send(instance.W, url); error != nil {
					log.Println("websocket出现异常", error)
				}
				break
			default:
				w.Write(util.ErrJson(util.ErrRequestParamError))
				return
			}
			for {
				select {
				case data := <-ch:
					fmt.Println("get ch is " + data)
					w.Write([]byte(data))
					return
				case <-timer.C:
					fmt.Println("time out secret is " + secret)
					w.Write(util.ErrJson(util.ErrTimeOut))
					return
				}
			}
		} else {
			w.Write(util.ErrJson(util.ErrSecretWrong))
			return
		}
	}
}

/**
ws链接关闭时清理缓存
*/
func wsClose(w *websocket.Conn, secret string) {
	fmt.Println("websocket is closes")
	w.Close()
	if len(secret) > 0 {
		go func() {
			MysqlDb.Exec("update instance set RemoteIP=''  where secret=? ", secret)
		}()
		instances.Delete(secret)
		fmt.Println("delete ws,secret is" + secret)
	}
}

/**
清除超时实例
*/
func clearTimeOutInstance() {
	if len(instances.Instances) == 0 {
		return
	}
	for k, v := range instances.Instances {
		t := v.lastAccessedTime.Unix() + v.maxAge
		if t < time.Now().Unix() {
			fmt.Println("timeout------->", v)
			instances.Delete(k)
		}
	}
	age2 := int(60 * time.Second)
	time.AfterFunc(time.Duration(age2), func() {
		clearTimeOutInstance()
	})
}

/**
重置密码链接
*/
func resetPwd(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		w.Write([]byte("参数错误"))
		return
	}
	pwddata := util.QueryAndParseJsonRows(MysqlDb, "select * from resetpwd where code=? ", code)
	if pwddata != nil && len(pwddata) > 0 {
		pwddata := pwddata[0]
		newpassword := pwddata["password"]
		mail := pwddata["mail"]
		tx, err := MysqlDb.Begin()
		if err != nil {
			log.Fatalln(err)
			w.Write([]byte("数据库错误"))
			return
		}
		defer clearTransaction(tx, w)
		result, err := tx.Exec("update user set password=? where mail=?", newpassword, mail)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		} else {
			_, err := result.RowsAffected()
			if err != nil {
				log.Fatalln(err)
				return
			}
			result, err = tx.Exec("delete from resetpwd where mail=?", mail)
			if err != nil {
				w.Write([]byte("数据库错误1"))
				return
			}
			if err != nil {
				log.Fatalln(err)
				return
			}
			if err := tx.Commit(); err != nil {
				log.Fatalln(err)
				w.Write([]byte("数据库错误2"))
				return
			}
			w.Write([]byte("密码重置成功"))
			return
		}
	} else {
		w.Write([]byte("密码重置链接已失效"))
		return
	}
}

/**
重置密码，忘记密码
*/
func sendResetPwdMail(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	mail := formData["mail"]
	if mail == nil {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	totalcount, err := util.QueryCountSql(MysqlDb, "select count(1) from user where mail=?", mail)
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if totalcount != 1 {
		w.Write(util.ErrJson(util.ErrUserNotRegister))
		return
	}
	newpassword := util.RandNumStr(6)
	code := util.MD5(config.Secret + mail.(string) + newpassword)

	result, err := MysqlDb.Exec("insert into resetpwd (mail,code,password) values(?,?,md5(?))", mail, code, newpassword)
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	} else {
		rowsaffected, _ := result.RowsAffected()
		if rowsaffected > 0 {
			resetPwdUrl := config.HostName + "/api/user/resetpwd?code=" + code
			mailBody := fmt.Sprintf(resetpwdtxt, resetPwdUrl, newpassword)
			err = util.SendMailUsingTLS(config.SMTPserver, config.SMTPport, config.SMTPshowname, fmt.Sprintf("%v", mail), mailBody, config.SMTPpassword, config.SMTPusername, "重置密码")
			if err != nil {
				w.Write(util.ErrJson(util.ErrSendMailError))
				return
			}
			w.Write(util.ErrJson(util.OK()))
			return
		} else {
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
	}
}

/**
修改密码
*/
func changePassword(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	}
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	password := formData["password"]
	oldpassword := formData["oldpassword"]
	if oldpassword == nil || len(oldpassword.(string)) == 0 || password == nil || len(password.(string)) == 0 {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	totalcount, err := util.QueryCountSql(MysqlDb, "select count(1) from user where mail=? and password=md5(?)", mail, oldpassword)
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if totalcount == 1 {
		result, err := MysqlDb.Exec("update user set password=md5(?)  where mail=? ", password, mail)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		} else {
			rowsaffected, _ := result.RowsAffected()
			if rowsaffected > 0 {
				w.Write(util.ErrJson(util.OK()))
				return
			} else {
				w.Write(util.ErrJson(util.ErrDatabase))
				return
			}
		}
	} else {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrOldPasswordWrong))
		return
	}

}

func sendCommand(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	mail := sessionV.Get("mail")
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	secret := formData["secret"]
	totalcount, err := util.QueryCountSql(MysqlDb, "select count(1) from instance where secret = ? and mail= ?", secret, mail)
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if totalcount > 0 {
		instance := instances.Get(secret.(string))
		instance.lastAccessedTime = time.Now()
		instances.Set(secret.(string), instance)
		if error := websocket.Message.Send(instance.W, "/api/summary?json=1\n"); error != nil {
			log.Println("websocket出现异常", error)
		}
	}
}

/**
登出
*/
func userLogout(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	sessionV.Remove("mail")
	sessionM.Destroy(w, r)
	w.Write(util.ErrJson(util.OK()))
	return
}

/**
删除实例
*/
func instanceDel(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	}
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	id := formData["id"]
	userData := util.QueryAndParseJsonRows(MysqlDb, "select * from instance where mail=? and id=? ", mail, id)
	if userData != nil && len(userData) > 0 {
		result, err := MysqlDb.Exec("delete from instance where id=? and mail=? ", id, mail)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		} else {
			rowsaffected, _ := result.RowsAffected()
			if rowsaffected > 0 {
				w.Write(util.ErrJson(util.OK()))
				return
			} else {
				w.Write(util.ErrJson(util.ErrDatabase))
				return
			}
		}
	} else {
		w.Write(util.ErrJson(util.ErrUserNotFound))
	}
}

/**
获取实例列表
*/
func instanceList(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	}
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	pagesize := int(formData["pagesize"].(float64))
	pageno := int(formData["pageno"].(float64))
	if pagesize == 0 { //不分页，获取所有
		instanceList := util.QueryAndParseJsonRows(MysqlDb, "select * from instance where mail=?  ", mail)
		var resultDataMap = make(map[string]interface{})
		resultDataMap["list"] = instanceList
		resultDataMap["pagesize"] = pagesize
		resultDataMap["pageno"] = pageno
		resultDataMap["totalcount"] = len(instanceList)
		resultDataMapByte, _ := json.Marshal(resultDataMap)
		resultData := util.OK()
		json.Unmarshal(resultDataMapByte, &resultData.Data)
		w.Write(util.ErrJson(resultData))
		return
	} else {
		totalcount, err := util.QueryCountSql(MysqlDb, "select count(1) from instance where mail = ?", mail)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
		instanceList := util.QueryAndParseJsonRows(MysqlDb, "select * from instance where mail=? limit ?,? ", mail, pagesize*(pageno-1), pagesize)
		var resultDataMap = make(map[string]interface{})
		resultDataMap["list"] = instanceList
		resultDataMap["pagesize"] = pagesize
		resultDataMap["pageno"] = pageno
		resultDataMap["totalcount"] = totalcount
		resultDataMapByte, _ := json.Marshal(resultDataMap)
		resultData := util.OK()
		json.Unmarshal(resultDataMapByte, &resultData.Data)
		w.Write(util.ErrJson(resultData))
		return
	}
}

/**
更新实例
*/
func instanceUpdate(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	}
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	id := formData["id"]
	name := formData["name"]
	updatetimestamp := strconv.FormatInt(time.Now().Unix(), 10)
	secret := config.Secret + mail.(string) + name.(string) + updatetimestamp
	userData := util.QueryAndParseJsonRows(MysqlDb, "select mail from user where mail=? ", mail)
	if userData != nil && len(userData) > 0 {
		totalcount, err := util.QueryCountSql(MysqlDb, "select count(1) from instance where name = ? and id != ? and mail=?", name, id, mail)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
		if totalcount > 0 {
			w.Write(util.ErrJson(util.ErrInstanceNameExist))
			return
		}
		result, err := MysqlDb.Exec("update instance set name=?,secret=md5(?),updatetimestamp=? where id=? and mail=? ", name, secret, updatetimestamp, id, mail)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		} else {
			rowsaffected, _ := result.RowsAffected()
			if rowsaffected > 0 {
				w.Write(util.ErrJson(util.OK()))
				return
			} else {
				w.Write(util.ErrJson(util.ErrDatabase))
				return
			}
		}
	} else {
		w.Write(util.ErrJson(util.ErrUserNotFound))
	}
}

/**
新增实例
*/
func instanceAdd(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	}
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	name := formData["name"]
	updatetimestamp := strconv.FormatInt(time.Now().Unix(), 10)
	secret := config.Secret + mail.(string) + name.(string) + updatetimestamp
	userData := util.QueryAndParseJsonRows(MysqlDb, "select mail from user where mail=? ", mail)
	if userData != nil && len(userData) > 0 {
		instanceCount, err := util.QueryCountSql(MysqlDb, "select count(1) from instance where mail = ? and name = ?", mail, name)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
		if instanceCount > 0 {
			w.Write(util.ErrJson(util.ErrInstanceNameExist))
			return
		}
		result, err := MysqlDb.Exec("insert into instance (mail,name,createtime,secret,updatetimestamp) values(?,?,now(),md5(?),?)", mail, name, secret, updatetimestamp)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		} else {
			rowsaffected, _ := result.RowsAffected()
			if rowsaffected > 0 {
				w.Write(util.ErrJson(util.OK()))
				return
			} else {
				w.Write(util.ErrJson(util.ErrDatabase))
				return
			}
		}
	} else {
		w.Write(util.ErrJson(util.ErrUserNotFound))
	}
}

func uploadFileHandler() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		CORS(w, r)
		if err := r.ParseMultipartForm(maxUploadSize); err != nil {
			fmt.Printf("Could not parse multipart form: %v\n", err)
			w.WriteHeader(http.StatusBadRequest)
			w.Write(util.ErrJson(util.ErrUploadFailedError))
			return
		}
		// parse and validate file and post parameters
		file, fileHeader, err := r.FormFile("file")
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(util.ErrJson(util.ErrUploadFailedError))
			return
		}
		defer file.Close()
		// Get and print out file size
		fileSize := fileHeader.Size
		fmt.Printf("File size (bytes): %v\n", fileSize)
		// validate file size
		if fileSize > maxUploadSize {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(util.ErrJson(util.ErrUploadFileTooBigError))
			return
		}
		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(util.ErrJson(util.ErrUploadFailedError))
			return
		}

		// check file type, detectcontenttype only needs the first 512 bytes
		detectedFileType := http.DetectContentType(fileBytes)
		switch detectedFileType {
		case "image/jpeg", "image/jpg":
		case "image/gif", "image/png":
		case "application/pdf":
			break
		default:
			w.WriteHeader(http.StatusBadRequest)
			w.Write(util.ErrJson(util.ErrUploadFileTypeError))
			return
		}
		//fileName := util.RandNumStr(12)
		fileName := "wxqrcode"
		var suffix string
		var newPath string
		suffixArr := strings.Split(fileHeader.Filename, ".")
		if len(suffixArr) > 0 {
			suffix = "." + suffixArr[1]
		} else {
			fileEndings, _ := mime.ExtensionsByType(detectedFileType)
			suffix = fileEndings[0]
		}
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(util.ErrJson(util.ErrUploadFailedError))
			return
		}

		newPath = filepath.Join(uploadPath, fileName+suffix)

		fmt.Printf("FileType: %s, File: %s\n", detectedFileType, newPath)

		// write file
		newFile, err := os.Create(newPath)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(util.ErrJson(util.ErrUploadFailedError))
			return
		}
		defer newFile.Close() // idempotent, okay to call twice
		if _, err := newFile.Write(fileBytes); err != nil || newFile.Close() != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(util.ErrJson(util.ErrUploadFailedError))
			return
		}
		w.Write(util.ErrJson(util.OK()))
	})
}

func renderError(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte(message))
}

/**
登录
*/
func userLogin(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	mail := formData["mail"]
	password := formData["password"]
	userData := util.QueryAndParseJsonRows(MysqlDb, "select mail from user where mail=? ", mail)
	if userData != nil && len(userData) > 0 {
		userData = util.QueryAndParseJsonRows(MysqlDb, "select mail from user where mail=? and password=md5(?)", mail, password)
		if userData != nil && len(userData) > 0 {
			fmt.Println("user data is %+v", userData)
			go func() {
				MysqlDb.Exec("update user set lastlogintime=now() where mail=?", mail)
			}()
			sessionV := sessionM.BeginSession(w, r)
			sessionV.Set("mail", mail)
			resultData := util.OK()
			userdataByte, _ := json.Marshal(userData[0])
			json.Unmarshal(userdataByte, &resultData.Data)
			w.Write(util.ErrJson(resultData))
			return
		} else {
			w.Write(util.ErrJson(util.ErrUserNotFound))
			return
		}
	} else {
		w.Write(util.ErrJson(util.ErrUserNotRegister))
		return
	}
}

/**
获取验证码
*/
func getVerifyCode(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	mail := formData["mail"]
	datacount, err := util.QueryCountSql(MysqlDb, "select count(1) from user where mail = ?", mail.(string))
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if datacount > 0 {
		w.Write(util.ErrJson(util.ErrUserHasRegister))
		return
	}

	datacount, err = util.QueryCountSql(MysqlDb, "select count(1) from verifycode where NOW()<=DATE_ADD(createtime,INTERVAL ? MINUTE) and "+
		"  mail=?", config.Verifycodetimeout, mail)
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if datacount > 0 {
		w.Write(util.ErrJson(util.ErrUserHasVerifyCode))
		return
	}

	verifycode := util.RandNumStr(6)
	mailBody := fmt.Sprintf(mailtxt, verifycode, config.Verifycodetimeout)
	err = util.SendMailUsingTLS(config.SMTPserver, config.SMTPport, config.SMTPshowname, fmt.Sprintf("%v", mail), mailBody, config.SMTPpassword, config.SMTPusername, "注册验证码")
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
			w.Write(util.ErrJson(util.OK()))
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
func userRegister(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	mail := formData["mail"]
	password := formData["password"]
	verifycode := formData["verifycode"]
	datacount, err := util.QueryCountSql(MysqlDb, "select count(1) from user where mail=?", mail)
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if datacount > 0 { //有用户数据，不需要注册，直接登录
		w.Write(util.ErrJson(util.ErrUserHasRegister))
		return
	} else { //没有该邮箱，需要注册，先校验验证码，然后建立用户数据
		ret, err := util.QueryCountSql(MysqlDb, "select count(1) from verifycode where NOW()<=DATE_ADD(createtime,INTERVAL ? MINUTE) and "+
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
		tx, _ := MysqlDb.Begin()
		if err != nil {
			log.Fatalln(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
		defer clearTransaction(tx, w)
		_, err = tx.Exec("insert INTO user(mail,password,createtime) values(?,md5(?),now())", mail, password)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		} else {
			if err != nil {
				log.Fatalln(err)
				return
			}
			_, err = tx.Exec("delete from verifycode where mail=?", mail)
			if err != nil {
				w.Write(util.ErrJson(util.ErrDatabase))
				return
			}
			if err := tx.Commit(); err != nil {
				log.Fatalln(err)
				w.Write(util.ErrJson(util.ErrDatabase))
				return
			}
			w.Write(util.ErrJson(util.OK()))
			return
		}
	}
}

func clearTransaction(tx *sql.Tx, w http.ResponseWriter) {
	err := tx.Rollback()
	if err != sql.ErrTxDone && err != nil {
		log.Fatalln(err)
		w.Write(util.ErrJson(util.ErrDatabase))
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
	//if r.Method != "POST" {
	//	w.WriteHeader(405)
	//	return
	//}
	body, err := ioutil.ReadAll(r.Body)
	if len(body) > 0 {
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
	}
	fmt.Printf("formData is %+v\n", formData)
	return formData
}
