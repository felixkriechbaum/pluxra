<template>
  <div class="flex flex-col h-full p-3 gap-2 overflow-hidden">
    <h3 class="font-semibold text-xs uppercase tracking-wide text-muted-foreground shrink-0">
      {{ config.title ?? 'Bookmarks' }}
    </h3>

    <!-- Icon-only: grid of favicon tiles -->
    <div v-if="display === 'icon'" class="flex flex-wrap gap-2 overflow-y-auto content-start">
      <a
        v-for="item in items"
        :key="item.url"
        :href="item.url"
        :title="item.label"
        target="_blank"
        rel="noopener noreferrer"
        class="w-9 aspect-square flex-none flex items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors"
      >
        <img
          v-if="!faviconError[item.url]"
          :src="faviconUrl(item.url)"
          class="w-4 h-4 object-contain"
          loading="lazy"
          @error="faviconError[item.url] = true"
        >
        <span v-else class="text-xs font-semibold text-muted-foreground">
          {{ item.label.charAt(0).toUpperCase() }}
        </span>
      </a>
    </div>

    <!-- Row layout: label or both -->
    <div v-else class="flex flex-col gap-0.5 overflow-y-auto">
      <a
        v-for="item in items"
        :key="item.url"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-accent transition-colors group"
      >
        <div v-if="display === 'both'" class="w-4 h-4 shrink-0 flex items-center justify-center overflow-hidden">
          <img
            v-if="!faviconError[item.url]"
            :src="faviconUrl(item.url)"
            class="w-4 h-4 object-contain"
            loading="lazy"
            @error="faviconError[item.url] = true"
          >
          <span v-else class="text-xs font-semibold text-muted-foreground leading-none">
            {{ item.label.charAt(0).toUpperCase() }}
          </span>
        </div>
        <span class="text-sm truncate text-foreground/80 group-hover:text-foreground transition-colors">
          {{ item.label }}
        </span>
      </a>
    </div>

    <p v-if="items.length === 0" class="text-xs text-muted-foreground">No bookmarks yet.</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ config: Record<string, unknown> }>()

const items = computed(() => (props.config.items as { label: string; url: string }[]) ?? [])
const display = computed(() => (props.config.display as string) ?? 'both')
const faviconError = reactive<Record<string, boolean>>({})

function faviconUrl(url: string) {
  try {
    return `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico`
  }
  catch { return '' }
}
</script>
