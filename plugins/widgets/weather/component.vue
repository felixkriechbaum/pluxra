<template>
  <div ref="containerEl" class="flex flex-col items-center justify-center h-full p-3 gap-2">
    <p v-if="!config.city" class="text-xs text-muted-foreground">Configure city in settings.</p>
    <p v-else-if="error" class="text-xs text-destructive">{{ (error as any).data?.message || (error as any).message }}</p>
    <template v-else-if="weather">

      <!-- Row 1: icon + city + temp + min/max + stats -->
      <div class="flex flex-row items-center justify-center gap-3 flex-wrap">
        <span :class="s.icon">{{ weatherIcon(weather.code) }}</span>
        <div class="flex flex-col items-center">
          <span :class="[s.city, 'font-semibold tracking-tight']">{{ weather.city }}</span>
          <span :class="[s.temp, 'font-bold tracking-tighter leading-none']">{{ weather.temp }}°{{ unitSuffix }}</span>
          <span :class="[s.small, 'text-muted-foreground']">{{ weather.tempMin }}° / {{ weather.tempMax }}°</span>
        </div>
        <div class="flex flex-col gap-0.5" :class="s.small">
          <span v-if="config.showHumidity !== false" class="text-muted-foreground">💧 {{ weather.humidity }}%</span>
          <span v-if="config.showWind !== false" class="text-muted-foreground">💨 {{ weather.windCurrent }} {{ windUnit }}</span>
          <span v-if="config.showWindDetail" class="text-muted-foreground">↓{{ weather.windMin }} ↑{{ weather.windMax }} {{ windUnit }}</span>
        </div>
      </div>

      <!-- Row 2: hourly forecast — horizontal normally, vertical when small -->
      <div
        v-if="config.showHourly !== false && weather.hourly?.length && size !== 'xs'"
        class="flex gap-2 overflow-x-auto scrollbar-hide w-full justify-center"
        :class="size === 'sm' ? 'flex-col items-center' : 'flex-row'"
      >
        <div
          v-for="h in weather.hourly"
          :key="h.hour"
          class="flex items-center gap-1 shrink-0"
          :class="size === 'sm' ? 'flex-row' : 'flex-col'"
        >
          <span :class="[s.small, 'text-muted-foreground']">{{ h.hour }}</span>
          <span :class="s.hourlyIcon">{{ weatherIcon(h.code) }}</span>
          <span :class="[s.small, 'font-medium']">{{ h.temp }}°</span>
        </div>
      </div>

    </template>
    <p v-else class="text-xs text-muted-foreground">Loading...</p>
  </div>
</template>

<script setup lang="ts">
import type { WeatherData } from '~/../../server/api/weather.get'

const props = defineProps<{
  config: {
    city: string
    units: string
    provider?: string
    apiKey?: string
    showHumidity?: boolean
    showWind?: boolean
    showWindDetail?: boolean
    showHourly?: boolean
    hour12?: boolean
  }
}>()

const { data: weather, error } = useFetch<WeatherData>(
  () => `/api/weather?city=${encodeURIComponent(props.config.city)}&units=${props.config.units}&provider=${props.config.provider ?? 'open-meteo'}&apiKey=${encodeURIComponent(props.config.apiKey ?? '')}&hour12=${props.config.hour12 ? 'true' : 'false'}`,
  { immediate: !!props.config.city },
)

const unitSuffix = computed(() => props.config.units === 'imperial' ? 'F' : 'C')
const windUnit = computed(() => props.config.units === 'imperial' ? 'mph' : 'km/h')

const containerEl = ref<HTMLElement | null>(null)
const width = ref(0)
const height = ref(0)

onMounted(() => {
  const ro = new ResizeObserver(([entry]) => {
    width.value = entry.contentRect.width
    height.value = entry.contentRect.height
  })
  if (containerEl.value) ro.observe(containerEl.value)
  onUnmounted(() => ro.disconnect())
})

const size = computed(() => {
  const min = Math.min(width.value, height.value)
  if (min < 100) return 'xs'
  if (min < 160) return 'sm'
  if (min < 240) return 'md'
  if (min < 340) return 'lg'
  return 'xl'
})

const s = computed(() => ({
  xs: { icon: 'text-lg',   city: 'text-[10px]', temp: 'text-2xl', small: 'text-[9px]',  hourlyIcon: 'text-xs'  },
  sm: { icon: 'text-2xl',  city: 'text-xs',     temp: 'text-3xl', small: 'text-[10px]', hourlyIcon: 'text-sm'  },
  md: { icon: 'text-3xl',  city: 'text-sm',     temp: 'text-4xl', small: 'text-xs',     hourlyIcon: 'text-base' },
  lg: { icon: 'text-4xl',  city: 'text-base',   temp: 'text-5xl', small: 'text-sm',     hourlyIcon: 'text-lg'  },
  xl: { icon: 'text-5xl',  city: 'text-lg',     temp: 'text-7xl', small: 'text-base',   hourlyIcon: 'text-xl'  },
}[size.value]))

function weatherIcon(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code <= 3) return '☁️'
  if (code <= 49) return '🌫️'
  if (code <= 59) return '🌦️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '❄️'
  if (code <= 82) return '🌧️'
  if (code <= 84) return '🌨️'
  if (code <= 99) return '⛈️'
  if (code >= 200 && code < 300) return '⛈️'
  if (code >= 300 && code < 400) return '🌦️'
  if (code >= 500 && code < 600) return '🌧️'
  if (code >= 600 && code < 700) return '❄️'
  if (code >= 700 && code < 800) return '🌫️'
  if (code === 800) return '☀️'
  if (code > 800) return '☁️'
  return '🌡️'
}
</script>
