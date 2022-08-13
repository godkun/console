import { h } from 'vue'
import {NTime } from 'naive-ui'
export const columns = [
  {
    title: 'ID',
    key: 'ID',
    width: 100
  },
  {
    title: 'Name',
    key: 'Name',
    width: 70
  },
  {
    title: 'Manufacturer',
    key: 'Manufacturer',
    width: 100
  },
  {
    title: 'Model',
    key: 'Model',
    width: 50
  },
  {
    title: 'Owner',
    key: 'Owner',
    width: 70
  },
  {
    title: 'RegisterTime',
    key: 'RegisterTime',
    width: 130,
    render(row) {
      return h(NTime, row.RegisterTime)
    }
  },
  {
    title: 'UpdateTIme',
    key: 'UpdateTIme',
    width: 130,
    render(row) {
      return h(NTime, row.UpdateTIme)
    }
  },
  {
    title: 'Status',
    key: 'Status',
    width: 70
  },
  {
    title: 'NetAddr',
    key: 'NetAddr',
    width: 120
  },
  {
    title: 'Channels',
    key: 'Channels',
    width: 70,
    render(row) {
      return h('text', row.Channels.length)
    }
  }
]
