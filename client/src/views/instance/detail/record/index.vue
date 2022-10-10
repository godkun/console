<template>
  <n-layout>
    <n-layout-content content-style="padding: 24px;">
      <BasicTable
        class="table"
        :row-class-name="'row'"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="{ simple: true }"
        :actionColumn="actionColumn"
        :row-key="(row) => row.Name"
        :scroll-x="1090">
        <template #tableTitle>
          <n-gradient-text type="success"> 录像文件列表 </n-gradient-text>
        </template>
        <template #toolbar> </template>
      </BasicTable>
    </n-layout-content>
  </n-layout>
</template>
<script lang="ts" setup>
  import { BasicTable } from '@/components/Table'
  import { getRecordFiles } from '@/api/instance'
  import { h, ref } from 'vue'
  import { useRoute } from 'vue-router'
  const { params } = useRoute()
  function ByteStr(byte: number) {
    if (byte > 1024 * 1024) return (byte / 1024 / 1024).toFixed(2) + ' MB'
    if (byte > 1024) return (byte / 1024).toFixed(2) + ' KB'
    return byte.toString() + ' B'
  }
  const columns = [
    {
      title: '文件',
      key: 'Path'
    },
    {
      title: '大小',
      render: (row) => h('text', ByteStr(row.Size)),
      width: 100
    },
    {
      title: '时长',
      key: 'Duration',
      width: 100
    }
  ]
  const actionColumn = []
  const dataSource = ref([])
  getRecordFiles(params.id as string).then((x) => {
    dataSource.value = x
  })
</script>
