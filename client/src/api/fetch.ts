import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { router } from '@/router'

// 创建一个实例
const service = axios.create({
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
    // adapter m7s engine api
    if (res && typeof res?.code == 'number' && res?.code !== 0) {
      window.$message.error(res.msg)
      if (res.code == 20305) {
        setTimeout(() => {
          router.replace({
            name: 'Login'
          })
        }, 500)
      }
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
