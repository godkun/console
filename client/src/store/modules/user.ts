import { defineStore } from 'pinia'
import { store } from '@/store'
import { login, register, logout } from '@/api/system/user'

export interface IUserState {
  username: string
  welcome: string
  avatar: string
  permissions: any[]
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    username: '',
    welcome: '',
    avatar: '',
    permissions: []
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getAvatar(): string {
      return this.avatar
    },
    getNickname(): string {
      return this.username
    },
    getPermissions(): [any][] {
      return this.permissions
    },
    getUserInfo(): object {
      return this.info
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setPermissions(permissions) {
      this.permissions = permissions
    },
    setUserInfo(info) {
      this.info = info
    },
    // 注册
    async register(userInfo) {
      try {
        const response = await register(userInfo)
        return Promise.resolve(response)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 登录
    async login(userInfo) {
      try {
        const response = await login(userInfo)
        return Promise.resolve(response)
      } catch (e) {
        return Promise.reject(e)
      }
    },

    // 获取用户信息
    GetInfo() {
      const that = this
      return new Promise((resolve, reject) => {
        const res = {
          userId: '1',
          username: 'admin',
          realName: 'Admin',
          avatar: 'http://dummyimage.com/120x60',
          desc: 'manager',
          password: 'TTNJYLREVTSSL',
          token: 'ANEJRNFFCHKPTIPMUQFWADJLQPVESUVH',
          permissions: [{ label: '主控台', value: 'dashboard_console' }]
        }
        const result = res
        if (result.permissions && result.permissions.length) {
          const permissionsList = result.permissions
          that.setPermissions(permissionsList)
          that.setUserInfo(result)
        } else {
          reject(new Error('getInfo: permissionsList must be a non-null array !'))
        }
        that.setAvatar(result.avatar)
        resolve(res)
      })
    },

    // 登出
    async logout() {
      await logout()
      this.setPermissions([])
      this.setUserInfo('')
      return Promise.resolve('')
    }
  }
})

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store)
}
