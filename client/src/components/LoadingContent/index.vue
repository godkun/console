<template></template>
<script lang="ts">
  import { useLoadingBar } from 'naive-ui'

  export default {
    name: 'LoadingContent',
    setup() {
      window.$loadingBar = useLoadingBar()
    }
  }
</script>
