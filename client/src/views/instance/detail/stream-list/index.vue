<template>
  <div>
    <InstanceSelect />
    <n-card :bordered="false" class="proCard">
      <BasicTable
        :columns="columns"
        :dataSource="steam"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090">
        <template #tableTitle>
          <n-gradient-text type="success"> 流列表 </n-gradient-text>
          <!-- <n-button type="primary" @click="addTable">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button> -->
        </template>

        <template #toolbar>
          <n-button type="primary" @click="reloadTable">刷新数据</n-button>
        </template>
      </BasicTable>

      <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="modalTitle">
        <n-form
          :model="formParams"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="80"
          class="py-4">
          <n-form-item label="名称" path="name">
            <n-input placeholder="请输入实例名称" v-model:value="formParams.name" />
          </n-form-item>
          <!-- <n-form-item label="链接" path="url">
            <n-input placeholder="请输入实例链接" v-model:value="formParams.url" />
          </n-form-item> -->
        </n-form>

        <template #action>
          <n-space>
            <n-button @click="() => (showModal = false)">取消</n-button>
            <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
          </n-space>
        </template>
      </n-modal>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useDialog, useMessage } from 'naive-ui'
  import { BasicTable, TableAction } from '@/components/Table'
  import { columns } from './columns'
  import { PlusOutlined } from '@vicons/antd'
  import { addInstance, updateInstance, delInstance, getInstanceSummary, getStreamDetail } from '@/api/instance'

  const route = useRoute()
  const router = useRouter()
  const { query } = route

  const id = ref('')
  id.value = query.id as string

  const rules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入名称'
    }
    // address: {
    //   url: true,
    //   trigger: ['blur', 'input'],
    //   message: '请输入地址'
    // }
  }

  const dialog = useDialog()
  const formRef: any = ref(null)
  const message = useMessage()
  const actionRef = ref()

  const showModal = ref(false)
  const formBtnLoading = ref(false)
  const formParams = reactive({
    name: '',
    url: ''
  })
  const modalTitle = ref('')

  const instance = ref({
    id: '',
    name: '',
    mail: '',
    secret: ''
  })

  function instanceChange(d) {
    console.log('🚀 ~ file: index.vue ~ line 113 ~ instanceChange ~ window.location.search', route)
    if (route.query.id == d) return
    else {
      router.push({
        name: 'instance_stream_list',
        query: {
          id: d
        }
      })
    }
  }

  // getSysInfo()

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
          },
          {
            label: '播放',
            type: 'primary',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true
            }
          },
          {
            label: '暂停录制',
            type: 'primary',
            icon: 'ic:outline-delete-outline',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true
            }
          },
          {
            label: '录制',
            type: 'primary',
            icon: 'ic:outline-delete-outline',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true
            }
          }
        ],
        select: (key) => {
          message.info(`您点击了，${key} 按钮`)
        }
      })
    }
  })

  function addTable() {
    formParams.name = ''
    formParams.url = ''
    modalTitle.value = '新建实例'
    showModal.value = true
  }

  const loadDataTable = async () => {
    const r = await getInstanceSummary()
    return [
      {
        Path: 'live/test',
        State: 1,
        Subscribers: 1,
        Tracks: ['aac', 'h264'],
        StartTime: -62135596800,
        Type: 'RTMPReceiver',
        BPS: 520930
      }
    ]
    return r.Streams
  }

  const steam = ref([
     {
        Path: 'live/test',
        State: 1,
        Subscribers: 1,
        Tracks: ['aac', 'h264'],
        StartTime: -62135596800,
        Type: 'RTMPReceiver',
        BPS: 520930
      }
  ])

  const detail = {
    StartTime: '0001-01-01T00:00:00Z',
    WaitTimeout: 10000000000,
    PublishTimeout: 10000000000,
    WaitCloseTimeout: 0,
    Path: 'live/test',
    Publisher: {
      ID: '',
      Type: 'RTMPReceiver',
      StartTime: '2022-06-25T14:53:30.605358+08:00',
      Args: {},
      StreamID: 1
    },
    State: 1,
    Subscribers: [
      {
        ID: '',
        Type: 'HLSWriter',
        StartTime: '2022-06-25T14:53:30.605462+08:00',
        Args: {}
      }
    ],
    Tracks: {
      aac: {
        Name: 'aac',
        BPS: 20139,
        FPS: 47,
        SampleRate: 48000,
        SampleSize: 16,
        CodecID: 10,
        Channels: 2,
        AVCCHead: 'rwE=',
        Profile: 2
      },
      h264: {
        Name: 'h264',
        BPS: 500360,
        FPS: 60,
        SampleRate: 90000,
        SampleSize: 0,
        CodecID: 7,
        SPSInfo: {
          ProfileIdc: 100,
          LevelIdc: 32,
          MbWidth: 72,
          MbHeight: 45,
          CropLeft: 0,
          CropRight: 0,
          CropTop: 0,
          CropBottom: 0,
          Width: 1152,
          Height: 720
        },
        GOP: 250
      }
    },
    AppName: 'live',
    StreamName: 'test'
  }

  function onCheckedRow(rowKeys) {
    console.log(rowKeys)
  }

  function reloadTable() {
    actionRef.value.reload()
  }

  function confirmForm(e) {
    e.preventDefault()
    formBtnLoading.value = true
    formRef.value.validate((errors) => {
      if (!errors) {
        if (modalTitle.value == '新建实例') {
          const name = formParams.name
          addInstance({ name }).then(() => {
            message.success('新建成功')
            setTimeout(() => {
              showModal.value = false
              reloadTable()
            })
          })
        } else if (modalTitle.value == '更新实例') {
          const name = formParams.name
          const id = instance.value.id
          const secret = instance.value.secret
          updateInstance({ name, id, secret }).then(() => {
            message.success('更新成功')
            setTimeout(() => {
              showModal.value = false
              reloadTable()
            })
          })
        }
      } else {
        message.error('请填写完整信息')
      }
      formBtnLoading.value = false
    })
  }

  function handleEdit(record: Recordable) {
    formParams.name = record.name
    formParams.url = record.url
    modalTitle.value = '更新实例'
    showModal.value = true
    instance.value.id = record.id
    instance.value.name = record.name
    instance.value.mail = localStorage.getItem('mail') || ''
  }

  function handleDetail(record: Recordable) {
    getStreamDetail(record.Path).then(res => {
      dialog.info({
        showIcon: false,
        title: '流详情',
        content: res.data,
        style: {
          width: '50vw',
        },
        positiveText: '确定'
    })
      console.log('res----', res)
    })
  }

  function handleDelete(record: Recordable) {
    dialog.info({
      title: '提示',
      content: '您确定要删除此实例吗',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        delInstance({
          id: record.id
        }).then(() => {
          message.success('删除成功')
          setTimeout(() => {
            showModal.value = false
            reloadTable()
          })
        })
      },
      onNegativeClick: () => {}
    })
  }
</script>

<style lang="less" scoped>
  .n-gradient-text {
    font-size: 24px;
  }
</style>
