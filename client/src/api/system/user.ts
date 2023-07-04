import fetch from '../fetch'

/**
 * @description: 用户注册
 */
export function register(data) {
  return fetch({
    url: '/api/user/register',
    method: 'POST',
    data
  })
}

/**
 * @description: 发送验证码
 */
export function getVerifyCode(data) {
  return fetch({
    url: '/api/user/getverifycode',
    method: 'POST',
    data
  })
}

/**
 * @description: 用户登录
 */
export function login(data) {
  return fetch({
    url: '/api/user/login',
    method: 'POST',
    data
  })
}

/**
 * @description: 用户登出
 */
export function logout() {
  return fetch({
    url: '/api/user/logout',
    method: 'POST'
  })
}

/**
 * @description: 修改密码
 */
export function changePassword(data) {
  return fetch({
    url: '/api/user/changepassword',
    method: 'POST',
    data
  })
}

/**
 * @description: 重置密码
 */
export function resetPassword(data) {
  return fetch({
    url: '/api/user/sendresetpwdmail',
    method: 'POST',
    data
  })
}

/**
 * @description: 重置密码
 */
export function isTimeout() {
  return fetch({
    url: '/api/isTimeout'
  })
}
