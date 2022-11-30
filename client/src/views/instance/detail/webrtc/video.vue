<template>
  <div class="container">
    <video ref="videoEle" :srcObject="stream" autoplay></video>
    <div class="title">{{ value.id }}</div>
  </div>
</template>
<script setup lang="ts">
  import { WebRTCStream } from 'jv4-connection'
  import { ref, watchEffect } from 'vue'
  const videoEle = ref()
  const stream = new MediaStream()
  const props = defineProps<{
    value: WebRTCStream
  }>()
  watchEffect(() => {
    if (props.value.audioTrack && stream.getAudioTracks().length == 0) {
      stream.addTrack(props.value.audioTrack)
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
  .container {
    width: 320px;
    height: 240px;
    border: 1px solid gray;
    position: relative;
    color: white;
    background-color: black;
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
  .container > video {
    position: absolute;
    top: 0;
    left: 0;
    object-fit: contain;
    width: 320px;
    height: 240px;
  }
</style>
