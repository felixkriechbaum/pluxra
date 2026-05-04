<template>
  <div class="space-y-2">
    <div>
      <Label>City</Label>
      <Input v-model="local.city" />
    </div>
    <div>
      <Label>Units</Label>
      <select v-model="local.units" class="w-full border rounded px-2 py-1 text-sm bg-background">
        <option value="metric">Metric (°C)</option>
        <option value="imperial">Imperial (°F)</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const props = defineProps<{ modelValue: { city: string; units: string } }>()
const emit = defineEmits<{ 'update:modelValue': [v: typeof props.modelValue] }>()
const local = reactive({ ...props.modelValue })
watch(local, v => emit('update:modelValue', v), { deep: true })
</script>
