package pkg

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

type MySQLDB struct {
	db *sql.DB
}

func (m *MySQLDB) QueryAndParse(queryStr string, args ...any) map[string]string {
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

func (m *MySQLDB) QueryCountSql(sql string, args ...any) (int, error) {
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

func (m *MySQLDB) Begin() (Transaction, error) {
	return m.db.Begin()
}

//func (m *MySQLDB) Begin() (*sql.Tx, error) {
//	return m.db.Begin()
//}

func (m *MySQLDB) Exec(queryStr string, args ...any) (sql.Result, error) {
	result, err := m.db.Exec(queryStr, args)
	return result, err
}

func (m *MySQLDB) Close() {
	m.db.Close()
}

func (m *MySQLDB) Open(dbDSN string) error {
	var err error
	//Golang数据连接："用户名:密码@tcp(IP:端口号)/数据库名?charset=utf8"
	//dbDSN := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=%s", config.Username, config.Password, config.Server, config.Database, config.Charset)
	//打开数据库,前者是驱动名，所以要导入： _ "github.com/go-sql-driver/mysql"
	m.db, err = sql.Open("mysql", dbDSN)
	if err != nil {
		//如果打开数据库错误，直接panic
		log.Println(err)
		return err
	}
	//设置数据库最大连接数
	m.db.SetConnMaxLifetime(10)
	//设置上数据库最大闲置连接数
	m.db.SetMaxIdleConns(5)
	//验证连接
	if err := m.db.Ping(); err != nil {
		log.Println(err)
		return err
	}
	// Implement MySQL open connection here
	// m.db = ...
	return nil
}

func (m *MySQLDB) QueryAndParseJsonRows(queryStr string, args ...any) []map[string]string {
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
