package util


type Errno struct {
	Code    int
	Message string
}

var (
	OK = &Errno{Code: 0, Message: "OK"}

	// 系统错误, 前缀为 100
	InternalServerError = &Errno{Code: 10001, Message: "内部服务器错误"}
	ErrRequestParamError             = &Errno{Code: 10002, Message: "请求参数错误"}

	// 数据库错误, 前缀为 201
	ErrDatabase = &Errno{Code: 20100, Message: "数据库错误"}
	ErrFill     = &Errno{Code: 20101, Message: "从数据库填充 struct 时发生错误"}

	// 认证错误, 前缀是 202
	ErrValidation   = &Errno{Code: 20201, Message: "验证失败"}
	ErrTokenInvalid = &Errno{Code: 20202, Message: "jwt 是无效的"}

	// 用户错误, 前缀为 203
	ErrUserNotFound      = &Errno{Code: 20301, Message: "用户没找到"}
	ErrUserHasRegister = &Errno{Code: 20302, Message: "用户已注册"}
)