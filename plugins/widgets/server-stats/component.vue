<template>
  <div class="flex flex-col h-full p-3 gap-2">
    <!-- Header -->
    <div class="flex items-center justify-between shrink-0">
      <span class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{{ config.title }}</span>
      <span v-if="liveData" class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="live" />
    </div>

    <div v-if="!hasData" class="flex-1 flex items-center justify-center">
      <p class="text-xs text-muted-foreground">Waiting for data...</p>
    </div>

    <template v-else>
      <!-- Stat bars (when chart is off) -->
      <div v-if="config.showChart === false" class="flex flex-col gap-1.5 flex-1 justify-center">
        <div v-for="key in visibleKeys" :key="key" class="space-y-0.5">
          <div class="flex justify-between text-[10px]">
            <span class="text-muted-foreground uppercase tracking-wide">{{ key }}</span>
            <span class="font-mono font-medium">{{ currentData[key] }}%</span>
          </div>
          <div class="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="barColor(currentData[key])"
              :style="{ width: `${Math.min(100, currentData[key])}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Chart (when chart is on) -->
      <div v-else-if="history.length > 1" class="flex-1 min-h-0 relative">
        <canvas ref="chartEl" class="absolute inset-0 w-full h-full" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from 'chart.js'
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const props = defineProps<{
  config: { title: string; showChart?: boolean; keys?: string[] }
  widgetId: string
}>()

const { data: liveData } = useSse(props.widgetId)
const { idToken } = useUser()

const { data: historyRaw, refresh } = useFetch<{ payload: Record<string, number>; createdAt: string }[]>(
  () => `/api/widgets/history?widgetId=${props.widgetId}`,
  {
    headers: computed(() => idToken.value ? { Authorization: `Bearer ${idToken.value}` } : {}),
    watch: [idToken],
    default: () => [],
  },
)

const history = computed(() => {
  const base = historyRaw.value ?? []
  if (!liveData.value) return base
  const last = base[base.length - 1]
  const livePayload = liveData.value as Record<string, number>
  if (last && JSON.stringify(last.payload) === JSON.stringify(livePayload)) return base
  const live = { payload: livePayload, createdAt: new Date().toISOString() }
  return [...base.slice(-9), live]
})

const currentData = computed<Record<string, number>>(() => {
  if (liveData.value) return liveData.value as Record<string, number>
  if (history.value.length) return history.value[history.value.length - 1].payload
  return {}
})

const hasData = computed(() => Object.keys(currentData.value).length > 0)

const visibleKeys = computed(() => {
  const keys = props.config.keys?.length ? props.config.keys : Object.keys(currentData.value)
  return keys.filter(k => currentData.value[k] !== undefined).slice(0, 4)
})

function barColor(val: number) {
  if (val >= 90) return 'bg-destructive'
  if (val >= 70) return 'bg-orange-400'
  return 'bg-primary'
}

const chartEl = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444']

function buildChart() {
  if (!chartEl.value) return
  if (history.value.length < 2) return

  const labels = history.value.map(h =>
    new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  )
  const datasets = visibleKeys.value.map((key, i) => ({
    label: key.toUpperCase(),
    data: history.value.map(h => h.payload[key] ?? 0),
    borderColor: COLORS[i % COLORS.length],
    backgroundColor: COLORS[i % COLORS.length] + '20',
    fill: true,
    tension: 0.3,
    pointRadius: 2,
    borderWidth: 1.5,
  }))

  if (chart) {
    chart.data.labels = labels
    chart.data.datasets = datasets
    chart.update('none')
    return
  }

  chart = new Chart(chartEl.value, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 }, maxTicksLimit: 5, color: '#888' } },
        y: {
          min: 0, max: 100,
          grid: { color: 'rgba(128,128,128,0.15)' },
          ticks: { font: { size: 9 }, stepSize: 25, color: '#888', callback: (v) => `${v}%` },
        },
      },
    },
  })
}

watch(history, () => nextTick(buildChart))
watch(liveData, () => nextTick(buildChart))
watch(chartEl, (el) => { if (el) nextTick(buildChart) })
onUnmounted(() => { chart?.destroy(); chart = null })
</script>
