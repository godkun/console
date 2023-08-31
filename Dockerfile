FROM golang:1.20-bullseye  AS build

WORKDIR /app/src
COPY ./server /app/src/server
RUN echo "go 1.19\nuse ./server" > /app/src/go.work
RUN go env -w GOPROXY=https://goproxy.cn,direct CGO_ENABLED=1 GOOS=linux
RUN go build -o /app/bin/m7sconsole /app/src/server/main.go


FROM bitnami/minideb:latest
WORKDIR /app
RUN cd /app
# 复制可执行文件到镜像中
COPY --from=build /app/bin/m7sconsole m7sconsole
COPY config.toml config.toml

# 安装依赖库（如果有需要的话）

# 暴露容器的端口
EXPOSE 9999
EXPOSE 10000
EXPOSE 44944/udp

# 设置容器启动命令
ENTRYPOINT /app/m7sconsole
