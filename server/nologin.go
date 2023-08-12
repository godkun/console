//go:build ignore
// +build ignore

package main

import (
	"context"

	server "github.com/Monibuca/console/server/pkg"
)

func main() {
	server.OEM = &server.TrailNoLoginORM{}
	server.Run(context.Background())
}
