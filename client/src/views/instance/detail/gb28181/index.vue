<template>
  <div>
    <div class="top">
      <InstanceSelect />
      <Interval @tick="tick" />
    </div>
    <n-card :bordered="false" class="proCard">
      <BasicTable
        class="table"
        :row-class-name="'row'"
        :columns="columns"
        :dataSource="streamData"
        :pagination="false"
        :row-key="(row) => row.id"
        :scroll-x="1090">
        <template #tableTitle>
          <n-gradient-text type="success"> GB28181 </n-gradient-text>
        </template>
      </BasicTable>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { BasicTable } from '@/components/Table'
  import { Interval } from '@/components/Interval'
  import { columns } from './columns'
  import { getInstanceGB } from '@/api/instance'

  const streamData = ref([])

  async function tick() {
    const r = await getInstanceGB()
    streamData.value = r
  }
</script>

<style lang="less" scoped>
  .top {
    display: flex;
  }

  // /deep/ .row {
  //   .n-ellipsis:not(.n-ellipsis--line-clamp) {
  //     height: 100px;
  //     white-space: inherit;
  //     overflow-y: auto;
  //   }
  // }
  .n-gradient-text {
    font-size: 24px;
  }
</style>
