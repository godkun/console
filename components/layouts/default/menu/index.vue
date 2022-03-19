<template>
  <div class="menu">
    <el-menu
      default-active="1"
      :collapse="collapse"
    >
      <el-menu-item index="1">
        <el-icon><icon-menu /></el-icon>
        <template #title>列表</template>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><setting /></el-icon>
        <template #title>登录</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'
const collapse = useCollapse()
console.log("🚀 ~ file: index.vue ~ line 25 ~ collapse", collapse)
</script>

<style>
</style>