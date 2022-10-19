<template>
  <n-layout>
    <!-- <n-layout-header v-if="noPlugin || roomPass">
    </n-layout-header> -->
    <n-layout-content content-style="padding: 24px;height:calc(100vh - 120px)">
      <n-alert v-if="noPlugin" title="当前功能受限" type="error">
        当前实例未安装插件，无法创建房间
      </n-alert>
      <n-alert v-else-if="roomPass" type="success">邀请他人入房的口令：{{ roomPass }}</n-alert>
      <n-space>
        <UserVideo v-for="user in userList" :title="user.ID" :key="user.ID" />
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
  import { onUnmounted, reactive, ref } from 'vue'
  import { useMessage } from 'naive-ui'
  import { useRoute, useRouter } from 'vue-router'
  import { usePluginConfigStore } from '@/store/modules/pluginConfig'
  import { getRoomPass } from '@/api/instance'
  interface User {
    ID: string
    StreamPath: string
  }
  const showModal = ref(true)
  const router = useRouter()
  const userList = reactive<User[]>([])
  const chatMessage = ref('')
  const route = useRoute()
  const message = useMessage()
  const myUserId = ref('')
  const token = ref('')
  let ws: WebSocket
  const configStore = usePluginConfigStore()
  const m7sId = route.params.id as string
  const noPlugin = ref(false)
  const appName = ref('room')
  const roomId = ref('')
  const roomPass = ref('')
  let consoleURL = 'wss://console.monibuca.com:9999'
  if (m7sId) {
    configStore
      .getConfig(m7sId, 'Room')
      .then((res) => (appName.value = res.appname))
      .catch((err) => (noPlugin.value = true))
    configStore.getConfig(m7sId, '').then((res) => {
      const regx = /[^:\/]+/
      consoleURL =
        'wss://' + (regx.exec(res.console.server)?.[0] || 'console.monibuca.com') + ':9999'
    })
  }
  function inputKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      send()
    }
  }
  onUnmounted(() => {
    ws?.close()
  })
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
    }
  }
  function enterOther(wsAddr: string) {
    ws = new WebSocket(wsAddr)
    ws.onmessage = (e) => {
      const { data, event, userId } = JSON.parse(e.data)
      switch (event) {
        case 'joined':
          token.value = data
          message.success('成功加入房间')
          showModal.value = false
          break
        case 'msg':
          message.info(`${userId}：${data}`)
          break
        case 'userlist':
          userList.push(...data)
          break
        case 'userjoin':
          message.success(data.ID + '加入房间')
          userList.push(data)
          break
        case 'userleave':
          message.info(userId + '离开房间')
          userList.splice(
            userList.findIndex((user) => user.ID === userId),
            1
          )
          break
        case 'publish':
          const streamPath = data
          const user = findUser(userId)
          if (user) user.StreamPath = streamPath
          break
      }
    }
    ws.onerror = (e) => {
      message.error(e.toString())
    }
  }

  function findUser(userId: string) {
    return userList.find((user) => user.ID === userId)
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
