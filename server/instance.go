package main

import (
	"golang.org/x/net/websocket"
	"time"
)

type Instance struct {
	Name             string `json:"name"`
	Secret           string `json:"secret"`
	W                *websocket.Conn
	lastAccessedTime time.Time
	maxAge           int64
}

const DEFEALT_TIME = 1800

//实例化
func newInstance(name string, secret string) *Instance {
	return &Instance{
		Name:   name,
		Secret: secret,
		maxAge: DEFEALT_TIME,
	}
}
