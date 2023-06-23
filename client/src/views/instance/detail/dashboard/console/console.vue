<template>
  <div class="console">
    <!-- <div class="top">
      <Interval @tick="tick" />
    </div> -->
    <!--数据卡片-->
    <n-grid cols="1 s:2 m:3 l:3 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8">
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
              <div>启动时间： <n-time :time="new Date(StartTime)" type="relative" /></div>
            </div>
          </div>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard
          title="资源使用"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false">
          <div class="py-1 px-1 flex justify-between">
            <TimelineGraph :value="tlds" />
          </div>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard
          title="流数量"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false">
          <div class="py-1 px-1 flex justify-between">
            <TimelineGraph :value="tldsStream" />
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
                <n-grid cols="2 s:1 m:1 l:1 xl:2 2xl:2" responsive="screen" :x-gap="12" :y-gap="8">
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
                </n-grid>
                <n-table :single-line="false">
                  <thead>
                    <tr>
                      <td style="width: 20%">网卡</td>
                      <td style="width: 20%">接收总bit</td>
                      <td style="width: 20%">发送总bit</td>
                      <td style="width: 20%">接收速率</td>
                      <td style="width: 20%">发送速率</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in NetWork" :key="item.Name">
                      <td>{{ item.Name }}</td>
                      <td>{{ BitStr(item.Receive) }}</td>
                      <td>{{ BitStr(item.Sent) }}</td>
                      <td>{{ BPSStr(item.ReceiveSpeed) }}</td>
                      <td>{{ BPSStr(item.SentSpeed) }}</td>
                    </tr>
                  </tbody>
                </n-table>
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
  import { useRoute, onBeforeRouteLeave } from 'vue-router'
  import { getSysInfo } from '@/api/instance'
  import TimelineGraph from '@/components/TimelineGraph.vue'
  const loading = ref(true)
  const summary = ref({})
  const NetWork = ref<
    { Name: string; Receive: number; Sent: number; ReceiveSpeed: number; SentSpeed: number }[]
  >([])

  const CPUUsage = ref('')
  const HardDiskUsage = ref('')
  const MemoryUsage = ref('')
  const Version = ref('')
  const StartTime = ref('')
  const tlds = ref<number[]>([])
  const tldsStream = ref<number[]>([])
  const tldsNetWorkSent = ref<number[]>([])
  const tldsNetWorkRec = ref<number[]>([])
  function BPSStr(bps: number) {
    if (bps > 1024 * 1024) return (bps / 1024 / 1024).toFixed(2) + ' mb/s'
    if (bps > 1024) return (bps / 1024).toFixed(2) + ' kb/s'
    return bps.toString() + ' b/s'
  }
  function BitStr(bits: number) {
    if (bits > 1024 * 1024) return (bits / 1024 / 1024).toFixed(2) + ' mb'
    if (bits > 1024) return (bits / 1024).toFixed(2) + ' kb'
    return bits.toString() + ' b'
  }
  const id = useRoute().params.id as string
  let es: EventSource
  onMounted(async () => {
    const info = await getSysInfo(id)
    StartTime.value = info.StartTime
    Version.value = info.Version
    es = new EventSource('/api/summary?m7sid=' + id)
    es.onmessage = tick
  })
  onBeforeRouteLeave(() => {
    es?.close()
  })
  async function tick(event) {
    const r = JSON.parse(event.data)
    tlds.value = [r.CPUUsage || 0, r.HardDisk?.Usage || 0, r.Memory?.Usage || 0]
    tldsStream.value = [r.Streams?.length || 0]
    summary.value = r
    CPUUsage.value = r.CPUUsage?.toFixed(2) + '%'
    HardDiskUsage.value = r.HardDisk?.Usage?.toFixed(2) + '%'
    MemoryUsage.value = r.Memory?.Usage?.toFixed(2) + '%'
    const networks = (r.NetWork || []).filter((item) => item.Receive != 0 && item.Sent != 0)
    NetWork.value = networks
    tldsNetWorkRec.value = networks.map((item) => item.ReceiveSpeed)
    tldsNetWorkSent.value = networks.map((item) => item.SentSpeed)
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
