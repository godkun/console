import fetch from '../fetch'

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return fetch({
    url: '/api/menus',
    method: 'GET'
  })
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return fetch({
    url: '/api/menu/list',
    method: 'GET',
    params
  })
}
