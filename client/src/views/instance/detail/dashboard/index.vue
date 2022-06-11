<template>
  <div class="console">
    <n-grid x-gap="12" :cols="2">
      <n-gi>
        <n-card content-style="padding: 0;" :bordered="false" title="">
          <CPU />
        </n-card>
      </n-gi>
      <n-gi>
        <n-card content-style="padding: 0;" :bordered="false" title="内存使用">
          <CPU />
        </n-card>
      </n-gi>
    </n-grid>
    <n-grid x-gap="12" :cols="2">
      <n-gi>
        <n-card content-style="padding: 0;" :bordered="false" title="存储使用">
          <HardDisk />
        </n-card>
      </n-gi>
      <n-gi>
        <n-card content-style="padding: 0;" :bordered="false" title="网络">
          <NetWork />
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
  import CPU from './components/CPU.vue';
  import HardDisk from './components/HardDisk.vue';
  import NetWork from './components/NetWork.vue';
</script>

<style lang="less" scoped></style>
