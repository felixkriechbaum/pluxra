<template>
  <div class="space-y-2">
    <div>
      <Label>Feed URL</Label>
      <Input v-model="local.feedUrl" placeholder="https://..." />
    </div>
    <div>
      <Label>Title</Label>
      <Input v-model="local.title" />
    </div>
    <div>
      <Label>Max items</Label>
      <Input v-model.number="local.maxItems" type="number" min="1" max="20" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const props = defineProps<{ modelValue: { feedUrl: string; title: string; maxItems: number } }>()
const emit = defineEmits<{ 'update:modelValue': [v: typeof props.modelValue] }>()
const local = reactive({ ...props.modelValue })
watch(local, v => emit('update:modelValue', v), { deep: true })
</script>
