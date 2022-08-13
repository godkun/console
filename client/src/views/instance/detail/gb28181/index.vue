<template>
  <div>
    <div class="top">
      <InstanceSelect @changeIp="changeIp" />
      <Interval @interval-change="intervalChange" />
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
  import { useDialog, useMessage } from 'naive-ui'
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

  let timer

  async function initPage() {
    const r = await getInstanceGB({
      id: query.id
    })
    const s = [{
      ID: 123243,
      Name: '',
      Manufacturer: 1323,
      Model: '',
      Owner: '',
      RegisterTime: new Date(),
      Status: 'ONLINE',
      NetAddr: '180.109.36.24:5060',
      UpdateTIme: new Date(),
      Channels: [
        {
          DeviceID: '342443242424242',
          ParentID: '7428357289375982',
          Name: 'dsfsfg'
        }
      ]
    }]
    streamData.value = r
  }
  initPage()
  function intervalChange() {
    clearInterval(timer)
    let interval = localStorage.getItem('interval')
    if (interval) {
      timer = setInterval(async () => {
        const r = await getInstanceGB({ id: query.id })
        streamData.value = r.Streams
      }, Number(interval) * 1000)
    }
  }

  onUnmounted(() => {
    clearInterval(timer)
  })

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
