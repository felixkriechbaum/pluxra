<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Widget settings</DialogTitle>
      </DialogHeader>
      <component
        :is="settingsComponent"
        v-if="settingsComponent"
        v-model="localConfig"
        class="py-4"
      />
      <DialogFooter>
        <Button @click="save">Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getWidget } from '~/plugins/widgets/widgetRegistry'

const props = defineProps<{
  open: boolean
  widgetId: string
  pluginId: string
  config: Record<string, unknown>
}>()

const emit = defineEmits<{
  'update:open': [v: boolean]
  save: [config: Record<string, unknown>]
}>()

const settingsComponent = computed(() => {
  try { return getWidget(props.pluginId).settings }
  catch { return null }
})

const localConfig = ref<Record<string, unknown>>({ ...props.config })

watch(() => props.config, (c) => { localConfig.value = { ...c } })

function save() {
  emit('save', localConfig.value)
  emit('update:open', false)
}
</script>
