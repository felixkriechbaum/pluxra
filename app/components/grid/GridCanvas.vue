<template>
  <div
    class="w-full h-full"
    :style="{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: '8px',
    }"
  >
    <GridTile
      v-for="widget in widgets"
      :key="widget.id"
      :widget="widget"
      @delete="emit('delete', $event)"
      @settings="emit('settings', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import GridTile from './GridTile.vue'

interface Widget {
  id: string
  pluginId: string
  colStart: number
  colSpan: number
  rowStart: number
  rowSpan: number
  config: Record<string, unknown>
}

defineProps<{ widgets: Widget[]; cols: number; rows: number }>()
const emit = defineEmits<{ delete: [id: string]; settings: [id: string] }>()
</script>
