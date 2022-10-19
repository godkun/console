<template>
  <div class="user">
    <video width="320" height="240"></video>
    <div class="title">{{ title }}</div>
  </div>
</template>
<script setup lang="ts">
  import { defineProps } from 'vue'
  defineProps<{ title: string }>()
</script>
<style scoped>
  .user {
    width: 320px;
    height: 240px;
    border: 1px solid gray;
    position: relative;
    color: white;
    background-color: black;
  }
  .title {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .user video {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
