<template>
  <div v-if="noPlugin">
    <n-alert title="当前页面不可用" type="error"> 当前实例未安装插件，无法使用此功能 </n-alert>
  </div>
  <div v-else>
    <div class="top">
      <Interval @tick="tick" />
    </div>
    <n-card :bordered="false" class="proCard">
      <BasicTable
        class="table"
        :row-class-name="'row'"
        :columns="columns(params.id as string)"
        :dataSource="streamData"
        :pagination="false"
        :row-key="(row) => row.id"
        :scroll-x="1090">
        <template #tableTitle>
          <n-gradient-text type="success"> GB28181 </n-gradient-text>
        </template>
      </BasicTable>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { BasicTable } from '@/components/Table'
  import { Interval } from '@/components/interval'
  import { columns } from './columns'
  import { getInstanceGB } from '@/api/instance'
  import { useRoute } from 'vue-router'
  import { usePluginConfigStore } from '@/store/modules/pluginConfig'
  const streamData = ref([])
  const { params } = useRoute()
  const configStore = usePluginConfigStore()
  const noPlugin = ref(false)
  configStore.getConfig(params.id as string, 'GB28181').catch((err) => {
    noPlugin.value = true
  })
  async function tick() {
    const r = await getInstanceGB(params.id as string)
    streamData.value = r
  }
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
