<template>
  <div class="mt-4">
    <NRow :gutter="24">
      <NCol :span="24">
        <n-card content-style="padding: 0;" :bordered="false">
          <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
            <!-- <n-tab-pane name="cpu使用情况">
              <CPU />
            </n-tab-pane>
            <n-tab-pane name="内存使用">
              <CPU />
            </n-tab-pane>
            <n-tab-pane name="存储使用">
              <HardDisk />
            </n-tab-pane> -->
            <n-tab-pane name="网络" class="pane">
              <n-card :title="item.Name" v-for="item in net">
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
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue'
  import CPU from './CPU.vue'
  import HardDisk from './HardDisk.vue'
  import NetWork from './NetWork.vue'
  import { getInstanceSummary } from '@/api/instance'
  export default defineComponent({
    components: { CPU, HardDisk, NetWork },
    setup() {
      const net = ref([])
      onMounted(async () => {
        const r = await getInstanceSummary()
        const f = r.NetWork
        net.value = f.filter((item) => item.Receive != 0 && item.Sent != 0)
      })
      return {
        net
      }
    }
  })
</script>

<style lang="less">
  .pane {
    display: flex;
  }
</style>
