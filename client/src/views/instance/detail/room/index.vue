<template>
  <n-layout>
    <!-- <n-layout-header v-if="noPlugin || roomPass">
    </n-layout-header> -->
    <n-layout-content content-style="padding: 24px;height:calc(100vh - 120px)">
      <n-space>
        <n-alert v-if="webrtcError" type="error"> WebRTC连接失败：{{ webrtcError }} </n-alert>
        <n-alert v-else-if="!signalReady" type="warning"> 正在等待WebRTC连接 </n-alert>
        <n-alert v-else type="success"> WebRTC已连接 </n-alert>
        <n-alert v-if="publishing" type="success"> 正在发布流 </n-alert>
        <n-alert v-if="noPlugin" title="当前功能受限" type="error">
          当前实例未安装插件，无法创建房间
        </n-alert>
        <n-alert v-else-if="roomPass" type="success" @click="copyLink"
          >邀请他人入房链接（点击复制到剪切板）：{{ inviteLink }}</n-alert
        >
      </n-space>
      <n-space>
        <MySelf
          :title="myUserId"
          :value="myStream"
          :signalReady="signalReady"
          v-if="myStream"
          @update:value="publish"
          :audio-context="audioContext" />
        <UserVideo
          v-for="user in userList"
          :title="user.ID"
          :key="user.ID"
          :value="user.Stream"
          :audio-context="audioContext" />
      </n-space>
    </n-layout-content>
    <n-layout-footer>
      <n-input-group>
        <n-input
          v-model:value="chatMessage"
          clearable
          placeholder="发送聊天信息"
          @keyup="inputKeyup" />
        <n-button type="primary" @click="send">发送</n-button>
      </n-input-group>
    </n-layout-footer>
    <n-modal v-model:show="showModal" :close-on-esc="false" :mask-closable="false">
      <n-card
        style="width: 600px"
        :title="m7sId ? '进入房间' : '加入房间'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true">
        <template #header-extra>
          <n-button type="primary" @click="router.back()">返回</n-button>
        </template>
        <n-form>
          <n-form-item-row :label="m7sId ? '房间名称' : '入房口令'">
            <n-input v-model:value="roomId" />
          </n-form-item-row>
          <n-form-item-row label="用户名称">
            <n-input v-model:value="myUserId" />
          </n-form-item-row>
        </n-form>
        <template #footer>
          <n-button type="primary" block secondary strong @click="enterCurrent"> 进入 </n-button>
        </template>
      </n-card>
    </n-modal>
  </n-layout>
</template>
<script setup lang="ts">
  // import { getInstanceHttp } from '@/api/instance'
  import UserVideo from './user.vue'
  import MySelf from './myself.vue'
  import { onUnmounted, reactive, ref } from 'vue'
  import { useMessage } from 'naive-ui'
  import { useRoute, useRouter } from 'vue-router'
  import { usePluginConfigStore } from '@/store/modules/pluginConfig'
  import { getRoomPass } from '@/api/instance'
  import { WebRTCConnection, WebRTCStream } from 'jv4-connection'
  import { computed } from 'vue'
  import fetch from '@/api/fetch'
  interface User {
    ID: string
    StreamPath: string
    Stream: WebRTCStream
  }
  const showModal = ref(true)
  const router = useRouter()
  const userList = reactive<User[]>([])
  const chatMessage = ref('')
  const route = useRoute()
  const message = useMessage()
  const myUserId = ref('usr' + Math.random().toString(36).substr(2, 9))
  const token = ref('')
  let ws: WebSocket
  const configStore = usePluginConfigStore()
  const m7sId = route.params.id as string
  const noPlugin = ref(false)
  const appName = ref('room')
  const roomId = ref((route.query.pass as string) || 'test')
  const roomPass = ref('')
  const signalReady = ref(false)
  const webrtcError = ref()
  const publishing = ref(false)
  const inviteLink = computed(
    () => location.protocol + '//' + location.host + '/#/instance/room?pass=' + roomPass.value
  )
  const consoleURL = location.protocol.replace('http', 'ws') + `//${location.host}/m7sws`
  let signalChannel: RTCDataChannel
  const myStream = ref<WebRTCStream>()
  const conn = new WebRTCConnection('m7s/webrtc/batch', {
    requestInit: {
      headers: {
        m7sid: m7sId
      }
    }
  })
  const pc = conn.webrtc
  const audioContext = new AudioContext()
  onUnmounted(() => {
    audioContext.close()
    conn.close()
    ws?.close()
  })
  fetch({
    url: '/api/user/islogin',
    method: 'POST'
  }).then((res) => {
    if (res.code === 0) {
      myUserId.value = res.data
    }
  })
  if (m7sId) {
    configStore
      .getConfig(m7sId, 'Room')
      .then((res) => (appName.value = res.appname))
      .catch(() => (noPlugin.value = true))
    configStore.getConfig(m7sId, '').then((res) => {
      // consoleURL =
      //   location.protocol.replace('http', 'ws') + `//${res.console.server || location.host}/m7s`
    })
  }
  function copyLink() {
    navigator.clipboard.writeText(inviteLink.value).then(() => {
      message.success('链接已复制到剪切板')
    })
  }
  function inputKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      send()
    }
  }
  function enterCurrent() {
    // getInstanceHttp(m7sId, true, true, 'ws').then((res) => {
    //   roomURL.value = res + '/room/' + roomId.value
    // })
    // consoleURL = location.protocol.replace('http', 'ws') + '//' + location.host + '/m7s'
    if (m7sId) {
      getRoomPass(m7sId, roomId.value).then((x) => {
        roomPass.value = x
      })
      enterOther([consoleURL, 'room', roomId.value, myUserId.value].join('/') + '?m7sid=' + m7sId)
    } else {
      enterOther(
        `${consoleURL}/room/join?${new URLSearchParams({
          userId: myUserId.value,
          pass: roomId.value
        })}`
      )
      // @ts-ignore
      conn.options.requestInit.headers.pass = roomId.value
    }
  }
  async function publish() {
    if (myStream.value && myStream.value.mediaStream && signalReady.value && !publishing.value) {
      publishing.value = true
      const rtcStream = myStream.value
      conn.addStream(rtcStream)
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      signalChannel.send(
        JSON.stringify({
          type: 'publish',
          offer: offer.sdp,
          streamPath: `room/${roomId.value}/${myUserId.value}?token=${token.value}`
        })
      )
    }
  }
  // async function unpublish() {
  //   if (myStream.value) {
  //     const rtcStream = myStream.value
  //     conn.deleteStream(rtcStream.id)
  //     const offer = await pc.createOffer()
  //     await pc.setLocalDescription(offer)
  //     signalChannel.send(
  //       JSON.stringify({
  //         type: 'unpublish',
  //         offer: offer.sdp
  //       })
  //     )
  //   }
  // }
  function enterOther(wsAddr: string) {
    myStream.value = new WebRTCStream(myUserId.value, 'sendonly')
    ws = new WebSocket(wsAddr)
    ws.onmessage = (e) => {
      const { data, event, userId } = JSON.parse(e.data)
      console.log(data, event, userId)
      switch (event) {
        case 'joined':
          token.value = data.token
          roomId.value = token.value.split(':')[0]
          message.success('成功加入房间')
          showModal.value = false
          signalChannel = pc.createDataChannel('signal')
          signalChannel.onmessage = async (evt) => {
            const signal = JSON.parse(evt.data)
            console.log(signal)
            switch (signal.type) {
              case 'answer':
                pc.setRemoteDescription(new RTCSessionDescription(signal))
                break
              case 'remove':
                conn.deleteStream(signal.streamPath)
                const user = userList.find((x) => x.StreamPath == signal.streamPath)
                if (user) {
                  user.StreamPath = ''
                }
                break
              case 'offer':
                await pc.setRemoteDescription(new RTCSessionDescription(signal))
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                signalChannel.send(JSON.stringify(answer))
            }
          }
          signalChannel.onopen = async () => {
            message.success('成功连接信令服务器')
            signalReady.value = true
            publish()
            sendSubscribe()
          }
          signalChannel.onclose = () => {
            message.error('信令服务器连接断开')
            signalReady.value = false
          }
          if (data.userList)
            for (const user of data.userList) {
              if (isSelf(user.ID)) continue
              userList.push(user)
              const streamPath = user.StreamPath
              if (streamPath) {
                user.Stream = reactive(new WebRTCStream(streamPath))
                conn.addStream(user.Stream)
              }
            }
          conn.connect().catch((err) => {
            webrtcError.value = err
            message.error('连接失败' + err)
          })
          break
        case 'msg':
          message.info(`${userId}：${data}`)
          break
        case 'userjoin':
          message.success(data.ID + '加入房间')
          if (!isSelf(data.ID)) userList.push(data)
          break
        case 'userleave':
          message.info(userId + '离开房间')
          {
            const user = findUser(userId)
            if (user) {
              if (user.StreamPath) conn.deleteStream(user.StreamPath)
              userList.splice(
                userList.findIndex((user) => user.ID === userId),
                1
              )
            }
          }
          break
        case 'publish':
          const streamPath = data
          const user = findUser(userId)
          if (user && !isSelf(userId)) {
            user.StreamPath = streamPath
            user.Stream = new WebRTCStream(streamPath)
            conn.addStream(user.Stream)
            sendSubscribe()
          }
          break
      }
    }
    ws.onerror = (e) => {
      // message.error(e.toString())
      message.error('进入房间失败')
    }
  }
  async function sendSubscribe() {
    if (!signalReady.value) return
    const streamList: string[] = []
    for (const user of userList) {
      if (user.StreamPath) streamList.push(user.StreamPath)
    }
    const offer = await pc.createOffer()
    console.log(offer)
    await pc.setLocalDescription(offer)
    signalChannel.send(
      JSON.stringify({
        type: 'subscribe',
        offer: offer.sdp,
        streamList
      })
    )
  }
  function findUser(userId: string) {
    return userList.find((user) => user.ID === userId)
  }
  function isSelf(userId: string) {
    return myUserId.value === userId
  }
  function send() {
    if (ws) {
      ws.send(chatMessage.value)
      chatMessage.value = ''
    } else {
      message.error('未连接到服务器')
    }
  }
</script>
<style scoped>
  .card-tabs .n-tabs-nav--bar-type {
    padding-left: 4px;
  }
</style>
