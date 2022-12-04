<template>
  <div v-if="noPlugin">
    <n-alert title="当前页面不可用" type="error"> 当前实例未安装插件，无法使用此功能 </n-alert>
  </div>
  <div v-else class="video-container">
    <Video v-for="v in videoList" :value="v" />
    <n-pagination v-model:page="pageNum" :page-count="total / pageSize" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import Video from './video.vue'
  import { onBeforeRouteLeave, useRoute } from 'vue-router'
  import { usePluginConfigStore } from '@/store/modules/pluginConfig'
  import { DemuxEvent, FlvDemuxer } from 'jv4-demuxer'
  import { DataChannelConnection, WebRTCConnection, WebRTCStream } from 'jv4-connection'
  import { VideoDecoderHard } from 'jv4-decoder'
  import { DemuxMode } from 'jv4-demuxer/src/base'
  import { VideoDecoderEvent } from 'jv4-decoder/src/types'
  import { dualCalendarValidation } from 'naive-ui/es/date-picker/src/validation-utils'
  let signalChannel: RTCDataChannel
  const videoList = reactive<Record<string, WebRTCStream>>({})
  const { params } = useRoute()
  const configStore = usePluginConfigStore()
  const noPlugin = ref(false)
  const pageSize = ref(9)
  const pageNum = ref(0)
  const total = ref(0)
  configStore.getConfig(params.id as string, 'WebRTC').catch((err) => {
    noPlugin.value = true
  })
  const conn = new WebRTCConnection('m7s/webrtc/batch', {
    requestInit: {
      headers: {
        m7sid: params.id as string
      }
    }
  })
  const pc = conn.webrtc
  async function tick(event: MessageEvent<string>) {
    const summary = JSON.parse(event.data)
    if (!summary.Streams) return
    total.value = summary.Streams.length
    const allStreams = summary.Streams.sort((a, b) => a.Path.localeCompare(b.Path))
    const streams = allStreams.slice(
      pageNum.value * pageSize.value,
      (pageNum.value + 1) * pageSize.value
    )
    const streamList: string[] = []
    for (const s of streams) {
      if (!videoList[s.Path]) {
        videoList[s.Path] = new WebRTCStream(s.Path)
        conn.addStream(videoList[s.Path])
        streamList.push(s.Path)
      }
    }
    if (streamList.length > 0) {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      signalChannel.send(
        JSON.stringify({
          type: 'subscribe',
          offer: offer.sdp,
          streamList
        })
      )
    }
  }
  onMounted(async () => {
    signalChannel = pc.createDataChannel('signal')
    signalChannel.onmessage = async (evt) => {
      console.log(evt)
      const signal = JSON.parse(evt.data)
      switch (signal.type) {
        case 'answer':
          console.log(signal.sdp)
          pc.setRemoteDescription(new RTCSessionDescription(signal))
          break
        case 'remove':
          conn.deleteStream(signal.streamPath)
          delete videoList[signal.streamPath]
          break
        case 'offer':
          await pc.setRemoteDescription(new RTCSessionDescription(signal))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          signalChannel.send(JSON.stringify(answer))
      }
    }
    signalChannel.onopen = async () => {
      const es = new EventSource('/api/summary?m7sid=' + params.id)
      es.onmessage = tick
      onBeforeRouteLeave(() => es.close())
    }
    pc.ondatachannel = async (evt) => {
      const dc = evt.channel
      console.log('ondatachannel', evt)
      const info = videoList[dc.label]
      if (info) {
        const track = new MediaStreamTrackGenerator({ kind: 'video' })
        info.videoTrack = track
        const writer = track.writable.getWriter()
        const dcConn = new DataChannelConnection(dc)
        const demuxer = new FlvDemuxer(DemuxMode.PUSH, dcConn)
        demuxer.gotVideo = (chunk) => videoDecoder.decode(chunk)
        const videoDecoder = new VideoDecoderHard()
        await videoDecoder.initialize()
        demuxer.on(DemuxEvent.VIDEO_ENCODER_CONFIG_CHANGED, (data: Uint8Array) => {
          console.log('VIDEO_ENCODER_CONFIG_CHANGED', data)
          videoDecoder.configure({
            codec: 'hvc1.1.6.L0.12.34.56.78.9A.BC',
            extraData: data,
            videoType: 'hevc'
          })
        })
        videoDecoder.on(VideoDecoderEvent.Error, (err) => {
          console.error(err)
          videoDecoder.initialize()
        })
        videoDecoder.on(VideoDecoderEvent.VideoFrame, (frame: VideoFrame) => {
          writer.write(frame)
        })
        dcConn.connect()
      }
    }
    conn.connect()
  })
</script>
<style scoped>
  .video-container {
    display: flex;
    flex-wrap: wrap;
  }
</style>
