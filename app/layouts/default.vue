<template>
  <div class="flex flex-col h-screen overflow-hidden bg-background text-foreground">
    <AppTopbar
      :tabs="tabs ?? []"
      :current-tab-id="currentTabId"
      @add-tab="showAddTab = true"
    />
    <main class="flex-1 overflow-auto p-4 relative">
      <slot />
      <span class="fixed bottom-2 right-3 text-[10px] text-muted-foreground/40 select-none pointer-events-none tabular-nums">
        {{ appVersion }}
      </span>
    </main>
    <div v-if="showAddTab" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-card border rounded-lg p-6 w-80 space-y-4">
        <h2 class="font-semibold">{{ t('addTab') }}</h2>
        <input
          v-model="newTabTitle"
          :placeholder="t('addTabPlaceholder')"
          class="w-full border rounded px-2 py-1 text-sm bg-background"
          autofocus
          @keyup.enter="addTab"
        />
        <div class="flex gap-2">
          <button class="flex-1 px-3 py-1.5 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90" @click="addTab">{{ t('add') }}</button>
          <button class="px-3 py-1.5 text-sm rounded hover:bg-accent" @click="showAddTab = false">{{ t('cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppTopbar from '~/components/layout/AppTopbar.vue'

const route = useRoute()
const router = useRouter()
const { tabs, createTab } = useTabs()
const { t } = useLocale()
const appVersion = useRuntimeConfig().public.appVersion

const showAddTab = ref(false)
const newTabTitle = ref('')

const currentTabId = computed(() => (route.params.tab as string) ?? '')

async function addTab() {
  const title = newTabTitle.value.trim()
  if (!title) return
  const tab = await createTab(title)
  newTabTitle.value = ''
  showAddTab.value = false
  router.push(`/${tab.id}`)
}
</script>
