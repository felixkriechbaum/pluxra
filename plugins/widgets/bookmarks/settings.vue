<template>
  <div class="space-y-4">
    <div>
      <Label>Title</Label>
      <Input v-model="local.title" />
    </div>
    <div v-for="(item, i) in local.items" :key="i" class="flex gap-2">
      <Input v-model="item.label" placeholder="Label" />
      <Input v-model="item.url" placeholder="https://..." />
      <Button variant="ghost" size="icon" @click="local.items.splice(i, 1)">✕</Button>
    </div>
    <Button variant="outline" @click="local.items.push({ label: '', url: '' })">Add bookmark</Button>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const props = defineProps<{ modelValue: { title: string; items: { label: string; url: string }[] } }>()
const emit = defineEmits<{ 'update:modelValue': [v: typeof props.modelValue] }>()
const local = reactive({ ...props.modelValue, items: props.modelValue.items.map(i => ({ ...i })) })
watch(local, v => emit('update:modelValue', v), { deep: true })
</script>
