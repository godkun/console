<template>
  <n-space justify="space-between">
    <n-card :title="`修改过的${name || '全局'}配置`" style="min-width: 27vw">
      <template #header-extra>
        <template v-if="isEdit">
          <n-space>
            <n-button type="success" size="small" @click="saveConfigFile">保存</n-button>
            <n-button type="primary" size="small" @click="noSaveConfigFile">不保存</n-button>
          </n-space>
        </template>
        <n-space v-else>
          <div></div>
          <n-button type="primary" size="small" @click="edit">编辑</n-button>
        </n-space>
      </template>
      <JsonEditor v-if="isEdit" class="jsonEditor" v-model:json="yamls.Modified" />
      <n-code language="yaml" show-line-numbers v-else :code="yamls.Modified" />
    </n-card>
    <n-card :title="`配置文件中的${name || '全局'}配置`" style="min-width: 27vw">
      <n-code
        :code="yamls.File"
        language="yaml"
        show-line-numbers
        word-wrap
        style="font-size: 13px" />
    </n-card>
    <n-card :title="`最终合并后的${name || '全局'}配置`" style="min-width: 27vw">
      <n-code
        :code="yamls.Merged"
        language="yaml"
        show-line-numbers
        word-wrap
        style="font-size: 13px" />
    </n-card>
  </n-space>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { useMessage } from 'naive-ui'
  import { useRoute } from 'vue-router'
  import JsonEditor from '@/components/Editor/index.vue'
  import { getConfig, modifyConfig } from '@/api/instance'
  const yamls = reactive({ Merged: '', Modified: '', File: '' })
  const oldJsonCode = ref('')
  const isEdit = ref(false)
  const message = useMessage()

  const route = useRoute()
  const { query, params } = route
  const name = (query.name as string) || ''
  const id = params.id as string
  getConfig(id, name, '1').then((res) => {
    Object.assign(yamls, res)
    // jsonCode.value = JSON.stringify(res, null, 2)
  })

  function edit() {
    isEdit.value = true
    oldJsonCode.value = yamls.Modified
  }

  function saveConfigFile() {
    isEdit.value = false
    modifyConfig(id, yamls.Modified, query.name as string)
      .then((x) => {
        if (x == 'ok') message.success('配置保存成功')
        else message.error('配置保存失败' + x)
      })
      .catch((e) => {
        message.error('配置保存失败' + e)
      })
  }

  function noSaveConfigFile() {
    yamls.Modified = oldJsonCode.value
    isEdit.value = false
  }
</script>

<style lang="less" scoped>
  .jsonEditor {
    // width: vw;
    min-height: 80vh;
  }
  .pre {
    width: auto;
  }
</style>
