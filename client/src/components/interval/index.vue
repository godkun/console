<template>
  <div class="page">
    <div class="name">
      所有接口定时刷新间隔
    </div>
    <nSelect v-model:value="value" class="select" placeholder="选择间隔时间" :options="options" @update:value="handleUpdateValue" />
  </div>
</template>


<script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  const emit = defineEmits(['interval-change'])
  let interval = localStorage.getItem('interval')
  let value
  if (interval) value = ref(Number(interval))
  else value = ref(5)
  const options = ref([
    {
      label: '1s',
      value: 1
    },
    {
      label: '2s',
      value: 2
    },
    {
      label: '5s',
      value: 5
    },
    {
      label: '10s',
      value: 10
    }
  ])
  function handleUpdateValue(value) {
    localStorage.setItem('interval', value)
    emit("interval-change", value)
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
