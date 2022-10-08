<template>
  <div class="logo">
    <icon-local-logo />
    <img src="~@/assets/imgs/logo.png" class="icon" :class="{ 'mr-2': !collapsed }" alt="" />
    <h2 v-show="!collapsed" class="title">Monibuca</h2>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    props: {
      collapsed: {
        type: Boolean
      }
    }
  }
</script>

<style lang="less" scoped>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    .icon {
      width: auto;
      height: 32px;
    }

    .title {
      margin-bottom: 0;
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>
