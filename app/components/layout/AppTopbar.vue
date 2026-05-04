<template>
  <header class="h-12 border-b flex items-center px-4 gap-4 bg-card">
    <nav class="flex gap-1 flex-1 overflow-x-auto">
      <Button
        v-for="tab in tabs"
        :key="tab.id"
        :variant="currentTabId === tab.id ? 'default' : 'ghost'"
        size="sm"
        @click="router.push(`/${pageSlug}/${tab.id}`)"
      >
        {{ tab.title }}
      </Button>
      <Button variant="ghost" size="sm" @click="emit('addTab')">+</Button>
    </nav>
    <Button variant="outline" size="sm" @click="toggleEditMode">
      {{ editMode ? 'Done' : 'Edit' }}
    </Button>
    <NuxtLink to="/settings/tokens">
      <Button variant="ghost" size="sm">Tokens</Button>
    </NuxtLink>
    <Button variant="ghost" size="sm" @click="logout">Logout</Button>
  </header>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineProps<{
  tabs: { id: string; title: string }[]
  pageSlug: string
  currentTabId: string
}>()

const emit = defineEmits<{ addTab: [] }>()
const { editMode, toggleEditMode } = useGrid()
const { logout } = useUser()
const router = useRouter()
</script>
