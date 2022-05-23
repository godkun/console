package main

import (
	"golang.org/x/net/websocket"
	"sync"
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
func NewInstance(name string, secret string) *Instance {
	return &Instance{
		Name:   name,
		Secret: secret,
		maxAge: DEFEALT_TIME,
	}
}

type ConcurInstances struct {
	Instances map[string]*Instance
	Lock        *sync.RWMutex
}

func NewConcurInstances() *ConcurInstances {
	return &ConcurInstances{
		Instances: make(map[string]*Instance),
		Lock:        &sync.RWMutex{},
	}
}

func (c ConcurInstances) Get(k string) *Instance {
	c.Lock.RLock()
	defer c.Lock.RUnlock()
	if data, ok := c.Instances[k]; ok {
		return data
	} else {
		return nil
	}
}

func (c ConcurInstances) Set(k string, v *Instance) {
	c.Lock.Lock()
	defer c.Lock.Unlock()
	c.Instances[k] = v
}

func (c ConcurInstances) Delete(k string) {
	c.Lock.Lock()
	defer c.Lock.Unlock()
	delete(c.Instances, k)
}