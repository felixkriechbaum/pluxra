import { z } from 'zod'
import type { WidgetPlugin } from '../types'
import component from './component.vue'
import settings from './settings.vue'

export const iframePlugin: WidgetPlugin = {
  manifest: {
    id: 'iframe',
    name: 'iFrame',
    icon: 'layout',
    dataSource: 'static',
    defaultSize: { colSpan: 6, rowSpan: 6 },
    configSchema: z.object({
      url: z.string().url(),
      title: z.string().default(''),
    }),
  },
  component,
  settings,
}
