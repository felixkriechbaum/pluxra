<template>
  <div class="flex h-screen overflow-hidden bg-background text-foreground">
    <AppSidebar />
    <div class="flex flex-col flex-1 overflow-hidden">
      <AppTopbar
        :tabs="currentPageTabs"
        :page-slug="currentPageSlug"
        :current-tab-id="currentTabId"
        @add-tab="showAddTab = true"
      />
      <main class="flex-1 overflow-auto p-4">
        <slot />
      </main>
    </div>
    <!-- Add tab dialog -->
    <div v-if="showAddTab" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-card border rounded-lg p-6 w-80 space-y-4">
        <h2 class="font-semibold">Add tab</h2>
        <input
          v-model="newTabTitle"
          placeholder="Tab title"
          class="w-full border rounded px-2 py-1 text-sm bg-background"
          @keyup.enter="addTab"
        />
        <div class="flex gap-2">
          <Button class="flex-1" @click="addTab">Add</Button>
          <Button variant="ghost" @click="showAddTab = false">Cancel</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '~/components/layout/AppSidebar.vue'
import AppTopbar from '~/components/layout/AppTopbar.vue'
import { Button } from '@/components/ui/button'

const route = useRoute()
const { pages, createTab } = usePages()

const showAddTab = ref(false)
const newTabTitle = ref('')

const currentPage = computed(() =>
  (pages.value as any[])?.find((p: any) => p.slug === route.params.page) ?? null,
)
const currentPageTabs = computed(() => currentPage.value?.tabs ?? [])
const currentPageSlug = computed(() => (route.params.page as string) ?? '')
const currentTabId = computed(() => (route.params.tab as string) ?? '')

async function addTab() {
  const title = newTabTitle.value.trim()
  if (!title || !currentPage.value) return
  await createTab(currentPage.value.id, title)
  newTabTitle.value = ''
  showAddTab.value = false
}
</script>
