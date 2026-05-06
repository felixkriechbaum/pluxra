<template>
  <div class="flex h-screen bg-background text-foreground">
    <!-- Sidebar -->
    <aside class="w-52 shrink-0 border-r bg-card flex flex-col">
      <div class="p-4 border-b space-y-1">
        <p class="font-semibold text-base tracking-tight">pluxra</p>
        <NuxtLink
          to="/"
          class="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {{ t('backToDashboard') }}
        </NuxtLink>
      </div>
      <nav class="flex-1 p-2 space-y-0.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
          active-class="bg-accent text-foreground font-medium"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </aside>

    <!-- Content -->
    <main class="flex-1 overflow-auto p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale()

const navItems = computed(() => [
  { to: '/settings/tokens', label: t('tokens') },
  { to: '/settings/widgets', label: t('myWidgets') },
  { to: '/settings/push', label: t('pushSetup') },
  { to: '/settings/language', label: t('language') },
])
</script>
