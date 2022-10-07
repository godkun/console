import { h } from "vue";

export function unitSpeedFormat(value, unit = '') {
  const uintInc = {
    '': 'K',
    K: 'M',
    M: 'G',
    G: null
  }

  if (value > 1024 && uintInc[unit]) {
    return unitSpeedFormat(value / 1024, uintInc[unit])
  }
  return (value || 0).toFixed(2).replace('.00', '') + unit + 'B'
}
export const columns = [
  {
    title: '名称',
    key: 'Name',
    width: 100
  },
  {
    title: '大小',
    width: 100,
    render(row) {
      return h('text', unitSpeedFormat(row.Size))
    }
  }
]
