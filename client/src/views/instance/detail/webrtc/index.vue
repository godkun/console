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
  import { AudioDecoderHard, VideoDecoderHard } from 'jv4-decoder'
  import { DemuxMode } from 'jv4-demuxer/src/base'
  import {
    AudioDecoderEvent,
    AudioDecoderInterface,
    VideoDecoderEvent,
    VideoDecoderInterface,
    VideoDecoderConfig,
    AudioDecoderConfig
  } from 'jv4-decoder/src/types'
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
        console.warn(s.Path)
        videoList[s.Path] = new WebRTCStream(s.Path)
        console.warn(videoList[s.Path])
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
          // console.log(signal.sdp)
          pc.setRemoteDescription(new RTCSessionDescription(signal))
          break
        case 'remove':
          console.log('remove', signal.streamPath)
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
        let videoWriter: WritableStreamDefaultWriter<VideoFrame>
        let audioWriter: WritableStreamDefaultWriter<AudioData>
        const dcConn = new DataChannelConnection(dc)
        const demuxer = new FlvDemuxer(dcConn, DemuxMode.PUSH)
        demuxer.gotVideo = (chunk) => videoDecoder.decode(chunk)
        demuxer.gotAudio = (chunk) => audioDecoder.decode(chunk)
        const videoDecoder: VideoDecoderInterface = new VideoDecoderHard()
        const audioDecoder: AudioDecoderInterface = new AudioDecoderHard()
        await videoDecoder.initialize()
        await audioDecoder.initialize()
        demuxer.on(DemuxEvent.VIDEO_ENCODER_CONFIG_CHANGED, (conf: VideoDecoderConfig) => {
          console.log('VIDEO_ENCODER_CONFIG_CHANGED', conf)
          videoDecoder.configure(conf)
        })
        demuxer.on(DemuxEvent.AUDIO_ENCODER_CONFIG_CHANGED, (conf: AudioDecoderConfig) => {
          console.log('AUDIO_ENCODER_CONFIG_CHANGED', conf)
          audioDecoder.configure(conf)
        })
        videoDecoder.on(VideoDecoderEvent.Error, (err) => {
          console.error(err)
          videoDecoder.initialize()
        })
        videoDecoder.on(VideoDecoderEvent.VideoFrame, (frame: VideoFrame) => {
          if (!info.videoTrack) {
            const track = new MediaStreamTrackGenerator({ kind: 'video' })
            info.videoTrack = track
            videoWriter = track.writable.getWriter()
          }
          videoWriter.write(frame)
        })
        audioDecoder.on(AudioDecoderEvent.Error, (err) => {
          console.error(err)
          audioDecoder.initialize()
        })
        audioDecoder.on(AudioDecoderEvent.AudioFrame, (frame: AudioData) => {
          if (!info.audioTrack) {
            const track = new MediaStreamTrackGenerator({ kind: 'audio' })
            info.audioTrack = track
            audioWriter = track.writable.getWriter()
          }
          audioWriter.write(frame)
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
