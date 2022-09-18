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
            <n-tab-pane name="网络">
              <NetWork />
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </NCol>
    </NRow>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import CPU from './CPU.vue'
  import HardDisk from './HardDisk.vue'
  import NetWork from './NetWork.vue'

  export default defineComponent({
    components: { CPU, HardDisk, NetWork },
    setup() {
      return {}
    }
  })
</script>
