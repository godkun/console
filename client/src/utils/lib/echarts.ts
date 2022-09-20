import * as echarts from 'echarts/core'

import { BarChart, LineChart } from 'echarts/charts'

import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TooltipComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent
} from 'echarts/components'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart
])

export default echarts
