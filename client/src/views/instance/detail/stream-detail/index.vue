<template>
  <div>
    <Interval @interval-change="intervalChange" />
    <div class="page">
      <n-grid x-gap="12" :cols="6">
        <n-gi span="2">
          <n-space class="action"></n-space>
        </n-gi>
        <n-gi span="4">
          <n-space>
            <JsonEditor v-if="isEdit" class="jsonEditor" v-model:json="jsonCode" />
            <pre v-else class="pre">{{ jsonCode }}</pre>
          </n-space>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onUnmounted} from 'vue'
  import { useMessage } from 'naive-ui'
  import { useRoute } from 'vue-router'
  import JsonEditor from '@/components/editor/index.vue'
  import {
    getStreamDetail
  } from '@/api/instance'

  const jsonCode = ref('')
  const oldJsonCode = ref('')
  const isEdit = ref(false)
  const message = useMessage()

  const route = useRoute()
  const { query } = route

  let timer

  async function initPage() {
    const res = await getStreamDetail(query.path)
    jsonCode.value = JSON.stringify(res, null, 2)
  }
  
  initPage()

  function intervalChange() {
    clearInterval(timer)
    let interval = localStorage.getItem('interval')
    if (interval) {
      timer = setInterval(async () => {
        const res = await getStreamDetail(query.path)
        jsonCode.value = JSON.stringify(res, null, 2)
      }, Number(interval) * 1000)
    }
  }

  onUnmounted(() => {
    clearInterval(timer)
  })

</script>

<style lang="less" scoped>
  .page {
    position: relative;
    .action {
      position: sticky;
      top: 120px;
    }
    .jsonEditor {
      width: 55vw;
      min-height: 80vh;
    }
    .pre {
      width: 70vw;
      height: 80vh;
    }
  }
</style>
