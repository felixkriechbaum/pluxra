<template>
  <div class="max-w-sm space-y-6">
    <h1 class="text-2xl font-semibold">{{ t('language') }}</h1>

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

    <!-- Preview -->
    <div class="border rounded-lg p-4 space-y-2">
      <p class="text-xs text-muted-foreground font-medium uppercase tracking-wide">Preview</p>
      <div class="space-y-1 text-sm">
        <div class="flex justify-between">
          <span class="text-muted-foreground">Edit / Done</span>
          <span>{{ t('edit') }} / {{ t('done') }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">Columns / Rows</span>
          <span>{{ t('gridCols') }} / {{ t('gridRows') }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted-foreground">Logout</span>
          <span>{{ t('logout') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'settings' })

const { locale, locales, t, setLocale } = useLocale()

const langLabels: Record<string, string> = {
  de: '🇩🇪 Deutsch',
  en: '🇬🇧 English',
}
</script>
