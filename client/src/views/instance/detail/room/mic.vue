<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 20 20">
    <defs>
      <linearGradient id="volume" x1="0%" y1="60%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="cyan" stop-opacity="1" />
        <stop :offset="volume + '%'" stop-color="cyan" stop-opacity="1" />
        <stop :offset="volume + 0.1 + '%'" stop-color="cyan" stop-opacity="0" />
        <stop offset="100%" stop-color="cyan" stop-opacity="0" />
      </linearGradient>
    </defs>
    <g>
      <template v-if="hasMic && !muted">
        <path
          d="M5.5 10a.5.5 0 0 0-1 0a5.5 5.5 0 0 0 5 5.478V17.5a.5.5 0 0 0 1 0v-2.022a5.5 5.5 0 0 0 5-5.478a.5.5 0 0 0-1 0a4.5 4.5 0 1 1-9 0zm7.5 0a3 3 0 0 1-6 0V5a3 3 0 0 1 6 0v5z"
          fill="url(#volume)" />
        <path
          d="M10 13a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm0-1a2 2 0 0 1-2-2V5a2 2 0 1 1 4 0v5a2 2 0 0 1-2 2zM5 9.5a.5.5 0 0 1 .5.5a4.5 4.5 0 1 0 9 0a.5.5 0 0 1 1 0a5.5 5.5 0 0 1-5 5.478V17.5a.5.5 0 0 1-1 0v-2.022A5.5 5.5 0 0 1 4.5 10a.5.5 0 0 1 .5-.5z"
          fill="currentColor" />
      </template>
      <path
        v-else-if="hasMic"
        d="M12 5v4.879l.898.898c.067-.248.102-.508.102-.777V5a3 3 0 0 0-5.998-.119L8 5.879V5a2 2 0 1 1 4 0zM7 7.707L2.146 2.854a.5.5 0 1 1 .708-.708l15 15a.5.5 0 0 1-.708.708l-3.627-3.627a5.475 5.475 0 0 1-3.019 1.25V17.5a.5.5 0 0 1-1 0v-2.022A5.5 5.5 0 0 1 4.5 10a.5.5 0 0 1 1 0a4.5 4.5 0 0 0 7.309 3.516l-1.07-1.07A3 3 0 0 1 7 10V7.706zm4.016 4.016L8 8.707V10a2 2 0 0 0 3.016 1.723zm3.787.959l-.742-.742A4.481 4.481 0 0 0 14.5 10a.5.5 0 0 1 1 0c0 .974-.253 1.888-.697 2.682z"
        fill="currentColor" />
      <path
        v-else
        d="M9 13c.07 0 .14-.002.21-.007c.11-.387.26-.757.448-1.104A2 2 0 0 1 7 10V5.001a2 2 0 1 1 4 0v5c0 .092-.006.183-.018.272c.312-.26.653-.486 1.018-.672V5a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm-4.5-3A4.5 4.5 0 0 0 9 14.5c0 .819.179 1.596.5 2.294v.706a.5.5 0 0 1-1 0v-2.022A5.5 5.5 0 0 1 3.5 10a.5.5 0 0 1 1 0zm10 9a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9zm0-8a3.5 3.5 0 0 0-2.803 5.596l4.9-4.9A3.484 3.484 0 0 0 14.5 11zm-2.096 6.303a3.5 3.5 0 0 0 4.9-4.9l-4.9 4.9z"
        fill="currentColor" />
    </g>
  </svg>
</template>
<script setup lang="ts">
  defineProps<{
    hasMic: boolean
    muted: boolean
    volume: number
  }>()
</script>
