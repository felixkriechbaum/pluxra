import { z } from 'zod'
import type { WidgetPlugin } from '../types'
import component from './component.vue'
import settings from './settings.vue'

const blockSchema = z.object({
  key: z.string().default(''),
  label: z.string().default(''),
  type: z.enum(['value', 'bar', 'chart']).default('value'),
  unit: z.string().default(''),
  color: z.string().default('#6366f1'),
  min: z.number().default(0),
  max: z.number().default(100),
})

export const customPlugin: WidgetPlugin = {
  manifest: {
    id: 'custom',
    name: 'Custom Widget',
    icon: 'puzzle',
    dataSource: 'push',
    defaultSize: { colSpan: 3, rowSpan: 3 },
    configSchema: z.object({
      title: z.string().default('Custom'),
      dataSource: z.enum(['push', 'poll']).default('push'),
      pollUrl: z.string().default(''),
      pollInterval: z.number().default(60),
      blocks: z.array(blockSchema).default([]),
    }),
  },
  component,
  settings,
}
