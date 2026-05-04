<template>
  <div>
    <Label>Title</Label>
    <Input v-model="local.title" />
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const props = defineProps<{ modelValue: { title: string } }>()
const emit = defineEmits<{ 'update:modelValue': [v: typeof props.modelValue] }>()
const local = reactive({ ...props.modelValue })
watch(local, v => emit('update:modelValue', v), { deep: true })
</script>
