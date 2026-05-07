<template>
  <div class="space-y-3">
    <div>
      <Label>Label (optional)</Label>
      <Input v-model="local.label" placeholder="e.g. Status" />
    </div>
    <div class="grid grid-cols-4 gap-2">
      <div class="col-span-1">
        <Label>Method</Label>
        <select v-model="local.method" class="select-input">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
        </select>
      </div>
      <div class="col-span-3">
        <Label>URL</Label>
        <Input v-model="local.url" placeholder="https://example.com/status" />
      </div>
    </div>
    <div>
      <Label>Headers (one per line, <code>Key: Value</code>)</Label>
      <textarea
        v-model="local.headers"
        placeholder="Authorization: Bearer token123&#10;X-Api-Key: mykey"
        rows="3"
        class="w-full border rounded px-2 py-1 text-sm bg-background font-mono resize-y"
      />
    </div>
    <div>
      <Label>Body (optional)</Label>
      <textarea
        v-model="local.body"
        placeholder='{"key": "value"}'
        rows="3"
        class="w-full border rounded px-2 py-1 text-sm bg-background font-mono resize-y"
      />
    </div>
    <div>
      <Label>Poll interval</Label>
      <select v-model.number="local.intervalMs" class="select-input">
        <option :value="5000">5 seconds</option>
        <option :value="15000">15 seconds</option>
        <option :value="30000">30 seconds</option>
        <option :value="60000">1 minute</option>
        <option :value="300000">5 minutes</option>
      </select>
    </div>
    <div>
      <Label>Font size</Label>
      <select v-model="local.fontSize" class="select-input">
        <option value="xs">XS</option>
        <option value="sm">Small</option>
        <option value="base">Normal</option>
        <option value="lg">Large</option>
        <option value="xl">XL</option>
        <option value="2xl">2XL</option>
        <option value="3xl">3XL</option>
        <option value="4xl">4XL</option>
      </select>
    </div>
    <div>
      <Label>Alignment</Label>
      <select v-model="local.align" class="select-input">
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  modelValue: {
    url: string
    intervalMs: number
    fontSize: string
    align: string
    label: string
    headers: string
    method: string
    body: string
  }
}>()
const emit = defineEmits<{ 'update:modelValue': [v: typeof props.modelValue] }>()
const local = reactive({ method: 'GET', body: '', ...props.modelValue })
watch(local, v => emit('update:modelValue', { ...v }), { deep: true })
</script>
