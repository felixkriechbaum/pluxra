<template>
  <div class="h-full relative">
    <GridCanvas
      v-if="widgets?.length"
      :widgets="(widgets as any[])"
      :cols="12"
      :rows="12"
      @delete="deleteWidget"
      @settings="openSettings"
    />
    <div v-else-if="!editMode" class="flex items-center justify-center h-full text-muted-foreground text-sm">
      No widgets yet. Click Edit to add some.
    </div>
    <Button
      v-if="editMode"
      class="absolute bottom-4 right-4"
      @click="showPicker = true"
    >
      + Add widget
    </Button>
    <WidgetPicker v-model:open="showPicker" @select="onPickWidget" />
    <WidgetSettings
      v-if="settingsTarget"
      :open="showSettings"
      :widget-id="settingsTarget.id"
      :plugin-id="settingsTarget.pluginId"
      :config="settingsTarget.config"
      @update:open="showSettings = $event"
      @save="onSaveSettings"
    />
  </div>
</template>

<script setup lang="ts">
import GridCanvas from '~/components/grid/GridCanvas.vue'
import WidgetPicker from '~/components/widgets/WidgetPicker.vue'
import WidgetSettings from '~/components/widgets/WidgetSettings.vue'
import { Button } from '@/components/ui/button'
import { getWidget } from '~/plugins/widgets/widgetRegistry'

const route = useRoute()
const tabId = computed(() => route.params.tab as string)
const { widgets, createWidget, updateWidget, deleteWidget } = useWidgets(tabId)
const { editMode } = useGrid()

const showPicker = ref(false)
const showSettings = ref(false)
const settingsTarget = ref<{ id: string; pluginId: string; config: Record<string, unknown> } | null>(null)

async function onPickWidget(pluginId: string) {
  const plugin = getWidget(pluginId)
  await createWidget({
    tabId: tabId.value,
    pluginId,
    colStart: 1,
    colSpan: plugin.manifest.defaultSize.colSpan,
    rowStart: 1,
    rowSpan: plugin.manifest.defaultSize.rowSpan,
  })
}

function openSettings(id: string) {
  const w = (widgets.value as any[])?.find((x: any) => x.id === id)
  if (!w) return
  settingsTarget.value = { id: w.id, pluginId: w.pluginId, config: w.config }
  showSettings.value = true
}

async function onSaveSettings(config: Record<string, unknown>) {
  if (!settingsTarget.value) return
  await updateWidget(settingsTarget.value.id, { config })
  settingsTarget.value = null
}
</script>
