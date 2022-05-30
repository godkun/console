package util

import "encoding/json"

type Errno struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data interface{} `json:"data"`
}

func OK() *Errno {
	return &Errno{Code: 0, Msg: "OK", Data: ""}
}

var (
	//OK = &Errno{Code: 0, Msg: "OK", Data: ""}

	// 系统错误, 前缀为 100
	InternalServerError      = &Errno{Code: 10001, Msg: "内部服务器错误"}
	ErrRequestParamError     = &Errno{Code: 10002, Msg: "请求参数错误"}
	ErrSendMailError         = &Errno{Code: 10003, Msg: "发送邮件错误"}
	ErrUploadFailedError     = &Errno{Code: 10004, Msg: "上传文件失败"}
	ErrUploadFileTooBigError = &Errno{Code: 10005, Msg: "上传文件过大"}
	ErrUploadFileTypeError   = &Errno{Code: 10006, Msg: "上传文件类型错误"}
	ErrTimeOut   = &Errno{Code: 10007, Msg: "请求超时"}

	// 数据库错误, 前缀为 201
	ErrDatabase = &Errno{Code: 20100, Msg: "数据库错误"}
	ErrFill     = &Errno{Code: 20101, Msg: "从数据库填充 struct 时发生错误"}

	// 用户错误, 前缀是 202
	ErrValidation   = &Errno{Code: 20201, Msg: "验证码校验失败"}
	ErrTokenInvalid = &Errno{Code: 20202, Msg: "jwt 是无效的"}

	// 用户错误, 前缀为 203
	ErrUserNotFound      = &Errno{Code: 20301, Msg: "用户名或密码错误"}
	ErrUserHasRegister   = &Errno{Code: 20302, Msg: "用户已注册"}
	ErrUserRegister      = &Errno{Code: 20303, Msg: "用户注册失败"}
	ErrUserHasVerifyCode = &Errno{Code: 20304, Msg: "已获取过验证码"}
	ErrUserNotLogin = &Errno{Code: 20305, Msg: "用户未登录"}
	ErrUserNotRegister      = &Errno{Code: 20306, Msg: "用户未注册"}
	ErrInstanceNameExist      = &Errno{Code: 20307, Msg: "实例名已存在"}
	ErrOldPasswordWrong      = &Errno{Code: 20308, Msg: "旧密码错误"}
	ErrSecretWrong      = &Errno{Code: 20309, Msg: "密钥错误"}
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
