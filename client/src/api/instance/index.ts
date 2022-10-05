// 实例管理接口
import fetch from '../fetch'

function queryURLparamsRegEs6(url) {
  const obj: Record<string, string | null> = {}
  const reg = /([^?=&]+)=([^?=&]+)/g
  url.replace(reg, (...arg) => {
    obj[arg[1]] = arg[2]
  })
  return obj
}
function getInstanceId() {
  const query = queryURLparamsRegEs6(window.location.href)
  return query.id || localStorage.getItem('id')
}
// 获取实例列表
export function getInstanceList(data) {
  return fetch({
    url: '/api/instance/list',
    method: 'post',
    data
  })
}

// 新增实例
export function addInstance(data) {
  return fetch({
    url: '/api/instance/add',
    method: 'post',
    data
  })
}

// 更新实例
export function updateInstance(data) {
  return fetch({
    url: '/api/instance/update',
    method: 'post',
    data
  })
}

// 删除实例
export function delInstance(data) {
  return fetch({
    url: '/api/instance/del',
    method: 'post',
    data
  })
}

// 获取采样数据,包括 CPU、内存、网卡数据、以及流信息
export function getInstanceSummary() {
  let id = getInstanceId()
  if (!id) {
    const pagesize = 0
    const pageno = 0
    getInstanceList({ pagesize, pageno }).then((res) => {
      id = res.data.list[0].id
      return fetch({
        url: '/api/summary?json=1',
        method: 'post',
        headers: {
          m7sid: id
        }
      })
    })
  } else {
    return fetch({
      url: '/api/summary?json=1',
      method: 'post',
      headers: {
        m7sid: id
      }
    })
  }
}

// 系统信息，包含版本号（Version）和启动时间（StartTime）两个字段
export function getSysInfo() {
  return fetch({
    url: '/api/sysinfo',
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}

// 获取流（live/test）的详细信息
export function getStreamDetail(streamPath) {
  return fetch({
    url: `/api/stream?streamPath=${streamPath}`,
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}

// 停止流
export function stopStream(streamPath) {
  return fetch({
    url: `/api/closestream?streamPath=${streamPath}`,
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}

// 获取配置文件信息，可以加参数 name=xxx，获取 xxx 插件的配置信息（不加参数则获取全局配置信息）
export function getConfig(name: string) {
  const params = new URLSearchParams({ yaml: '1', name })
  return fetch({
    url: `/api/getconfig?${params.toString()}`,
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}

// 热更新配置信息，可以加参数 name=xxx，代表热更新 xxx 插件的配置信息（不加参数则热更新全局配置信息）
export function updateConfig(data) {
  return fetch({
    url: '/api/updateconfig',
    method: 'post',
    data
  })
}

// 修改配置信息，可以加参数 name=xxx，代表修改 xxx 插件的配置信息（不加参数则修改全局配置信息）
// 修改的配置信息通过请求的 body（JSON 格式）提交
export function modifyConfig(data, name) {
  return fetch({
    url: name ? `/api/modifyconfig?name=${name}` : `/api/modifyconfig`,
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    },
    data
  })
}

// 获取实例所有插件
export function getInstancePlugin() {
  return fetch({
    url: '/api/plugins',
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}

export function getInstanceGB() {
  return fetch({
    url: '/gb28181/api/list',
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}
export function gb28181Invite(id: string, channel: string, startTime?: number, endTime?: number) {
  return fetch({
    url: `/gb28181/api/invite?id=${id}&channel=${channel}${
      startTime ? '&startTime=' + startTime : ''
    }${endTime ? '&endTime=' + endTime : ''}`,
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}

export function getInstancePullList() {
  return fetch({
    url: '/api/list/pull',
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}

export function getInstancePushList() {
  return fetch({
    url: '/api/list/push',
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}

export function pullStream(
  type: 'rtsp' | 'rtmp' | 'hls' | 'hdl',
  streamPath: string,
  url: string,
  save = false
) {
  return fetch({
    url: `/${type}/api/pull?streamPath=${streamPath}&target=${encodeURI(url)}${
      save ? '&save=1' : ''
    }`,
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}

export function stopPush() {}
export function pushStream(type: 'rtsp' | 'rtmp', streamPath: string, url: string) {
  return fetch({
    url: `/${type}/api/push?streamPath=${streamPath}&target=${encodeURI(url)}`,
    method: 'post',
    headers: {
      m7sid: getInstanceId()
    }
  })
}
