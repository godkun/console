package pkg

import (
	"net/http"
	"sync"
	"time"

	"github.com/quic-go/quic-go"
	"golang.org/x/net/websocket"
)

type IncomingRequest struct {
	W http.ResponseWriter
	R *http.Request
	sync.WaitGroup
}
type Instance struct {
	Name             string `json:"name"`
	Secret           string `json:"secret"`
	id               string
	mail             string
	W                *websocket.Conn
	Quic             quic.Connection
	lastAccessedTime time.Time
	maxAge           int64
	Ch               chan *IncomingRequest
}

const DEFEALT_TIME = 1800

// 实例化
func NewInstance(name string, secret string) *Instance {
	return &Instance{
		Name:   name,
		Secret: secret,
		maxAge: DEFEALT_TIME,
		Ch:     make(chan *IncomingRequest, 10),
	}
}

type ConcurInstances struct {
	Instances map[string]*Instance
	sync.RWMutex
}

func NewConcurInstances() *ConcurInstances {
	return &ConcurInstances{
		Instances: make(map[string]*Instance),
	}
}

func (c *ConcurInstances) Get(k string) *Instance {
	c.RLock()
	defer c.RUnlock()
	if data, ok := c.Instances[k]; ok {
		return data
	} else {
		return nil
	}
}

func (c *ConcurInstances) FindByIdAndMail(id, mail string) *Instance {
	instance := c.FindById(id)
	if instance != nil && instance.mail == mail {
		return instance
	}
	return nil
}

func (c *ConcurInstances) FindById(id string) *Instance {
	c.RLock()
	defer c.RUnlock()
	for _, instance := range c.Instances {
		if instance.id == id {
			return instance
		}
	}
	return nil
}

func (c *ConcurInstances) Set(k string, v *Instance) {
	c.Lock()
	defer c.Unlock()
	c.Instances[k] = v
}

func (c *ConcurInstances) Delete(k string) {
	c.Lock()
	defer c.Unlock()
	delete(c.Instances, k)
}
