<template>
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
        <n-button type="primary" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
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
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue'
  import { useDialog, useMessage } from 'naive-ui'
  import { BasicTable, TableAction } from '@/components/Table'
  import { getInstanceList } from '@/api/instance'
  import { columns } from './columns'
  import { PlusOutlined } from '@vicons/antd'

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

  const params = ref({
    pageSize: 5,
    name: 'xiaoMa'
  })

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
            label: '查看',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true
            },
            // auth: ['basic_list']
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true
            },
          },
          {
            label: '删除',
            icon: 'ic:outline-delete-outline',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            // auth: ['basic_list']
          },
        ],
        // dropDownActions: [
        //   {
        //     label: '启用',
        //     key: 'enabled',
        //     // 根据业务控制是否显示: 非enable状态的不显示启用按钮
        //     ifShow: () => {
        //       return true
        //     }
        //   },
        //   {
        //     label: '禁用',
        //     key: 'disabled',
        //     ifShow: () => {
        //       return true
        //     }
        //   }
        // ],
        select: (key) => {
          message.info(`您点击了，${key} 按钮`)
        }
      })
    }
  })

  // const [register, {}] = useForm({
  //   gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  //   labelWidth: 80,
  //   schemas
  // })

  function addTable() {
    formParams.name = ''
    formParams.url = ''
    modalTitle.value = '新建实例'
    showModal.value = true
  }

  const loadDataTable = async (res) => {
    return await getInstanceList({ ...formParams, ...params.value, ...res })
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
        message.success('新建成功')
        setTimeout(() => {
          showModal.value = false
          reloadTable()
        })
      } else {
        message.error('请填写完整信息')
      }
      formBtnLoading.value = false
    })
  }

  function handleEdit(record: Recordable) {
    formParams.name = record.name
    formParams.url = record.url
    modalTitle.value = '编辑实例'
    showModal.value = true
    // router.push({ name: 'basic-info', params: { id: record.id } })
  }

  function handleDelete(record: Recordable) {
    dialog.info({
      title: '提示',
      content: '您确定要删除此实例吗',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        console.log(record)
      },
      onNegativeClick: () => {}
    })
  }
</script>

<style lang="less" scoped></style>
