<template>
  <div>
    <n-card :bordered="false" class="proCard">
      <BasicTable
        title="流列表"
        :columns="columns"
        :dataSource="streamData"
        :pagination="false"
        :row-key="(row) => row.id"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090" />
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, onMounted } from 'vue'
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
  import { BasicTable, TableAction } from '@/components/Table'
  // import { Interval } from '@/components/interval'
  import { columns } from './columns'
  import { getInstanceHttp, getInstanceSummarySSE } from '@/api/instance'

  const route = useRoute()
  const router = useRouter()
  const { params } = route

  const id = params.id as string

  const streamData = ref([])

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

  onMounted(() => {
    const es = getInstanceSummarySSE(id)
    es.onmessage = tick
    onBeforeRouteLeave(() => es.close())
  })

  async function tick(event) {
    // const r = await getInstanceSummary(id)
    const r = JSON.parse(event.data)
    streamData.value = r.Streams.sort((a, b) => a.Path.localeCompare(b.Path))
  }

  function onCheckedRow(rowKeys) {
    console.log(rowKeys)
  }

  async function handleSelect(key: string, record) {
    const path = record.text
    const url = await getInstanceHttp(id, key == '2' || key == '4', key == '3' || key == '4')
    window.open(`${url}/preview/${path}`, '_blank')
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
</script>

<style lang="less" scoped>
  .top {
    display: flex;
  }

  .n-gradient-text {
    font-size: 24px;
  }
</style>
