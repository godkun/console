<template>
  <div class="user">
    <video ref="videoEle" autoplay></video>
    <div class="title">{{ title }}</div>
    <n-switch v-if="signalReady" type="primary" @checked="publish">
      <template #unchecked> 点击推流 </template>
    </n-switch>
  </div>
</template>
<script setup lang="ts">
  import { WebRTCStream } from 'jv4-connection'
  import { ref, watchEffect } from 'vue'
  const videoEle = ref<HTMLVideoElement>()
  const props = defineProps<{
    value: WebRTCStream
    title: string
    signalReady: boolean
  }>()
  const emit = defineEmits(['update:value', 'publish'])
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true
    })
    .then((mediaStream) => {
      props.value!.mediaStream = mediaStream
      emit('update:value', props.value)
    })
  watchEffect(() => {
    if (props.value.mediaStream && videoEle.value) {
      videoEle.value.srcObject = props.value.mediaStream
      videoEle.value.play()
    }
  })
  function publish() {
    emit('publish')
  }
  // watchEffect(() => {
  //   if (props.value.audioTrack && stream.getAudioTracks().length == 0) {
  //     stream.addTrack(props.value.audioTrack)
  //   }
  //   if (props.value.videoTrack && stream.getVideoTracks().length == 0) {
  //     stream.addTrack(props.value.videoTrack)
  //   }
  //   if ((props.value.audioTrack || props.value.videoTrack) && videoEle.value) {
  //     videoEle.value.play()
  //   }
  // })
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
