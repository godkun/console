<template>
  <canvas ref="canvas"></canvas>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watchEffect } from 'vue'
  import { TimelineDataSeries, TimelineGraphView } from 'webrtc-internals'
  const canvas = ref<HTMLCanvasElement>()
  const props = defineProps<{ value: number[] }>()
  const tlds: TimelineDataSeries[] = []
  const colors = ['red', 'blue', 'green', 'yellow']
  onMounted(() => {
    const view = new TimelineGraphView(canvas.value!)
    let lastTime = 0
    watchEffect(() => {
      const now = Date.now()
      if (now != lastTime) {
        props.value.forEach((x, i) => {
          if (!tlds[i]) {
            tlds[i] = new TimelineDataSeries()
            tlds[i].setColor(colors[i])
            view.addDataSeries(tlds[i])
          }
          tlds[i].addPoint(now, x)
        })
        view.updateEndDate()
        lastTime = now
      }
    })
  })
</script>
