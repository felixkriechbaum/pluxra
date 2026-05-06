import { z } from 'zod'
import type { WidgetPlugin } from '../types'
import component from './component.vue'
import settings from './settings.vue'

export const weatherPlugin: WidgetPlugin = {
  manifest: {
    id: 'weather',
    name: 'Weather',
    icon: 'cloud',
    dataSource: 'poll',
    defaultSize: { colSpan: 3, rowSpan: 2 },
    configSchema: z.object({
      city: z.string().default(''),
      units: z.enum(['metric', 'imperial']).default('metric'),
      provider: z.enum(['open-meteo', 'openweathermap', 'weatherapi']).default('open-meteo'),
      apiKey: z.string().default(''),
    }),
  },
  component,
  settings,
}
