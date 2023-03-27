import { defineStore } from 'pinia';
import { login, register, logout } from '@/api/system/user';

export interface IUserState {
  username: string;
  level: number;
  mail: string;
  welcome: string;
  avatar: string;
  permissions: any[];
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    username: '',
    mail: '',
    level: 0,
    welcome: '',
    avatar: '',
    permissions: []
  }),
  getters: {
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getCurrentCamera(): string {
      return localStorage.getItem("currentCamera") || "";
    }
  },
  actions: {
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setCurrentCamera(cameraId: string) {
      localStorage.setItem("currentCamera", cameraId);
    },
    // 注册
    async register(userInfo) {
      try {
        const response = await register(userInfo);
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    // 登录
    async login(userInfo) {
      try {
        const response = await login(userInfo);
        this.username = response.data.nickname;
        this.level = response.data.level;
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },

    // 登出
    async logout() {
      await logout();
      this.setPermissions([]);
      return Promise.resolve('');
    }
  }
});
