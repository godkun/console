<template>
  <n-layout>
    <n-layout-header>
      <n-alert v-if="noPlugin" title="当前功能受限" type="error">
        当前实例未安装插件，无法创建房间
      </n-alert>
      <n-alert v-else-if="roomId != null" type="success">{{ roomURL }}</n-alert>
    </n-layout-header>
    <n-layout-content content-style="padding: 24px;">
      <n-card v-for="user in userList" :title="user.ID" :key="user.ID">
        <video></video>
      </n-card>
    </n-layout-content>
    <n-layout-footer>
      <n-input v-model:value="chatMessage">
        <template #append>
          <n-button type="primary" @click="send">发送</n-button>
        </template>
      </n-input>
    </n-layout-footer>
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        title="选择功能"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true">
        <template #header-extra>
          <n-button type="primary" @click="router.back()">返回</n-button>
        </template>
        <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          animated
          style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
          <n-tab-pane name="signin" tab="加入当前实例房间" v-if="!noPlugin">
            <n-form>
              <n-form-item-row label="房间名称">
                <n-input v-model:value="roomId" />
              </n-form-item-row>
              <n-form-item-row label="用户名称">
                <n-input v-model:value="myUserId" />
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong @click="enterCurrent"> 进入 </n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="加入他人的实例房间">
            <n-form>
              <n-form-item-row label="房间地址">
                <n-input v-model:value="roomURL" />
              </n-form-item-row>
              <n-form-item-row label="用户名称">
                <n-input v-model:value="myUserId" />
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong @click="enterOther"> 加入 </n-button>
          </n-tab-pane>
        </n-tabs>
        <template #footer> </template>
      </n-card>
    </n-modal>
  </n-layout>
</template>
<script setup lang="ts">
  import { getInstanceHttp } from '@/api/instance'
  import { ref } from 'vue'
  import { useMessage } from 'naive-ui'
  import { useRoute, useRouter } from 'vue-router'
  import { usePluginConfigStore } from '@/store/modules/pluginConfig'
  interface User {
    ID: string
    StreamPath: string
  }
  const showModal = ref(true)
  const router = useRouter()
  const userList = ref<User[]>([])
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
  const roomURL = ref('')
  if (m7sId)
    configStore
      .getConfig(m7sId, 'room')
      .then((res) => {
        appName.value = res.AppName
      })
      .catch((err) => {
        noPlugin.value = true
      })
  function enterCurrent() {
    getInstanceHttp(m7sId, true, true, 'ws').then((res) => {
      roomURL.value = res + '/room/' + roomId.value
      enterOther()
    })
  }
  function enterOther() {
    ws = new WebSocket(roomURL.value + '/' + myUserId.value)
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
        case 'userList':
          userList.value = data
          break
        case 'userjoin':
          message.success(data.ID + '加入房间')
          userList.value.push(data)
          break
        case 'userleave':
          message.info(userId + '离开房间')
          userList.value.splice(
            userList.value.findIndex((user) => user.ID === userId),
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
    return userList.value.find((user) => user.ID === userId)
  }
  function send() {
    if (ws) {
      ws.send(JSON.stringify({ event: 'msg', data: chatMessage.value, userId: myUserId.value }))
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
