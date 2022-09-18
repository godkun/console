<template>
  <div class="page">
    <div class="name">当前实例</div>
    <nSelect
      v-model:value="value"
      class="select"
      placeholder="选择实例"
      :options="options"
      @update:value="handleUpdateValue" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getInstanceList } from '@/api/instance'
  const emit = defineEmits(['changeIp'])
  const options = ref<{ label: string; value: any }[]>([])
  const router = useRouter()
  const route = useRoute()
  const value = ref('')
  const pagesize = 0
  const pageno = 0

  getInstanceList({ pagesize, pageno }).then((res) => {
    options.value = res.data.list.map((item) => {
      return {
        label: item.id,
        disabled: item.online != 1,
        value: item
      }
    })
    if (!localStorage.getItem('id')) {
      localStorage.setItem('id', options.value[0].label)
    }
    const v = res.data.list.find((item) => item.id == localStorage.getItem('id'))
    value.value = v
    const remoteIp = v.RemoteIP
    emit('changeIp', remoteIp)
  })
  function handleUpdateValue(value) {
    emit('changeIp', value.RemoteIP)
    localStorage.setItem('id', value.id)
    router.push({
      path: unref(route).path,
      query: {
        id: value.id
      }
    })
    return
    const href = window.location.href
    const a = href.split('?')[0]
    window.location.href = a + `?id=${value}`
    window.location.reload()
  }
</script>

<style lang="less">
  .page {
    padding: 10px 0 15px 0;
    display: flex;
    align-items: center;

    .name {
      padding: 0 15px;
      font-weight: bold;
      color: #000;
    }

    .select {
      width: 100px;
      color: #000;
    }
  }
</style>
