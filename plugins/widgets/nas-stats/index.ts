import { z } from 'zod'
import type { WidgetPlugin } from '../types'
import component from './component.vue'
import settings from './settings.vue'

export const nasStatsPlugin: WidgetPlugin = {
  manifest: {
    id: 'nas-stats',
    name: 'NAS Stats',
    icon: 'hard-drive',
    dataSource: 'push',
    defaultSize: { colSpan: 3, rowSpan: 2 },
    configSchema: z.object({
      title: z.string().default('NAS'),
    }),
  },
  component,
  settings,
}
