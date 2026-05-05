<template>
  <div
    class="relative overflow-hidden rounded-lg border bg-card transition-opacity duration-150"
    :class="[editMode ? 'cursor-grab' : '', dimmed ? 'opacity-30' : 'opacity-100']"
    :style="{
      gridColumn: `${widget.colStart} / span ${widget.colSpan}`,
      gridRow: `${widget.rowStart} / span ${widget.rowSpan}`,
    }"
    @mousedown="onMouseDown"
  >
    <component :is="pluginComponent" :config="widget.config" :widget-id="widget.id" />
    <EditOverlay
      v-if="editMode"
      :widget-id="widget.id"
      @delete="emit('delete', widget.id)"
      @settings="emit('settings', widget.id)"
    />
  </div>
</template>

<script setup lang="ts">
import EditOverlay from './EditOverlay.vue'
import { getWidget } from '#widgets/widgetRegistry'

interface Widget {
  id: string
  pluginId: string
  colStart: number
  colSpan: number
  rowStart: number
  rowSpan: number
  config: Record<string, unknown>
}

const props = defineProps<{ widget: Widget; dimmed?: boolean }>()
const emit = defineEmits<{
  delete: [id: string]
  settings: [id: string]
  dragstart: [widgetId: string, colSpan: number, rowSpan: number, event: MouseEvent]
}>()

const { editMode } = useGrid()
const pluginComponent = computed(() => getWidget(props.widget.pluginId).component)

function onMouseDown(e: MouseEvent) {
  if (!editMode.value) return
  if ((e.target as HTMLElement).closest('button')) return
  e.preventDefault()
  emit('dragstart', props.widget.id, props.widget.colSpan, props.widget.rowSpan, e)
}
</script>
