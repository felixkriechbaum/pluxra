<template>
  <div class="p-3 space-y-2">
    <h3 class="font-semibold text-sm">{{ config.title }}</h3>
    <a
      v-for="item in config.items"
      :key="item.url"
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-2 text-sm hover:underline"
    >
      {{ item.label }}
    </a>
    <p v-if="config.items.length === 0" class="text-xs text-muted-foreground">No bookmarks yet.</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ config: { title: string; items: { label: string; url: string }[] } }>()
</script>
