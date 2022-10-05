<template>
  <div>
    <div class="top">
      <Interval @tick="tick" />
    </div>
    <n-card :bordered="false" class="proCard">
      <BasicTable
        :columns="columns"
        :dataSource="streamData"
        :pagination="false"
        :row-key="(row) => row.id"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090">
        <template #tableTitle>
          <n-gradient-text type="success"> 流列表 </n-gradient-text>
        </template>
      </BasicTable>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { BasicTable, TableAction } from '@/components/Table'
  import { Interval } from '@/components/Interval'
  import { columns } from './columns'
  import { getInstanceSummary, getSysInfo, getConfig } from '@/api/instance'

  const route = useRoute()
  const router = useRouter()
  const { query } = route

  const id = ref('')
  id.value = query.id as string

  const streamData = ref([])

  const remoteIp = ref('')

  function changeIp(ip: string) {
    remoteIp.value = ip
  }

  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '流详情',
            type: 'primary',
            onClick: handleDetail.bind(null, record),
            ifShow: () => {
              return true
            }
          }
        ],
        dropDownActions: [
          {
            label: 'http公网',
            key: '1',
            text: record.Path,
            ifShow: () => {
              return true
            }
          },
          {
            label: 'http局域网',
            key: '2',
            text: record.Path,
            ifShow: () => {
              return true
            }
          },
          {
            label: 'https公网',
            key: '3',
            text: record.Path,
            ifShow: () => {
              return true
            }
          },
          {
            label: 'https局域网',
            key: '4',
            text: record.Path,
            ifShow: () => {
              return true
            }
          }
        ],
        select: (key, record) => {
          handleSelect(key, record)
        }
      })
    }
  })

  let timer

  async function tick() {
    const r = await getInstanceSummary()
    streamData.value = r.Streams
  }

  function onCheckedRow(rowKeys) {
    console.log(rowKeys)
  }

  async function handleSelect(key: string, record) {
    const path = record.text
    const info = await getSysInfo()
    // 局域网ip
    const localIp = info.LocalIP
    const config = await getConfig('')
    const { publicaddr, publicaddrtls } = config.console
    const { listenaddr, listenaddrtls } = config.http
    // http公网
    if (key == '1') {
      const ip = publicaddr ? publicaddr : remoteIp.value
      window.open(`http://${ip}${listenaddr}/preview/${path}`, '_blank')
      // http局域网
    } else if (key == '2') {
      window.open(`http://${localIp}${listenaddr}/preview/${path}`, '_blank')
      // https公网
    } else if (key == '3') {
      const ip = publicaddrtls ? publicaddrtls : remoteIp.value
      window.open(`https://${ip}${listenaddrtls}/preview/${path}`, 'target')
      // https局域网
    } else if (key == '4') {
      window.open(`https://${localIp}${listenaddrtls}/preview/${path}`, 'target')
    }
  }

  function handleDetail(record: Recordable) {
    const id = record.id
    const path = record.Path
    router.push({
      name: 'instance_stream_detail',
      query: {
        id,
        path
      }
    })
  }

  onUnmounted(() => {
    clearInterval(timer)
  })
</script>

<style lang="less" scoped>
  .top {
    display: flex;
  }

  .n-gradient-text {
    font-size: 24px;
  }
</style>
