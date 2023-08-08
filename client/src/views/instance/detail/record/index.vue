<template>
  <n-layout>
    <n-layout-content content-style="padding: 24px;">
      <n-tabs type="line" animated>
        <n-tab-pane name="filelist" tab="录像文件列表">
          <BasicTable
            title="录像文件列表"
            class="table"
            :row-class-name="'row'"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="{ simple: true }"
            :actionColumn="actionColumn"
            :row-key="(row) => row.Name"
            :scroll-x="1090">
            <template #toolbar><n-button @click="showModal = true">开始录制</n-button> </template>
          </BasicTable>
        </n-tab-pane>
        <n-tab-pane name="recording" tab="正在录制列表">
          <BasicTable
            title="正在录制的流列表"
            class="table"
            :row-class-name="'row'"
            :columns="recordingColumns"
            :dataSource="recordingList"
            :pagination="{ simple: true }"
            :actionColumn="recordingAction"
            :row-key="(row) => row.ID"
            :scroll-x="1090">
            <template #toolbar>
              <Interval @tick="tick" style="padding: 0 20px 0 0" />
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
      preset="dialog">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="85"
        class="py-4">
        <n-form-item label="录制格式" path="recordType">
          <n-radio-group v-model:value="formParams.recordType" name="radiobuttongroup1">
            <n-radio-button
              v-for="t of ['flv', 'mp4', 'hls', 'raw']"
              :key="t"
              :value="t"
              :label="t" />
          </n-radio-group>
        </n-form-item>
        <n-form-item label="流路径" path="recordStreamPath">
          <n-input
            placeholder="输入需要录制的StreamPath"
            v-model:value="formParams.recordStreamPath" />
        </n-form-item>
        <n-form-item label="文件名" path="fileName">
          <n-input placeholder="输入文件名" v-model:value="formParams.fileName" />
        </n-form-item>
        <n-form-item label="切片时间" path="fragment">
          <n-input placeholder="输入切片时间（秒）" v-model:value="formParams.fragment" />
        </n-form-item>
      </n-form>
      如何配置请查看官网文档:
      <a
        href="https://m7s.live/guide/plugins/record.html#api"
        target="_blank"
        style="color: #18a058"
        >https://m7s.live/guide/plugins/record.html#api</a
      >
      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" @click="record">确认</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-layout>
</template>
<script lang="ts" setup>
  import { Interval } from '@/components/interval'
  import { BasicTable } from '@/components/Table'
  import { getRecordFiles, getRecordingList, startRecord, stopRecord } from '@/api/instance'
  import { h, ref, reactive } from 'vue'
  import { useRoute } from 'vue-router'
  import { NButton, NTime, useMessage } from 'naive-ui'
  // const recordStreamPath = ref('')
  // const recordType = ref('flv')
  const formRef: any = ref(null)
  const message = useMessage()
  const showModal = ref(false)
  const { params } = useRoute()
  const formParams = reactive({
    recordStreamPath: '',
    fileName: '',
    fragment: '',
    recordType: 'flv'
  })
  const rules = {
    recordStreamPath: {
      required: true,
      trigger: ['blur', 'input'],
      message: '输入需要录制的StreamPath'
    }
  }
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
  const dataSource = ref<Array<{ Path: string }>>([])
  const recordingList = ref<Array<{ ID: string }>>([])
  getRecordFiles(params.id as string).then((x) => {
    dataSource.value = x || []
    dataSource.value = dataSource.value.sort((a, b) => a.Path.localeCompare(b.Path))
  })
  function tick() {
    getRecordingList(params.id as string).then((x) => {
      recordingList.value = x || []
      recordingList.value = recordingList.value.sort((a, b) => a.ID.localeCompare(b.ID))
    })
  }
  function record() {
    formRef.value.validate((errors) => {
      if (!errors) {
        if (formParams.fragment !== '') {
          const s = /^\d+$/
          if (!s.test(formParams.fragment)) {
            message.error('切片时间请输入非负整数')
            return
          }
        }
        if (formParams.fileName !== '') {
          const s = /^[a-z0-9_]*$/g
          if (!s.test(formParams.fileName)) {
            message.error('文件名只允许数字、字母和下划线组合')
            return
          }
        }
        startRecord(
          params.id as string,
          formParams.recordStreamPath,
          formParams.recordType,
          (formParams.fileName = ''),
          (formParams.fragment = '0')
        )
          .then((x) => {
            if (x) {
              message.success('开始录制成功')
            } else {
              message.error('开始录制失败')
            }
          })
          .catch(() => {
            showModal.value = false
            // message.error(err)
          })
      } else {
        // showModal.value = true
      }
    })
  }
</script>
