<template>
  <div ref="containerEl" class="flex flex-col items-center justify-center h-full p-3 gap-2">
    <p v-if="!config.city" class="text-xs text-muted-foreground">Configure city in settings.</p>
    <p v-else-if="error" class="text-xs text-destructive">{{ (error as any).data?.message || (error as any).message }}</p>
    <template v-else-if="weather">

      <!-- Main content: horizontal or vertical based on aspect ratio -->
      <div
        class="flex items-center justify-center gap-4 flex-1 min-h-0 min-w-0 w-full"
        :style="{ flexDirection: isHorizontal ? 'row' : 'column' }"
      >
        <!-- Icon + temp block -->
        <div class="flex items-center gap-3 shrink-0">
          <span :style="{ fontSize: sz.icon }">{{ weatherIcon(weather.code) }}</span>
          <div class="flex flex-col" :style="{ alignItems: isHorizontal ? 'flex-start' : 'center' }">
            <span class="font-semibold tracking-tight" :style="{ fontSize: sz.city }">{{ weather.city }}</span>
            <span class="font-bold tracking-tighter leading-none" :style="{ fontSize: sz.temp }">{{ weather.temp }}°{{ unitSuffix }}</span>
            <span class="text-muted-foreground" :style="{ fontSize: sz.small }">{{ weather.tempMin }}° / {{ weather.tempMax }}°</span>
          </div>
        </div>

        <!-- Stats + hourly -->
        <div class="flex flex-col gap-1 min-w-0">
          <div class="flex gap-3 flex-wrap" :style="{ fontSize: sz.small, justifyContent: isHorizontal ? 'flex-start' : 'center' }">
            <span v-if="config.showHumidity !== false" class="text-muted-foreground">💧 {{ weather.humidity }}%</span>
            <span v-if="config.showWind !== false" class="text-muted-foreground">💨 {{ weather.windCurrent }} {{ windUnit }}</span>
            <span v-if="config.showWindDetail" class="text-muted-foreground">↓{{ weather.windMin }} ↑{{ weather.windMax }} {{ windUnit }}</span>
          </div>

          <div
            v-if="config.showHourly !== false && weather.hourly?.length && scale > 0.5"
            class="flex gap-3 scrollbar-hide"
            :style="{ flexDirection: isHorizontal ? 'row' : 'column', alignItems: 'center', overflowX: isHorizontal ? 'auto' : 'visible', overflowY: isHorizontal ? 'visible' : 'auto' }"
          >
            <div
              v-for="h in weather.hourly"
              :key="h.hour"
              class="flex items-center gap-0.5 shrink-0"
              :style="{ flexDirection: isHorizontal ? 'column' : 'row' }"
            >
              <span class="text-muted-foreground" :style="{ fontSize: sz.small }">{{ h.hour }}</span>
              <span :style="{ fontSize: sz.hourlyIcon }">{{ weatherIcon(h.code) }}</span>
              <span class="font-medium" :style="{ fontSize: sz.small }">{{ h.temp }}°</span>
            </div>
          </div>
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
  const el = containerEl.value
  if (!el) return
  const ro = new ResizeObserver(([entry]) => {
    width.value = entry.contentRect.width
    height.value = entry.contentRect.height
  })
  ro.observe(el.parentElement ?? el)
  onUnmounted(() => ro.disconnect())
})

const isHorizontal = computed(() => width.value >= height.value)
const scale = computed(() => {
  // use the smaller dimension so content never overflows either axis
  const constraining = Math.min(width.value, height.value)
  return Math.max(0.3, Math.min(3, constraining / 200))
})

function rem(base: number) {
  return `${(base * scale.value).toFixed(3)}rem`
}

const sz = computed(() => ({
  icon:       rem(2.2),
  city:       rem(0.8),
  temp:       rem(2.2),
  small:      rem(0.72),
  hourlyIcon: rem(1.3),
}))

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
