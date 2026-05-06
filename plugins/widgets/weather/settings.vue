<template>
  <div class="space-y-3">
    <div>
      <Label>Provider</Label>
      <select v-model="local.provider" class="w-full border rounded px-2 py-1 text-sm bg-background">
        <option value="open-meteo">Open-Meteo (free, no key)</option>
        <option value="openweathermap">OpenWeatherMap (free tier)</option>
        <option value="weatherapi">WeatherAPI (free tier)</option>
      </select>
    </div>
    <div v-if="local.provider !== 'open-meteo'">
      <Label>API Key</Label>
      <Input v-model="local.apiKey" placeholder="Your API key" />
    </div>
    <div>
      <Label>City</Label>
      <Input v-model="local.city" placeholder="e.g. Vienna" />
    </div>
    <div>
      <Label>Units</Label>
      <select v-model="local.units" class="w-full border rounded px-2 py-1 text-sm bg-background">
        <option value="metric">Metric (°C)</option>
        <option value="imperial">Imperial (°F)</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const props = defineProps<{ modelValue: { city: string; units: string; provider?: string; apiKey?: string } }>()
const emit = defineEmits<{ 'update:modelValue': [v: typeof props.modelValue] }>()
const local = reactive({
  provider: 'open-meteo',
  apiKey: '',
  ...props.modelValue,
})
watch(local, v => emit('update:modelValue', { ...v }), { deep: true })
</script>
