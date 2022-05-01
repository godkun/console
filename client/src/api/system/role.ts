import fetch from '../fetch'

/**
 * @description: 角色列表
 */
export function getRoleList() {
  return fetch({
    url: '/role/list',
    method: 'GET'
  })
}
