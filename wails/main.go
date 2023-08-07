package main

import (
	"embed"
	"io"
	"net/http"
	"strings"

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
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets:  assets,
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
	// req.RequestURI = strings.Replace(req.RequestURI, "wails://wails/", "http://localhost:9999/", -1)
	// req.Host = "localhost:9999"
	// resp, err := http.DefaultClient.Do(req)
	println(req.RequestURI)
	// resp, err := http.Get("http://localhost:9999/web/index.html")
	// if err != nil {
	// 	println(err.Error())
	// 	return
	// }
	// for k, v := range resp.Header {
	// 	res.Header().Set(k, v[0])
	// }
	// io.Copy(res, resp.Body)

	// var err error
	requestedFilename := strings.TrimPrefix(req.URL.Path, "/")
	// requestedFilename = strings.TrimPrefix(requestedFilename, "/")
	if strings.HasPrefix(requestedFilename, "api/") || strings.HasPrefix(requestedFilename, "m7s/") {
		query := req.URL.RawQuery
		if query != "" {
			query = "?" + query
		}
		req, _ := http.NewRequestWithContext(req.Context(), req.Method, "http://localhost:9999/"+requestedFilename+query, req.Body)
		req.Header = req.Header.Clone()
		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			println(err.Error())
			return
		}
		for k, v := range resp.Header {
			res.Header().Set(k, v[0])
		}
		io.Copy(res, resp.Body)
		return
	}
	// println("Requesting file:", requestedFilename)
	// if requestedFilename == "" {
	// 	requestedFilename = "index.html"
	// }
	// requestedFilename = "frontend/dist/" + requestedFilename
	// fileData, err := assets.ReadFile(requestedFilename)
	// if err != nil {
	// 	println("Error:", err.Error())
	// 	res.WriteHeader(http.StatusBadRequest)
	// 	res.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
	// }

	// res.Write(fileData)
}
