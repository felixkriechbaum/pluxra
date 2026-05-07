<template>
  <div ref="containerEl" class="flex flex-col items-center justify-center h-full p-3 gap-2">
    <p v-if="!config.city" class="text-xs text-muted-foreground">Configure city in settings.</p>
    <p v-else-if="error" class="text-xs text-destructive">{{ (error as any).data?.message || (error as any).message }}</p>
    <template v-else-if="weather">

      <!-- Row 1: icon + city + temp + min/max + stats -->
      <div class="flex flex-row items-center justify-center gap-3 flex-wrap">
        <span :style="{ fontSize: iconSize }">{{ weatherIcon(weather.code) }}</span>
        <div class="flex flex-col items-center">
          <span class="font-semibold tracking-tight" :style="{ fontSize: citySize }">{{ weather.city }}</span>
          <span class="font-bold tracking-tighter leading-none" :style="{ fontSize: tempSize }">{{ weather.temp }}°{{ unitSuffix }}</span>
          <span class="text-muted-foreground" :style="{ fontSize: smallSize }">{{ weather.tempMin }}° / {{ weather.tempMax }}°</span>
        </div>
        <div class="flex flex-col gap-0.5" :style="{ fontSize: smallSize }">
          <span v-if="config.showHumidity !== false" class="text-muted-foreground">💧 {{ weather.humidity }}%</span>
          <span v-if="config.showWind !== false" class="text-muted-foreground">💨 {{ weather.windCurrent }} {{ windUnit }}</span>
          <span v-if="config.showWindDetail" class="text-muted-foreground">↓{{ weather.windMin }} ↑{{ weather.windMax }} {{ windUnit }}</span>
        </div>
      </div>

      <!-- Row 2: hourly forecast -->
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
          <span class="text-muted-foreground" :style="{ fontSize: smallSize }">{{ h.hour }}</span>
          <span :style="{ fontSize: hourlyIconSize }">{{ weatherIcon(h.code) }}</span>
          <span class="font-medium" :style="{ fontSize: smallSize }">{{ h.temp }}°</span>
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
  const w = width.value
  const h = height.value
  const dim = h < 160 ? Math.min(w, h) : w
  if (dim < 200) return 'xs'
  if (dim < 320) return 'sm'
  if (dim < 500) return 'md'
  if (dim < 700) return 'lg'
  return 'xl'
})

// Inline styles so Tailwind purging is never an issue
const scales = {
  xs: { icon: '2rem',   city: '0.65rem', temp: '1.5rem',  small: '0.6rem',  hourlyIcon: '1.1rem' },
  sm: { icon: '2.75rem', city: '0.75rem', temp: '2rem',    small: '0.7rem',  hourlyIcon: '1.4rem' },
  md: { icon: '4rem',   city: '0.9rem',  temp: '2.75rem', small: '0.8rem',  hourlyIcon: '1.8rem' },
  lg: { icon: '5.5rem', city: '1.1rem',  temp: '4rem',    small: '0.95rem', hourlyIcon: '2.2rem' },
  xl: { icon: '8rem',   city: '1.4rem',  temp: '6rem',    small: '1.1rem',  hourlyIcon: '3rem'   },
}

const iconSize       = computed(() => scales[size.value].icon)
const citySize       = computed(() => scales[size.value].city)
const tempSize       = computed(() => scales[size.value].temp)
const smallSize      = computed(() => scales[size.value].small)
const hourlyIconSize = computed(() => scales[size.value].hourlyIcon)

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
