<template>
  <div class="space-y-4">

    <!-- General -->
    <div class="space-y-2">
      <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wide">General</h3>
      <div>
        <Label>Title</Label>
        <Input v-model="local.title" />
      </div>
      <div>
        <Label>Data source</Label>
        <select v-model="local.dataSource" class="select-input">
          <option value="push">Push (Ingest token)</option>
          <option value="poll">Poll (fetch URL)</option>
        </select>
      </div>
      <template v-if="local.dataSource === 'poll'">
        <div class="grid grid-cols-4 gap-2">
          <div class="col-span-1">
            <Label>Method</Label>
            <select v-model="local.pollMethod" class="select-input">
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
            </select>
          </div>
          <div class="col-span-3">
            <Label>URL to fetch</Label>
            <Input v-model="local.pollUrl" placeholder="https://..." />
          </div>
        </div>
        <div>
          <Label>Headers (one per line, <code>Key: Value</code>)</Label>
          <textarea
            v-model="local.pollHeaders"
            placeholder="Authorization: Bearer token123&#10;X-Api-Key: mykey"
            rows="3"
            class="w-full border rounded px-2 py-1 text-sm bg-background font-mono resize-y"
          />
        </div>
        <div>
          <Label>Body (optional, e.g. JSON)</Label>
          <textarea
            v-model="local.pollBody"
            placeholder='{"key": "value"}'
            rows="3"
            class="w-full border rounded px-2 py-1 text-sm bg-background font-mono resize-y"
          />
        </div>
        <div>
          <Label>Interval (seconds)</Label>
          <Input v-model.number="local.pollInterval" type="number" min="5" />
        </div>
      </template>
    </div>

    <!-- Blocks -->
    <div class="space-y-2">
      <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Blocks</h3>

      <div v-for="(block, i) in local.blocks" :key="i" class="border rounded p-3 space-y-2 relative">
        <button class="absolute top-2 right-2 text-muted-foreground hover:text-destructive text-xs" @click="removeBlock(i)">✕</button>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <Label>Key</Label>
            <Input v-model="block.key" placeholder="e.g. cpu" />
          </div>
          <div>
            <Label>Label</Label>
            <Input v-model="block.label" placeholder="e.g. CPU" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <Label>Type</Label>
            <select v-model="block.type" class="select-input">
              <option value="value">Value (large number)</option>
              <option value="bar">Bar (progress)</option>
              <option value="chart">Chart (line graph)</option>
            </select>
          </div>
          <div>
            <Label>Unit</Label>
            <Input v-model="block.unit" placeholder="e.g. %" />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div>
            <Label>Color</Label>
            <input v-model="block.color" type="color" class="w-full h-9 rounded border cursor-pointer bg-background" />
          </div>
          <div>
            <Label>Min</Label>
            <Input v-model.number="block.min" type="number" />
          </div>
          <div>
            <Label>Max</Label>
            <Input v-model.number="block.max" type="number" />
          </div>
        </div>
      </div>

      <button
        class="w-full py-1.5 text-sm border border-dashed rounded hover:bg-accent transition-colors text-muted-foreground"
        @click="addBlock"
      >
        + Add block
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import type { CustomConfig, Block } from './types'

const props = defineProps<{ modelValue: CustomConfig }>()
const emit = defineEmits<{ 'update:modelValue': [v: CustomConfig] }>()

const local = reactive<CustomConfig>({
  title: '',
  dataSource: 'push',
  pollUrl: '',
  pollInterval: 60,
  pollHeaders: '',
  pollBody: '',
  pollMethod: 'GET',
  blocks: [],
  ...JSON.parse(JSON.stringify(props.modelValue)),
})

watch(local, v => emit('update:modelValue', JSON.parse(JSON.stringify(v))), { deep: true })

function addBlock() {
  local.blocks.push({ key: '', label: '', type: 'value', unit: '', color: '#6366f1', min: 0, max: 100 } as Block)
}

function removeBlock(i: number) {
  local.blocks.splice(i, 1)
}
</script>
