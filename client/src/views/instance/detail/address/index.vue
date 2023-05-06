<template>
  <div>
    <n-form
      :model="formParams"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="80"
      class="py-4">
      <n-form-item label="域名或IP" path="hostname">
        <n-input placeholder="localhost" v-model:value="formParams.hostname" />
      </n-form-item>
      <n-form-item label="StreamPath" path="streamPath">
        <n-input placeholder="请输入StreamPath" v-model:value="formParams.streamPath" />
      </n-form-item>
      <n-form-item label="过期时间" path="expire">
        <n-date-picker v-model:value="formParams.expire" type="datetime" />
      </n-form-item>
      <n-form-item>
        <n-button @click="genAddr">生成地址</n-button>
      </n-form-item>
    </n-form>
    <n-descriptions label-placement="top" title="生成结果">
      <n-descriptions-item label="推流地址">
        <n-table>
          <tr v-for="addr in pushAddrs" :key="addr[1]">
            <td>
              <n-tag>{{ addr[0] }}</n-tag>
            </td>
            <td>{{ addr[1] }}</td>
            <td><n-button @click="copy(addr[1])">复制</n-button></td>
          </tr>
        </n-table>
      </n-descriptions-item>
      <n-descriptions-item label="拉流地址">
        <n-table>
          <tr v-for="addr in pullAddrs" :key="addr[1]">
            <td>
              <n-tag>{{ addr[0] }}</n-tag>
            </td>
            <td>{{ addr[1] }}</td>
            <td><n-button @click="copy(addr[1])">复制</n-button></td>
          </tr>
        </n-table>
      </n-descriptions-item>
    </n-descriptions>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { FormItemRule, useMessage } from 'naive-ui'
  import { getInstancePlugin } from '@/api/instance'
  const pushAddrs = ref<string[][]>([])
  const pullAddrs = ref<string[][]>([])
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
      trigger: 'blur',
      validator(rule: FormItemRule, target: string) {
        if (!target) {
          rule.message = '域名'
          return false
        }
        return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(
          target
        )
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
    res.forEach((element) => {
      pluginMap[element.Name] = element
    })
  })
  async function genAddr() {
    // const { hostname, streamPath, expire } = formParams
    // if(pluginMap["RTMP"]){
      
    // }
    // const pushAddr = push.genAddr(hostname, streamPath, expire)
    // const pullAddr = pull.genAddr(hostname, streamPath, expire)
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
