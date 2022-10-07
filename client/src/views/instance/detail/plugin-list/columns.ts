import { NTag } from 'naive-ui'
import { h } from 'vue'

export const columns = [
  {
    title: '名称',
    render(row) {
      return row.RawConfig['enabled'] === false
        ? h('div', [
            h('text', row.Name),
            h(
              NTag,
              {
                type: 'primary'
              },
              '禁用'
            )
          ])
        : h('text', row.Name)
    },
    width: 100
  },
  {
    title: '版本',
    key: 'Version',
    width: 200
  }
]
