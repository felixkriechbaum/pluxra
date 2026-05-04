<template>
  <div class="p-3">
    <h3 class="font-semibold text-sm">{{ config.city }}</h3>
    <div v-if="weather" class="text-2xl font-bold">{{ (weather as any).temp }}°</div>
    <p v-else class="text-xs text-muted-foreground">Loading...</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ config: { city: string; units: string } }>()
const { data: weather } = useFetch(
  () => `/api/weather?city=${encodeURIComponent(props.config.city)}&units=${props.config.units}`,
)
</script>
