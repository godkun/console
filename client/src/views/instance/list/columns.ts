import { NTag } from 'naive-ui'
import { h } from 'vue'
export const columns = [
  {
    title: '实例id',
    key: 'id',
    width: '10%'
  },
  {
    title: '实例名称',
    key: 'name',
    width: '10%'
  },
  {
    title: '实例秘钥',
    key: 'secret',
    width: '15%'
  },
  {
    title: '创建时间',
    key: 'createtime',
    width: '15%'
  },
  {
    title: '是否在线',
    key: 'online',
    width: '8%',
    render(row) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px'
          },
          type: row.online == 1 ? 'success' : 'error',
          bordered: false
        },
        {
          default: () => (row.online == 1 ? '在线' : '离线')
        }
      )
    }
  }
]
