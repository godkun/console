<template>
  <div>
    <div class="top">
      <Interval @tick="tick" />
    </div>
    <n-card :bordered="false" class="proCard">
      <BasicTable
        title="远端拉流列表"
        class="table"
        :row-class-name="'row'"
        :columns="columns"
        :dataSource="pulllist"
        :pagination="false"
        :actionColumn="actionColumn"
        :row-key="(row) => row.id"
        :scroll-x="1090">
        <template #toolbar>
          <n-button @click="showModal = true" type="primary" round>添加拉流</n-button>
        </template>
      </BasicTable>
    </n-card>
    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="从远端服务器导入流">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4">
        <n-form-item label="远端流地址" path="target">
          <n-input placeholder="请输入远端流的地址" v-model:value="formParams.target" />
        </n-form-item>
        <n-form-item label="StreamPath" path="streamPath">
          <n-input placeholder="请输入StreamPath" v-model:value="formParams.streamPath" />
        </n-form-item>
        <n-form-item label="重启后恢复" path="save">
          <n-switch v-model:value="formParams.save" />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
  import { columns } from './columns'
  import { BasicTable, TableAction } from '@/components/Table'
  import { Interval } from '@/components/interval'
  import { useRoute } from 'vue-router'
  import { getInstancePullList, stopStream, pullStream } from '@/api/instance'
  import { ref, reactive, h, toRaw } from 'vue'
  import { FormItemRule, useMessage } from 'naive-ui'
  const { params } = useRoute()
  const msg = useMessage()
  const formParams = reactive({ target: '', streamPath: '', save: false })
  const formBtnLoading = ref(false)
  const pulllist = ref([])
  const showModal = ref(false)
  const rules = {
    target: {
      required: true,
      message: '请输入远端流地址',
      trigger: 'blur',
      validator(rule: FormItemRule, target: string) {
        if (!target) {
          rule.message = '请输入远端流地址'
          return false
        }
        if (target.startsWith('rtsp')) {
          return true
        } else if (target.startsWith('rtmp')) {
          return true
        } else if (/\.m3u8($|\?)/.test(target)) {
          return true
        } else if (target.startsWith('http')) {
          return true
        } else {
          rule.message = 'only support rtsp,rtmp,hls,hdl'
          return false
        }
      }
    },
    streamPath: {
      required: true,
      message: '请输入StreamPath',
      trigger: 'blur',
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          rule.message = '请输入StreamPath'
          return false
        }
        if (value.split('/').length == 1) {
          rule.message = 'StreamPath必须包含/'
          return false
        } else if (value.startsWith('/')) {
          rule.message = 'StreamPath开头不能包含/'
          return false
        } else if (value.endsWith('/')) {
          rule.message = 'StreamPath结尾不能包含/'
          return false
        } else {
          return true
        }
      }
    }
  }
  async function tick() {
    pulllist.value = await getInstancePullList(params.id as string)
  }
  async function confirmForm() {
    formBtnLoading.value = true
    const { target, streamPath } = toRaw(formParams)
    let type: 'rtsp' | 'rtmp' | 'hls' | 'hdl' = 'hdl'
    if (target.startsWith('rtsp')) {
      type = 'rtsp'
    } else if (target.startsWith('rtmp')) {
      type = 'rtmp'
    } else if (/\.m3u8($|\?)/.test(target)) {
      type = 'hls'
    } else if (target.startsWith('http')) {
      type = 'hdl'
    } else {
      msg.error('type not support')
      formBtnLoading.value = false
      return
    }
    try {
      await pullStream(params.id as string, type, streamPath, encodeURI(target))
      formBtnLoading.value = false
      showModal.value = false
      msg.success('成功导入远端流')
    } catch (err) {
      formBtnLoading.value = false
      msg.error(err)
    }
  }
  async function handleDelete(record) {
    try {
      await stopStream(params.id as string, record.StreamPath)
      msg.success('删除成功')
    } catch (err) {
      msg.error(err.toString())
    }
  }
  const actionColumn = reactive({
    // width: 320,
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 100,
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '删除',
            type: 'error',
            icon: 'ic:outline-delete-outline',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => true
          }
        ]
      })
    }
  })
</script>

<style lang="less" scoped>
  .top {
    display: flex;
  }

  // /deep/ .row {
  //   .n-ellipsis:not(.n-ellipsis--line-clamp) {
  //     height: 100px;
  //     white-space: inherit;
  //     overflow-y: auto;
  //   }
  // }
  .n-gradient-text {
    font-size: 24px;
  }
</style>
