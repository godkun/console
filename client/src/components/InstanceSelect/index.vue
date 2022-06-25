<template>
  <div class="page">
    <div class="name">
      当前实例
    </div>
    <nSelect v-model:value="value" class="select" placeholder="选择实例" :options="options" @update:value="handleUpdateValue" />
  </div>
</template>


<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { useRoute, useRouter } from 'vue-router'
  import { getInstanceList } from '@/api/instance'
  // const emit = defineEmits(['instanceChange'])
  const options = ref([])
  const router = useRouter()
  const route = useRoute()
  const value = ref('')
  const pagesize = 0
  const pageno = 0
  getInstanceList({ pagesize, pageno }).then(res => {
    options.value = res.data.list.map(item => {
      return {
        label: item.id,
        value: item.id
      }
    })
    const id = route.query.id as string
    if (id) value.value = id
    else value.value = options.value[0].value
    localStorage.setItem('id', value.value)
    console.log('🚀 ~ file: index.vue ~ line 32 ~ getInstanceList ~ value.value', value.value)
    // router.push({
    //   path: unref(route).path,
    //   query: {
    //     id: value.value
    //   }
    // })
  })
  function handleUpdateValue(value) {
    router.push({
      path: unref(route).path,
      query: {
        id: value
      }
    })
    return
    const href = window.location.href
    const a = href.split('?')[0]
    window.location.href = a  + `?id=${value}`
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
    width: 300px;
    color: #000;
  }
}
  
</style>
