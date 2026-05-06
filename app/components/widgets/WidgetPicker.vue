<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add widget</DialogTitle>
      </DialogHeader>
      <div class="space-y-4 py-2">

        <!-- Built-in widgets -->
        <div class="space-y-2">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">Built-in</p>
          <div class="grid grid-cols-2 gap-2">
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
        </div>

        <!-- Custom templates -->
        <div v-if="templates?.length" class="space-y-2">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">My Widgets</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="t in templates"
              :key="t.id"
              class="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent text-left transition-colors"
              @click="selectTemplate(t)"
            >
              <div class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: t.color }" />
              <span class="text-sm font-medium">{{ t.name }}</span>
              <span class="text-xs text-muted-foreground ml-auto">{{ (t.config as any).dataSource ?? 'push' }}</span>
            </button>
          </div>
        </div>

        <NuxtLink to="/settings/widgets" class="block text-xs text-muted-foreground hover:text-foreground text-center pt-1" @click="emit('update:open', false)">
          + Create new widget type
        </NuxtLink>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { widgetRegistry } from '#widgets/widgetRegistry'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [v: boolean]; select: [pluginId: string]; selectTemplate: [templateId: string, config: Record<string, unknown>] }>()

const { templates } = useWidgetTemplates()

function selectTemplate(t: { id: string; config: Record<string, unknown> }) {
  emit('selectTemplate', t.id, t.config)
  emit('update:open', false)
}
</script>
