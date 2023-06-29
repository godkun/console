package main

import "database/sql"

type Database interface {
	Open(dbDSN string) error
	Exec(queryStr string, args ...any) (sql.Result, error)
	Close()
	Begin()(Transaction, error)
	QueryAndParseJsonRows(queryStr string, args ...any) []map[string]string
	QueryCountSql(sql string, args ...any) (int, error)
	QueryAndParse(queryStr string, args ...any) map[string]string
}
