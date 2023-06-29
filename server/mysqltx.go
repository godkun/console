package main

import "database/sql"

type MysqlTx struct {
	tx *sql.Tx
}

func (tx *MysqlTx) Exec(queryStr string, args ...any) (sql.Result, error) {
	return tx.tx.Exec(queryStr, args)
}

func (tx *MysqlTx) Rollback() error {
	return tx.tx.Rollback()
}

func (tx *MysqlTx) Commit() error {
	return tx.tx.Commit()
}
