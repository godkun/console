//go:build trail

package main

import (
	"fmt"
	"github.com/Monibuca/console/server/util"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

func Start() {
	log.Println("试用版，试用时间为" +strconv.Itoa(config.QuitMinutes) + "分钟，且实例数最多只能有两个")
}

func InstanceListSql(mail string) string {
	return fmt.Sprintf("select * from instance where mail='%s' limit 2", mail)
}

func InstanceListCountSql(mail string) string {
	return fmt.Sprintf("select count(1) from instance where mail='%s' limit 2", mail)
}

func InstanceListPage(mail string, pagesize int, pageno int) string {
	return fmt.Sprintf("select * from instance where mail='%s' limit 2", mail)
}

func InstanceAddCount(mail string, w http.ResponseWriter) bool {
	instanceCount, _ := db.QueryCountSql("select count(1) from instance where mail = ? ", mail)
	if instanceCount >= 2 {
		w.Write(util.ErrJson(util.ErrTrialInstanceCountMax))
		return false
	}
	return true
}

func Trail() {
	if nothasStartTime {
		expirationTime = time.Now().Add(time.Duration(config.QuitMinutes) * time.Minute)
		nothasStartTime = false
		go func() {
			log.Println("开始计时")
			// 持续检查当前时间是否超过退出时间
			for time.Now().Before(expirationTime) {
				time.Sleep(5 * time.Second) // 每分钟检查一次
			}

			log.Println("程序运行超过" + string(config.QuitMinutes) + "分钟，退出")
			os.Exit(0)
		}()
	}

	//go func() {
	//	log.Println("试用版，试用时间为" + strconv.Itoa(config.QuitMinutes) + "分钟")
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
}
