// 实例管理接口
import fetch, { prefix } from '../fetch'
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
export function getInstanceSummary(m7sid: string) {
  return fetch({
    url: '/api/summary',
    method: 'post',
    headers: {
      m7sid
    }
  })
}
export function getInstanceSummarySSE(m7sid: string) {
  return new EventSource(prefix + '/api/summary?m7sid=' + m7sid)
}

// 系统信息，包含版本号（Version）和启动时间（StartTime）两个字段
export function getSysInfo(m7sid: string) {
  return fetch({
    url: '/api/sysinfo',
    method: 'post',
    headers: {
      m7sid
    }
  })
}

// 获取流（live/test）的详细信息
export function getStreamDetail(m7sid: string, streamPath) {
  return fetch({
    url: `/api/stream?streamPath=${streamPath}`,
    method: 'post',
    headers: {
      m7sid
    }
  })
}

// 停止流
export function stopStream(m7sid: string, streamPath) {
  return fetch({
    url: `/api/closestream?streamPath=${streamPath}`,
    method: 'post',
    headers: {
      m7sid
    }
  })
}

// 获取配置文件信息，可以加参数 name=xxx，获取 xxx 插件的配置信息（不加参数则获取全局配置信息）
export function getConfig(m7sid: string, name: string, yaml = '') {
  const params = new URLSearchParams({ yaml, name })
  return fetch({
    url: `/api/getconfig?${params.toString()}`,
    method: 'post',
    headers: {
      m7sid
    }
  })
}
export async function getInstanceHttp(
  id: string,
  local: boolean,
  https: boolean,
  protocol = 'http'
) {
  const sysInfo = await getSysInfo(id)
  const detail = await fetch({
    url: `/api/instance/detail`,
    method: 'post',
    data: {
      id
    }
  })
  const localIp = sysInfo.LocalIP
  const remoteIp = detail.RemoteIP
  const config = await fetch({
    url: `/api/getconfig`,
    method: 'post',
    headers: {
      m7sid: id
    }
  })
  const { publicaddr, publicaddrtls } = config.console
  const { listenaddr, listenaddrtls } = config.http
  const ip = (https ? publicaddrtls : publicaddr) || remoteIp
  return `${protocol}${https ? 's' : ''}://${local ? localIp : ip}${
    https ? listenaddrtls : listenaddr
  }`
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
export function modifyConfig(m7sid: string, data, name = '') {
  return fetch({
    url: `/api/modifyconfig?${new URLSearchParams({ name: name || '', yaml: '1' })}`,
    method: 'post',
    headers: {
      m7sid
    },
    data
  })
}

// 获取实例所有插件
export function getInstancePlugin(m7sid: string) {
  return fetch({
    url: '/api/plugins',
    method: 'post',
    headers: {
      m7sid
    }
  })
}

export function getInstanceGB(m7sid: string) {
  return fetch({
    url: '/gb28181/api/list',
    method: 'post',
    headers: {
      m7sid
    }
  })
}
export function gb28181Invite(
  m7sid: string,
  id: string,
  channel: string,
  startTime?: number,
  endTime?: number
) {
  return fetch({
    url: `/gb28181/api/invite?id=${id}&channel=${channel}${
      startTime ? '&startTime=' + startTime : ''
    }${endTime ? '&endTime=' + endTime : ''}`,
    method: 'post',
    headers: {
      m7sid
    }
  })
}

export function getInstancePullList(m7sid: string) {
  return fetch({
    url: '/api/list/pull',
    method: 'post',
    headers: {
      m7sid
    }
  })
}

export function getInstancePushList(m7sid: string) {
  return fetch({
    url: '/api/list/push',
    method: 'post',
    headers: {
      m7sid
    }
  })
}

export function pullStream(
  m7sid: string,
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
      m7sid
    }
  })
}

export function stopPush(m7sid: string, url: string) {
  return fetch({
    url: `/api/stoppush?url=${encodeURI(url)}`,
    method: 'post',
    headers: {
      m7sid
    }
  })
}
export function pushStream(m7sid: string, type: 'rtsp' | 'rtmp', streamPath: string, url: string) {
  return fetch({
    url: `/${type}/api/push?streamPath=${streamPath}&target=${encodeURI(url)}`,
    method: 'post',
    headers: {
      m7sid
    }
  })
}

export function getLogFiles(m7sid: string) {
  return fetch({
    url: '/logrotate/api/list',
    method: 'post',
    headers: {
      m7sid
    }
  })
}

export function getRecordFiles(m7sid: string) {
  return fetch({
    url: '/record/api/list',
    method: 'post',
    headers: {
      m7sid
    }
  })
}

export function getRecordingList(m7sid: string) {
  return fetch({
    url: '/record/api/list/recording',
    method: 'post',
    headers: {
      m7sid
    }
  })
}

export function stopRecord(m7sid: string, id: string) {
  return fetch({
    url: '/record/api/stop?id=' + id,
    method: 'post',
    headers: {
      m7sid
    }
  })
}

export function startRecord(
  m7sid: string,
  streamPath: string,
  type: string,
  fileName: string,
  fragment: string
) {
  return fetch({
    url: '/record/api/start?' + new URLSearchParams({ streamPath, type, fileName, fragment }),
    method: 'post',
    headers: {
      m7sid
    }
  })
}
//获取入房口令
export function getRoomPass(m7sid: string, roomId: string) {
  return fetch({
    url: `/api/instance/getroompass?roomId=${roomId}`,
    method: 'post',
    headers: {
      m7sid
    }
  })
}
export function getSDPs(m7sid: string, sdp: string) {
  return fetch({
    url: `/webrtc/batch`,
    method: 'post',
    headers: {
      m7sid
    },
    data: sdp
  })
}

export function getStreamList(m7sid: string, streamPath: string, time: string) {
  return fetch({
    url: '/monitor/api/list/stream?' + new URLSearchParams({ streamPath, time }),
    method: 'post',
    headers: {
      m7sid
    }
  })
}
export function getTrackList(m7sid: string, streamPath: string) {
  return fetch({
    url: '/monitor/api/list/track?' + new URLSearchParams({ streamPath }),
    method: 'post',
    headers: {
      m7sid
    }
  })
}
export function getMonitorFile(m7sid: string, filePath: string) {
  return fetch({
    url: '/monitor/' + filePath,
    method: 'post',
    headers: {
      m7sid
    }
  })
}

export function pprof(m7sid: string, path: string) {
  return fetch({
    url: '/debug/pprof/' + (path || ''),
    method: 'post',
    headers: {
      m7sid
    }
  })
}
