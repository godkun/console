<template>
  <div>
    <div class="top">
      <InstanceSelect @changeIp="changeIp" />
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
        ref="actionRef"
        :scroll-x="1090">
        <template #tableTitle>
          <n-gradient-text type="success"> gb28181 </n-gradient-text>
        </template>
      </BasicTable>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { BasicTable } from '@/components/Table'
  import { columns } from './columns'
  import { getInstanceGB } from '@/api/instance'

  const route = useRoute()
  const router = useRouter()
  const { query } = route

  const id = ref('')
  id.value = query.id as string

  const actionRef = ref()

  const streamData= ref([])

  const remoteIp = ref('')

  function changeIp(ip: string) {
    remoteIp.value = ip
  }

async function tick(){
  const r = await getInstanceGB()
  streamData.value = r.Streams
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
