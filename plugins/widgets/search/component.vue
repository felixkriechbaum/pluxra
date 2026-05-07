<template>
  <div class="flex flex-col items-center justify-center h-full p-3 gap-2">
    <form class="flex w-full" @submit.prevent="search">
      <div class="flex flex-1 items-center rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring transition-colors overflow-hidden">

        <!-- Engine picker -->
        <div ref="anchorEl" class="relative shrink-0">
          <button
            type="button"
            class="flex items-center gap-1.5 h-9 px-3 bg-muted hover:bg-accent transition-colors text-sm border-r"
            @click="open = !open"
          >
            <img v-if="current.favicon" :src="current.favicon" class="w-4 h-4" @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
            <span class="text-xs text-muted-foreground max-w-[80px] truncate">{{ current.name }}</span>
            <svg class="w-3 h-3 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>

        <!-- Input -->
        <input
          ref="inputEl"
          v-model="query"
          type="text"
          placeholder="Search..."
          class="flex-1 h-9 px-4 text-sm bg-transparent outline-none min-w-0"
        />
      </div>
    </form>

    <!-- Dropdown teleported to body to escape overflow:hidden -->
    <Teleport to="body">
      <template v-if="open">
        <div class="fixed inset-0 z-40" @click="open = false" />
        <div
          class="fixed z-[9999] bg-popover border rounded-xl shadow-lg py-1 min-w-[160px]"
          :style="dropdownStyle"
        >
          <button
            v-for="engine in allEngines"
            :key="engine.key"
            type="button"
            class="flex items-center gap-2 w-full px-4 py-1.5 text-sm hover:bg-accent transition-colors text-left"
            :class="selectedEngine === engine.key ? 'text-foreground font-medium' : 'text-muted-foreground'"
            @click="selectedEngine = engine.key; open = false; inputEl?.focus()"
          >
            <img v-if="engine.favicon" :src="engine.favicon" class="w-4 h-4 shrink-0" @error="(e) => (e.target as HTMLImageElement).style.display='none'" />
            {{ engine.name }}
            <span v-if="selectedEngine === engine.key" class="ml-auto text-primary text-xs leading-none">✓</span>
          </button>
        </div>
      </template>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  config: {
    defaultEngine: string
    extraEngines: { key: string; name: string; url: string; icon: string }[]
  }
}>()

const BUILTIN_ENGINES = [
  { key: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', favicon: 'https://duckduckgo.com/favicon.ico' },
]

const allEngines = computed(() => [
  ...BUILTIN_ENGINES,
  ...(props.config.extraEngines ?? []).map(e => ({ ...e, favicon: e.icon || '' })),
])

const selectedEngine = ref(props.config.defaultEngine || 'duckduckgo')
watch(() => props.config.defaultEngine, v => { selectedEngine.value = v })
const current = computed(() => allEngines.value.find(e => e.key === selectedEngine.value) ?? allEngines.value[0])

const query = ref('')
const open = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)
const anchorEl = ref<HTMLElement | null>(null)
const dropdownStyle = ref({})

function updateDropdownPos() {
  if (!anchorEl.value) return
  const rect = anchorEl.value.getBoundingClientRect()
  dropdownStyle.value = { top: `${rect.bottom + 6}px`, left: `${rect.left}px` }
}

watch(open, v => { if (v) nextTick(updateDropdownPos) })

onMounted(() => nextTick(() => inputEl.value?.focus()))

function search() {
  if (!query.value.trim()) return
  window.open(current.value.url + encodeURIComponent(query.value.trim()), '_blank')
  query.value = ''
  nextTick(() => inputEl.value?.focus())
}
</script>
