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

// 新增实例
export function addInstance(params) {
  return http.request({
    url: '/instance/add',
    method: 'post',
    params
  })
}

// 删除实例
export function delInstance(params) {
  return http.request({
    url: '/instance/del',
    method: 'get',
    params
  })
}
