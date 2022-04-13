package util

import (
	"fmt"
	"math/rand"
	"strings"
	"time"
)

const numLetterString = "0123456789"

var Rander = rand.New(rand.NewSource(time.Now().UnixNano()))

func RandStr(n int, letter string) string {
	str := []byte(letter)
	res := ""
	for i := 0; i < n; i++ {
		res += fmt.Sprintf("%c", str[Rander.Intn(strings.Count(letter, "")-1)])
	}
	return res
}

/**
按长度要求返回随机数
*/
func RandNumStr(n int) string {
	return RandStr(n, numLetterString)
}
