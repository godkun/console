<template>
  <NConfigProvider :locale="zhCN" :theme="getDarkTheme" :theme-overrides="getThemeOverrides" :date-locale="dateZhCN">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { zhCN, dateZhCN, darkTheme } from 'naive-ui'
import { AppProvider } from '@/components/Application'
import { useDesignSettingStore } from '@/store/modules/designSetting'
import { lighten } from '@/utils/index'

const designStore = useDesignSettingStore()

/**
 * naive-ui 主题配置覆盖
 * @type import('naive-ui').GlobalThemeOverrides
 */
const getThemeOverrides = computed(() => {
  const appTheme = designStore.appTheme
  const lightenStr = lighten(designStore.appTheme, 6)
  return {
    common: {
      primaryColor: appTheme,
      primaryColorHover: lightenStr,
      primaryColorPressed: lightenStr
    },
    LoadingBar: {
      colorLoading: appTheme
    }
  }
})

const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined))
const ws = new WebSocket('ws://124.223.73.152:9999/test')

ws.onopen = function () {
  ws.send('发送数据')
};

setInterval(() => {
  ws.send('发送数据')
}, 2000)

// 接收服务端数据时触发事件
ws.onmessage = function (evt) {
  console.log('数据已接收...', evt.data)
};

ws.onclose = function () {
  console.log('连接已关闭...')
}
</script>

<style lang="less">
@import 'styles/index.less';
</style>
