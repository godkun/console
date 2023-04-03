<template>
  <div>
    <Check name="Debug" v-model:value="noPlugin" />
    <div v-html="content" v-if="!noPlugin"></div>
  </div>
</template>
<script setup lang="ts">
  import Check from '../check.vue'
  import { pprof } from '@/api/instance'
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  const { id, path } = useRoute().params
  const noPlugin = ref(false)
  const content = ref('')
  if (!path)
    pprof(id as string, path as string).then((res) => {
      content.value = res
        .replace(/href="(.+)"/g, `href="${location.href}/$1"`)
        .replace(/href='(.+)'/g, `href="${location.href}/$1"`)
    })
  else {
    content.value = '<span></span>'
  }
</script>
