<template>
  <div class="max-w-2xl mx-auto py-8 space-y-6">
    <h1 class="text-2xl font-semibold">My Widgets</h1>
    <p class="text-sm text-muted-foreground">Create custom widget types that appear in the widget picker.</p>

    <!-- Existing templates -->
    <div v-if="templates?.length" class="space-y-2">
      <div
        v-for="t in templates"
        :key="t.id"
        class="flex items-center justify-between p-3 border rounded-lg"
      >
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 rounded flex items-center justify-center text-sm" :style="{ backgroundColor: t.color + '30', color: t.color }">
            ✦
          </div>
          <div>
            <p class="text-sm font-medium">{{ t.name }}</p>
            <p class="text-xs text-muted-foreground">{{ (t.config as any).blocks?.length ?? 0 }} block(s) · {{ (t.config as any).dataSource ?? 'push' }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="startEdit(t)">Edit</Button>
          <Button variant="destructive" size="sm" @click="deleteTemplate(t.id)">Delete</Button>
        </div>
      </div>
    </div>
    <p v-else class="text-sm text-muted-foreground">No custom widgets yet.</p>

    <!-- Create / Edit form -->
    <div class="border rounded-lg p-5 space-y-4">
      <h2 class="font-medium">{{ editing ? 'Edit widget type' : 'New widget type' }}</h2>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <Label>Name</Label>
          <Input v-model="form.name" placeholder="e.g. YouTube Counter" />
        </div>
        <div>
          <Label>Color</Label>
          <input v-model="form.color" type="color" class="w-full h-9 rounded border cursor-pointer bg-background px-1" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <Label>Data source</Label>
          <select v-model="form.config.dataSource" class="select-input">
            <option value="push">Push (Ingest token)</option>
            <option value="poll">Poll (fetch URL)</option>
          </select>
        </div>
        <template v-if="form.config.dataSource === 'poll'">
          <div>
            <Label>Poll interval (s)</Label>
            <Input v-model.number="form.config.pollInterval" type="number" min="5" />
          </div>
        </template>
      </div>

      <div v-if="form.config.dataSource === 'poll'">
        <Label>URL</Label>
        <Input v-model="form.config.pollUrl" placeholder="https://..." />
      </div>

      <!-- Blocks -->
      <div class="space-y-2">
        <Label>Blocks</Label>
        <div v-for="(block, i) in form.config.blocks" :key="i" class="border rounded p-3 space-y-2 relative">
          <button class="absolute top-2 right-2 text-xs text-muted-foreground hover:text-destructive" @click="removeBlock(i)">✕</button>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <Label>Key</Label>
              <Input v-model="block.key" placeholder="e.g. subscribers" />
            </div>
            <div>
              <Label>Label</Label>
              <Input v-model="block.label" placeholder="e.g. Subscribers" />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <Label>Type</Label>
              <select v-model="block.type" class="select-input">
                <option value="value">Value</option>
                <option value="bar">Bar</option>
                <option value="chart">Chart</option>
              </select>
            </div>
            <div>
              <Label>Unit</Label>
              <Input v-model="block.unit" placeholder="e.g. %" />
            </div>
            <div>
              <Label>Color</Label>
              <input v-model="block.color" type="color" class="w-full h-9 rounded border cursor-pointer bg-background px-1" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
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

      <div class="flex gap-2 pt-2">
        <Button :disabled="!form.name" @click="save">
          {{ editing ? 'Save changes' : 'Create widget type' }}
        </Button>
        <Button v-if="editing" variant="outline" @click="cancelEdit">Cancel</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'settings' })
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WidgetTemplate } from '~/composables/useWidgetTemplates'

const { templates, createTemplate, updateTemplate, deleteTemplate } = useWidgetTemplates()

const editing = ref<string | null>(null)

function emptyForm() {
  return {
    name: '',
    color: '#6366f1',
    config: {
      dataSource: 'push' as 'push' | 'poll',
      pollUrl: '',
      pollInterval: 60,
      blocks: [] as { key: string; label: string; type: 'value' | 'bar' | 'chart'; unit: string; color: string; min: number; max: number }[],
    },
  }
}

const form = reactive(emptyForm())

function addBlock() {
  form.config.blocks.push({ key: '', label: '', type: 'value', unit: '', color: '#6366f1', min: 0, max: 100 })
}

function removeBlock(i: number) {
  form.config.blocks.splice(i, 1)
}

function startEdit(t: WidgetTemplate) {
  editing.value = t.id
  form.name = t.name
  form.color = t.color
  form.config = JSON.parse(JSON.stringify(t.config as any))
}

function cancelEdit() {
  editing.value = null
  Object.assign(form, emptyForm())
}

async function save() {
  if (!form.name) return
  if (editing.value) {
    await updateTemplate(editing.value, { name: form.name, color: form.color, config: JSON.parse(JSON.stringify(form.config)) })
    cancelEdit()
  }
  else {
    await createTemplate({ name: form.name, icon: 'puzzle', color: form.color, config: JSON.parse(JSON.stringify(form.config)) })
    Object.assign(form, emptyForm())
  }
}
</script>
