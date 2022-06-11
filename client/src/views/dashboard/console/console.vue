<template>
  <div class="console">
    <!--数据卡片-->
    <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item>
        <NCard
          title="实例"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <template #header-extra>
            <!-- <n-tag type="success">日</n-tag> -->
          </template>
          <div class="py-1 px-1 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <CountTo v-else :startVal="1" :endVal="list.length" class="text-3xl" @click="goList" />
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
    
    <!--导航卡片-->
    <div class="mt-4">
      <n-grid cols="1 s:2 m:3 l:8 xl:8 2xl:8" responsive="screen" :x-gap="16" :y-gap="8">
        <n-grid-item v-for="(item, index) in iconList" :key="index" @click="deal(item)">
          <NCard content-style="padding-top: 0;" size="small" :bordered="false">
            <template #footer>
              <n-skeleton v-if="loading" size="medium" />
              <div class="cursor-pointer" v-else>
                <p class="flex justify-center">
                  <span>
                    <n-icon :size="item.size" class="flex-1" :color="item.color">
                      <component :is="item.icon" />
                    </n-icon>
                  </span>
                </p>
                <p class="flex justify-center"
                  ><span>{{ item.title }}</span></p
                >
              </div>
            </template>
          </NCard>
        </n-grid-item>
      </n-grid>
    </div>

    <!--访问量 | 流量趋势-->
    <VisiTab />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import VisiTab from './components/VisiTab.vue';
  import { CountTo } from '@/components/CountTo/index';
  import router from '@/router';
  import {
    getInstanceSummary,
    getInstanceList
  } from '@/api/instance'

  import {
    UnorderedListOutlined
  } from '@vicons/antd';

  const loading = ref(true);
  const list = ref([]);
  const summary = ref({})

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
    const r = await getInstanceSummary({ pagesize, pageno })
    summary.value = r
    CPUUsage.value = r.CPUUsage.toFixed(2) + '%';
    HardDiskUsage.value = r.HardDisk.Usage.toFixed(2) + '%';
    MemoryUsage.value = r.Memory.Usage.toFixed(2) + '%';
    list.value = s.data.list;
    loading.value = false;
  });
</script>

<style lang="less" scoped></style>
