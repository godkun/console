package main

import (
	"context"

	server "github.com/Monibuca/console/server/pkg"
)

func main() {

	server.Start()
	server.Run(context.Background())

}
