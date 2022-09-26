<template>
  <NConfigProvider
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </NConfigProvider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { lighten } from '@/utils/index'
  import { zhCN, dateZhCN, darkTheme } from 'naive-ui'
  import { AppProvider } from '@/components/Application'
  import { useDesignSettingStore } from '@/store/modules/designSetting'

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
</script>

<style lang="less">
  @import 'styles/less/index.less';
</style>
