<template>
  <n-grid :x-gap="24">
    <n-grid-item span="6">
      <n-list>
        <n-list-item>
          <n-thing
            class="thing-cell"
            v-for="item in typeTabList"
            :key="item.key"
            :class="{ 'thing-cell-on': type === item.key }"
            @click="switchType(item)">
            <template #header>{{ item.name }}</template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-grid-item>
    <n-grid-item span="18">
      <n-card :bordered="false" size="small" :title="typeTitle" class="proCard">
        <BasicSetting v-if="type === 1" />
        <PM2 v-if="type === 2" />
      </n-card>
    </n-grid-item>
  </n-grid>
</template>
<script lang="ts" setup>
  import { useUserStore } from '@/store'
  import { useMessage, useDialog } from 'naive-ui'
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import BasicSetting from './BasicSetting.vue'
  const typeTabList = [
    {
      name: '修改密码',
      key: 1
    },
    {
      name: '修改昵称',
      key: 2
    },
    {
      name: '退出登录',
      key: 3
    }
  ]

  const type = ref(1)
  const typeTitle = ref('修改密码')
  const message = useMessage()
  const userStore = useUserStore()
  const dialog = useDialog()
  const router = useRouter()
  const route = useRoute()
  // 退出登录
  function doLogout() {
    dialog.info({
      title: '提示',
      content: '您确定要退出登录吗',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        userStore.logout().then(() => {
          message.success('成功退出登录')
          // 移除标签页
          localStorage.removeItem('TABS-ROUTES')
          router.replace({
            name: 'Login',
            query: {
              redirect: route.fullPath
            }
          })
        })
      },
      onNegativeClick: () => {}
    })
  }
  function switchType(e) {
    if (e.key == 3) {
      doLogout()
    } else {
      type.value = e.key
      typeTitle.value = e.name
    }
  }
</script>
<style lang="less" scoped>
  .thing-cell {
    margin: 12px;
    margin-top: 0px;
    padding: 15px;

    &:hover {
      background: #f0faff;
      cursor: pointer;
    }
  }

  .thing-cell-on {
    background: #f0faff;

    ::v-deep(.n-thing-main .n-thing-header .n-thing-header__title) {
      color: #2d8cf0;
    }
  }
</style>
