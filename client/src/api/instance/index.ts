// 实例管理接口
import fetch from '../fetch'

// 获取实例列表
export function getInstanceList(data) {
  return fetch({
    url: '/instance/list',
    method: 'post',
    data
  })
}

// 新增实例
export function addInstance(data) {
  return fetch({
    url: '/instance/add',
    method: 'post',
    data
  })
}

// 更新实例
export function updateInstance(data) {
  return fetch({
    url: '/instance/update',
    method: 'post',
    data
  })
}

// 删除实例
export function delInstance(data) {
  return fetch({
    url: '/instance/del',
    method: 'post',
    data
  })
}
