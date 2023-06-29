package main

import "database/sql"

type Transaction interface {
	Exec(queryStr string, args ...any) (sql.Result, error)
	Rollback() error
	Commit() error
}
