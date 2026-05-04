import { z } from 'zod'
import type { WidgetPlugin } from '../types'
import component from './component.vue'
import settings from './settings.vue'

export const bookmarksPlugin: WidgetPlugin = {
  manifest: {
    id: 'bookmarks',
    name: 'Bookmarks',
    icon: 'bookmark',
    dataSource: 'static',
    defaultSize: { colSpan: 4, rowSpan: 4 },
    configSchema: z.object({
      title: z.string().default('Bookmarks'),
      items: z.array(z.object({
        label: z.string(),
        url: z.string().url(),
        icon: z.string().optional(),
      })).default([]),
    }),
  },
  component,
  settings,
}
