<template>
  <div class="p-3 flex flex-col gap-1 h-full">
    <p v-if="!config.city" class="text-xs text-muted-foreground">Configure city in settings.</p>
    <template v-else-if="error">
      <p class="text-xs text-destructive">{{ (error as any).data?.message || error.message }}</p>
    </template>
    <template v-else-if="weather">
      <h3 class="font-semibold text-sm leading-none">{{ config.city }}</h3>
      <div class="text-3xl font-bold tracking-tight">{{ weather.temp }}°{{ config.units === 'imperial' ? 'F' : 'C' }}</div>
      <div class="flex gap-3 text-xs text-muted-foreground mt-auto">
        <span>💨 {{ weather.wind }} {{ config.units === 'imperial' ? 'mph' : 'km/h' }}</span>
        <span>💧 {{ weather.humidity }}%</span>
      </div>
    </template>
    <p v-else class="text-xs text-muted-foreground">Loading...</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  config: { city: string; units: string; provider?: string; apiKey?: string }
}>()

const { data: weather, error } = useFetch(
  () => `/api/weather?city=${encodeURIComponent(props.config.city)}&units=${props.config.units}&provider=${props.config.provider ?? 'open-meteo'}&apiKey=${encodeURIComponent(props.config.apiKey ?? '')}`,
  { immediate: !!props.config.city },
)
</script>
