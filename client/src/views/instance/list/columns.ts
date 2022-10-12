import { NTag } from 'naive-ui'
import { h } from 'vue'
export const columns = [
  {
    title: 'id',
    key: 'id',
    width: 50
  },
  {
    title: '名称',
    key: 'name',
    width: 100
  },
  {
    title: 'secret',
    key: 'secret',
    width: 200
  },
  {
    title: '创建时间',
    key: 'createtime',
    width: 200
  },
  {
    title: '状态',
    key: 'online',
    width: 100,
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
