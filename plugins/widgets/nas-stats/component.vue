<template>
  <div class="p-3 space-y-1">
    <h3 class="font-semibold text-sm">{{ config.title }}</h3>
    <div v-if="liveData" class="text-xs space-y-0.5">
      <div>CPU: {{ (liveData as any).cpu }}%</div>
      <div>RAM: {{ (liveData as any).ram }}%</div>
      <div>Disk: {{ (liveData as any).disk }}%</div>
    </div>
    <p v-else class="text-xs text-muted-foreground">Waiting for data...</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ config: { title: string }; widgetId: string }>()
const { data: liveData } = useSse(props.widgetId)
</script>
