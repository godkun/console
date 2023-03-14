<template>
  <div class="user">
    <video ref="videoEle" autoplay></video>
    <div class="title">
      {{ title }}
      <Mic
        class="mic"
        @click="mute"
        :muted="audioTrack != null && !audioTrack.enabled"
        :has-mic="audioTrack != null"
        :volume="volume" />
    </div>
    <!-- <n-switch type="primary" @update:value="publish" v-if="signalReady">
      <template #unchecked> 点击推流 </template>
    </n-switch> -->
    <div class="camlist" v-if="cameraList.length > 1">
      <n-select v-model:value="currentCamera" :options="cameraList" value-field="deviceId" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import Mic from './mic.vue'
  import { useUserStore } from '@/store/modules/user'
  import { WebRTCStream } from 'jv4-connection'
  import { onUnmounted, ref, watchEffect } from 'vue'
  const videoEle = ref<HTMLVideoElement>()
  const props = defineProps<{
    value: WebRTCStream
    title: string
    signalReady: boolean
    audioContext: AudioContext
  }>()
  const emit = defineEmits(['update:value', 'publish', 'unpublish'])
  const cameraList = ref<MediaDeviceInfo[]>([])
  const userStore = useUserStore()
  const currentCamera = ref(userStore.getCurrentCamera)
  const audioTrack = ref<MediaStreamAudioTrack>()
  const volume = ref(0)
  const volumeStream = new MediaStream()

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    cameraList.value = devices.filter((device) => device.kind == 'videoinput')
    if (cameraList.value.find((x) => x.deviceId == currentCamera.value)) return
    currentCamera.value = cameraList.value[0].deviceId
  })
  function mute() {
    if (!audioTrack.value) return
    audioTrack.value.enabled = !audioTrack.value.enabled
  }
  onUnmounted(() => {
    if (props.value.mediaStream)
      props.value.mediaStream.getTracks().forEach((track) => track.stop())
  })
  watchEffect(() => {
    userStore.setCurrentCamera(currentCamera.value)
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: currentCamera.value ? { deviceId: currentCamera.value } : true
      })
      .then((mediaStream) => {
        if (props.value.mediaStream)
          props.value.mediaStream.getTracks().forEach((track) => track.stop())
        props.value!.mediaStream = mediaStream
        audioTrack.value = mediaStream.getAudioTracks()[0]
        const videoTrack = mediaStream.getVideoTracks()[0]
        if (audioTrack.value) {
          if (volumeStream.getAudioTracks().length == 0) {
            volumeStream.addTrack(audioTrack.value)
            const sourceNode = props.audioContext.createMediaStreamSource(volumeStream)
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
          } else {
            volumeStream.removeTrack(volumeStream.getAudioTracks()[0])
            volumeStream.addTrack(audioTrack.value)
          }
          if (props.value.audioTransceiver) {
            props.value.audioTransceiver.sender.replaceTrack(audioTrack.value)
          }
        }
        if (props.value.videoTransceiver && videoTrack) {
          props.value.videoTransceiver.sender.replaceTrack(videoTrack)
        }
        emit('update:value', props.value)
      })
  })

  watchEffect(() => {
    if (props.value.mediaStream && videoEle.value) {
      videoEle.value.srcObject = props.value.mediaStream
      videoEle.value.muted = true
      videoEle.value.play().catch(() => {})
    }
  })

  // function publish(value: boolean) {
  //   if (value) emit('publish')
  //   else emit('unpublish')
  // }
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
  .mic {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30px;
    height: 30px;
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
