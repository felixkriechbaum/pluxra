<template>
  <div class="p-3 space-y-2">
    <h3 class="font-semibold text-sm">{{ config.title }}</h3>
    <a
      v-for="item in (items as any[])"
      :key="item.link"
      :href="item.link"
      target="_blank"
      rel="noopener noreferrer"
      class="block text-xs hover:underline truncate"
    >
      {{ item.title }}
    </a>
    <p v-if="!items?.length" class="text-xs text-muted-foreground">No items.</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ config: { feedUrl: string; title: string; maxItems: number } }>()
const { data: items } = useFetch(
  () => `/api/rss?url=${encodeURIComponent(props.config.feedUrl)}&max=${props.config.maxItems}`,
)
</script>
