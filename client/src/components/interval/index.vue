<template>
  <div class="page">
    <div class="name">
      所有接口定时刷新间隔
    </div>
    <nSelect v-model:value="value" class="select" placeholder="选择间隔时间" :options="options"
      @update:value="handleUpdateValue" />
  </div>
</template>


<script lang="ts" setup>
import { ref, defineEmits, onMounted, onUnmounted } from 'vue';
const emit = defineEmits(['interval-change', 'tick']);
let interval = localStorage.getItem('interval');
const value = ref(Number(interval) || 5);

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
]);
let timer: ReturnType<typeof setInterval>;
let clear = () => clearInterval(timer);
onMounted(() => {
  handleUpdateValue(value.value)
  emit('tick')
  onUnmounted(clear);
});
function handleUpdateValue(value) {
  localStorage.setItem('interval', value);
  emit("interval-change", value);
  clear();
  timer = setInterval(() => emit('tick'), value * 1000);
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
