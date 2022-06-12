<template>
  <div class="console">
    <InstanceSelect />
    <!--数据卡片-->
    <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item>
        <NCard
          title="基本信息"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <div class="py-1 px-1 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <div v-else>
              <div>
                版本号： <span class="text-1xl">{{ Version }}</span>
              </div>
              <div>
                启动时间： <span class="text-1xl">{{ StartTime }}</span>
              </div>
            </div>
          </div>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard
          title="cpu使用情况"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <div class="py-1 px-1 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <div v-else class="text-3xl">{{ CPUUsage }}</div>
          </div>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard
          title="内存使用"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <div class="py-1 px-1 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <div v-else class="text-3xl">{{ MemoryUsage }}</div>
          </div>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard
          title="硬盘使用"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <div class="py-1 px-1 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <div v-else class="text-3xl">{{ HardDiskUsage }}</div>
          </div>
        </NCard>
      </n-grid-item>
    </n-grid>
    <VisiTab />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, reactive } from 'vue';
  import VisiTab from './components/VisiTab.vue';
  import { CountTo } from '@/components/CountTo/index';
  import router from '@/router';
  import {
    getInstanceSummary,
    getInstanceList,
    getSysInfo
  } from '@/api/instance'

  import {
    UnorderedListOutlined
  } from '@vicons/antd';

  const loading = ref(true);
  const list = ref([]);
  const summary = ref({})
  const NetWork = ref([])

  // 图标列表
  const iconList = [
    {
      icon: UnorderedListOutlined,
      size: '32',
      title: '实例列表',
      color: '#69c0ff'
    }
  ];

  const CPUUsage = ref('')
  const HardDiskUsage = ref('')
  const MemoryUsage = ref('')
  const info = ref({})
  const Version = ref('')
  const StartTime = ref('')

  function deal(item) {
    const { title } = item
    if (title == '实例列表') {
      goList()
    }
  }
  function goList() {
    router.push({
      name: 'instance_list'
    })
  }

  onMounted(async () => {
    const pagesize = 0
    const pageno = 0
    const s =  await getInstanceList({ pagesize, pageno })
    const r = await getInstanceSummary()
    const info = await getSysInfo()
    StartTime.value = info.StartTime
    Version.value = info.Version
    summary.value = r
    CPUUsage.value = r.CPUUsage.toFixed(2) + '%';
    HardDiskUsage.value = r.HardDisk.Usage.toFixed(2) + '%';
    MemoryUsage.value = r.Memory.Usage.toFixed(2) + '%';
    NetWork.value = r.NetWork
    list.value = s.data.list;
    loading.value = false;
  });
</script>

<style lang="less" scoped></style>
