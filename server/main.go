package main

import (
	"context"

	server "github.com/Monibuca/console/server/pkg"
)

func main() {
	server.OEM = &server.TrailORM{}
	server.Run(context.Background())
}
