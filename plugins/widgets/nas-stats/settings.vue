<template>
  <div class="space-y-3">
    <div>
      <Label>Title</Label>
      <Input v-model="local.title" />
    </div>

    <div class="space-y-2 pt-1">
      <h3 class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Y-Axis</h3>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <Label>Suffix</Label>
          <Input v-model="local.yAxisSuffix" placeholder="%" />
        </div>
        <div>
          <Label>Min</Label>
          <Input v-model.number="local.yAxisMin" type="number" />
        </div>
        <div>
          <Label>Max</Label>
          <Input v-model.number="local.yAxisMax" type="number" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const props = defineProps<{ modelValue: { title: string; yAxisSuffix?: string; yAxisMin?: number; yAxisMax?: number } }>()
const emit = defineEmits<{ 'update:modelValue': [v: typeof props.modelValue] }>()
const local = reactive({ yAxisSuffix: '%', yAxisMin: 0, yAxisMax: 100, ...props.modelValue })
watch(local, v => emit('update:modelValue', { ...v }), { deep: true })
</script>
