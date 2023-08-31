<template>
  <div>
    <Interval @tick="tick" />
    <n-card :bordered="false" class="proCard">
      <BasicTable
        :columns="columns"
        :dataSource="instanceData"
        :row-key="(row) => row.id"
        :pagination="false"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090">
        <template #tableTitle>
          <n-button type="primary" @click="addTable">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button>
        </template>
      </BasicTable>

      <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="modalTitle">
        <n-form
          :model="formParams"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="85"
          class="py-4">
          <n-form-item label="名称" path="name">
            <n-input placeholder="请输入实例名称" v-model:value="formParams.name" />
          </n-form-item>
          <n-form-item label="重置 secret" path="resetSecret" v-if="modalTitle == '编辑实例'">
            <n-checkbox v-model:checked="formParams.resetSecret" />
          </n-form-item>
          <!-- <n-form-item label="监控" path="enableReport">
            <n-switch v-model:value="formParams.enableReport" :disabled="user.level == 0" />
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
  import { h, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDialog, useMessage } from 'naive-ui'
  import { BasicTable, TableAction } from '@/components/Table'
  import { Interval } from '@/components/interval'
  import { columns } from './columns'
  import { PlusOutlined } from '@vicons/antd'
  import { addInstance, updateInstance, delInstance } from '@/api/instance'
  import { useInstanceList, useProjectSetting } from '@/hooks'
  // import { useUserStore } from '@/store'

  const rules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入名称'
    }
  }

  const dialog = useDialog()
  const formRef: any = ref(null)
  const message = useMessage()
  const actionRef = ref()
  const router = useRouter()
  // const user = useUserStore()
  const showModal = ref(false)
  const formBtnLoading = ref(false)
  const formParams = reactive({
    name: '',
    // url: ''
    // enableReport: false,
    resetSecret: false
  })
  const modalTitle = ref('')

  const instance = ref({
    id: '',
    name: '',
    mail: '',
    secret: ''
  })

  const instanceData = ref([])

  const actionColumn = reactive({
    width: 200,
    title: '操作',
    key: 'action',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          // {
          //   label: '配置',
          //   type: 'primary',
          //   icon: 'ic:outline-delete-outline',
          //   onClick: handleInstanceConfig.bind(null, record),
          //   // 根据业务控制是否显示 isShow 和 auth 是并且关系
          //   ifShow: () => record.online == 1
          // },
          // {
          //   label: '流列表',
          //   type: 'primary',
          //   icon: 'ic:outline-delete-outline',
          //   onClick: handleInstanceDetail.bind(null, record),
          //   // 根据业务控制是否显示 isShow 和 auth 是并且关系
          //   ifShow: () => record.online == 1
          // },
          // {
          //   label: '插件列表',
          //   type: 'primary',
          //   icon: 'ic:outline-delete-outline',
          //   onClick: handleInstancePlugin.bind(null, record),
          //   // 根据业务控制是否显示 isShow 和 auth 是并且关系
          //   ifShow: () => record.online == 1
          // },
          {
            label: '详情',
            type: 'primary',
            disabled: record.online == 1 ? false : true,
            onClick: handleInstanceDetail.bind(null, record)
          },
          {
            label: '编辑',
            type: 'primary',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true
            }
          },
          {
            label: '删除',
            type: 'error',
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
    // formParams.url = ''
    modalTitle.value = '新建实例'
    showModal.value = true
  }

  async function tick() {
    const pagesize = 0
    const pageno = 0
    const { list, error, fetchResource } = useInstanceList()
    await fetchResource({ pagesize, pageno })
    if (!error.value) {
      instanceData.value = (list as any).value.data.list
    } else message.info(`error--${error.value}`)
  }

  function onCheckedRow(rowKeys) {
    console.log(rowKeys)
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
            showModal.value = false
            tick()
          })
        } else if (modalTitle.value == '编辑实例') {
          const id = instance.value.id
          updateInstance({ id, ...formParams }).then(() => {
            message.success('编辑成功')
            showModal.value = false
            tick()
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
    // formParams.url = record.url
    // formParams.enableReport = record.report == 1
    modalTitle.value = '编辑实例'
    showModal.value = true
    instance.value.id = record.id
    instance.value.name = record.name
    instance.value.mail = localStorage.getItem('mail') || ''
  }

  // 跳转到实例详情
  function handleInstanceDetail(record: Recordable) {
    const id = record.id
    const page = router.resolve({
      name: 'instance_dashboard',
      params: {
        id
      }
    })
    console.log(page.href)
    const { isSaas } = useProjectSetting()
    if (isSaas.value) {
      window.open(page.href, '_blank')
    } else {
      location.href = page.href
    }
  }

  // // 跳转到实例详情
  // function handleConsole(record: Recordable) {
  //   const id = record.id
  //   router.push({
  //     name: 'instance_dashboard',
  //     query: {
  //       id
  //     }
  //   })
  // }

  // // 跳转到实例详情
  // function handleInstancePlugin(record: Recordable) {
  //   const id = record.id
  //   router.push({
  //     name: 'instance_plugin_list',
  //     query: {
  //       id
  //     }
  //   })
  // }

  // // 跳转到实例详情
  // function handleInstanceConfig(record: Recordable) {
  //   const id = record.id
  //   router.push({
  //     name: 'config',
  //     query: {
  //       id
  //     }
  //   })
  // }

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
        })
      },
      onNegativeClick: () => {}
    })
  }
</script>

<style lang="less" scoped></style>
