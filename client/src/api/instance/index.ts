// 实例管理接口
import fetch from '../fetch'

function queryURLparamsRegEs6(url) {
  let obj = {}
  let reg = /([^?=&]+)=([^?=&]+)/g
  url.replace(reg, (...arg) => {
      obj[arg[1]] = arg[2]
  })
  return obj
}

// 获取实例列表
export function getInstanceList(data) {
  return fetch({
    url: '/instance/list',
    method: 'post',
    data
  })
}

// 新增实例
export function addInstance(data) {
  return fetch({
    url: '/instance/add',
    method: 'post',
    data
  })
}

// 更新实例
export function updateInstance(data) {
  return fetch({
    url: '/instance/update',
    method: 'post',
    data
  })
}

// 删除实例
export function delInstance(data) {
  return fetch({
    url: '/instance/del',
    method: 'post',
    data
  })
}

// 获取采样数据,包括 CPU、内存、网卡数据、以及流信息
export function getInstanceSummary() {
  const href = window.location.href
  const query = queryURLparamsRegEs6(href)
  let id = query.id
  if (!id) {
    id = localStorage.getItem('id')
    if (!id) {
      const pagesize = 0
      const pageno = 0
      getInstanceList({ pagesize, pageno }).then((res) => {
        id = res.data.list[0].id
        console.log("🚀 ~ file: index.ts ~ line 62 ~ getInstanceList ~ id", id)
        return fetch({
          url: '/summary',
          method: 'post',
          headers: {
            m7sid: id
          }
        })
      })
    } else {
      return fetch({
        url: '/summary',
        method: 'post',
        headers: {
          m7sid: id
        }
      })
    }
  } else {
    return fetch({
      url: '/summary',
      method: 'post',
      headers: {
        m7sid: id
      }
    })
  }
}

// 系统信息，包含版本号（Version）和启动时间（StartTime）两个字段
export function getSysInfo() {
  const href = window.location.href
  const query = queryURLparamsRegEs6(href)
  let id = query.id
  if (!id) id = localStorage.getItem('id')
  return fetch({
    url: '/sysinfo',
    method: 'post',
    headers: {
      m7sid: id
    },
  })
}

// 获取流（live/test）的详细信息
export function getStreamDetail(streamPath) {
  const href = window.location.href
  const query = queryURLparamsRegEs6(href)
  let id = query.id
  if (!id) id = localStorage.getItem('id')
  return fetch({
    url: `/stream?streamPath=${streamPath}`,
    method: 'post',
    headers: {
      m7sid: id
    }
  })
}

// 停止流
export function stopStream(params) {
  const href = window.location.href
  const query = queryURLparamsRegEs6(href)
  let id = query.id
  if (!id) id = localStorage.getItem('id')
  return fetch({
    url: '/stopstream',
    method: 'post',
    headers: {
      m7sid: id
    },
    data: params
  })
}

// 获取配置文件信息，可以加参数 name=xxx，获取 xxx 插件的配置信息（不加参数则获取全局配置信息）
export function getConfig(name) {
  const href = window.location.href
  const query = queryURLparamsRegEs6(href)
  let id = query.id
  if (!id) id = localStorage.getItem('id')
  return fetch({
    url: name ? `/getconfig?name=${name}` : `/getconfig`,
    method: 'post',
    headers: {
      m7sid: id
    }
  })
}

// 热更新配置信息，可以加参数 name=xxx，代表热更新 xxx 插件的配置信息（不加参数则热更新全局配置信息）
export function updateConfig(data) {
  return fetch({
    url: '/updateconfig',
    method: 'post',
    data
  })
}

// 修改配置信息，可以加参数 name=xxx，代表修改 xxx 插件的配置信息（不加参数则修改全局配置信息）
// 修改的配置信息通过请求的 body（JSON 格式）提交
export function modifyConfig(data, name) {
  const href = window.location.href
  const query = queryURLparamsRegEs6(href)
  let id = query.id
  if (!id) id = localStorage.getItem('id')
  return fetch({
    url: name ? `/modifyconfig?name=${name}` : `/modifyconfig`,
    method: 'post',
    headers: {
      m7sid: id
    },
    data
  })
}

// 获取实例所有插件
export function getInstancePlugin(params) {
  const href = window.location.href
  const query = queryURLparamsRegEs6(href)
  let id = query.id
  if (!id) id = localStorage.getItem('id')
  return fetch({
    url: '/plugins',
    method: 'post',
    headers: {
      m7sid: id
    }
  })
}
