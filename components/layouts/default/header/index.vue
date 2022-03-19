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
function go() {
  const collapse = useCollapse()
  console.log("🚀 ~ file: index.vue ~ line 16 ~ go ~ collapse", collapse.value)
  useCollapse(!collapse.value)
}
</script>

<style lang="less" scoped src="./index.less"></style>