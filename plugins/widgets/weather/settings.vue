<template>
  <div class="space-y-4">
    <div class="space-y-3">
      <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Data source</h3>
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
          <option value="metric">Metric (°C, km/h)</option>
          <option value="imperial">Imperial (°F, mph)</option>
        </select>
      </div>
    </div>

    <div class="space-y-2">
      <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Show / hide</h3>
      <label v-for="toggle in toggles" :key="toggle.key" class="flex items-center justify-between py-1 cursor-pointer">
        <span class="text-sm">{{ toggle.label }}</span>
        <input type="checkbox" :checked="local[toggle.key] !== false" class="cursor-pointer" @change="local[toggle.key] = ($event.target as HTMLInputElement).checked" />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  modelValue: {
    city: string
    units: string
    provider?: string
    apiKey?: string
    showHumidity?: boolean
    showWind?: boolean
    showWindDetail?: boolean
    showHourly?: boolean
  }
}>()
const emit = defineEmits<{ 'update:modelValue': [v: typeof props.modelValue] }>()
const local = reactive({
  provider: 'open-meteo',
  apiKey: '',
  showHumidity: true,
  showWind: true,
  showWindDetail: false,
  showHourly: true,
  ...props.modelValue,
})
watch(local, v => emit('update:modelValue', { ...v }), { deep: true })

const toggles = [
  { key: 'showHumidity' as const, label: 'Humidity' },
  { key: 'showWind' as const, label: 'Current wind' },
  { key: 'showWindDetail' as const, label: 'Wind min/max' },
  { key: 'showHourly' as const, label: 'Hourly forecast' },
]
</script>
