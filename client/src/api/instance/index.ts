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

const _prefix = '/api'

export const v4 = {
  fetchSysInfo: _prefix + '/gateway/sysInfo',
  fetchPlugins: _prefix + '/gateway/plugins',
  fetchLogList: _prefix + '/logrotate/list',
  fetchLogTail: _prefix + '/logrotate/tail',
  searchLog: _prefix + '/logrotate/find',
  fetchRecordList: _prefix + '/record/flv/list',
  deleteRecordItem: _prefix + '/record/flv/delete',
  stopRecordFlv: _prefix + '/record/flv/stop',
  recordFlv: _prefix + '/record/flv',
  fetchSummary: _prefix + '/summary',
  fetchGb28181: _prefix + '/gb28181/list',
  getWebRtcRemoteSdp: _prefix + '/webrtc/play',
  inviteGb28181: _prefix + '/gb28181/invite',
  byeGb28181: _prefix + '/gb28181/bye',
  ptzCmdGb28181: _prefix + '/gb28181/control',
  queryRecords: _prefix + '/gb28181/query/records',
  playRecords: _prefix + '/gb28181/invite',
  stopRecords: _prefix + '/gateway/stop'
}

export function fetchSysInfo() {
  return fetch({
    url: v4.fetchSysInfo,
    method: 'get'
  })
}

export function fetchPlugins() {
  return fetch({
    url: v4.fetchPlugins,
    method: 'get'
  })
}

export function fetchLogList() {
  return fetch({
    url: v4.fetchLogList,
    method: 'get'
  })
}

export function searchLog(query) {
  return fetch({
    url: v4.searchLog,
    method: 'get',
    params: { query }
  })
}

export function fetchRecordList() {
  return fetch({
    url: v4.fetchRecordList,
    method: 'get'
  })
}

export function deleteRecordItem(streamPath) {
  return fetch({
    url: v4.deleteRecordItem,
    method: 'get',
    params: { streamPath: streamPath.replace('.flv', '') }
  })
}

export function stopRecordFlv(streamPath) {
  return fetch({
    url: v4.stopRecordFlv,
    method: 'get',
    params: { streamPath }
  })
}

export function recordFlv(options) {
  return fetch({
    url: v4.recordFlv,
    method: 'get',
    params: options
  })
}

export function fetchSummary() {
  return new EventSource(v4.fetchSummary)
}

export function fetchGb28181() {
  return new EventSource(v4.fetchGb28181)
}

export function getWebRtcRemoteSdp(streamPath, data) {
  return fetch({
    url: v4.getWebRtcRemoteSdp,
    method: 'POST',
    params: { streamPath },
    data: data
  })
}

export function inviteGb28181(options) {
  return fetch({
    method: 'get',
    url: v4.inviteGb28181,
    params: options
  })
}

export function byeGb28181(options) {
  return fetch({
    method: 'get',
    url: v4.byeGb28181,
    params: options
  })
}

export function ptzCmdGb28181(options) {
  return fetch({
    method: 'get',
    url: v4.ptzCmdGb28181,
    params: options
  })
}

export function queryRecords(options) {
  return fetch({
    method: 'get',
    url: v4.queryRecords,
    params: options
  })
}

export function playRecords(options) {
  return fetch({
    method: 'get',
    url: v4.playRecords,
    params: options
  })
}

export function stopRecords(streamPath) {
  return fetch({
    method: 'get',
    url: v4.stopRecords,
    params: { streamPath }
  })
}
