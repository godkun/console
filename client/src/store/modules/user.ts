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
    getAvatar(): string {
      return this.avatar
    },
    getNickname(): string {
      return this.username
    },
    getPermissions(): [any][] {
      return this.permissions
    },
  },
  actions: {
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    setPermissions(permissions) {
      this.permissions = permissions
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

    // 登出
    async logout() {
      await logout()
      this.setPermissions([])
      return Promise.resolve('')
    }
  }
})

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store)
}
