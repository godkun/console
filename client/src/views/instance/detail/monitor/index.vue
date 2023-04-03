<template>
  <div>
    <Check name="Monitor" v-model:value="noPlugin" />
    <div class="query-bar" v-if="!noPlugin">
      <n-input class="input-field" placeholder="输入流名称" v-model:value="streamName" clearable />
      <n-button @click="setToday">今天</n-button>
      <n-button @click="setYesterday">昨天</n-button>
      <n-date-picker class="input-field" placeholder="选择日期范围" v-model:value="dr" type="daterange" range-separator="至"
        format="yyyy-MM-dd" clearable />
      <n-button type="primary" @click="handleQuery">查询</n-button>
    </div>
    <n-data-table :columns="columns" :data="streamList" :pagination="{ pageSize: 10, showSizePicker: true }"
      :bordered="false" />
  </div>
</template>

<script setup lang="ts">
import Check from '../check.vue';
import { h, ref } from 'vue';
import { getStreamList } from '@/api/instance';
import { useRoute, useRouter } from 'vue-router';
import YAML from 'yaml';
import { NButton } from 'naive-ui';
import { TableColumn } from 'naive-ui/es/data-table/src/interface';
const noPlugin = ref(false);
const router = useRouter();
const id = useRoute().params.id as string;
const streamName = ref('');
const dr = ref<[number, number]>([Date.now(), Date.now()]);
const streamList = ref([]);
function setToday() {
  dr.value = [Date.now(), Date.now()];
}
function setYesterday() {
  dr.value = [Date.now() - 24 * 3600 * 1000, Date.now() - 24 * 3600 * 1000];
}
function getStreamDir(time: number) {
  return (new Date(time - (new Date().getTimezoneOffset() * 60000))).toISOString().replace(/\.[^\.]+Z/, '');
}
const handleQuery = () => {
  getStreamList(id, streamName.value, dr.value.join("-")).then(res => {
    res = YAML.parse(res);
    if (res)
      streamList.value = res;
    else streamList.value = [];
  });
};
const columns: TableColumn<{ time: number, path: string; }>[] = [
  { title: '流名称', key: 'path' },
  {
    title: '流创建时间', key: 'time',
    render(row) {
      return h('span', {}, (new Date(row.time)).toLocaleString());
    }
  },
  {
    title: '操作',
    key: 'action',
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () => detail(row)
        },
        { default: () => '详情' }
      );
    }
  }
];
function detail(row) {
  router.push({ name: 'monitor-detail', params: { stream: row.path + "/" + getStreamDir(row.time) } });
}
</script>

<style scoped>
.query-bar {
  display: flex;
  align-items: left;
  justify-content: space-between;
  padding: 16px;
  background-color: #f7f7f7;
}

.input-field {
  width: 400px;
}
</style>
