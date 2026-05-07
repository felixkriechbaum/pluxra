import { z } from 'zod'
import type { WidgetPlugin } from '../types'
import component from './component.vue'
import settings from './settings.vue'

export const searchPlugin: WidgetPlugin = {
  manifest: {
    id: 'search',
    name: 'Search',
    icon: 'search',
    dataSource: 'static',
    defaultSize: { colSpan: 6, rowSpan: 2 },
    configSchema: z.object({
      defaultEngine: z.string().default('duckduckgo'),
      extraEngines: z.array(z.object({
        key: z.string(),
        name: z.string(),
        url: z.string(),
        icon: z.string().default(''),
      })).default([]),
    }),
  },
  component,
  settings,
}
