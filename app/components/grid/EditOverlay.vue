<template>
  <div class="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
    <Button size="icon" variant="secondary" @click="emit('settings', widgetId)">
      <Settings class="h-4 w-4" />
    </Button>
    <Button size="icon" variant="destructive" @click="emit('delete', widgetId)">
      <Trash2 class="h-4 w-4" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Settings, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps<{ widgetId: string }>()
const emit = defineEmits<{ settings: [id: string]; delete: [id: string] }>()
</script>
