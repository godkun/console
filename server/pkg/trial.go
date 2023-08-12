package pkg

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/Monibuca/console/server/pkg/sessions"
	"github.com/Monibuca/console/server/pkg/util"
)

type TrailNoLoginORM struct {
	TrailORM
}

func (TrailNoLoginORM) GetMail(w http.ResponseWriter, r *http.Request) string {
	return "admin"
}

func (t *TrailORM) GetMail(w http.ResponseWriter, r *http.Request) string {
	sessionV := t.BeginSession(w, r)
	if sessionV == nil {
		http.Error(w, "session error", http.StatusInternalServerError)
		return ""
	}
	mail := sessionV.Get("mail")
	if mail == nil {
		w.Write(util.ErrJson(util.ErrUserNotLogin))
		return ""
	}
	return mail.(string)
}

type TrailORM struct {
	*sessions.SessionManager
}

func (t *TrailORM) Start() {
	log.Println("试用版，试用时间为" + strconv.Itoa(config.QuitMinutes) + "分钟，且实例数最多只能有两个")
	t.SessionManager = sessions.NewSessionMange()
}

func (TrailORM) InstanceListSql(mail string) string {
	return fmt.Sprintf("select * from instance where mail='%s' limit 2", mail)
}

func (TrailORM) InstanceListCountSql(mail string) string {
	return fmt.Sprintf("select count(1) from instance where mail='%s' limit 2", mail)
}

func (TrailORM) InstanceListPage(mail string, pagesize int, pageno int) string {
	return fmt.Sprintf("select * from instance where mail='%s' limit 2", mail)
}

func (TrailORM) InstanceAddCount(mail string, w http.ResponseWriter) bool {
	instanceCount, _ := db.QueryCountSql("select count(1) from instance where mail = ? ", mail)
	if instanceCount >= 2 {
		w.Write(util.ErrJson(util.ErrTrialInstanceCountMax))
		return false
	}
	return true
}

func (TrailORM) Trail() {
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
}
