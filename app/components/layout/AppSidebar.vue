<template>
  <nav class="w-56 shrink-0 border-r bg-card flex flex-col h-full">
    <div class="p-4 font-semibold text-lg border-b">Dashboard</div>
    <ul class="flex-1 overflow-y-auto p-2 space-y-1">
      <li v-for="page in pages" :key="page.id">
        <NuxtLink
          :to="`/${page.slug}`"
          class="block px-3 py-2 rounded-md text-sm hover:bg-accent"
          active-class="bg-accent font-medium"
        >
          {{ page.title }}
        </NuxtLink>
      </li>
    </ul>
    <div class="p-2 border-t space-y-1">
      <div v-if="showAddForm" class="space-y-1 p-1">
        <input
          v-model="newTitle"
          placeholder="Page title"
          class="w-full border rounded px-2 py-1 text-sm bg-background"
          @keyup.enter="addPage"
        />
        <div class="flex gap-1">
          <Button size="sm" class="flex-1" @click="addPage">Add</Button>
          <Button size="sm" variant="ghost" @click="showAddForm = false">Cancel</Button>
        </div>
      </div>
      <Button v-else variant="ghost" class="w-full justify-start text-sm" @click="showAddForm = true">
        <Plus class="h-4 w-4 mr-2" /> Add page
      </Button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const { pages, createPage } = usePages()
const showAddForm = ref(false)
const newTitle = ref('')

async function addPage() {
  const title = newTitle.value.trim()
  if (!title) return
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  await createPage(title, slug)
  newTitle.value = ''
  showAddForm.value = false
}
</script>
