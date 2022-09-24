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
          <n-gradient-text type="success"> 插件列表 </n-gradient-text>
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
  import { useMessage } from 'naive-ui'
  import { BasicTable, TableAction } from '@/components/Table'
  import { InstanceSelect } from '@/components/InstanceSelect'
  import { columns } from './columns'
  import { addInstance, updateInstance, getInstancePlugin } from '@/api/instance'

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
  const pluginData = ref([])

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
                if (p.Name == record.Name) {
                  if (!p.RawConfig) return false
                  else return true
                }
              }
            }
          },
          {
            label: '详情',
            type: 'primary',
            onClick: handleDetail.bind(null, record),
            ifShow: () => {
              if (record.Name == 'GB28181') return true
            }
          }
        ],
        select: (key) => {
          message.info(`您点击了，${key} 按钮`)
        }
      })
    }
  })

  function handleDetail(record: Recordable) {
    const id = record.id
    console.log(1111, record.Name)
    if (record.Name == 'GB28181') {
      router.push({
        name: 'gb28181',
        query: {
          id
        }
      })
    }
  }

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
</script>

<style lang="less" scoped>
  .n-gradient-text {
    font-size: 24px;
  }
</style>
