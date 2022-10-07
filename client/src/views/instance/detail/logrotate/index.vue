<template>
  <n-layout>
    <n-layout-content content-style="padding: 24px;">
      <BasicTable
        class="table"
        :loading="loading"
        :row-class-name="'row'"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="{ simple: true }"
        :actionColumn="actionColumn"
        :row-key="(row) => row.Name"
        :scroll-x="1090">
        <template #tableTitle>
          <n-gradient-text type="success"> 日志文件列表 </n-gradient-text>
        </template>
        <template #toolbar>
          <n-input v-model:value="searchFull" />
          <n-button attr-type="button" @click="onLogSearch"> 全文搜索 </n-button>
          <n-button attr-type="button" @click="onLogTail"> 实时跟踪 </n-button>
        </template>
      </BasicTable>
    </n-layout-content>
  </n-layout>
</template>
<script lang="ts" setup>
  import { getInstanceHttp, getLogFiles } from '@/api/instance'
  import { TableAction, BasicTable } from '@/components/Table'
  import { NInput } from 'naive-ui'
  import { computed, h, reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  const searchKey = ref('')
  const searchFull = ref('')
  const loading = ref(true)
  const id = useRoute().params.id as string
  const _dataSource = ref([])
  const dataSource = computed(() => {
    return searchKey.value
      ? _dataSource.value.filter((log) => log.Name.indexOf(searchKey.value) != -1)
      : _dataSource.value
  })

  function unitSpeedFormat(value, unit = '') {
    const uintInc = {
      '': 'K',
      K: 'M',
      M: 'G',
      G: null
    }

    if (value > 1024 && uintInc[unit]) {
      return unitSpeedFormat(value / 1024, uintInc[unit])
    }
    return (value || 0).toFixed(2).replace('.00', '') + unit + 'B'
  }
  const columns = [
    {
      title: () =>
        h('div', [
          '名称',
          h(NInput, {
            placeholder: '按名称过滤',
            onUpdateValue(s) {
              console.log(s)
              searchKey.value = s
            }
          })
        ]),
      key: 'Name',
      width: 100
    },
    {
      title: '大小',
      width: 100,
      render(row) {
        return h('text', unitSpeedFormat(row.Size))
      }
    }
  ]

  getLogFiles(id).then((data) => {
    _dataSource.value = data
    loading.value = false
  })

  async function logOpenHref(record) {
    const url = await getInstanceHttp(id, true, false)
    window.open(`${url}/logrotate/api/open?file=${encodeURI(record.Name)}`)
  }
  async function logDownloadHref(record) {
    const url = await getInstanceHttp(id, true, false)
    window.open(`${url}/logrotate/api/download?file=${encodeURI(record.Name)}`)
  }
  async function onLogSearch() {
    const url = await getInstanceHttp(id, true, false)
    window.open(`${url}/logrotate/api/find?query=${searchFull.value}`)
  }
  async function onLogTail() {
    const url = await getInstanceHttp(id, true, false)
    window.open(`${url}/logrotate/api/tail`)
  }
  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    // fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '打开',
            type: 'primary',
            icon: 'ic:outline-delete-outline',
            onClick: logOpenHref.bind(null, record)
          },
          {
            label: '下载',
            type: 'primary',
            icon: 'ic:outline-delete-outline',
            onClick: logDownloadHref.bind(null, record)
          }
        ]
      })
    }
  })
</script>
