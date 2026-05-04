import { z } from 'zod'
import type { WidgetPlugin } from '../types'
import component from './component.vue'
import settings from './settings.vue'

export const rssPlugin: WidgetPlugin = {
  manifest: {
    id: 'rss',
    name: 'RSS Feed',
    icon: 'rss',
    dataSource: 'poll',
    defaultSize: { colSpan: 4, rowSpan: 5 },
    configSchema: z.object({
      feedUrl: z.string().url(),
      title: z.string().default('Feed'),
      maxItems: z.number().int().min(1).max(20).default(5),
    }),
  },
  component,
  settings,
}
