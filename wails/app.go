package main

import (
	"context"
	"fmt"

	console "github.com/Monibuca/console/server/pkg"
	m7s "m7s.live/engine/v4"
	"m7s.live/engine/v4/config"
	_ "m7s.live/plugin/debug/v4"
	_ "m7s.live/plugin/edge/v4"
	_ "m7s.live/plugin/fmp4/v4"
	_ "m7s.live/plugin/gb28181/v4"
	_ "m7s.live/plugin/hdl/v4"
	_ "m7s.live/plugin/hls/v4"
	_ "m7s.live/plugin/hook/v4"
	_ "m7s.live/plugin/jessica/v4"
	_ "m7s.live/plugin/logrotate/v4"
	_ "m7s.live/plugin/monitor/v4"
	_ "m7s.live/plugin/preview/v4"
	_ "m7s.live/plugin/record/v4"
	_ "m7s.live/plugin/room/v4"
	_ "m7s.live/plugin/rtmp/v4"
	_ "m7s.live/plugin/rtsp/v4"
	_ "m7s.live/plugin/snap/v4"
	_ "m7s.live/plugin/webrtc/v4"
	_ "m7s.live/plugin/webtransport/v4"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	console.OEM = &console.TrailNoLoginORM{}
	go console.Run(ctx)
	go m7s.Run(ctx, config.Config{
		"global": config.Config{
			"console": config.Config{
				"server": "localhost:44944",
				"secret": "e10adc3949ba59abbe56e057f20f883e",
			},
		},
	})
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
