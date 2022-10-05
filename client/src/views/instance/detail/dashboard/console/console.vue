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
        <TimelineGraph :value="tlds" />
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
                <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8">
                  <n-grid-item>
                    <n-card title="接收速率">
                      <TimelineGraph :value="tldsNetWorkRec" />
                    </n-card>
                  </n-grid-item>
                  <n-grid-item>
                    <n-card title="发送速率">
                      <TimelineGraph :value="tldsNetWorkSent" />
                    </n-card>
                  </n-grid-item>
                  <n-grid-item v-for="item in NetWork" :key="item.Name">
                    <n-card :title="item.Name">
                      <div>Receive: {{ item.Receive }}</div>
                      <div>Sent: {{ item.Sent }}</div>
                      <div>ReceiveSpeed: {{ item.ReceiveSpeed }}</div>
                      <div>SentSpeed: {{ item.SentSpeed }}</div>
                    </n-card>
                  </n-grid-item>
                </n-grid>
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
  import { ref, onMounted } from 'vue'
  import { getInstanceSummary, getSysInfo } from '@/api/instance'
  import { Interval } from '@/components/Interval'
  import { InstanceSelect } from '@/components/InstanceSelect'
  import TimelineGraph from '@/components/TimelineGraph.vue'
  const loading = ref(true)
  // const list = ref([])
  const summary = ref({})
  const NetWork = ref<
    { Name: string; Receive: string; Sent: string; ReceiveSpeed: string; SentSpeed: string }[]
  >([])

  const CPUUsage = ref('')
  const HardDiskUsage = ref('')
  const MemoryUsage = ref('')
  const Version = ref('')
  const StartTime = ref('')
  const tlds = ref<number[]>([])
  const tldsNetWorkSent = ref<number[]>([])
  const tldsNetWorkRec = ref<number[]>([])
  function BPSStr(bps: number) {
    if (bps > 1024 * 1024) return (bps / 1024 / 1024).toFixed(2) + ' mb/s'
    if (bps > 1024) return (bps / 1024).toFixed(2) + ' kb/s'
    return bps.toString() + ' b/s'
  }
  onMounted(async () => {
    const info = await getSysInfo()
    StartTime.value = info.StartTime
    Version.value = info.Version
  })
  async function tick() {
    // const pagesize = 0
    // const pageno = 0
    // const s = await getInstanceList({ pagesize, pageno })
    const r = await getInstanceSummary()
    tlds.value = [r.CPUUsage || 0, r.HardDisk?.Usage || 0, r.Memory?.Usage || 0]
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
    tldsNetWorkRec.value = r.NetWork?.map((item) => item.ReceiveSpeed)
    tldsNetWorkSent.value = r.NetWork?.map((item) => item.SentSpeed)
    // list.value = s.data.list
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
