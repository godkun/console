<template>
  <div class="page">
    <n-grid x-gap="12" :cols="6">
      <n-gi span="2">
        <n-space class="action">
          <n-button type="primary" @click="edit">编辑</n-button>
          <n-button type="success" @click="saveConfigFile">保存</n-button>
          <n-button type="primary" @click="noSaveConfigFile">不保存</n-button>
        </n-space>
      </n-gi>
      <n-gi span="4">
        <n-space>
          <JsonEditor v-if="isEdit" class="jsonEditor" v-model:json="jsonCode" />
          <pre v-else class="pre">{{ jsonCode }}</pre>
        </n-space>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useMessage } from 'naive-ui'
  import { useRoute } from 'vue-router'
  import JsonEditor from '@/components/Editor-s/index.vue'
  import { getConfig, modifyConfig } from '@/api/instance'

  const jsonCode = ref('')
  const oldJsonCode = ref('')
  const isEdit = ref(false)
  const message = useMessage()

  const route = useRoute()
  const { query } = route

  getConfig(query.name).then((res) => {
    jsonCode.value = JSON.stringify(res, null, 2)
  })

  function edit() {
    isEdit.value = true
    oldJsonCode.value = jsonCode.value
  }

  function saveConfigFile() {
    isEdit.value = false
    modifyConfig(jsonCode.value, query.name).then(() => {
      message.success('配置保存成功')
    })
  }

  function noSaveConfigFile() {
    jsonCode.value = oldJsonCode.value
    isEdit.value = false
  }
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
