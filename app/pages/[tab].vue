<template>
  <div class="h-full flex flex-col">
    <div v-if="editMode" class="flex items-center gap-4 px-4 py-2 border-b bg-muted/30 text-sm shrink-0">
      <span class="text-muted-foreground font-medium">Grid</span>
      <label class="flex items-center gap-1.5">
        <span class="text-muted-foreground">{{ t('gridCols') }}</span>
        <div class="flex items-center gap-1">
          <button class="w-6 h-6 flex items-center justify-center rounded border hover:bg-accent" @click="adjustGrid('cols', -1)">−</button>
          <span class="w-8 text-center font-mono">{{ gridCols }}</span>
          <button class="w-6 h-6 flex items-center justify-center rounded border hover:bg-accent" @click="adjustGrid('cols', 1)">+</button>
        </div>
      </label>
      <label class="flex items-center gap-1.5">
        <span class="text-muted-foreground">{{ t('gridRows') }}</span>
        <div class="flex items-center gap-1">
          <button class="w-6 h-6 flex items-center justify-center rounded border hover:bg-accent" @click="adjustGrid('rows', -1)">−</button>
          <span class="w-8 text-center font-mono">{{ gridRows }}</span>
          <button class="w-6 h-6 flex items-center justify-center rounded border hover:bg-accent" @click="adjustGrid('rows', 1)">+</button>
        </div>
      </label>
    </div>

    <div class="flex-1 relative overflow-hidden p-4">
      <GridCanvas
        v-if="widgets?.length"
        :widgets="(widgets as any[])"
        :cols="gridCols"
        :rows="gridRows"
        @delete="deleteWidget"
        @settings="openSettings"
        @duplicate="duplicateWidget"
        @move="onMove"
      />
      <div v-else-if="!editMode" class="flex items-center justify-center h-full text-muted-foreground text-sm">
        {{ t('noWidgets') }}
      </div>
      <button
        v-if="editMode"
        class="absolute bottom-4 right-4 px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
        @click="showPicker = true"
      >
        {{ t('addWidget') }}
      </button>
    </div>

    <WidgetPicker v-model:open="showPicker" @select="onPickWidget" @select-template="onPickTemplate" />
    <WidgetSettings
      v-if="settingsTarget"
      :open="showSettings"
      :widget-id="settingsTarget.id"
      :plugin-id="settingsTarget.pluginId"
      :config="settingsTarget.config"
      :col-span="settingsTarget.colSpan"
      :row-span="settingsTarget.rowSpan"
      :max-cols="gridCols"
      :max-rows="gridRows"
      @update:open="showSettings = $event"
      @save="onSaveSettings"
    />
  </div>
</template>

<script setup lang="ts">
import GridCanvas from '~/components/grid/GridCanvas.vue'
import WidgetPicker from '~/components/widgets/WidgetPicker.vue'
import WidgetSettings from '~/components/widgets/WidgetSettings.vue'
import { getWidget } from '#widgets/widgetRegistry'

const route = useRoute()
const tabId = computed(() => route.params.tab as string)
const { widgets, createWidget, updateWidget, deleteWidget } = useWidgets(tabId)
const { tabs, updateTab } = useTabs()
const { editMode } = useGrid()
const { t } = useLocale()

const currentTab = computed(() => tabs.value?.find(t => t.id === tabId.value))
const gridCols = computed(() => currentTab.value?.cols ?? 12)
const gridRows = computed(() => currentTab.value?.rows ?? 12)

const showPicker = ref(false)
const showSettings = ref(false)
const settingsTarget = ref<{ id: string; pluginId: string; config: Record<string, unknown>; colSpan: number; rowSpan: number } | null>(null)

async function adjustGrid(field: 'cols' | 'rows', delta: number) {
  if (!currentTab.value) return
  await updateTab(currentTab.value.id, { [field]: Math.max(1, Math.min(48, (currentTab.value[field] ?? 12) + delta)) })
}

async function onMove(widgetId: string, position: { colStart: number; rowStart: number }) {
  await updateWidget(widgetId, position)
}

async function duplicateWidget(id: string) {
  const w = (widgets.value as any[])?.find((x: any) => x.id === id)
  if (!w) return
  await createWidget({
    tabId: tabId.value,
    pluginId: w.pluginId,
    colStart: Math.min(w.colStart + 1, gridCols.value),
    colSpan: w.colSpan,
    rowStart: Math.min(w.rowStart + 1, gridRows.value),
    rowSpan: w.rowSpan,
    config: { ...w.config },
  })
}

async function onPickWidget(pluginId: string) {
  const plugin = getWidget(pluginId)
  await createWidget({
    tabId: tabId.value,
    pluginId,
    colStart: 1,
    colSpan: plugin.manifest.defaultSize.colSpan,
    rowStart: 1,
    rowSpan: plugin.manifest.defaultSize.rowSpan,
    config: plugin.manifest.configSchema.parse({}),
  })
}

async function onPickTemplate(_templateId: string, config: Record<string, unknown>) {
  const plugin = getWidget('custom')
  await createWidget({
    tabId: tabId.value,
    pluginId: 'custom',
    colStart: 1,
    colSpan: plugin.manifest.defaultSize.colSpan,
    rowStart: 1,
    rowSpan: plugin.manifest.defaultSize.rowSpan,
    config,
  })
}

function openSettings(id: string) {
  const w = (widgets.value as any[])?.find((x: any) => x.id === id)
  if (!w) return
  settingsTarget.value = { id: w.id, pluginId: w.pluginId, config: w.config, colSpan: w.colSpan, rowSpan: w.rowSpan }
  showSettings.value = true
}

async function onSaveSettings(config: Record<string, unknown>, size: { colSpan: number; rowSpan: number }) {
  if (!settingsTarget.value) return
  await updateWidget(settingsTarget.value.id, { config, ...size })
  settingsTarget.value = null
}
</script>
