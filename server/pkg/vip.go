package pkg

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Monibuca/console/server/pkg/sessions"
	"github.com/Monibuca/console/server/pkg/util"
)

func (v *VIPORM) GetMail(w http.ResponseWriter, r *http.Request) string {
	sessionV := v.BeginSession(w, r)
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

type VIPORM struct {
	*sessions.SessionManager
}

func (v *VIPORM) Start() {
	log.Println("VIP版本，无使用限制")
	v.SessionManager = sessions.NewSessionMange()
}

func (VIPORM) InstanceListSql(mail string) string {
	return fmt.Sprintf("select * from instance where mail='%s'", mail)
}

func (VIPORM) InstanceListCountSql(mail string) string {
	return fmt.Sprintf("select count(1) from instance where mail='%s'", mail)
}

func (VIPORM) InstanceListPage(mail string, pagesize int, pageno int) string {
	return fmt.Sprintf("select * from instance where mail='%s' limit %d,%d", mail, pagesize*(pageno-1), pagesize)
}

func (VIPORM) InstanceAddCount(mail string, w http.ResponseWriter) bool {
	return true
}

func (VIPORM) Trail() {
}
