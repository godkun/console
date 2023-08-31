package main

import (
	"embed"
	"fmt"
	"net/http"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Monibuca Console",
		Width:  1500,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets:  nil,
			Handler: NewFileLoader(),
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

type FileLoader struct {
	http.Handler
}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	res.Write([]byte(`<script>location.href="http://localhost:9999/web/index.html"</script>`))
	// http.Redirect(res, req, "http://localhost:9999/web/index.html", http.StatusFound)
	fmt.Println(req.RequestURI)
	// requestedFilename := strings.TrimPrefix(req.URL.Path, "/")
	// if strings.HasPrefix(requestedFilename, "api/") || strings.HasPrefix(requestedFilename, "m7s/") {
	// 	query := req.URL.RawQuery
	// 	if query != "" {
	// 		query = "?" + query
	// 	}
	// 	newReq, _ := http.NewRequestWithContext(req.Context(), req.Method, "http://localhost:9999/"+requestedFilename+query, req.Body)
	// 	newReq.Header = req.Header.Clone()
	// 	resp, err := http.DefaultClient.Do(newReq)
	// 	fmt.Println("request server:", requestedFilename+query)
	// 	if err != nil {
	// 		fmt.Println(err.Error())
	// 		return
	// 	}
	// 	for k, v := range resp.Header {
	// 		res.Header().Set(k, v[0])
	// 	}
	// 	io.Copy(res, resp.Body)
	// 	return
	// }
}
