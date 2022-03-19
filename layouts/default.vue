<template>
  <el-container class="common-layout">
    <el-aside>
      <LayoutsDefaultMenu />
    </el-aside>
    <el-container>
      <div>
        <LayoutsDefaultHeader />
      </div>
      <el-main>
        <slot></slot>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
  .common-layout {
    min-height: 100vh;
  }
</style>
