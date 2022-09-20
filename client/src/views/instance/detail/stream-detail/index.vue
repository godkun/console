<template>
  <div>
    <Interval @tick="tick" />
    <div class="page">
      <n-grid x-gap="12" :cols="6">
        <n-gi span="6">
          <n-statistic label="流标识" :value="data.Path" />
        </n-gi>
        <n-gi span="1">
          <n-statistic
            label="流状态"
            :value="['⌛等待发布者', '🟢发布中', '🟡等待关闭', '🔴已关闭'][data.State]" />
        </n-gi>
        <n-gi span="2">
          <n-statistic label="发布类型" :value="data.Publisher?.Type" />
        </n-gi>
        <n-gi span="2">
          <n-statistic label="发布时间" :value="data.Publisher?.StartTime" />
        </n-gi>
        <n-gi span="1">
          <n-statistic label="订阅者总数" :value="data.Subscribers?.length || 0" />
        </n-gi>
        <template v-for="(track, i) in data.Tracks" :key="i">
          <n-gi span="6">
            <div style="margin: 20px">-轨道{{ i }}详情-</div>
          </n-gi>
          <n-gi span="1">
            <n-statistic label="轨道名称" :value="track.Name" />
          </n-gi>
          <n-gi span="1">
            <n-statistic label="BPS" :value="BPSStr(track.BPS)" />
          </n-gi>
          <n-gi span="1">
            <n-statistic label="FPS" :value="track.FPS" />
          </n-gi>
          <n-gi span="1">
            <n-statistic label="裸数据长度" :value="track.RawSize + ' byte'" />
          </n-gi>
          <n-gi span="2">
            <n-statistic
              label="裸数据前10字节"
              :value="
                track.RawPart.map((x) => x.toString(16).toUpperCase().padStart(2, '0')).join(',')
              " />
          </n-gi>
          <n-gi span="1">
            <n-statistic
              v-if="track.SPSInfo"
              label="分辨率"
              :value="track.SPSInfo.Width + 'x' + track.SPSInfo.Height" />
            <n-statistic v-else label="通道数" :value="track.Channels" />
          </n-gi>
          <n-gi span="1">
            <n-statistic v-if="track.GOP" label="GOP" :value="track.GOP" />
            <n-statistic v-else label="位深度" :value="track.SampleSize" />
          </n-gi>
          <n-gi span="1">
            <n-statistic label="累计帧数" :value="track.MoveCount" />
          </n-gi>
          <n-gi span="1">
            <n-statistic label="时间戳" :value="track.LastValue.AbsTime" />
          </n-gi>
          <n-gi span="1">
            <n-statistic label="PTS" :value="track.LastValue.PTS" />
          </n-gi>
          <n-gi span="1">
            <n-statistic label="DTS" :value="track.LastValue.DTS" />
          </n-gi>
          <n-gi span="2">
            <canvas :id="'bps' + track.Name"></canvas>
          </n-gi>
          <n-gi span="2">
            <canvas :id="'fps' + track.Name"></canvas>
          </n-gi>
        </template>
      </n-grid>
    </div>
    <pre class="pre">{{ jsonCode }}</pre>
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { getStreamDetail } from '@/api/instance'
  import { TimelineDataSeries, TimelineGraphView } from 'webrtc-internals'
  interface TimelineData {
    Timestamp: string
    Value: number
  }
  interface StreamDetail {
    Path: string
    StartTime: string
    State: number
    Publisher?: {
      Type: string
      StartTime: string
    }
    Tracks: {
      Name: string
      BPS: number
      FPS: number
      RawPart: number[]
      RawSize: number
      BPSs: TimelineData[]
      FPSs: TimelineData[]
      Channels: number
      SampleSize: number
      GOP?: number
      SPSInfo?: { Width: number; Height: number }
      MoveCount: number
      LastValue: {
        PTS: number
        DTS: number
        AbsTime: number
      }
    }[]
    Subscribers: { Type: string; StartTime: string }[]
  }
  function BPSStr(bps: number) {
    bps = bps << 3
    if (bps > 1024 * 1024) return (bps / 1024 / 1024).toFixed(2) + ' mb/s'
    if (bps > 1024) return (bps / 1024).toFixed(2) + ' kb/s'
    return bps.toString() + ' b/s'
  }
  const jsonCode = computed(() => {
    return JSON.stringify(data.value, null, 2)
  })
  const route = useRoute()
  const { query } = route
  const data = ref({} as StreamDetail)
  const gvs: {
    [key: string]: {
      bps: TimelineGraphView
      fps: TimelineGraphView
      bpsds: TimelineDataSeries
      fpsds: TimelineDataSeries
    }
  } = {}
  async function tick() {
    data.value = await getStreamDetail(query.path)
    data.value.Tracks.forEach((t) => {
      if (!gvs[t.Name]) {
        nextTick(() => {
          const g = (gvs[t.Name] = {
            bps: new TimelineGraphView(
              document.getElementById(`bps${t.Name}`) as HTMLCanvasElement
            ),
            fps: new TimelineGraphView(
              document.getElementById(`fps${t.Name}`) as HTMLCanvasElement
            ),
            bpsds: new TimelineDataSeries(),
            fpsds: new TimelineDataSeries()
          })
          g.bps.addDataSeries(g.bpsds)
          g.fps.addDataSeries(g.fpsds)
          t.BPSs.forEach((x) => {
            g.bpsds.addPoint(+new Date(x.Timestamp), x.Value)
          })
          t.FPSs.forEach((x) => {
            g.fpsds.addPoint(+new Date(x.Timestamp), x.Value)
          })
          g.bps.updateEndDate()
          g.fps.updateEndDate()
        })
      } else {
        t.BPSs.forEach((x) => {
          gvs[t.Name].bpsds.addPoint(+new Date(x.Timestamp), x.Value)
        })
        t.FPSs.forEach((x) => {
          gvs[t.Name].fpsds.addPoint(+new Date(x.Timestamp), x.Value)
        })
        gvs[t.Name].bps.updateEndDate()
        gvs[t.Name].fps.updateEndDate()
      }
    })
  }
</script>

<style lang="less" scoped>
  .page {
    position: relative;

    .action {
      position: sticky;
      top: 120px;
    }

    .jsonEditor {
      width: 55vw;
      min-height: 80vh;
    }

    .pre {
      width: 70vw;
      height: 80vh;
    }
  }
</style>
