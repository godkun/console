import { defineStore } from 'pinia'

let summaryES: any = null
let gb28181ES: any = null
import { fetchSysInfo, fetchGb28181, fetchSummary } from '@/api/instance/index'

// 定义
export const store = defineStore('app', {
  state: () => {
    return {
      device: 'desktop',
      // 插件
      plugins: [],
      Address: location.hostname,
      NetWork: [],
      Streams: [],
      Gb28181List: [],
      Gb28181ChannelList: [],
      // 内存
      Memory: {
        Used: 0,
        Usage: 0
      },
      CPUUsage: 0,
      // 硬盘
      HardDisk: {
        Used: 0,
        Usage: 0
      },
      updateTimestamp: '',
      Children: {},
      // 引擎信息
      engineInfo: {}
    }
  },
  actions: {
    toggleDevice(val) {
      this.device = val
    },
    destroy() {
      gb28181ES && gb28181ES.close()
      summaryES && summaryES.close()
    },
    update: (payload) => {
      Object.assign(this.state, payload)
    },
    fetchEngineInfo() {
      return fetchSysInfo().then((engineInfo) => {
        console.log(engineInfo)
      })
    },
    fetchPlugins() {
      return api.fetchPlugins().then((plugins) => {
        plugins.sort((a, b) => (a.Name > b.Name ? 1 : -1))
        this.update(plugins)
        return plugins
      })
    },
    fetchSummary() {
      if (summaryES) {
        return
      }
      summaryES = fetchSummary()
      summaryES.onmessage = (evt) => {
        if (!evt.data) return
        const summary = JSON.parse(evt.data)
        summary.Address = location.hostname
        if (!summary.Streams) summary.Streams = []
        summary.Streams.sort((a, b) => (a.StreamPath > b.StreamPath ? 1 : -1))
        summary.updateTimestamp = new Date().getTime()
        this.update(summary)
      }
    },
    fetchGb28181() {
      if (gb28181ES) {
        return
      }

      gb28181ES = fetchGb28181()
      gb28181ES.onmessage = (evt) => {
        if (!evt.data) return
        const Gb28181List = JSON.parse(evt.data)
        if (!Array.isArray(Gb28181List)) {
          return
        }
        Gb28181List.sort((a, b) => (a.ID > b.ID ? 1 : -1))
        let Gb28181ChannelList = []
        Gb28181List.forEach((device) => {
          const channels = device.Channels || []
          if (channels.length > 0) {
            Gb28181ChannelList = Gb28181ChannelList.concat(
              channels.map((x, index) => {
                x.device = device
                x.channel = index
                return x
              })
            )
          }
        })
        Gb28181ChannelList = Gb28181ChannelList.filter((channel: any) => !!channel.DeviceID)
        this.update({ Gb28181List, Gb28181ChannelList })
      }
    }
  }
})
