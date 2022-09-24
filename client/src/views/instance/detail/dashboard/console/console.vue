<template>
  <div class="console">
    <div class="top">
      <InstanceSelect />
      <Interval @tick="tick" />
    </div>
    <!--数据卡片-->
    <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item>
        <NCard
          title="基本信息"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false">
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
          :bordered="false">
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
          :bordered="false">
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
          :bordered="false">
          <div class="py-1 px-1 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <div v-else class="text-3xl">{{ HardDiskUsage }}</div>
          </div>
        </NCard>
      </n-grid-item>
    </n-grid>
    <div class="mt-4">
      <NRow :gutter="24">
        <NCol :span="24">
          <n-card content-style="padding: 0;" :bordered="false">
            <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
              <n-tab-pane name="网络" class="pane">
                <n-card :title="item.Name" v-for="item in NetWork">
                  <div>Receive: {{ item.Receive }}</div>
                  <div>Sent: {{ item.Sent }}</div>
                  <div>ReceiveSpeed: {{ item.ReceiveSpeed }}</div>
                  <div>SentSpeed: {{ item.SentSpeed }}</div>
                </n-card>
                <!-- <NetWork /> -->
              </n-tab-pane>
            </n-tabs>
          </n-card>
        </NCol>
      </NRow>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { getInstanceSummary, getInstanceList, getSysInfo } from '@/api/instance'
  import { Interval } from '@/components/Interval'
  import { InstanceSelect } from '@/components/InstanceSelect'

  const loading = ref(true)
  const list = ref([])
  const summary = ref({})
  const NetWork = ref<
    { Name: string; Receive: string; Sent: string; ReceiveSpeed: string; SentSpeed: string }[]
  >([])

  const CPUUsage = ref('')
  const HardDiskUsage = ref('')
  const MemoryUsage = ref('')
  const Version = ref('')
  const StartTime = ref('')

  function BPSStr(bps: number) {
    if (bps > 1024 * 1024) return (bps / 1024 / 1024).toFixed(2) + ' mb/s'
    if (bps > 1024) return (bps / 1024).toFixed(2) + ' kb/s'
    return bps.toString() + ' b/s'
  }
  async function tick() {
    const pagesize = 0
    const pageno = 0
    const s = await getInstanceList({ pagesize, pageno })
    const r = await getInstanceSummary()
    const info = await getSysInfo()
    StartTime.value = info.StartTime
    Version.value = info.Version
    summary.value = r
    CPUUsage.value = r.CPUUsage?.toFixed(2) + '%'
    HardDiskUsage.value = r.HardDisk?.Usage?.toFixed(2) + '%'
    MemoryUsage.value = r.Memory?.Usage?.toFixed(2) + '%'
    NetWork.value = r.NetWork?.filter((item) => item.Receive != 0 && item.Sent != 0).map((x) => {
      return {
        Name: x.Name,
        Receive: BPSStr(x.Receive),
        Sent: BPSStr(x.Sent),
        ReceiveSpeed: BPSStr(x.ReceiveSpeed),
        SentSpeed: BPSStr(x.SentSpeed)
      }
    })
    list.value = s.data.list
    loading.value = false
  }
</script>

<style lang="less" scoped>
  .top {
    display: flex;
  }

  .pane {
    display: flex;
  }
</style>
