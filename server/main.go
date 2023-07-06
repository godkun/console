package main

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha1"
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"embed"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"flag"
	"fmt"
	"github.com/Monibuca/console/server/sessions"
	"github.com/Monibuca/console/server/util"
	"io/ioutil"
	"log"
	"math/big"
	"mime"
	_ "net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"compress/zlib"

	"github.com/BurntSushi/toml"
	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/sync/errgroup"
)

//go:embed web/*
var webfs embed.FS
var (
	expirationTime  time.Time
	nothasStartTime = true
	ctxBack         = context.Background()
	db              Database
	MysqlDbErr      error
	mailtxt         string
	resetpwdtxt     string
	sessionM        *sessions.SessionManager
	instances       = NewConcurInstances()
	config          = &struct {
		QuitMinutes       int
		Env               string
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
		QuicPort          string
		SqliteDbPath      string
	}{30, "dev", "127.0.0.1:3306", "root", "123456",
		"monibuca", "utf8", "", "", "", "",
		"", 300, ":9999", "Monibuca#!4", "http://localhost/", "44944", "./sqlite.db"}
	ConfigRaw     []byte
	websocketGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
)

func getNonceAccept(nonce []byte) (expected []byte, err error) {
	h := sha1.New()
	if _, err = h.Write(nonce); err != nil {
		return
	}
	if _, err = h.Write([]byte(websocketGUID)); err != nil {
		return
	}
	expected = make([]byte, 28)
	base64.StdEncoding.Encode(expected, h.Sum(nil))
	return
}
func generateTLSConfig() *tls.Config {
	key, err := rsa.GenerateKey(rand.Reader, 1024)
	if err != nil {
		panic(err)
	}
	template := x509.Certificate{SerialNumber: big.NewInt(1)}
	certDER, err := x509.CreateCertificate(rand.Reader, &template, &template, &key.PublicKey, key)
	if err != nil {
		panic(err)
	}
	keyPEM := pem.EncodeToMemory(&pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509.MarshalPKCS1PrivateKey(key)})
	certPEM := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: certDER})

	tlsCert, err := tls.X509KeyPair(certPEM, keyPEM)
	if err != nil {
		panic(err)
	}
	return &tls.Config{
		Certificates: []tls.Certificate{tlsCert},
		NextProtos:   []string{"monibuca"},
	}
}
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
	var dbDSN string

	if _, err = toml.Decode(string(ConfigRaw), &cg); err == nil {
		if cfg, ok := cg["Sqlite"]; ok { //读取到Sqlite数据库配置，优先使用Sqlite作为数据库
			b, _ := json.Marshal(cfg)
			if err = json.Unmarshal(b, config); err != nil {
				log.Println(err)
			} else {
				//初始化sqlite数据库，创建数据库文件，执行建表语句等
				err = initSqliteDB()
				if err != nil {
					util.Println("read config file error:", err)
					return
				}
				db = &SqliteDB{}
				dbDSN = config.SqliteDbPath
			}
		} else {
			if cfg, ok := cg["Mysql"]; ok {
				b, _ := json.Marshal(cfg)
				if err = json.Unmarshal(b, config); err != nil {
					log.Println(err)
				} else {
					db = &MySQLDB{}
					dbDSN = fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=%s", config.Username, config.Password, config.Server, config.Database, config.Charset)
				}
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
	//打开数据库,前者是驱动名，所以要导入： _ "github.com/go-sql-driver/mysql"
	err = db.Open(dbDSN)
	if err != nil {
		log.Fatalln(err)
	}
}

const maxUploadSize = 2 * 1024 * 2014 // 2 MB
const uploadPath = "./files"

func main() {

	Start()

	//go func() {
	//	log.Println("程序开始运行")
	//
	//	// 设置退出时间为30分钟后
	//	expirationTime = time.Now().Add(time.Duration(config.QuitMinutes) * time.Minute)
	//
	//	// 持续检查当前时间是否超过退出时间
	//	for time.Now().Before(expirationTime) {
	//		time.Sleep(5 * time.Second) // 每分钟检查一次
	//	}
	//
	//	log.Println("程序运行超过1分钟，退出")
	//	os.Exit(0)
	//}()

	//util.SendMailUsingTLS(config.SMTPserver, config.SMTPport, config.SMTPshowname, "pg830616@163.com",
	//	"hello", config.SMTPpassword, config.SMTPusername, "注册验证码")
	defer db.Close()

	fmt.Println("start server at ", config.ServerPort)
	http.HandleFunc("/test", test)
	http.HandleFunc("/api/user/islogin", islogin)
	http.Handle("/api/upload/", http.StripPrefix("/api/upload/", http.FileServer(http.Dir("./static"))))
	http.HandleFunc("/api/user/register", userRegister)
	http.HandleFunc("/api/user/getverifycode", getVerifyCode)
	http.HandleFunc("/api/user/login", userLogin)
	http.HandleFunc("/api/user/logout", userLogout)
	http.HandleFunc("/api/user/changepassword", changePassword)
	http.HandleFunc("/api/user/sendresetpwdmail", sendResetPwdMail)
	http.HandleFunc("/api/user/resetpwd", resetPwd)
	http.HandleFunc("/api/instance/detail", instanceDetail)
	http.HandleFunc("/api/instance/list", instanceList)
	http.HandleFunc("/api/instance/add", instanceAdd)
	http.HandleFunc("/api/instance/del", instanceDel)
	http.HandleFunc("/api/instance/update", instanceUpdate)
	http.HandleFunc("/api/instance/getroompass", getRoomPass)
	http.HandleFunc("/api/uploadFile", uploadFileHandler())
	fs1 := http.FileServer(http.Dir(uploadPath))
	http.Handle("/files/", http.StripPrefix("/files", fs1))
	http.Handle("/api/files/", http.StripPrefix("/api/files", fs1))
	http.Handle("/ws/v1", wsv1)
	http.HandleFunc("/room/join", joinRoom)
	http.HandleFunc("/report", report)
	http.HandleFunc("/relay", relay)
	http.HandleFunc("/api/isTimeout", isTimeout)

	if config.Env == "pro" {
		http.Handle("/", http.FileServer(http.FS(webfs)))
	}
	clearTimeOutInstance()
	var g errgroup.Group
	g.Go(startQuic)
	g.Go(func() error {
		//return http.ListenAndServeTLS(config.ServerPort, "console.monibuca.com_bundle.crt", "console.monibuca.com.key", nil)
		return http.ListenAndServe(config.ServerPort, nil)
	})
	// g.Go(func() error {
	// 	return http.ListenAndServe(":10000", nil)
	// })
	log.Fatal(g.Wait())
}

/*
判断体验时间是否到期
*/
func isTimeout(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	}
	if nothasStartTime {
		var resultDataMap = make(map[string]interface{})
		resultDataMap["remainseconds"] = config.QuitMinutes * 60
		resultDataMapByte, _ := json.Marshal(resultDataMap)
		resultData := util.OK()
		json.Unmarshal(resultDataMapByte, &resultData.Data)
		w.Write(util.ErrJson(resultData))
		return
	}
	log.Println("体验版到期时间为" + expirationTime.String())
	// 检查是否超过30分钟
	if expirationTime.Sub(time.Now()) <= 0 {
		w.Write(util.ErrJson(util.ErrTrialPeriodExpired))
		os.Exit(0)
		return
	} else {
		var resultDataMap = make(map[string]interface{})
		resultDataMap["remainseconds"] = int(expirationTime.Sub(time.Now()).Seconds())
		resultDataMapByte, _ := json.Marshal(resultDataMap)
		resultData := util.OK()
		json.Unmarshal(resultDataMapByte, &resultData.Data)
		w.Write(util.ErrJson(resultData))
		return
	}
}

type Report struct {
	UUID     string `json:"uuid"`
	Machine  string `json:"machine"`
	Instance string `json:"instance"`
	Version  string `json:"version"`
	OS       string `json:"os"`
	Arch     string `json:"arch"`
	Streams  int    `json:"streams"`
}

func test(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello world"))
}

func report(w http.ResponseWriter, r *http.Request) {
	report := &Report{}
	err := json.NewDecoder(r.Body).Decode(report)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	var result sql.Result
	if report.Version == "" {
		result, err = db.Exec("insert INTO report_streams(uuid,stream,createtime) values(?,?,?)", report.UUID, report.Streams, time.Now().Format("2006-01-02 15:04:05"))
	} else {
		id, _ := strconv.Atoi(report.Instance)
		result, err = db.Exec("insert INTO report(uuid,machine,instance,version,os,arch,ip,createtime) values(?,?,?,?,?,?)", report.UUID, report.Machine, id, report.Version, report.OS, report.Arch, r.RemoteAddr, time.Now().Format("2006-01-02 15:04:05"))

	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	} else {
		rows, _ := result.RowsAffected()
		http.Error(w, fmt.Sprintf("%d", rows), http.StatusOK)
	}
}

/*
*
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

func getRoomPass(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	}
	id := r.Header.Get("M7sid")
	roomId := r.URL.Query().Get("roomId")
	in := base64.NewEncoder(base64.StdEncoding, w)
	z := zlib.NewWriter(in)
	z.Write([]byte(fmt.Sprintf("%s:%s", id, roomId)))
	z.Close()
	in.Close()
}

// 加入别人的房间
func joinRoom(w http.ResponseWriter, r *http.Request) {
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

	pass := r.URL.Query().Get("pass")
	userId := r.URL.Query().Get("userId")
	instanceId, roomId, err := decodePass(pass)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	instance := instances.FindById(instanceId)
	if instance == nil {
		http.Error(w, "instance not found", http.StatusNotFound)
		return
	}
	if instance.Quic == nil {
		http.Error(w, "instance not connect with quic", http.StatusServiceUnavailable)
		return
	}
	if r.Header.Get("Upgrade") != "websocket" {
		http.Error(w, "not websocket", http.StatusBadRequest)
		return
	}
	r.RequestURI = fmt.Sprintf("/room/%s/%s", roomId, userId)
	r.URL, err = url.ParseRequestURI(r.RequestURI)
	instance.relayQuic(w, r)
}

/*
*
重置密码链接
*/
func resetPwd(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		w.Write([]byte("参数错误"))
		return
	}
	pwddata := db.QueryAndParseJsonRows("select * from resetpwd where code=? ", code)
	if pwddata != nil && len(pwddata) > 0 {
		pwddata := pwddata[0]
		newpassword := pwddata["password"]
		mail := pwddata["mail"]
		var tx Transaction
		tx, err := db.Begin()
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

/*
*
重置密码，忘记密码
*/
func sendResetPwdMail(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	if len(formData) == 0 {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	mail := formData["mail"]
	if mail == nil {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	totalcount, err := db.QueryCountSql("select count(1) from user where mail=?", mail)
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

	result, err := db.Exec("insert into resetpwd (mail,code,password) values(?,?,?)", mail, code, util.MD5(newpassword))
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

/*
*
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
	if len(formData) == 0 {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	password := formData["password"]
	passwordStr, _ := password.(string)
	oldpassword := formData["oldpassword"]
	oldpasswordStr, _ := oldpassword.(string)
	if oldpassword == nil || len(oldpassword.(string)) == 0 || password == nil || len(password.(string)) == 0 {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	totalcount, err := db.QueryCountSql("select count(1) from user where mail=? and password=?", mail, util.MD5(oldpasswordStr))
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if totalcount == 1 {
		result, err := db.Exec("update user set password=?  where mail=? ", passwordStr, mail)
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

/*
*
登出
*/
func userLogout(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	sessionV.Remove("mail")
	sessionM.Destroy(w, r)
	w.Write(util.ErrJson(util.OK()))
	return
}

func islogin(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	if mail := sessionV.Get("mail"); mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	} else {
		w.Write(util.ErrJson(&util.Errno{Code: 0, Msg: "OK", Data: mail}))
	}
}

func instanceDetail(w http.ResponseWriter, r *http.Request) {
	sessionV := sessionM.BeginSession(w, r)
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return
	}
	formData := getDataFromHttpRequest(w, r)
	userData := db.QueryAndParseJsonRows("select * from instance where mail=? and id=? ", mail, formData["id"])
	if userData != nil && len(userData) > 0 {
		if err := json.NewEncoder(w).Encode(userData[0]); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
}

/*
*
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
	if len(formData) == 0 {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	id := formData["id"]
	userData := db.QueryAndParseJsonRows("select * from instance where mail=? and id=? ", mail, id)
	if userData != nil && len(userData) > 0 {
		result, err := db.Exec("delete from instance where id=? and mail=? ", id, mail)
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

/*
*
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
	// fmt.Printf("formData is %+v\n", formData)
	if len(formData) == 0 {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	pagesize := int(formData["pagesize"].(float64))
	pageno := int(formData["pageno"].(float64))
	var instanceList []map[string]string
	if pagesize == 0 { //不分页，获取所有
		instanceList = db.QueryAndParseJsonRows(InstanceListSql(mail.(string)))

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
		totalcount, err := db.QueryCountSql(InstanceListCountSql(mail.(string)))
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
		//instanceList := db.QueryAndParseJsonRows("select * from instance where mail=? limit ?,? ", mail, pagesize*(pageno-1), pagesize)
		instanceList := db.QueryAndParseJsonRows(InstanceListPage(mail.(string), pagesize, pageno))
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

/*
*
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
	if len(formData) == 0 {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	id := formData["id"]
	name := formData["name"]
	enableReport := formData["enableReport"]
	resetSecret := formData["resetSecret"].(bool)
	updatetimestamp := strconv.FormatInt(time.Now().Unix(), 10)
	secret := config.Secret + mail.(string) + name.(string) + updatetimestamp
	userData := db.QueryAndParseJsonRows("select mail from user where mail=? ", mail)
	if userData != nil && len(userData) > 0 {
		totalcount, err := db.QueryCountSql("select count(1) from instance where name = ? and id != ? and mail=?", name, id, mail)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
		if totalcount > 0 {
			w.Write(util.ErrJson(util.ErrInstanceNameExist))
			return
		}
		var result sql.Result
		if resetSecret {
			result, err = db.Exec("update instance set name=?,secret=?,report=?,updatetimestamp=? where id=? and mail=? ", name, util.MD5(secret), enableReport, updatetimestamp, id, mail)
		} else {
			result, err = db.Exec("update instance set name=?,report=?,updatetimestamp=? where id=? and mail=? ", name, enableReport, updatetimestamp, id, mail)
		}
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

/*
*
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
	if len(formData) == 0 {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	name := formData["name"]
	updatetimestamp := strconv.FormatInt(time.Now().Unix(), 10)
	secret := config.Secret + mail.(string) + name.(string) + updatetimestamp
	userData := db.QueryAndParseJsonRows("select mail from user where mail=? ", mail)
	if userData != nil && len(userData) > 0 {
		var instanceCount int
		if !InstanceAddCount(mail.(string), w){
			return
		}

		instanceCount, err := db.QueryCountSql("select count(1) from instance where mail = ? and name = ?", mail, name)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
		if instanceCount > 0 {
			w.Write(util.ErrJson(util.ErrInstanceNameExist))
			return
		}

		result, err := db.Exec("insert into instance (mail,name,createtime,secret,updatetimestamp) values(?,?,?,?,?)", mail, name, time.Now().Format("2006-01-02 15:04:05"), util.MD5(secret), updatetimestamp)
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

/*
*
登录
*/
func userLogin(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	if len(formData) == 0 {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	mail := formData["mail"]
	password := formData["password"]
	passwordStr, _ := password.(string)
	userData := db.QueryAndParseJsonRows("select mail from user where mail=? ", mail)
	if userData != nil && len(userData) > 0 {

		userData = db.QueryAndParseJsonRows("select mail,nickname,level from user where mail=? and password=?", mail, util.MD5(passwordStr))
		if userData != nil && len(userData) > 0 {
			fmt.Println("user data is %+v", userData)
			go func() {
				db.Exec("update user set lastlogintime=? where mail=?", time.Now().Format("2006-01-02 15:04:05"), mail)
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

/*
*
获取验证码
*/
func getVerifyCode(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	mail := formData["mail"]
	datacount, err := db.QueryCountSql("select count(1) from user where mail = ?", mail.(string))
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if datacount > 0 {
		w.Write(util.ErrJson(util.ErrUserHasRegister))
		return
	}

	datacount, err = db.QueryCountSql("select count(1) from verifycode where NOW()<=DATE_ADD(createtime,INTERVAL ? MINUTE) and "+
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
	result, err := db.Exec("insert into verifycode(mail,verifycode,createtime) values(?,?,?)", mail, verifycode, time.Now().Format("2006-01-02 15:04:05"))
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

/*
*
注册
*/
func userRegister(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v\n", formData)
	if len(formData) == 0 {
		w.Write(util.ErrJson(util.ErrRequestParamError))
		return
	}
	mail := formData["mail"]
	password := formData["password"]
	passwordStr, _ := password.(string)
	verifycode := formData["verifycode"]
	datacount, err := db.QueryCountSql("select count(1) from user where mail=?", mail)
	if err != nil {
		fmt.Println(err)
		w.Write(util.ErrJson(util.ErrDatabase))
		return
	}
	if datacount > 0 { //有用户数据，不需要注册，直接登录
		w.Write(util.ErrJson(util.ErrUserHasRegister))
		return
	} else { //没有该邮箱，需要注册，先校验验证码，然后建立用户数据
		ret, err := db.QueryCountSql("select count(1) from verifycode where NOW()<=DATE_ADD(createtime,INTERVAL ? MINUTE) and "+
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
		tx, _ := db.Begin()
		if err != nil {
			log.Fatalln(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		}
		defer clearTransaction(tx, w)
		_, err = tx.Exec("insert INTO user(mail,password,createtime) values(?,?,?)", mail, util.MD5(passwordStr), time.Now().Format("2006-01-02 15:04:05"))
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

func clearTransaction(tx Transaction, w http.ResponseWriter) {
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

/*
*
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
		// fmt.Println("json:", string(body))
		// 初始化请求变量结构
		// 调用json包的解析，解析请求body
		if err = json.Unmarshal(body, &formData); err != nil {
			fmt.Printf("Unmarshal err, %v\n", err)
			w.Write(util.ErrJson(util.ErrRequestParamError))
			return
		}
	}
	// fmt.Printf("formData is %+v\n", formData)
	return formData
}
