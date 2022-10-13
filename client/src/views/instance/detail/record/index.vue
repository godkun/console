<template>
  <n-layout>
    <n-layout-content content-style="padding: 24px;">
      <n-tabs type="line" animated>
        <n-tab-pane name="filelist" tab="录像文件列表">
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
            <template #toolbar><n-button @click="showModal = true">开始录制</n-button> </template>
          </BasicTable>
        </n-tab-pane>
        <n-tab-pane name="recording" tab="正在录制列表">
          <BasicTable
            class="table"
            :row-class-name="'row'"
            :columns="recordingColumns"
            :dataSource="recordingList"
            :pagination="{ simple: true }"
            :actionColumn="recordingAction"
            :row-key="(row) => row.ID"
            :scroll-x="1090">
            <template #tableTitle>
              <n-gradient-text type="success"> 正在录制的流列表 </n-gradient-text>
            </template>
            <template #toolbar>
              <Interval @tick="tick" />
              <n-button @click="showModal = true">开始录制</n-button>
            </template>
          </BasicTable>
        </n-tab-pane>
      </n-tabs>
    </n-layout-content>
    <n-modal
      v-model:show="showModal"
      style="width: 600px"
      title="开始录制"
      :bordered="false"
      size="huge"
      preset="dialog"
      positive-text="确认"
      negative-text="算了"
      @positive-click="record()">
      <n-radio-group v-model:value="recordType" name="radiobuttongroup1">
        <n-radio-button v-for="t of ['flv', 'mp4', 'hls', 'raw']" :key="t" :value="t" :label="t" />
      </n-radio-group>
      <n-input v-model:value="recordStreamPath" placeholder="输入需要录制的StreamPath" />
    </n-modal>
  </n-layout>
</template>
<script lang="ts" setup>
  import { Interval } from '@/components/interval'
  import { BasicTable } from '@/components/Table'
  import { getRecordFiles, getRecordingList, startRecord, stopRecord } from '@/api/instance'
  import { h, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { NButton, NTime, useMessage } from 'naive-ui'
  const recordStreamPath = ref('')
  const recordType = ref('flv')
  const message = useMessage()
  const showModal = ref(false)
  const { params } = useRoute()
  function ByteStr(byte: number) {
    if (byte > 1024 * 1024) return (byte / 1024 / 1024).toFixed(2) + ' MB'
    if (byte > 1024) return (byte / 1024).toFixed(2) + ' KB'
    return byte.toString() + ' B'
  }
  const recordingColumns = [
    {
      title: 'ID',
      key: 'ID'
    },
    {
      title: 'Type',
      key: 'Type',
      width: 150
    },
    {
      title: '开始时间',
      render: (row: any) => h(NTime, { type: 'relative', time: new Date(row.StartTime) }),
      width: 150
    }
  ]
  const recordingAction = {
    title: '操作',
    key: 'action',
    width: 100,
    render: (row: { ID: string }) =>
      h(
        NButton,
        {
          type: 'error',
          size: 'small',
          onClick: () => {
            stopRecord(params.id as string, row.ID)
              .then((x) => {
                if (x == 'ok') {
                  message.success('停止录制成功')
                } else {
                  message.error('停止录制失败')
                }
              })
              .catch((err) => {
                message.error(err)
              })
          }
        },
        ['停止']
      )
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
  const recordingList = ref([])
  getRecordFiles(params.id as string).then((x) => {
    dataSource.value = x
  })
  function tick() {
    getRecordingList(params.id as string).then((x) => {
      recordingList.value = x || []
    })
  }
  function record() {
    startRecord(params.id as string, recordStreamPath.value, recordType.value)
      .then((x) => {
        if (x) {
          message.success('开始录制成功')
        } else {
          message.error('开始录制失败')
        }
      })
      .catch((err) => {
        message.error(err)
      })
  }
</script>
