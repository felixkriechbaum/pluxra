<template>
  <div ref="containerEl" class="flex flex-col h-full p-3 gap-2">
    <!-- Header -->
    <div class="flex items-center justify-between shrink-0">
      <span class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{{ config.title }}</span>
      <span v-if="config.dataSource === 'push' && liveData" class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="live" />
    </div>

    <div v-if="!hasData" class="flex-1 flex items-center justify-center">
      <p class="text-xs text-muted-foreground">Waiting for data...</p>
    </div>

    <div v-else class="flex flex-col gap-2 flex-1 min-h-0">
      <template v-for="block in config.blocks" :key="block.key">

        <!-- Value block -->
        <div v-if="block.type === 'value'" class="flex items-baseline gap-1">
          <span class="text-2xl font-bold font-mono" :style="{ color: block.color || undefined }">
            {{ currentData[block.key] ?? '—' }}
          </span>
          <span class="text-xs text-muted-foreground">{{ block.unit }}</span>
          <span v-if="block.label" class="text-xs text-muted-foreground ml-1">{{ block.label }}</span>
        </div>

        <!-- Bar block -->
        <div v-else-if="block.type === 'bar'" class="space-y-0.5">
          <div class="flex justify-between text-[10px]">
            <span class="text-muted-foreground uppercase tracking-wide">{{ block.label || block.key }}</span>
            <span class="font-mono font-medium">{{ currentData[block.key] ?? '—' }}{{ block.unit }}</span>
          </div>
          <div class="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{
                width: `${Math.min(100, Math.max(0, ((Number(currentData[block.key]) - block.min) / (block.max - block.min)) * 100))}%`,
                backgroundColor: block.color || 'hsl(var(--primary))',
              }"
            />
          </div>
        </div>

        <!-- Chart block -->
        <div v-else-if="block.type === 'chart'" class="flex-1 min-h-0 relative" style="min-height: 60px;">
          <span class="absolute top-0 left-0 text-[10px] text-muted-foreground">{{ block.label || block.key }}</span>
          <canvas :ref="el => setChartRef(block.key, el as HTMLCanvasElement)" class="absolute inset-0 w-full h-full" style="padding-top: 14px;" />
        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from 'chart.js'
import type { CustomConfig } from './types'
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const props = defineProps<{ config: CustomConfig; widgetId: string }>()

// Push data source
const { data: liveData } = useSse(props.widgetId)
const { idToken } = useUser()

// History for charts
const { data: historyRaw, refresh } = useFetch<{ payload: Record<string, unknown>; createdAt: string }[]>(
  () => `/api/widgets/history?widgetId=${props.widgetId}`,
  { headers: computed(() => idToken.value ? { Authorization: `Bearer ${idToken.value}` } : {}), watch: [idToken], default: () => [] },
)
watch(liveData, () => refresh())

// Poll data source
const pollData = ref<Record<string, unknown> | null>(null)
let pollTimer: ReturnType<typeof setInterval> | null = null

function startPolling() {
  if (pollTimer) clearInterval(pollTimer)
  if (props.config.dataSource !== 'poll' || !props.config.pollUrl) return
  const load = async () => {
    try { pollData.value = await $fetch(props.config.pollUrl) }
    catch {}
  }
  load()
  pollTimer = setInterval(load, (props.config.pollInterval || 60) * 1000)
}

onMounted(startPolling)
onUnmounted(() => { if (pollTimer) clearInterval(pollTimer) })
watch(() => [props.config.dataSource, props.config.pollUrl, props.config.pollInterval], startPolling)

const currentData = computed<Record<string, unknown>>(() => {
  if (props.config.dataSource === 'poll') return pollData.value ?? {}
  if (liveData.value) return liveData.value as Record<string, unknown>
  if (historyRaw.value?.length) return historyRaw.value[historyRaw.value.length - 1].payload
  return {}
})

const hasData = computed(() => Object.keys(currentData.value).length > 0)

const history = computed(() => {
  const base = historyRaw.value ?? []
  if (!liveData.value) return base
  const last = base[base.length - 1]
  if (last && JSON.stringify(last.payload) === JSON.stringify(liveData.value)) return base
  return [...base.slice(-9), { payload: liveData.value as Record<string, unknown>, createdAt: new Date().toISOString() }]
})

// Charts
const chartRefs = new Map<string, HTMLCanvasElement>()
const charts = new Map<string, Chart>()

function setChartRef(key: string, el: HTMLCanvasElement | null) {
  if (el) {
    chartRefs.set(key, el)
    nextTick(() => buildChart(key))
  }
}

function buildChart(key: string) {
  const el = chartRefs.get(key)
  if (!el || history.value.length < 2) return
  const block = props.config.blocks.find(b => b.key === key)
  if (!block) return

  const labels = history.value.map(h => new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  const data = history.value.map(h => Number((h.payload as Record<string, unknown>)[key] ?? 0))
  const color = block.color || '#6366f1'

  const existing = charts.get(key)
  if (existing) {
    existing.data.labels = labels
    existing.data.datasets[0].data = data
    existing.update('none')
    return
  }

  charts.set(key, new Chart(el, {
    type: 'line',
    data: {
      labels,
      datasets: [{ data, borderColor: color, backgroundColor: color + '20', fill: true, tension: 0.3, pointRadius: 2, borderWidth: 1.5 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 }, maxTicksLimit: 5, color: '#888' } },
        y: {
          min: block.min ?? 0,
          max: block.max ?? 100,
          grid: { color: 'rgba(128,128,128,0.15)' },
          ticks: { font: { size: 9 }, color: '#888', callback: (v) => `${v}${block.unit}` },
        },
      },
    },
  }))
}

watch(history, () => {
  props.config.blocks.filter(b => b.type === 'chart').forEach(b => nextTick(() => buildChart(b.key)))
}, { deep: true })

onUnmounted(() => { charts.forEach(c => c.destroy()); charts.clear() })
</script>
