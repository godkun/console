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
let value;
if (interval) value = ref(Number(interval));
else {
  value = ref(5);
  localStorage.setItem('interval', '5');
}
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
emit("interval-change", value);
let timer: ReturnType<typeof setInterval>;
let clear = () => clearInterval(timer)
onMounted(() => {
  emit('tick');
  timer = setInterval(() => emit('tick'), value * 1000);
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
    width: 300px;
    color: #000;
  }
}
</style>
