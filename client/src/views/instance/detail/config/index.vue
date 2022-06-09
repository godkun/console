<template>
  <n-grid x-gap="12" :cols="2">
    <n-gi>
      <n-button type="primary" size="small" @click="edit">编辑</n-button>
      <n-button type="primary" size="small" @click="saveConfigFile">保存</n-button>
        <el-button type="primary" size="small" @click="noSaveConfigFile">不保存</el-button>
    </n-gi>
    <n-gi>
      <JsonEditor v-if="isEdit" class="jsonEditor" v-model:json="jsonCode" />
      <pre v-else class="pre">{{ jsonCode }}</pre>
    </n-gi>
  </n-grid>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import json from './config.json'
import JsonEditor from '@/components/editor/index.vue'
const jsonCode = ref('')
const isEdit = ref(false)
jsonCode.value = JSON.stringify(json, null, 2)
function edit() {
  isEdit.value = true
}
function saveConfigFile() {
  isEdit.value = true
  console.log("🚀 ~ file: index.vue ~ line 22 ~ jsonCode.value", jsonCode.value)
}
function noSaveConfigFile() {
  isEdit.value = true
}
</script>

<style lang="less" scoped>
  .jsonEditor {
    width: 45vw;
    height: 60vh;
  }
</style>
