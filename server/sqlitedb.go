package main

import (
	"database/sql"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"os"
)

type SqliteDB struct {
	db *sql.DB
}

func initSqliteDB() error {
	dbFile := config.SqliteDbPath
	_, err := os.Stat(dbFile)
	if os.IsNotExist(err) {
		// 文件不存在，创建文件
		file, err := os.Create(dbFile)
		if err != nil {
			log.Fatal(err)
			return err
		}
		file.Close()
		log.Println("Database file created")
	}
	db, err := sql.Open("sqlite3", dbFile)
	if err != nil {
		log.Fatal(err)
		return err
	}
	defer db.Close()
	// 创建表
	sqlStmt := `
		CREATE TABLE IF NOT EXISTS "instance" (
		    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
		    "mail" varchar(255),
		    "name" varchar(255),
		    "createtime" datetime,
		    "updatetimestamp" integer,
		    "secret" varchar(255),
		    "RemoteIP" varchar(255),
		    "online" varchar(255),
		    "report" integer DEFAULT 0
		    );
	`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Printf("%q: %s\n", err, sqlStmt)
		return err
	}

	log.Println("Database and table checked/created successfully")
	return nil
}

func (m *SqliteDB) QueryAndParse(queryStr string, args ...any) map[string]string {
	rows, err := m.db.Query(queryStr, args...)
	defer rows.Close()

	if err != nil {
		log.Printf("查询出错,SQL语句:%s\n错误详情:%s\n", queryStr, err.Error())
		return nil
	}

	//获取列名cols
	cols, _ := rows.Columns()
	if len(cols) > 0 {
		buff := make([]interface{}, len(cols))       // 创建临时切片buff
		data := make([][]byte, len(cols))            // 创建存储数据的字节切片2维数组data
		dataKv := make(map[string]string, len(cols)) //创建dataKv, 键值对的map对象
		for i, _ := range buff {
			buff[i] = &data[i] //将字节切片地址赋值给临时切片,这样data才是真正存放数据
		}

		for rows.Next() {
			rows.Scan(buff...) // ...是必须的,表示切片
		}

		for k, col := range data {
			dataKv[cols[k]] = string(col)
			//fmt.Printf("%30s:\t%s\n", cols[k], col)
		}
		return dataKv
	} else {
		return nil
	}
}

func (m *SqliteDB) QueryCountSql(sql string, args ...any) (int, error) {
	total := 0
	totalRow, err := m.db.Query(sql, args...)
	if err != nil {
		fmt.Println("QueryCountSql error", err)
		return total, err
	}
	for totalRow.Next() {
		err := totalRow.Scan(
			&total,
		)
		if err != nil {
			fmt.Println("QueryCountSql scan row error", err)
			continue
		}
	}
	fmt.Println(total)
	totalRow.Close()
	return total, err
}

func (m *SqliteDB) Begin() (Transaction, error) {
	return m.db.Begin()
}

//func (m *MySQLDB) Begin() (*sql.Tx, error) {
//	return m.db.Begin()
//}

func (m *SqliteDB) Exec(queryStr string, args ...any) (sql.Result, error) {
	result, err := m.db.Exec(queryStr, args)
	return result, err
}

func (m *SqliteDB) Close() {
	m.db.Close()
}

func (m *SqliteDB) Open(dbDSN string) error {
	var err error
	m.db, err = sql.Open("sqlite3", dbDSN)
	if err != nil {
		//如果打开数据库错误，直接panic
		log.Println(err)
		return err
	}
	return nil
}

func (m *SqliteDB) QueryAndParseJsonRows(queryStr string, args ...any) []map[string]string {
	rows, err := m.db.Query(queryStr, args...)
	defer rows.Close()
	if err != nil {
		fmt.Printf("查询出错:\nSQL:\n%s, 错误详情:%s\n", queryStr, err.Error())
		return nil
	}
	//获取列名cols
	cols, _ := rows.Columns()
	if len(cols) > 0 {
		var ret []map[string]string
		for rows.Next() {
			buff := make([]interface{}, len(cols))
			data := make([][]byte, len(cols)) //数据库中的NULL值可以扫描到字节中
			for i, _ := range buff {
				buff[i] = &data[i]
			}
			rows.Scan(buff...) //扫描到buff接口中，实际是字符串类型data中
			//将每一行数据存放到数组中
			dataKv := make(map[string]string, len(cols))
			for k, col := range data { //k是index，col是对应的值
				//fmt.Printf("%30s:\t%s\n", cols[k], col)
				dataKv[cols[k]] = string(col)
			}
			ret = append(ret, dataKv)
		}
		return ret
	} else {
		return nil
	}
}
