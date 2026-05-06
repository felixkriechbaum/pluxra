<template>
  <header class="flex items-stretch px-2 gap-2 bg-muted/40 border-b border-border min-h-10">
    <nav class="flex items-end gap-0.5 flex-1 overflow-x-auto scrollbar-hide pt-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'group flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-t-md border-l border-t border-r -mb-px transition-colors whitespace-nowrap',
          currentTabId === tab.id
            ? 'bg-background border-border text-foreground'
            : 'bg-muted/60 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
        ]"
        @click="router.push(`/${tab.id}`)"
      >
        {{ tab.title }}
      </button>
      <button
        class="flex items-center justify-center px-2 py-1.5 rounded-t-md border-l border-t border-r border-transparent -mb-px text-muted-foreground hover:text-foreground transition-colors"
        @click="emit('addTab')"
      >
        <Plus class="h-3.5 w-3.5" />
      </button>
    </nav>
    <div class="flex items-center gap-1 shrink-0">
      <button
        class="px-3 py-1 text-xs rounded border border-border hover:bg-accent transition-colors"
        @click="toggleEditMode"
      >
        {{ editMode ? t('done') : t('edit') }}
      </button>
      <NuxtLink to="/settings/tokens">
        <button class="p-1.5 rounded hover:bg-accent transition-colors" :title="t('settings')">
          <Settings class="h-4 w-4" />
        </button>
      </NuxtLink>
      <button class="px-3 py-1 text-xs rounded hover:bg-accent transition-colors" @click="logout">
        {{ t('logout') }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Settings, Plus } from 'lucide-vue-next'

defineProps<{
  tabs: { id: string; title: string }[]
  currentTabId: string
}>()

const emit = defineEmits<{ addTab: [] }>()
const { editMode, toggleEditMode } = useGrid()
const { logout } = useUser()
const { t } = useLocale()
const router = useRouter()
</script>
