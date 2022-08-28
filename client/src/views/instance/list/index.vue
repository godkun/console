<template>
  <div>
    <Interval @tick="tick" />
    <n-card :bordered="false" class="proCard">
      <BasicTable :columns="columns" :dataSource="instanceData" :row-key="(row) => row.id" :pagination="false"
        ref="actionRef" :actionColumn="actionColumn" @update:checked-row-keys="onCheckedRow" :scroll-x="1090">
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

        <!-- <template #toolbar>
          <n-button type="primary" @click="reloadTable">刷新数据</n-button>
        </template> -->
      </BasicTable>

      <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="modalTitle">
        <n-form :model="formParams" :rules="rules" ref="formRef" label-placement="left" :label-width="80" class="py-4">
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
import { h, reactive, ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDialog, useMessage } from 'naive-ui';
import { BasicTable, TableAction } from '@/components/Table';
import { columns } from './columns';
import { PlusOutlined } from '@vicons/antd';
import {
  getInstanceList,
  addInstance,
  updateInstance,
  delInstance
} from '@/api/instance';

const rules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入名称'
  }
};

const dialog = useDialog();
const formRef: any = ref(null);
const message = useMessage();
const actionRef = ref();
const router = useRouter();

const showModal = ref(false);
const formBtnLoading = ref(false);
const formParams = reactive({
  name: '',
  url: ''
});
const modalTitle = ref('');

const instance = ref({
  id: '',
  name: '',
  mail: '',
  secret: ''
});

const instanceData = ref([]);

const actionColumn = reactive({
  // width: 320,
  title: '操作',
  key: 'action',
  fixed: 'right',
  render(record) {
    return h(TableAction as any, {
      style: 'button',
      actions: [
        {
          label: '监控',
          type: 'primary',
          onClick: handleConsole.bind(null, record),
          ifShow: () => record.online == 1
        },
        {
          label: '配置',
          type: 'primary',
          icon: 'ic:outline-delete-outline',
          onClick: handleInstanceConfig.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => record.online == 1
        },
        {
          label: '流列表',
          type: 'primary',
          icon: 'ic:outline-delete-outline',
          onClick: handleInstanceDetail.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => record.online == 1
        },
        {
          label: '插件列表',
          type: 'primary',
          icon: 'ic:outline-delete-outline',
          onClick: handleInstancePlugin.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => record.online == 1
        },
        {
          label: '更新',
          type: 'primary',
          onClick: handleEdit.bind(null, record),
          ifShow: () => {
            return true;
          }
        },
        {
          label: '删除',
          type: 'error',
          icon: 'ic:outline-delete-outline',
          onClick: handleDelete.bind(null, record),
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => {
            return true;
          }
        }
      ],
      select: (key) => {
        message.info(`您点击了，${key} 按钮`);
      }
    });
  }
});

function addTable() {
  formParams.name = '';
  formParams.url = '';
  modalTitle.value = '新建实例';
  showModal.value = true;
}

async function tick() {
  const pagesize = 0;
  const pageno = 0;
  const r = await getInstanceList({ pagesize, pageno });
  instanceData.value = r.data.list;
}

function onCheckedRow(rowKeys) {
  console.log(rowKeys);
}

function confirmForm(e) {
  e.preventDefault();
  formBtnLoading.value = true;
  formRef.value.validate((errors) => {
    if (!errors) {
      if (modalTitle.value == '新建实例') {
        const name = formParams.name;
        addInstance({ name }).then(() => {
          message.success('新建成功');
          setTimeout(() => {
            showModal.value = false;
            reloadTable();
          });
        });
      } else if (modalTitle.value == '更新实例') {
        const name = formParams.name;
        const id = instance.value.id;
        const secret = instance.value.secret;
        updateInstance({ name, id, secret }).then(() => {
          message.success('更新成功');
          setTimeout(() => {
            showModal.value = false;
            reloadTable();
          });
        });
      }
    } else {
      message.error('请填写完整信息');
    }
    formBtnLoading.value = false;
  });
}

function handleEdit(record: Recordable) {
  formParams.name = record.name;
  formParams.url = record.url;
  modalTitle.value = '更新实例';
  showModal.value = true;
  instance.value.id = record.id;
  instance.value.name = record.name;
  instance.value.mail = localStorage.getItem('mail') || '';
}

// 跳转到实例详情
function handleInstanceDetail(record: Recordable) {
  const id = record.id;
  router.push({
    name: 'instance_stream_list',
    query: {
      id
    }
  });
}

function jumpTest() {
  router.push({
    name: 'stream-play',
    query: {
      frameSrc: 'https://m7s.live/guide/introduction.html?s=1'
    }
  });
}

// 跳转到实例详情
function handleConsole(record: Recordable) {
  const id = record.id;
  router.push({
    name: 'instance_dashboard',
    query: {
      id
    }
  });
}

// 跳转到实例详情
function handleInstancePlugin(record: Recordable) {
  const id = record.id;
  router.push({
    name: 'instance_plugin_list',
    query: {
      id
    }
  });
}

// 跳转到实例详情
function handleInstanceConfig(record: Recordable) {
  const id = record.id;
  router.push({
    name: 'config',
    query: {
      id
    }
  });
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
        message.success('删除成功');
        setTimeout(() => {
          showModal.value = false;
          reloadTable();
        });
      });
    },
    onNegativeClick: () => { }
  });
}
</script>

<style lang="less" scoped>
</style>
