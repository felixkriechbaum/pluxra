<template>
  <div
    class="relative overflow-hidden rounded-lg border bg-card"
    :style="{
      gridColumn: `${widget.colStart} / span ${widget.colSpan}`,
      gridRow: `${widget.rowStart} / span ${widget.rowSpan}`,
    }"
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
import { getWidget } from '~/plugins/widgets/widgetRegistry'

interface Widget {
  id: string
  pluginId: string
  colStart: number
  colSpan: number
  rowStart: number
  rowSpan: number
  config: Record<string, unknown>
}

const props = defineProps<{ widget: Widget }>()
const emit = defineEmits<{ delete: [id: string]; settings: [id: string] }>()

const { editMode } = useGrid()
const pluginComponent = computed(() => getWidget(props.widget.pluginId).component)
</script>
