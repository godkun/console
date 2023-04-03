<template>
  <n-alert v-if="value" title="当前功能受限" type="error"> 当前实例未安装插件:{{ name }} </n-alert>
</template>
<script setup lang="ts">
  import { usePluginConfigStore } from '@/store/modules/pluginConfig'
  import { useRoute } from 'vue-router'
  const props = defineProps<{
    name: string
    value: boolean
  }>()
  const emit = defineEmits<{
    (e: 'update:value', value: boolean): void
  }>()
  const configStore = usePluginConfigStore()
  configStore
    .getConfig(useRoute().params.id as string, props.name)
    .catch(() => emit('update:value', true))
</script>
