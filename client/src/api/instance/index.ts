// 实例管理接口
import { http } from '@/utils/http/axios'

// 获取实例列表
export function getInstanceList(params) {
  return http.request({
    url: '/instance/list',
    method: 'get',
    params
  })
}

// 获取实例列表
export function addInstance(params) {
  return http.request({
    url: '/instance/add',
    method: 'post',
    params
  })
}
