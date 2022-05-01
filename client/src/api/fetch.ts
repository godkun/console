import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

// 创建一个实例
const service = axios.create({
  baseURL: '/api',
  timeout: 4000,
  withCredentials: false
})

// 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config
  },
  (error: any) => {
    Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    const res = response.data
    if (res.code !== 0) {
      return Promise.reject(res.msg)
    } else {
      return res
    }
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

export default service
