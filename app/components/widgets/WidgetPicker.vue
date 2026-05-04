<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add widget</DialogTitle>
      </DialogHeader>
      <div class="grid grid-cols-2 gap-3 py-4">
        <button
          v-for="[id, plugin] in Object.entries(widgetRegistry)"
          :key="id"
          class="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent text-left transition-colors"
          @click="emit('select', id); emit('update:open', false)"
        >
          <span class="text-sm font-medium">{{ plugin.manifest.name }}</span>
          <span class="text-xs text-muted-foreground ml-auto">{{ plugin.manifest.dataSource }}</span>
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { widgetRegistry } from '~/plugins/widgets/widgetRegistry'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [v: boolean]; select: [pluginId: string] }>()
</script>
