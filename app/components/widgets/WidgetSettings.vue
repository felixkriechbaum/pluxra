<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Widget settings</DialogTitle>
      </DialogHeader>

      <div class="grid grid-cols-2 gap-4 py-4 border-b">
        <div class="space-y-1">
          <p class="text-xs text-muted-foreground font-medium">Breite (Spalten)</p>
          <div class="flex items-center gap-1">
            <button class="w-6 h-6 flex items-center justify-center rounded border hover:bg-accent text-sm" @click="adjust('colSpan', -1)">−</button>
            <span class="w-14 text-center text-sm">{{ pos.colSpan }} / {{ maxCols }}</span>
            <button class="w-6 h-6 flex items-center justify-center rounded border hover:bg-accent text-sm" @click="adjust('colSpan', 1)">+</button>
          </div>
        </div>
        <div class="space-y-1">
          <p class="text-xs text-muted-foreground font-medium">Höhe (Zeilen)</p>
          <div class="flex items-center gap-1">
            <button class="w-6 h-6 flex items-center justify-center rounded border hover:bg-accent text-sm" @click="adjust('rowSpan', -1)">−</button>
            <span class="w-14 text-center text-sm">{{ pos.rowSpan }} / {{ maxRows }}</span>
            <button class="w-6 h-6 flex items-center justify-center rounded border hover:bg-accent text-sm" @click="adjust('rowSpan', 1)">+</button>
          </div>
        </div>
      </div>

      <component :is="settingsComponent" v-if="settingsComponent" v-model="localConfig" class="py-4" />
      <p v-else class="py-4 text-sm text-muted-foreground">Dieses Widget hat keine weiteren Einstellungen.</p>

      <DialogFooter>
        <Button @click="save">Speichern</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getWidget } from '#widgets/widgetRegistry'

const props = defineProps<{
  open: boolean
  widgetId: string
  pluginId: string
  config: Record<string, unknown>
  colSpan: number
  rowSpan: number
  maxCols: number
  maxRows: number
}>()

const emit = defineEmits<{
  'update:open': [v: boolean]
  save: [config: Record<string, unknown>, size: { colSpan: number; rowSpan: number }]
}>()

const settingsComponent = computed(() => {
  try { return getWidget(props.pluginId).settings }
  catch { return null }
})

const localConfig = ref<Record<string, unknown>>({ ...props.config })
const pos = ref({ colSpan: props.colSpan, rowSpan: props.rowSpan })

watch(() => props.config, c => { localConfig.value = { ...c } })
watch(() => [props.colSpan, props.rowSpan] as const, () => {
  pos.value = { colSpan: props.colSpan, rowSpan: props.rowSpan }
})

function adjust(field: 'colSpan' | 'rowSpan', delta: number) {
  const max = field === 'colSpan' ? props.maxCols : props.maxRows
  pos.value = { ...pos.value, [field]: Math.max(1, Math.min(pos.value[field] + delta, max)) }
}

function save() {
  emit('save', localConfig.value, { colSpan: pos.value.colSpan, rowSpan: pos.value.rowSpan })
  emit('update:open', false)
}
</script>
