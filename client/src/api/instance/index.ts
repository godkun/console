// 实例管理接口
import fetch from '../fetch'

// 获取实例列表
export function getInstanceList(params) {
  return fetch({
    url: '/instance/list',
    method: 'get',
    params
  })
}

// 新增实例
export function addInstance(params) {
  return fetch({
    url: '/instance/add',
    method: 'post',
    params
  })
}

// 删除实例
export function delInstance(params) {
  return fetch({
    url: '/instance/del',
    method: 'get',
    params
  })
}
