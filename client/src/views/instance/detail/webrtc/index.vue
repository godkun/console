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
  import { getInstanceSummary } from '@/api/instance'
  import { useRoute } from 'vue-router'
  import { usePluginConfigStore } from '@/store/modules/pluginConfig'
  import { DemuxEvent, FlvDemuxer } from 'jv4-demuxer'
  import { DataChannelConnection, WebRTCConnection } from 'jv4-connection'
  import { VideoDecoderHard } from 'jv4-decoder'
  import { VideoDecoderEvent } from 'jv4-decoder/src/types'
  let signalChannel: RTCDataChannel
  const videoList = reactive<
    Record<
      string,
      {
        stream: any
        audioTrack?: MediaStreamTrack
        videoTrack?: MediaStreamTrack
      }
    >
  >({})
  const { params } = useRoute()
  const configStore = usePluginConfigStore()
  const noPlugin = ref(false)
  const pageSize = ref(9)
  const pageNum = ref(0)
  const total = ref(0)
  const allStreams: Array<{ Path: string }> = []
  configStore.getConfig(params.id as string, 'WebRTC').catch((err) => {
    noPlugin.value = true
  })
  onMounted(async () => {
    const summary = await getInstanceSummary(params.id as string)
    if (!summary.Streams) return
    total.value = summary.Streams.length
    allStreams.push(...summary.Streams.sort((a, b) => a.Path.localeCompare(b.Path)))
    const conn = new WebRTCConnection('m7s/webrtc/batch', {
      requestInit: {
        headers: {
          m7sid: params.id as string
        }
      }
    })
    const pc = conn.webrtc
    const streams = allStreams.slice(
      pageNum.value * pageSize.value,
      (pageNum.value + 1) * pageSize.value
    )
    for (const s of streams) {
      videoList[s.Path] = {
        stream: s
      }
    }
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
      for (const s of streams) {
        pc.addTransceiver('audio', {
          direction: 'recvonly'
        })
        pc.addTransceiver('video', {
          direction: 'recvonly'
        })
      }
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      signalChannel.send(
        JSON.stringify({
          type: 'subscribe',
          offer: offer.sdp,
          streamList: streams.map((s) => s.Path)
        })
      )
    }
    pc.ondatachannel = async (evt) => {
      const dc = evt.channel
      console.log('ondatachannel', evt)
      const info = videoList[dc.label]
      if (info) {
        const track = new MediaStreamTrackGenerator({ kind: 'video' })
        info.videoTrack = track
        const dcConn = new DataChannelConnection(dc)
        await dcConn.connect()
        const demuxer = new FlvDemuxer(dcConn)
        const videoDecoder = new VideoDecoderHard()
        await videoDecoder.initialize()
        demuxer.on(DemuxEvent.VIDEO_ENCODER_CONFIG_CHANGED, (data: Uint8Array) => {
          videoDecoder.configure({
            codec: 'hvc1.1.6.L0.12.34.56.78.9A.BC',
            extraData: data,
            videoType: 'hevc'
          })
        })

        const pipe = demuxer.videoReadable
          .pipeThrough(
            new TransformStream({
              start(controller) {
                videoDecoder.on(VideoDecoderEvent.VideoFrame, (frame) => controller.enqueue(frame))
              },
              transform(chunk: EncodedVideoChunkInit) {
                videoDecoder.decode(chunk)
              }
            })
          )
          .pipeTo(track.writable)
        pipe.catch((err) => {
          console.error(err)
        })
        console.log(pipe)
      }
    }
    pc.ontrack = ({ track, streams, transceiver }) => {
      console.log(track, streams, transceiver)
      if (streams.length) {
        const info = videoList[streams[0].id]
        if (info) {
          info.videoTrack = streams[0].getVideoTracks()[0]
          info.audioTrack = streams[0].getAudioTracks()[0]
        }
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
