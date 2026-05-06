<template>
  <div class="space-y-3">
    <div>
      <Label>Title</Label>
      <Input v-model="local.title" />
    </div>
    <label class="flex items-center justify-between cursor-pointer">
      <span class="text-sm">Show chart</span>
      <input type="checkbox" :checked="local.showChart !== false" class="cursor-pointer" @change="local.showChart = ($event.target as HTMLInputElement).checked" />
    </label>
    <div>
      <Label>Keys to display (comma-separated, empty = all)</Label>
      <Input v-model="keysInput" placeholder="e.g. cpu, ram, disk" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const props = defineProps<{ modelValue: { title: string; showChart?: boolean; keys?: string[] } }>()
const emit = defineEmits<{ 'update:modelValue': [v: typeof props.modelValue] }>()
const local = reactive({ showChart: true, keys: [] as string[], ...props.modelValue })

const keysInput = ref((props.modelValue.keys ?? []).join(', '))
watch(keysInput, v => {
  local.keys = v.split(',').map(s => s.trim()).filter(Boolean)
})
watch(local, v => emit('update:modelValue', { ...v }), { deep: true })
</script>
