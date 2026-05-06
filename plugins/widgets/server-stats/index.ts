import { z } from 'zod'
import type { WidgetPlugin } from '../types'
import component from './component.vue'
import settings from './settings.vue'

export const serverStatsPlugin: WidgetPlugin = {
  manifest: {
    id: 'server-stats',
    name: 'Server Stats',
    icon: 'server',
    dataSource: 'push',
    defaultSize: { colSpan: 3, rowSpan: 2 },
    configSchema: z.object({
      title: z.string().default('Server'),
      showChart: z.boolean().default(true),
      keys: z.array(z.string()).default([]),
    }),
  },
  component,
  settings,
}
