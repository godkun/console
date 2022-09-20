<template>
  <div class="flv-wrap">
    <video :id="id" name="videoElement" controls autoplay>
      Your browser is too old which doesn't support HTML5 video.
    </video>
  </div>
</template>
<script lang="ts" setup>
  import { uuid } from '@/utils/v4'
  import flvjs from 'flv.js'
  import { onMounted, getCurrentInstance, ref } from 'vue'

  const instance = getCurrentInstance()
  const props = defineProps({
    flvUrl: String
  })
  const id = ref(uuid())
  // 初始化flv视频播放
  function initFlv() {
    flvjs.LoggingControl.addLogListener((type, str) => {
      console.log(type, str)
    })
  }
  // flv视频加载
  function flvLoad(url: string) {
    console.log(url)
    // TODO...
    // let mediaDataSource = {
    //   type: 'flv',
    //   url
    // };
  }
  // flv播放
  function flvStart() {
    // @ts-ignore
    const player = instance.$options.player
    player && player.play()
  }
  function flvPause() {
    // @ts-ignore
    const player = instance.$options.player
    player && player.pause()
  }
  function flvLoadMds(mediaDataSource) {
    // @ts-ignore
    let player = instance.$options.player
    if (player !== null) {
      player.unload()
      player.detachMediaElement()
      player.destroy()
      player = null
    }
    player = flvjs.createPlayer(mediaDataSource, {
      enableWorker: false,
      lazyLoadMaxDuration: 3 * 60,
      seekType: 'range'
    })
    const element = document.getElementById(id.value)
    player.attachMediaElement(element)
    player.load()
  }
  function flvDestroy() {
    // @ts-ignore
    let player = instance.$options.player
    if (player) {
      player.pause()
      player.unload()
      player.detachMediaElement()
      player.destroy()
      player = null
    }
  }
  initFlv()
  onMounted(() => {
    if (props.flvUrl) {
      flvLoad(props.flvUrl)
      flvStart()
    }
  })
</script>
