<template>
  <div class="p-3 space-y-1">
    <h3 class="font-semibold text-sm">{{ config.title }}</h3>
    <div v-if="liveData" class="text-xs space-y-0.5">
      <div v-for="(val, key) in (liveData as Record<string, unknown>)" :key="key">
        {{ key }}: {{ val }}{{ suffix }}
      </div>
    </div>
    <p v-else class="text-xs text-muted-foreground">Waiting for data...</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ config: { title: string; yAxisSuffix?: string; yAxisMin?: number; yAxisMax?: number }; widgetId: string }>()
const { data: liveData } = useSse(props.widgetId)
const suffix = computed(() => props.config.yAxisSuffix ?? '%')
</script>
