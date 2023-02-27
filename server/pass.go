package main

import (
	"compress/zlib"
	"encoding/base64"
	"io"
	"strings"
)

func decodePass(pass string) (instanceId string, roomId string, err error) {
	if len(pass) == 0 {
		return "", "", io.ErrUnexpectedEOF
	}
	z, err := zlib.NewReader(base64.NewDecoder(base64.StdEncoding, strings.NewReader(pass)))
	if err != nil {
		return "", "", err
	}
	info, _ := io.ReadAll(z)
	z.Close()
	ss := strings.Split(string(info), ":")
	if len(ss) != 2 {
		return "", "", io.ErrUnexpectedEOF
	}
	instanceId = ss[0]
	roomId = ss[1]
	return
}
