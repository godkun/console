package util

import "encoding/json"

type Errno struct {
	Code    int `json:"code"`
	Msg string `json:"msg"`
}

var (
	OK = &Errno{Code: 0, Msg: "OK"}

	// 系统错误, 前缀为 100
	InternalServerError  = &Errno{Code: 10001, Msg: "内部服务器错误"}
	ErrRequestParamError = &Errno{Code: 10002, Msg: "请求参数错误"}

	// 数据库错误, 前缀为 201
	ErrDatabase = &Errno{Code: 20100, Msg: "数据库错误"}
	ErrFill     = &Errno{Code: 20101, Msg: "从数据库填充 struct 时发生错误"}

	// 用户错误, 前缀是 202
	ErrValidation   = &Errno{Code: 20201, Msg: "验证失败"}
	ErrTokenInvalid = &Errno{Code: 20202, Msg: "jwt 是无效的"}

	// 用户错误, 前缀为 203
	ErrUserNotFound    = &Errno{Code: 20301, Msg: "用户名或密码错误"}
	ErrUserHasRegister = &Errno{Code: 20302, Msg: "用户已注册"}
	ErrUserRegister = &Errno{Code: 20303, Msg: "用户注册失败"}
)

/**
将错误转为json
 */
func ErrJson(error *Errno) []byte {
	jsonData, err := json.Marshal(error)
	if err != nil {
		return nil
	}
	return jsonData
}
