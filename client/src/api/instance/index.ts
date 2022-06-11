// 实例管理接口
import fetch from '../fetch'

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
export function getInstanceSummary(data) {
  return fetch({
    url: '/summary',
    method: 'post',
    data
  })
}

// 系统信息，包含版本号（Version）和启动时间（StartTime）两个字段
export function sysInfo(data) {
  return fetch({
    url: '/sysinfo',
    method: 'post',
    data
  })
}

// 获取流（live/test）的详细信息
export function getStreamDetail(data) {
  return fetch({
    url: '/stream',
    method: 'post',
    data
  })
}

// 获取流（live/test）的详细信息
export function stopStream(data) {
  return fetch({
    url: '/stopstream',
    method: 'post',
    data
  })
}

// 获取配置文件信息，可以加参数 name=xxx，获取 xxx 插件的配置信息（不加参数则获取全局配置信息）
export function getConfig(data) {
  return fetch({
    url: '/getconfig',
    method: 'post',
    data
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
export function modifyConfig(data) {
  return fetch({
    url: '/modifyconfig',
    method: 'post',
    data
  })
}

// 获取实例所有插件
export function getInstancePlugin(data) {
  return fetch({
    url: '/plugins',
    method: 'get',
    data
  })
}