import { z } from 'zod'
import type { WidgetPlugin } from '../types'
import component from './component.vue'
import settings from './settings.vue'

export const textPlugin: WidgetPlugin = {
  manifest: {
    id: 'text',
    name: 'Text',
    icon: 'text',
    dataSource: 'poll',
    defaultSize: { colSpan: 3, rowSpan: 2 },
    configSchema: z.object({
      url: z.string().default(''),
      intervalMs: z.number().default(30000),
      fontSize: z.enum(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']).default('base'),
      align: z.enum(['left', 'center', 'right']).default('center'),
      label: z.string().default(''),
      headers: z.string().default(''),
      method: z.enum(['GET', 'POST', 'PUT']).default('GET'),
      body: z.string().default(''),
    }),
  },
  component,
  settings,
}
