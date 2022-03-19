export default defineNuxtPlugin((nuxtApp) => {
  // 1 监听来自m7s的websocket 连接
  // 2 接收m7s 发过来的secret字符串，验证身份
  // 3 向m7s 发出HTTP请求URL地址字符串
  // 4 等待m7s发过来的响应数据
  // Doing something with nuxtApp
})
