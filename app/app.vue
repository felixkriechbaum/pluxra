<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({ title: 'pluxra', titleTemplate: '%s' })
const { initTheme } = useTheme()
onMounted(initTheme)
</script>
