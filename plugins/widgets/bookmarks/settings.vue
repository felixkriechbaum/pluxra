<template>
  <div class="space-y-4">
    <div>
      <Label>Title</Label>
      <Input v-model="local.title" />
    </div>
    <div>
      <Label>Anzeige</Label>
      <div class="flex gap-1 mt-1">
        <button
          v-for="opt in displayOptions"
          :key="opt.value"
          class="flex-1 px-2 py-1.5 text-xs rounded border transition-colors"
          :class="local.display === opt.value
            ? 'bg-primary text-primary-foreground border-primary'
            : 'hover:bg-accent border-border'"
          @click="local.display = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <div v-for="(item, i) in local.items" :key="i" class="flex gap-2">
        <Input v-model="item.label" placeholder="Label" />
        <Input v-model="item.url" placeholder="https://..." />
        <Button variant="ghost" size="icon" @click="local.items.splice(i, 1)">✕</Button>
      </div>
    </div>

    <div class="flex gap-2">
      <Button variant="outline" @click="local.items.push({ label: '', url: '' })">
        Add bookmark
      </Button>
      <Button variant="outline" @click="fileInput?.click()">
        Import from file
      </Button>
      <input
        ref="fileInput"
        type="file"
        accept=".html"
        class="hidden"
        @change="onFileSelected"
      >
    </div>

    <!-- Folder picker after parsing -->
    <div v-if="parsedFolders.length" class="space-y-2 border rounded-md p-3">
      <p class="text-xs text-muted-foreground font-medium">Ordner wählen:</p>
      <div class="flex flex-col gap-1 max-h-48 overflow-y-auto">
        <button
          v-for="folder in parsedFolders"
          :key="folder.name"
          class="flex items-center justify-between px-2 py-1.5 rounded hover:bg-accent text-sm text-left transition-colors"
          @click="importFolder(folder)"
        >
          <span>{{ folder.name }}</span>
          <span class="text-xs text-muted-foreground">{{ folder.items.length }} Einträge</span>
        </button>
      </div>
      <Button variant="ghost" size="sm" class="w-full" @click="parsedFolders = []">Abbrechen</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const props = defineProps<{ modelValue: Record<string, unknown> }>()
const emit = defineEmits<{ 'update:modelValue': [v: Record<string, unknown>] }>()

const displayOptions = [
  { value: 'both', label: 'Favicon + Text' },
  { value: 'label', label: 'Nur Text' },
  { value: 'icon', label: 'Nur Favicon' },
]

const local = reactive({
  title: (props.modelValue.title as string) ?? 'Bookmarks',
  display: (props.modelValue.display as string) ?? 'both',
  items: ((props.modelValue.items as { label: string; url: string }[]) ?? []).map(i => ({ ...i })),
})

watch(local, v => emit('update:modelValue', v), { deep: true })

const fileInput = ref<HTMLInputElement | null>(null)
const parsedFolders = ref<{ name: string; items: { label: string; url: string }[] }[]>([])

function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    parsedFolders.value = parseBookmarkHtml(ev.target?.result as string)
    if (fileInput.value) fileInput.value.value = ''
  }
  reader.readAsText(file)
}

function parseBookmarkHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const folders: { name: string; items: { label: string; url: string }[] }[] = []

  doc.querySelectorAll('h3').forEach((h3) => {
    const dl = h3.closest('dt')?.nextElementSibling
    if (!dl) return
    const items: { label: string; url: string }[] = []
    dl.querySelectorAll('a').forEach((a) => {
      const url = a.getAttribute('href') ?? ''
      const label = a.textContent?.trim() ?? ''
      if (label && url.startsWith('http')) items.push({ label, url })
    })
    if (items.length) folders.push({ name: h3.textContent?.trim() ?? 'Ordner', items })
  })

  // Fallback: root-level bookmarks without a folder
  if (!folders.length) {
    const items: { label: string; url: string }[] = []
    doc.querySelectorAll('a').forEach((a) => {
      const url = a.getAttribute('href') ?? ''
      const label = a.textContent?.trim() ?? ''
      if (label && url.startsWith('http')) items.push({ label, url })
    })
    if (items.length) folders.push({ name: 'Alle Bookmarks', items })
  }

  return folders
}

function importFolder(folder: { name: string; items: { label: string; url: string }[] }) {
  local.items.push(...folder.items)
  parsedFolders.value = []
}
</script>
