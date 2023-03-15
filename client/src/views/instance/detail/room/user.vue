<template>
  <div class="user">
    <video ref="videoEle" :srcObject="stream" autoplay></video>
    <div class="title">
      {{ title }}
      <Mic
        class="mic"
        :muted="value && value.audioTrack && !value.audioTrack.enabled"
        :has-mic="value && value.audioTrack"
        :volume="volume" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import Mic from './mic.vue'
  import { WebRTCStream } from 'jv4-connection'
  import { ref, watchEffect } from 'vue'
  const videoEle = ref()
  const stream = new MediaStream()
  const props = defineProps<{
    value: WebRTCStream
    title: string
    audioContext: AudioContext
  }>()
  const volume = ref(0)
  watchEffect(() => {
    if (!props.value) return
    if (props.value.audioTrack && stream.getAudioTracks().length == 0) {
      stream.addTrack(props.value.audioTrack)
      const sourceNode = props.audioContext.createMediaStreamSource(stream)
      const analyserNode = props.audioContext.createAnalyser()
      sourceNode.connect(analyserNode)
      const volumeData = new Uint8Array(analyserNode.frequencyBinCount)
      function updateLevelMeter() {
        if (props.audioContext.state == 'closed') return
        // 获取频域数据
        analyserNode.getByteFrequencyData(volumeData)
        // 计算音量级别
        let sum = 0
        for (let i = 0; i < volumeData.length; i++) {
          sum += volumeData[i]
        }
        volume.value = sum / volumeData.length
        // 更新级别计量器
        // console.log(volume.value)
        // 通过 requestAnimationFrame() 定期更新级别计量器
        requestAnimationFrame(updateLevelMeter)
      }
      updateLevelMeter()
    }
    if (props.value.videoTrack && stream.getVideoTracks().length == 0) {
      stream.addTrack(props.value.videoTrack)
    }
    if ((props.value.audioTrack || props.value.videoTrack) && videoEle.value) {
      videoEle.value.play()
    }
  })
</script>
<style scoped>
  .user {
    width: 320px;
    height: 240px;
    border: 1px solid gray;
    position: relative;
    color: white;
    background-color: black;
  }
  .mic {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30px;
    height: 30px;
  }
  .title {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .user video {
    position: absolute;
    top: 0;
    left: 0;
    width: 320px;
    height: 240px;
  }
</style>
