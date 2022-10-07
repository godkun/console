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
  import { ref } from 'vue'
  import BasicSetting from './BasicSetting.vue'
  const typeTabList = [
    {
      name: '修改密码',
      key: 1
    }
  ]

  const type = ref(1)
  const typeTitle = ref('修改密码')

  function switchType(e) {
    type.value = e.key
    typeTitle.value = e.name
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
