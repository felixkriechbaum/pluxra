<template>
  <div
    ref="gridEl"
    class="w-full h-full relative"
    :class="{ 'cursor-grabbing': isDragging }"
    :style="{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: '8px',
    }"
  >
    <!-- Background grid cells (edit mode only) -->
    <template v-if="editMode">
      <div
        v-for="cell in allCells"
        :key="`bg-${cell.col}-${cell.row}`"
        class="rounded-md border border-border/30 bg-muted/20 pointer-events-none"
        :style="{ gridColumn: String(cell.col), gridRow: String(cell.row) }"
      />
    </template>

    <!-- Widget tiles -->
    <GridTile
      v-for="widget in widgets"
      :key="widget.id"
      :widget="widget"
      :dimmed="isDragging && widget.id === dragging.widgetId"
      @dragstart="onTileDragStart"
      @delete="emit('delete', $event)"
      @settings="emit('settings', $event)"
    />

    <!-- Drop ghost -->
    <div
      v-if="isDragging && ghost.col > 0"
      class="rounded-lg border-2 border-dashed pointer-events-none z-10 transition-colors duration-75"
      :class="isValidDrop
        ? 'border-primary bg-primary/10'
        : 'border-destructive bg-destructive/10'"
      :style="{
        gridColumn: `${ghost.col} / span ${dragging.colSpan}`,
        gridRow: `${ghost.row} / span ${dragging.rowSpan}`,
      }"
    />

    <!-- Invisible overlay cells for drag hover detection -->
    <template v-if="isDragging">
      <div
        v-for="cell in allCells"
        :key="`ov-${cell.col}-${cell.row}`"
        class="z-50"
        :style="{ gridColumn: String(cell.col), gridRow: String(cell.row) }"
        @mouseenter="onCellEnter(cell.col, cell.row)"
      />
    </template>
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

const props = defineProps<{ widgets: Widget[]; cols: number; rows: number }>()
const emit = defineEmits<{
  delete: [id: string]
  settings: [id: string]
  move: [widgetId: string, position: { colStart: number; rowStart: number }]
}>()

const { editMode } = useGrid()
const gridEl = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragging = ref({ widgetId: '', colSpan: 1, rowSpan: 1 })
const ghost = ref({ col: 0, row: 0 })
const dragOffset = ref({ col: 0, row: 0 })

const allCells = computed(() => {
  const cells: { col: number; row: number }[] = []
  for (let r = 1; r <= props.rows; r++)
    for (let c = 1; c <= props.cols; c++)
      cells.push({ col: c, row: r })
  return cells
})

const isValidDrop = computed(() => {
  if (!isDragging.value || ghost.value.col === 0) return true
  const { col, row } = ghost.value
  const { widgetId, colSpan, rowSpan } = dragging.value
  return !props.widgets.some(w => {
    if (w.id === widgetId) return false
    return col < w.colStart + w.colSpan
      && col + colSpan > w.colStart
      && row < w.rowStart + w.rowSpan
      && row + rowSpan > w.rowStart
  })
})

function clamp(col: number, row: number) {
  return {
    col: Math.min(Math.max(1, col), Math.max(1, props.cols - dragging.value.colSpan + 1)),
    row: Math.min(Math.max(1, row), Math.max(1, props.rows - dragging.value.rowSpan + 1)),
  }
}

function resetDrag() {
  isDragging.value = false
  dragging.value = { widgetId: '', colSpan: 1, rowSpan: 1 }
  ghost.value = { col: 0, row: 0 }
  dragOffset.value = { col: 0, row: 0 }
}

function cellFromEvent(e: MouseEvent) {
  if (!gridEl.value) return { col: 1, row: 1 }
  const rect = gridEl.value.getBoundingClientRect()
  const gap = 8
  const cellW = (rect.width - gap * (props.cols - 1)) / props.cols
  const cellH = (rect.height - gap * (props.rows - 1)) / props.rows
  return {
    col: Math.min(props.cols, Math.max(1, Math.floor((e.clientX - rect.left) / (cellW + gap)) + 1)),
    row: Math.min(props.rows, Math.max(1, Math.floor((e.clientY - rect.top) / (cellH + gap)) + 1)),
  }
}

function onTileDragStart(widgetId: string, colSpan: number, rowSpan: number, e: MouseEvent) {
  const widget = props.widgets.find(w => w.id === widgetId)
  if (!widget) return
  const clicked = cellFromEvent(e)
  dragOffset.value = {
    col: Math.max(0, Math.min(colSpan - 1, clicked.col - widget.colStart)),
    row: Math.max(0, Math.min(rowSpan - 1, clicked.row - widget.rowStart)),
  }
  dragging.value = { widgetId, colSpan, rowSpan }
  ghost.value = { col: widget.colStart, row: widget.rowStart }
  isDragging.value = true
}

function onCellEnter(col: number, row: number) {
  if (isDragging.value) ghost.value = clamp(col - dragOffset.value.col, row - dragOffset.value.row)
}

function onGlobalMouseUp(e: MouseEvent) {
  if (!isDragging.value) return
  if (gridEl.value?.contains(e.target as Node) && ghost.value.col > 0 && isValidDrop.value) {
    emit('move', dragging.value.widgetId, { colStart: ghost.value.col, rowStart: ghost.value.row })
  }
  resetDrag()
}

onMounted(() => document.addEventListener('mouseup', onGlobalMouseUp))
onUnmounted(() => document.removeEventListener('mouseup', onGlobalMouseUp))
</script>
