//go:build vip

package main

import (
	"fmt"
	"log"
	"net/http"
)

func Start() {
	log.Println("VIP版本，无使用限制")
}

func InstanceListSql(mail string) string {
	return fmt.Sprintf("select * from instance where mail='%s'", mail)
}

func InstanceListCountSql(mail string) string {
	return fmt.Sprintf("select count(1) from instance where mail='%s'", mail)
}

func InstanceListPage(mail string, pagesize int, pageno int) string {
	return fmt.Sprintf("select * from instance where mail='%s' limit %d,%d", mail, pagesize*(pageno-1), pagesize)
}

func InstanceAddCount(mail string,w http.ResponseWriter) bool {
	return true
}

func Trail() {
}
