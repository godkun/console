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
 * @description: 用户登录
 */
export function changePassword(data) {
  return fetch({
    url: '/user/changepassword',
    method: 'POST',
    data
  })
}

/**
 * @description: 用户登录
 */
export function resetPassword(data) {
  return fetch({
    url: '/user/sendresetpwdmail',
    method: 'POST',
    data
  })
}
