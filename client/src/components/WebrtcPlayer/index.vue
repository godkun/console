<template>
  <div class="player-wrap">
    <div class="player-loading" v-if="loading">视频加载中...</div>
    <template v-if="rtcStream">
      <template v-if="controls">
        <video :srcObject.prop="rtcStream" autoplay muted controls
               controlslist="nodownload nofullscreen noremoteplayback"
               disablePictureInPicture></video>
      </template>
      <template v-else>
        <video :srcObject.prop="rtcStream" autoplay></video>
      </template>

    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { getWebRtcRemoteSdp } from '@/api/instance/index'
import { emit } from 'cluster';

    rtcPeerConnection: null
    const iceConnectionState = ref('')
    const rtcPeerConnectionInit = ref(false)
    const rtcStream = ref(null)
    const loading = ref(true)
    const props = defineProps({
      streamPath: {
        type: String,
        default: ''
      },
      controls: {
        type: Boolean,
        default: true
      }
    })
    await initRtcPeerConnection();
    if (props.streamPath) {
      loading.value = true;
      await play(props.streamPath);
      loading.value = false;
      console.log('played');
      emit('doPlayed')
    }
    async function initRtcPeerConnection() {
        const rtcPeerConnection = new RTCPeerConnection();
        rtcPeerConnection.addTransceiver('video', {
          direction: "recvonly"
        });
        rtcPeerConnection.onsignalingstatechange = e => {
          console.log('onsignalingstatechange', e);
        };

        rtcPeerConnection.oniceconnectionstatechange = e => {
          console.log('oniceconnectionstatechange', rtcPeerConnection.iceConnectionState);
        };

        rtcPeerConnection.onicecandidate = event => {
          console.log('onicecandidate', event);
        };

        rtcPeerConnection.ontrack = event => {
          console.log('ontrack', event);
          if (event.track.kind === "video") {
            rtcStream.value = event.streams[0];
          }
        };

        const rtcSessionDescriptionInit = await rtcPeerConnection.createOffer();
        await rtcPeerConnection.setLocalDescription(rtcSessionDescriptionInit);
        rtcPeerConnectionInit.value = true;
        $options.rtcPeerConnection = rtcPeerConnection;
    }
      async function play(streamPath) {
        const rtcPeerConnection = $options.rtcPeerConnection;
        const localDescriptionData = rtcPeerConnection.localDescription.toJSON();
        const result = await getWebRtcRemoteSdp(streamPath, localDescriptionData);
        if (result.error) {
          return;
        }
        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({
          type: result.type,
          sdp: result.sdp
        }));
      }
      function close() {
        const rtcPeerConnection = $options.rtcPeerConnection;
        rtcPeerConnection && rtcPeerConnection.close();
      }
</script>

<style lang="scss" scoped>


</style>
