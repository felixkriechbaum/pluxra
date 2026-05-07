<template>
  <div class="space-y-4">
    <div>
      <Label>Default search engine</Label>
      <select v-model="local.defaultEngine" class="select-input">
        <option v-for="e in allEngines" :key="e.key" :value="e.key">{{ e.name }}</option>
      </select>
    </div>

    <div class="space-y-2">
      <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Custom engines</h3>

      <div v-for="(e, i) in local.extraEngines" :key="i" class="border rounded p-3 space-y-2 relative">
        <button class="absolute top-2 right-2 text-muted-foreground hover:text-destructive text-xs" @click="remove(i)">✕</button>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <Label>Name</Label>
            <Input v-model="e.name" placeholder="My Engine" />
          </div>
          <div>
            <Label>Key (unique)</Label>
            <Input v-model="e.key" placeholder="my-engine" />
          </div>
        </div>
        <div>
          <Label>Search URL (append query at end)</Label>
          <Input v-model="e.url" placeholder="https://example.com/search?q=" />
        </div>
        <div>
          <Label>Icon URL (optional)</Label>
          <Input v-model="e.icon" placeholder="https://example.com/favicon.ico" />
        </div>
      </div>

      <button
        class="w-full py-1.5 text-sm border border-dashed rounded hover:bg-accent transition-colors text-muted-foreground"
        @click="add"
      >
        + Add engine
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const BUILTIN_ENGINES = [
  { key: 'duckduckgo', name: 'DuckDuckGo' },
]

const props = defineProps<{
  modelValue: {
    defaultEngine: string
    extraEngines: { key: string; name: string; url: string; icon: string }[]
  }
}>()
const emit = defineEmits<{ 'update:modelValue': [v: typeof props.modelValue] }>()
const local = reactive({ defaultEngine: 'duckduckgo', extraEngines: [], ...JSON.parse(JSON.stringify(props.modelValue)) })
watch(local, v => emit('update:modelValue', JSON.parse(JSON.stringify(v))), { deep: true })

const allEngines = computed(() => [
  ...BUILTIN_ENGINES,
  ...local.extraEngines.map((e: any) => ({ key: e.key, name: e.name })),
])

function add() {
  local.extraEngines.push({ key: '', name: '', url: '', icon: '' })
}
function remove(i: number) {
  local.extraEngines.splice(i, 1)
}
</script>
