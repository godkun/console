<template>
  <div>
    <div class="events">
      <v-chart class="chart" :option="option" autoresize />
    </div>
    <div class="events">
      <v-chart class="chart" :option="option_fps" autoresize />
    </div>
    <div class="events">
      <v-chart class="chart" :option="option_rbs" autoresize />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { getMonitorFile, getTrackList } from '@/api/instance'
  import { use } from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { ScatterChart, LineChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    MarkLineComponent,
    GridComponent,
    DataZoomComponent
  } from 'echarts/components'
  import VChart from 'vue-echarts'
  import YAML from 'yaml'
  import { ECBasicOption } from 'echarts/types/dist/shared'
  import { reactive, ref } from 'vue'
  use([
    CanvasRenderer,
    ScatterChart,
    LineChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    MarkLineComponent,
    DataZoomComponent
  ])
  const route = useRoute()
  const id = route.params.id as string
  const stream = route.params.stream as string
  const tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      animation: false,
      axis: 'x',
      label: {
        show: true,
        formatter: ({ value }) => new Date(value).toLocaleTimeString(),
        backgroundColor: 'rgba(50,50,50,0.7)'
      }
    }
  }
  const startTime = ref<number>(0)
  const xAxis = {
    type: 'time',
    min: startTime,
    splitLine: {
      show: false
    }
  }
  const dataZoom = [
    {
      id: 'dataZoomX',
      type: 'slider',
      xAxisIndex: [0],
      filterMode: 'filter'
    }
  ]
  const option = reactive<ECBasicOption>({
    title: {
      text: stream,
      left: '1%'
    },
    dataZoom,
    tooltip,
    xAxis,
    yAxis: [
      {
        name: '码率kbps',
        type: 'value'
      },
      {
        name: 'event',
        type: 'value',
        min: 0,
        max: 100,
        show: false,
        splitNumber: 2,
        splitLine: {
          show: false
        }
      }
    ],
    series: []
  })
  const option_fps = reactive<ECBasicOption>({
    tooltip,
    xAxis,
    dataZoom,
    yAxis: {
      name: '帧率fps',
      type: 'value'
    },
    series: []
  })
  const option_rbs = reactive<ECBasicOption>({
    tooltip,
    xAxis,
    dataZoom,
    yAxis: {
      name: '缓冲大小',
      type: 'value'
    },
    series: []
  })

  getMonitorFile(id, stream + '/stream.yaml').then((res) => {
    const data = YAML.parse(res)
    startTime.value = data[0].time
    option.series.push({
      yAxisIndex: 1,
      type: 'scatter',
      data: data.map((item) => [item.time, 100]),
      labelLayout: {
        moveOverlap: 'shiftY'
      },
      tooltip: {
        trigger: 'item',
        formatter: ({ data }) => {
          return `${data.event}<br/>${new Date(data.time).toLocaleTimeString()}`
        }
      },
      markLine: {
        lineStyle: {
          type: 'dashed'
        },
        data: data.map((i) => [
          {
            coord: [i.time, 0],
            symbol: 'none'
          },
          { coord: [i.time, 90], symbol: 'circle', name: i.event }
        ])
      }
    })
  })
  getTrackList(id, stream).then((res) => {
    const data = YAML.parse(res)
    data.forEach((track, index) => {
      getMonitorFile(id, stream + `/track/${track}.yaml`).then((res) => {
        const data = YAML.parse(res)
        option.series.push({
          yAxisIndex: 0,
          showSymbol: false,
          smooth: true,
          name: track,
          type: 'line',
          data: data.map((item) => {
            return {
              value: [item.time, item.bps >> 10]
            }
          })
        })
        option_fps.series.push({
          name: track,
          showSymbol: false,
          smooth: true,
          type: 'line',
          data: data.map((item) => {
            return {
              value: [item.time, item.fps]
            }
          })
        })
        option_rbs.series.push({
          name: track,
          showSymbol: false,
          smooth: true,
          type: 'line',
          data: data.map((item) => {
            return {
              value: [item.time, item.rb]
            }
          })
        })
      })
    })
  })
</script>
<style scoped>
  .events {
    width: 100%;
    height: 300px;
  }
</style>
