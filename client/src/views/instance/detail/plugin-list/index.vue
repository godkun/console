<template>
  <div>
    <InstanceSelect />
    <n-card :bordered="false" class="proCard">
      <BasicTable
        :columns="columns"
        :dataSource="pluginData"
        :row-key="(row) => row.id"
        :pagination="false"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090">
        <template #tableTitle>
          <n-gradient-text type="success">
            插件列表
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
  import { h, reactive, ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useDialog, useMessage } from 'naive-ui'
  import { BasicTable, TableAction } from '@/components/Table'
  import { columns } from './columns'
  import {
    addInstance,
    updateInstance,
    delInstance,
    getInstancePlugin
  } from '@/api/instance'

  const router = useRouter()
  const route = useRoute()
  const { query } = route

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

  const showModal = ref(false)
  const formBtnLoading = ref(false)
  const formParams = reactive({
    name: '',
    url: ''
  })
  const modalTitle = ref('')
  const pluginData= ref([])

  const instance = ref({
    id: '',
    name: '',
    mail: '',
    secret: ''
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
            label: '配置',
            type: 'primary',
            icon: 'ic:outline-delete-outline',
            onClick: handlePluginConfig.bind(null, record),
            ifShow: () => {
              for (let index = 0; index < pluginData.value.length; index++) {
                const p = pluginData.value[index]
                if(p.Name == record.Name) {
                  if (!p.RawConfig) return false
                  else return true
                }
              }
            }
          },
        ],
        select: (key) => {
          message.info(`您点击了，${key} 按钮`)
        }
      })
    }
  })

    // 跳转到实例详情
  function handlePluginConfig(record: Recordable) {
    const id = query.id
    const name = record.Name
    router.push({
      name: 'config',
      query: {
        id,
        name
      }
    })
  }

  async function initPage() {
    const r = await getInstancePlugin({
      id: query.id
    })
    pluginData.value = Object.values(r)
  }
  initPage()

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
          const name  = formParams.name
          addInstance({name }).then(() => {
            message.success('新建成功')
            setTimeout(() => {
              showModal.value = false
              reloadTable()
            })
          })
        } else if (modalTitle.value == '更新实例') {
            const name  = formParams.name
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
