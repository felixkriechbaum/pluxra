<template>
  <div class="max-w-sm space-y-8">
    <h1 class="text-2xl font-semibold">Appearance</h1>

    <!-- Theme -->
    <div class="space-y-3">
      <h2 class="text-sm font-medium text-muted-foreground uppercase tracking-wide">Theme</h2>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="option in themeOptions"
          :key="option.value"
          class="flex flex-col items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors"
          :class="theme === option.value
            ? 'bg-primary text-primary-foreground border-primary'
            : 'hover:bg-accent border-border'"
          @click="setTheme(option.value)"
        >
          <span class="text-xl">{{ option.icon }}</span>
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Language -->
    <div class="space-y-3">
      <h2 class="text-sm font-medium text-muted-foreground uppercase tracking-wide">Language</h2>
      <div class="flex gap-2">
        <button
          v-for="lang in locales"
          :key="lang"
          class="flex-1 py-3 rounded-lg border text-sm font-medium transition-colors"
          :class="locale === lang
            ? 'bg-primary text-primary-foreground border-primary'
            : 'hover:bg-accent border-border'"
          @click="setLocale(lang)"
        >
          {{ langLabels[lang] }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Theme } from '~/composables/useTheme'
definePageMeta({ layout: 'settings' })

const { theme, setTheme } = useTheme()
const { locale, locales, setLocale } = useLocale()

const themeOptions: { value: Theme; label: string; icon: string }[] = [
  { value: 'light',  label: 'Light',  icon: '☀️' },
  { value: 'dark',   label: 'Dark',   icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
]

const langLabels: Record<string, string> = {
  de: '🇩🇪 Deutsch',
  en: '🇬🇧 English',
}
</script>
