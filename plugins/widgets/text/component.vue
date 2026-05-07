<template>
  <div class="flex flex-col items-stretch justify-center h-full p-3 gap-1" :class="`text-${config.align}`">
    <p v-if="config.label" class="text-xs text-muted-foreground uppercase tracking-wide">{{ config.label }}</p>
    <p v-if="!config.url" class="text-xs text-muted-foreground">Configure URL in settings.</p>
    <p v-else-if="error" class="text-xs text-destructive">{{ error }}</p>
    <p v-else class="break-words whitespace-pre-wrap font-mono leading-snug" :class="`text-${config.fontSize}`">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  config: {
    url: string
    intervalMs: number
    fontSize: string
    align: string
    label: string
    headers: string
    method: string
    body: string
  }
}>()

const text = ref('')
const error = ref('')
let timer: ReturnType<typeof setInterval> | null = null

function parseHeaders(raw: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const idx = line.indexOf(':')
    if (idx < 1) continue
    result[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  return result
}

async function fetchText() {
  if (!props.config.url) return
  try {
    const res = await fetch(props.config.url, {
      method: props.config.method || 'GET',
      headers: parseHeaders(props.config.headers ?? ''),
      body: props.config.body || undefined,
    })
    text.value = await res.text()
    error.value = ''
  }
  catch (e: any) {
    error.value = e?.message ?? 'Fetch failed'
  }
}

function startPolling() {
  fetchText()
  timer = setInterval(fetchText, props.config.intervalMs || 30000)
}

function stopPolling() {
  if (timer !== null) { clearInterval(timer); timer = null }
}

watch(() => [props.config.url, props.config.intervalMs, props.config.headers, props.config.method, props.config.body], () => {
  stopPolling()
  startPolling()
}, { immediate: true })

onUnmounted(stopPolling)
</script>
