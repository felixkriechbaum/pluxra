<template>
  <div class="absolute inset-0 bg-black/30 flex items-start justify-end gap-1 p-1">
    <button
      class="p-1 rounded bg-black/60 text-white hover:bg-black/80 transition-colors"
      @mousedown.stop
      @click="emit('settings', widgetId)"
    >
      <Settings class="h-3.5 w-3.5" />
    </button>
    <button
      class="p-1 rounded bg-red-600/80 text-white hover:bg-red-600 transition-colors"
      @mousedown.stop
      @click="emit('delete', widgetId)"
    >
      <Trash2 class="h-3.5 w-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Settings, Trash2 } from 'lucide-vue-next'

defineProps<{ widgetId: string }>()
const emit = defineEmits<{ settings: [id: string]; delete: [id: string] }>()
</script>
