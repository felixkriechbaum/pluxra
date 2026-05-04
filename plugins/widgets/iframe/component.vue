<template>
  <iframe :src="config.url" class="w-full h-full border-0" sandbox="allow-scripts allow-same-origin" />
</template>

<script setup lang="ts">
defineProps<{ config: { url: string; title: string } }>()
</script>
