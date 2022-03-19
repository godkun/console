<template>
  <div class="nav">
    <div class="nav-l">
      <div class="p1" @click="go">图标</div>
      <div class="p2">ui控制台</div>
    </div>
    <div class="nav-r">
      <div class="1">账户</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { useStore } = useNuxtApp();
const store = useStore();
function go() {
  store.toogleCollpase()
}
</script>

<style lang="less" scoped src="./index.less"></style>