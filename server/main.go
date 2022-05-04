package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
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
	"strings"
)

var MysqlDb *sql.DB
var MysqlDbErr error
var mailtxt string

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
	}{"127.0.0.1:3306", "root", "123456",
		"monibuca", "utf8", "", "", "", "", "", 300, ":9999"}
	ConfigRaw []byte
)

func init() {

	var err error
	addr := flag.String("c", "config.toml", "config file")

	var mailtxtbyte []byte
	if mailtxtbyte, err = ioutil.ReadFile("mailtxt"); err != nil {
		util.Print("read config file error:", err)
		return
	}
	mailtxt = string(mailtxtbyte)

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
	http.HandleFunc("/api/user/register", register)
	http.HandleFunc("/api/user/getverifycode", getVerifyCode)
	http.HandleFunc("/api/user/login", login)
	http.HandleFunc("/api/instance/login", login)
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
	http.Handle("/test", websocket.Handler(func(w *websocket.Conn) {
		var error error
		for {
			//只支持string类型
			var reply string
			if error = websocket.Message.Receive(w, &reply); error != nil {
				log.Println("websocket出现异常", error)
				break
			}
			fmt.Println("收到客户端消息:" + reply)
			msg := reply + ", 我是服务端"
			fmt.Println("发送客户端消息:" + msg)
			if error = websocket.Message.Send(w, msg); error != nil {
				log.Println("websocket出现异常", error)
				break
			}
		}
	}))
	log.Fatal(http.ListenAndServe(config.ServerPort, nil))
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
		w.Write(util.ErrJson(util.OK))
	})
}

func renderError(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte(message))
}

/**
登录
*/
func login(w http.ResponseWriter, r *http.Request) {
	formData := getDataFromHttpRequest(w, r)
	fmt.Printf("formData is %+v", formData)
	mail := formData["mail"]
	password := formData["password"]
	userData := util.QueryAndParseJsonRows(MysqlDb, "select mail from user where mail=? and password=md5(?)", mail, password)
	if userData != nil && len(userData) > 0 {
		fmt.Println("user data is %+v", userData)
		go func() {
			MysqlDb.Exec("update user set lastlogintime=now() where mail=?", mail)
		}()
		resultData := util.OK
		userdataByte, _ := json.Marshal(userData[0])
		json.Unmarshal(userdataByte, &resultData.Data)
		w.Write(util.ErrJson(resultData))
		return
	} else {
		w.Write(util.ErrJson(util.ErrUserNotFound))
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
		result, err := tx.Exec("insert INTO user(mail,password,createtime) values(?,md5(?),now())", mail, password)
		if err != nil {
			fmt.Println(err)
			w.Write(util.ErrJson(util.ErrDatabase))
			return
		} else {
			rowsaffected, _ := result.RowsAffected()
			if rowsaffected > 0 {
				result, err = tx.Exec("delete from verifycode where mail=?", mail)
				if err != nil {
					w.Write(util.ErrJson(util.ErrDatabase))
					return
				}
				rowsaffected, _ = result.RowsAffected()
				if rowsaffected > 0 {
					if err := tx.Commit(); err != nil {
						log.Fatalln(err)
						w.Write(util.ErrJson(util.ErrDatabase))
						return
					}
					w.Write(util.ErrJson(util.OK))
					return
				}
			} else {
				w.Write(util.ErrJson(util.ErrDatabase))
				return
			}
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
