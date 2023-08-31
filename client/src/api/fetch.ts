import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { router } from '@/router'
// 创建一个实例
const service = axios.create({
  timeout: 10000,
  withCredentials: false
})
export const prefix = import.meta.env.VITE_GLOB_API_URL_PREFIX || ''
// 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.headers && 'm7sid' in config.headers) {
      config.baseURL = prefix || '/m7s/'
    } else {
      config.baseURL = prefix
    }
    return config
  },
  (error: any) => {
    Promise.reject(error)
  }
)
let redirectId: ReturnType<typeof setTimeout> | undefined = void 0
// 响应拦截
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    const res = response.data
    // adapter m7s engine api
    if (res && typeof res?.code == 'number' && res?.code !== 0) {
      window.$message.error(res.msg)
      if (res.code == 20305) {
        if (redirectId) clearTimeout(redirectId)
        redirectId = setTimeout(() => {
          router.replace({
            name: 'Login',
            query: {
              redirect: encodeURI(router.currentRoute.value.fullPath)
            }
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
