import { h } from 'vue'
import { NTag } from 'naive-ui'

const newTagColors = { color: '#f90', textColor: '#fff', borderColor: '#f90' }
export function renderNew(type = 'success', text = 'M7S', color: object = newTagColors) {
  return () =>
    h(
      NTag as any,
      {
        type,
        round: true,
        size: 'small',
        color
      },
      { default: () => text }
    )
}
