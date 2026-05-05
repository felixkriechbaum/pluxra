<template>
  <div class="max-w-2xl mx-auto py-8 space-y-6">
    <h1 class="text-2xl font-semibold">Ingest Tokens</h1>

    <div v-if="newTokenRaw" class="p-4 border rounded-lg bg-muted space-y-2">
      <p class="text-sm font-medium">Token created — copy it now, it won't be shown again:</p>
      <code class="block text-xs break-all select-all bg-background p-2 rounded border">{{ newTokenRaw }}</code>
      <Button variant="outline" size="sm" @click="clearNewToken">Dismiss</Button>
    </div>

    <div v-if="(tokens as any[])?.length" class="space-y-2">
      <div
        v-for="token in (tokens as any[])"
        :key="token.id"
        class="flex items-center justify-between p-3 border rounded-lg"
      >
        <div>
          <p class="text-sm font-medium">{{ token.label }}</p>
          <p class="text-xs text-muted-foreground">
            Expires: {{ new Date(token.expiresAt).toLocaleDateString() }}
            <span v-if="isExpired(token.expiresAt)" class="text-destructive ml-1">(expired)</span>
          </p>
        </div>
        <Button variant="destructive" size="sm" @click="deleteToken(token.id)">Delete</Button>
      </div>
    </div>
    <p v-else class="text-sm text-muted-foreground">No tokens yet.</p>

    <div class="border rounded-lg p-4 space-y-3">
      <h2 class="font-medium text-sm">Create new token</h2>
      <Input v-model="form.label" placeholder="Label (e.g. NAS Token)" />
      <select v-model="form.widgetId" class="w-full border rounded px-2 py-1 text-sm bg-background cursor-pointer">
        <option value="">Select widget...</option>
        <option v-for="w in (allWidgets as any[])" :key="w.id" :value="w.id">
          {{ w.pluginId }} ({{ w.id.slice(0, 8) }})
        </option>
      </select>
      <div class="space-y-1">
        <label class="text-sm font-medium">Expires on (max. 1 year from today)</label>
        <input
          v-model="form.expiresOn"
          type="date"
          :min="minDate"
          :max="maxDate"
          class="w-full border rounded px-2 py-1 text-sm bg-background cursor-pointer"
        />
      </div>
      <Button :disabled="!form.widgetId || !form.label || !form.expiresOn" @click="onCreate">
        Create token
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'settings' })

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const { tokens, createToken, deleteToken, newTokenRaw, clearNewToken } = useIngestTokens()
const { idToken } = useUser()

const { data: allWidgets } = useFetch('/api/widgets/all', {
  headers: computed(() => idToken.value ? { Authorization: `Bearer ${idToken.value}` } : {}),
  watch: [idToken],
})

const minDate = computed(() => {
  const d = new Date()
  d.setHours(d.getHours() + 1)
  return d.toISOString().slice(0, 10)
})

const maxDate = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
})

const form = reactive({ label: '', widgetId: '', expiresOn: '' })

function isExpired(expiresAt: string) { return new Date(expiresAt) < new Date() }

async function onCreate() {
  const expiresAt = new Date(form.expiresOn)
  expiresAt.setHours(23, 59, 59, 999)
  const lifetimeMs = expiresAt.getTime() - Date.now()
  await createToken(form.widgetId, form.label, lifetimeMs)
  form.label = ''
  form.widgetId = ''
  form.expiresOn = ''
}
</script>
