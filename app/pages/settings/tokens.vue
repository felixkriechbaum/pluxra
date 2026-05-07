<template>
  <div class="max-w-2xl mx-auto py-8 space-y-6">
    <h1 class="text-2xl font-semibold">Ingest Tokens</h1>

    <div v-if="(tokens as any[])?.length" class="space-y-2">
      <div
        v-for="token in (tokens as any[])"
        :key="token.id"
        class="border rounded-lg overflow-hidden"
      >
        <div class="flex items-center justify-between p-3">
          <div>
            <p class="text-sm font-medium">{{ token.label }}</p>
            <p class="text-xs text-muted-foreground">
              Expires: {{ new Date(token.expiresAt).toLocaleDateString() }}
              <span v-if="isExpired(token.expiresAt)" class="text-destructive ml-1">(expired)</span>
            </p>
            <p v-if="token.lastUsedAt" class="text-xs text-muted-foreground">
              Last used: {{ new Date(token.lastUsedAt).toLocaleDateString() }}
            </p>
            <button
              class="text-xs text-primary underline-offset-2 hover:underline mt-0.5"
              @click="toggleEdit(token.id, token.widgetIds)"
            >
              {{ editingId === token.id ? 'Close' : `${token.widgetIds?.length ?? 0} widget${token.widgetIds?.length !== 1 ? 's' : ''} · Edit` }}
            </button>
          </div>
          <Button variant="destructive" size="sm" @click="deleteToken(token.id)">Delete</Button>
        </div>

        <div v-if="editingId === token.id" class="border-t px-3 py-2 bg-muted/40 space-y-2">
          <p class="text-xs font-medium">Widgets for this token:</p>
          <div class="border rounded bg-background p-2 space-y-1 max-h-40 overflow-y-auto">
            <label
              v-for="w in (allWidgets as any[])"
              :key="w.id"
              class="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted px-1 py-0.5 rounded"
            >
              <input
                type="checkbox"
                :value="w.id"
                v-model="editWidgetIds"
                class="cursor-pointer"
              />
              {{ w.pluginId }} <span class="text-xs text-muted-foreground">({{ w.id.slice(0, 8) }})</span>
            </label>
            <p v-if="!(allWidgets as any[])?.length" class="text-xs text-muted-foreground">No widgets found.</p>
          </div>
          <div class="flex gap-2">
            <Button size="sm" :disabled="!editWidgetIds.length || saving" @click="saveEdit(token.id)">
              {{ saving ? 'Saving…' : 'Save' }}
            </Button>
            <Button size="sm" variant="outline" @click="editingId = null">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-sm text-muted-foreground">No tokens yet.</p>

    <div class="border rounded-lg p-4 space-y-3">
      <h2 class="font-medium text-sm">Create new token</h2>
      <Input v-model="form.label" placeholder="Label (e.g. NAS Token)" />

      <div class="space-y-1">
        <label class="text-sm font-medium">Widgets (select one or more)</label>
        <div class="border rounded p-2 space-y-1 max-h-40 overflow-y-auto">
          <label
            v-for="w in (allWidgets as any[])"
            :key="w.id"
            class="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted px-1 py-0.5 rounded"
          >
            <input
              type="checkbox"
              :value="w.id"
              v-model="form.widgetIds"
              class="cursor-pointer"
            />
            {{ w.pluginId }} <span class="text-xs text-muted-foreground">({{ w.id.slice(0, 8) }})</span>
          </label>
          <p v-if="!(allWidgets as any[])?.length" class="text-xs text-muted-foreground">No widgets found.</p>
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium">Expires on (max. 1 year from today)</label>
        <input
          v-model="form.expiresOn"
          type="date"
          :min="minDate"
          :max="maxDate"
          class="select-input cursor-pointer"
        />
      </div>
      <Button :disabled="!form.widgetIds.length || !form.label || !form.expiresOn" @click="onCreate">
        Create token
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'settings' })

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const { tokens, createToken, updateTokenWidgets, deleteToken } = useIngestTokens()
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

const form = reactive({ label: '', widgetIds: [] as string[], expiresOn: '' })

const editingId = ref<string | null>(null)
const editWidgetIds = ref<string[]>([])
const saving = ref(false)

function isExpired(expiresAt: string) { return new Date(expiresAt) < new Date() }

function toggleEdit(id: string, currentWidgetIds: string[]) {
  if (editingId.value === id) {
    editingId.value = null
  } else {
    editingId.value = id
    editWidgetIds.value = [...(currentWidgetIds ?? [])]
  }
}

async function saveEdit(id: string) {
  saving.value = true
  await updateTokenWidgets(id, editWidgetIds.value)
  saving.value = false
  editingId.value = null
}

async function onCreate() {
  const expiresAt = new Date(form.expiresOn)
  expiresAt.setHours(23, 59, 59, 999)
  const lifetimeMs = expiresAt.getTime() - Date.now()
  await createToken(form.widgetIds, form.label, lifetimeMs)
  form.label = ''
  form.widgetIds = []
  form.expiresOn = ''
}
</script>
