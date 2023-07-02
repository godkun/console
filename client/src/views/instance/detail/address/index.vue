<template>
  <n-layout>
    <n-layout-content content-style="padding: 24px;">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80">
        <n-form-item label="域名或IP" path="hostname">
          <n-input placeholder="localhost" v-model:value="formParams.hostname" />
        </n-form-item>
        <n-form-item label="StreamPath" path="streamPath">
          <n-input placeholder="请输入StreamPath" v-model:value="formParams.streamPath" />
        </n-form-item>
        <n-form-item label="配置key" path="key">
          <n-input placeholder="请输入配置key" v-model:value="formParams.key" />
        </n-form-item>
        <n-form-item label="过期时间" path="expire">
          <n-date-picker v-model:value="formParams.expire" type="datetime" />
        </n-form-item>
      </n-form>
      <n-button @click="genAddr" type="primary">生成推拉流地址</n-button>
      <n-divider />
      <n-list>
        <template #header> 推流地址 </template>
        <n-list-item v-for="addr in pushAddrs">
          <template #prefix>
            <n-button class="btn">{{ addr.name }}</n-button>
          </template>
          <template #suffix>
            <n-button @click="copy(addr.url)">复制</n-button>
          </template>
          <n-input :value="addr.url" />
        </n-list-item>
      </n-list>

      <n-list>
        <template #header> 拉流地址 </template>
        <n-list-item v-for="addr in pullAddrs">
          <template #prefix>
            <n-button class="btn">{{ addr.name }}</n-button>
          </template>
          <template #suffix>
            <n-button @click="copy(addr.url)">复制</n-button>
          </template>
          <n-input :value="addr.url" />
        </n-list-item>
      </n-list>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { FormItemRule, useMessage } from 'naive-ui'
  import { getInstancePlugin } from '@/api/instance'
  import CryptoJS from 'crypto-js'
  interface IItem {
    url: string
    name: string
  }
  const pushAddrs = ref<Array<IItem>>([])
  const pullAddrs = ref<Array<IItem>>([])
  const msg = useMessage()
  const formRef: any = ref(null)
  const formParams = reactive({
    hostname: 'localhost',
    streamPath: 'live/test',
    key: '',
    expire: new Date()
  })
  const rules = {
    hostname: {
      required: true,
      message: '域名',
      trigger: ['blur', 'change'],
      validator(rule: FormItemRule, target: string) {
        if (!target) {
          rule.message = '域名'
          return false
        } else {
          if (target == 'localhost') return true
          else
            return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(
              target
            )
        }
      }
    },
    streamPath: {
      required: true,
      message: '请输入StreamPath',
      trigger: 'blur',
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          rule.message = '请输入StreamPath'
          return false
        }
        if (value.split('/').length == 1) {
          rule.message = 'StreamPath必须包含/'
          return false
        } else if (value.startsWith('/')) {
          rule.message = 'StreamPath开头不能包含/'
          return false
        } else if (value.endsWith('/')) {
          rule.message = 'StreamPath结尾不能包含/'
          return false
        } else {
          return true
        }
      }
    }
    // expire: {
    //   required: true,
    //   message: '请设置过期时间',
    //   trigger: ['blur', 'change']
    // }
  }
  const { id } = useRoute().params as { id: string }
  const pluginMap = {}
  getInstancePlugin(id).then((res) => {
    for (const element in res) {
      pluginMap[element] = res[element]
    }
  })
  async function genAddr() {
    await formRef.value.validate()
    const { hostname, streamPath, key } = formParams
    const expire = new Date(formParams.expire).getTime().toString(16)
    const secret = CryptoJS.MD5(key + streamPath + expire).toString()
    const pushAddrs: Array<IItem> = []
    const pullAddrs: Array<IItem> = []
    if (pluginMap['RTMP']) {
      pushAddrs.push({
        name: 'RTMP',
        url: `rtmp://${hostname}/${streamPath}`
      })
      pullAddrs.push({
        name: 'RTMP',
        url: `rtmp://${hostname}/${streamPath}`
      })
    }
    if (pluginMap['RTSP']) {
      pushAddrs.push({
        name: 'RTSP',
        url: `rtsp://${hostname}/${streamPath}`
      })
      pullAddrs.push({
        name: 'RTSP',
        url: `rtsp://${hostname}/${streamPath}`
      })
    }

    if (pluginMap['WebRTC']) {
      pullAddrs.push({
        name: 'webrtc',
        url: `webrtc://${hostname}/webrtc/play/${streamPath}`
      })
    }
    if (pluginMap['Fmp4']) {
      const http = pluginMap['Fmp4'].RawConfig.http
      const a = http.listenaddr
      const b = http.listenaddrtls
      pullAddrs.push({
        name: 'fmp4(http)',
        url: `http://${hostname}${a}/fmp4/${streamPath}.mp4`
      })
      pullAddrs.push({
        name: 'fmp4(https)',
        url: `https://${hostname}${b}/fmp4/${streamPath}.mp4`
      })
    }
    if (pluginMap['HLS']) {
      const http = pluginMap['HLS'].RawConfig.http
      const a = http.listenaddr
      const b = http.listenaddrtls
      pullAddrs.push({
        name: 'hls(http)',
        url: `http://${hostname}${a}/hls/${streamPath}.m3u8`
      })
      pullAddrs.push({
        name: 'hls(https)',
        url: `https://${hostname}${b}/hls/${streamPath}.m3u8`
      })
    }
    if (pluginMap['HDL']) {
      const http = pluginMap['HDL'].RawConfig.http
      const a = http.listenaddr
      pullAddrs.push({
        name: 'http-flv',
        url: `http://${hostname}${a}/hdl/${streamPath}.flv`
      })
    }
    if (pluginMap['Jessica']) {
      const http = pluginMap['Jessica'].RawConfig.http
      const a = http.listenaddr
      pullAddrs.push({
        name: 'ws-flv',
        url: `ws://${hostname}${a}/jessica/${streamPath}.flv`
      })
      pullAddrs.push({
        name: 'ws-raw',
        url: `ws://${hostname}${a}/jessica/${streamPath}`
      })
    }
    pullAddrs.forEach((item) => {
      item.url = `${item.url}?secret=${secret}&expire=${expire}`
    })
    pushAddrs.forEach((item) => {
      item.url = `${item.url}?secret=${secret}&expire=${expire}`
    })
    setAddress(pullAddrs, pushAddrs)
  }
  function setAddress(pull, push) {
    pullAddrs.value = pull
    pushAddrs.value = push
  }
  function copy(text) {
    navigator.clipboard.writeText(text).then(
      () => {
        msg.success('复制成功')
      },
      () => {
        msg.error('复制失败')
      }
    )
  }
</script>

<style lang="less" scoped>
  .btn {
    width: 100px;
  }
</style>
