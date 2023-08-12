package pkg

import (
	"database/sql"
	"net/http"

	"github.com/Monibuca/console/server/pkg/sessions"
)

type Database interface {
	Open(dbDSN string) error
	Exec(queryStr string, args ...any) (sql.Result, error)
	Close()
	Begin() (Transaction, error)
	QueryAndParseJsonRows(queryStr string, args ...any) []map[string]string
	QueryCountSql(sql string, args ...any) (int, error)
	QueryAndParse(queryStr string, args ...any) map[string]string
}

type ORM interface {
	Start()
	InstanceListSql(mail string) string
	InstanceListCountSql(mail string) string
	InstanceListPage(mail string, pagesize int, pageno int) string
	InstanceAddCount(mail string, w http.ResponseWriter) bool
	Trail()
	GetMail(w http.ResponseWriter, r *http.Request) string
	BeginSession(w http.ResponseWriter, r *http.Request) sessions.Session
	Destroy(w http.ResponseWriter, r *http.Request)
}
