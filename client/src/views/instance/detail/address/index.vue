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
      </n-form>
      <n-button @click="genAddr" type="primary">生成推拉流地址</n-button>
      <n-divider />
      <n-descriptions label-placement="top" title="生成结果">
        <n-descriptions-item label="推流地址" content-style="padding-right: 20px;">
          <n-table v-if="pushAddrs.length">
            <tr v-for="addr in pushAddrs">
              <td>
                <n-tag>{{ addr.name }}</n-tag>
              </td>
              <td>{{ addr.url }}</td>
              <td><n-button @click="copy(addr.url)">复制</n-button></td>
            </tr>
          </n-table>
        </n-descriptions-item>
        <n-descriptions-item label="拉流地址" class="desc">
          <n-table v-if="pullAddrs.length">
            <tr v-for="addr in pullAddrs">
              <td>
                <n-tag>{{ addr.name }}</n-tag>
              </td>
              <td>{{ addr.url }}</td>
              <td><n-button @click="copy(addr.url)">复制</n-button></td>
            </tr>
          </n-table>
        </n-descriptions-item>
      </n-descriptions>
    </n-layout-content>
  </n-layout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { FormItemRule, useMessage } from 'naive-ui'
  import { getInstancePlugin } from '@/api/instance'
  const pushAddrs = ref<Object[]>([])
  const pullAddrs = ref<Object[]>([])
  const msg = useMessage()
  const formParams = reactive({
    hostname: 'localhost',
    streamPath: 'live/test',
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
  }
  const { id } = useRoute().params as { id: string }
  const pluginMap = {}
  getInstancePlugin(id).then((res) => {
    for (const element in res) {
      pluginMap[element] = res[element]
    }
  })
  async function genAddr() {
    console.log('formParams', pluginMap)
    const { hostname, streamPath } = formParams
    if (pluginMap['RTMP']) {
      pushAddrs.value.push({
        name: 'RTMP',
        url: `rtmp://${hostname}/${streamPath}`
      })
      pullAddrs.value.push({
        name: 'RTMP',
        url: `rtmp://${hostname}/${streamPath}`
      })
    }
    if (pluginMap['RTSP']) {
      pushAddrs.value.push({
        name: 'RTSP',
        url: `rtsp://${hostname}/${streamPath}`
      })
      pullAddrs.value.push({
        name: 'RTMP',
        url: `rtsp://${hostname}/${streamPath}`
      })
    }

    if (pluginMap['WebRTC']) {
      pullAddrs.value.push({
        name: 'webrtc',
        url: `webrtc://${hostname}/${streamPath}`
      })
    }
    if (pluginMap['Fmp4']) {
      const http = pluginMap['Fmp4'].RawConfig.http
      console.log('🚀 ~ file: index.vue:136 ~ genAddr ~ http:', http)
      const a = http.listenaddr
      const b = http.listenaddrtls
      pullAddrs.value.push({
        name: 'fmp4(http)',
        url: `http://${hostname}${a}/${streamPath}.mp4`
      })
      pullAddrs.value.push({
        name: 'fmp4(https)',
        url: `https://${hostname}${b}/${streamPath}.mp4`
      })
    }
    if (pluginMap['HLS']) {
      const http = pluginMap['HLS'].RawConfig.http
      console.log('🚀 ~ file: index.vue:136 ~ genAddr ~ http:', http)
      const a = http.listenaddr
      const b = http.listenaddrtls
      pullAddrs.value.push({
        name: 'hls(http)',
        url: `http://${hostname}${a}/${streamPath}.m3u8`
      })
      pullAddrs.value.push({
        name: 'hls(https)',
        url: `https://${hostname}${b}/${streamPath}.m3u8`
      })
    }
    if (pluginMap['HDL']) {
      const http = pluginMap['HDL'].RawConfig.http
      const a = http.listenaddr
      pullAddrs.value.push({
        name: 'http-flv',
        url: `http://${hostname}${a}/${streamPath}.flv`
      })
    }
    if (pluginMap['Jessica']) {
      const http = pluginMap['Jessica'].RawConfig.http
      const a = http.listenaddr
      pullAddrs.value.push({
        name: 'ws-flv',
        url: `ws://${hostname}${a}/${streamPath}.flv`
      })
      pullAddrs.value.push({
        name: 'ws-raw',
        url: `ws://${hostname}${a}/${streamPath}`
      })
    }
    // pushAddrs.value = pushAddr
    // pullAddrs.value = pullAddr
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

<style>
  .desc {
    display: none;
    background: yellow;
  }
</style>
