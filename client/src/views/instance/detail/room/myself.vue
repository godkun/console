<template>
  <div class="user">
    <video ref="videoEle" autoplay></video>
    <div class="title">{{ title }}</div>
    <n-switch type="primary" @update:value="publish" v-if="signalReady">
      <template #unchecked> 点击推流 </template>
    </n-switch>
    <div class="camlist" v-if="cameraList.length">
      <n-select v-model:value="currentCamera" :options="cameraList" value-field="deviceId" />
    </div>
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
  const emit = defineEmits(['update:value', 'publish', 'unpublish'])
  const cameraList = ref<MediaDeviceInfo[]>([])
  const currentCamera = ref('')
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    cameraList.value = devices.filter((device) => device.kind == 'videoinput')
    currentCamera.value = cameraList.value[0].deviceId
  })
  watchEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: currentCamera.value ? { deviceId: currentCamera.value } : true
      })
      .then((mediaStream) => {
        props.value!.mediaStream = mediaStream
        emit('update:value', props.value)
        if (props.value.videoTransceiver) {
          props.value.videoTransceiver.sender.replaceTrack(mediaStream.getVideoTracks()[0])
        }
      })
  })

  watchEffect(() => {
    if (props.value.mediaStream && videoEle.value) {
      videoEle.value.srcObject = props.value.mediaStream
      videoEle.value.muted = true
      videoEle.value.play()
    }
  })
  function publish(value: boolean) {
    if (value) emit('publish')
    else emit('unpublish')
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
    top: 0;
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
  .user .camlist {
    position: absolute;
    bottom: -35px;
    left: 0;
    width: 320px;
  }
</style>
