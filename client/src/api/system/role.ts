import fetch from '../fetch'

/**
 * @description: 角色列表
 */
export function getRoleList() {
  return fetch({
    url: '/api/role/list',
    method: 'GET'
  })
}
