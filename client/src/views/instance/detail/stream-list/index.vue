<template>
  <div>
    <InstanceSelect />
    <n-card :bordered="false" class="proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090">
        <template #tableTitle>
          <n-gradient-text type="success">
            流列表
          </n-gradient-text>
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
  import {
    addInstance,
    updateInstance,
    delInstance,
    getInstanceSummary
  } from '@/api/instance'

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
    console.log("🚀 ~ file: index.vue ~ line 113 ~ instanceChange ~ window.location.search", route)
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
    const r = await getInstanceSummary({
      id: id.value
    })
    return r.Streams
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
