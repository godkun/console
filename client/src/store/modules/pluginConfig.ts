import { getConfig } from '@/api/instance'
import { defineStore } from 'pinia'
interface PluginConfig {
  [key: string]: any
}
export const usePluginConfigStore = defineStore({
  id: 'plugin-config',
  state: (): {
    [key: string]: {
      [key: string]: PluginConfig
    }
  } => ({}),
  getters: {},
  actions: {
    async getConfig(instantceId: string, name: string) {
      if (!this[instantceId]) {
        this[instantceId] = {}
      }
      if (!this[instantceId][name])
        return getConfig(instantceId, name).then((config) => (this[instantceId][name] = config))
      return this[instantceId][name]
    }
  }
})
