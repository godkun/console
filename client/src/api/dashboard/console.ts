import fetch from '../fetch'

//获取主控台信息
export function getConsoleInfo() {
  return fetch({
    url: '/api/dashboard/console',
    method: 'get'
  })
}
