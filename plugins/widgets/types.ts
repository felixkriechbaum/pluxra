import type { Component } from 'vue'
import type { ZodTypeAny } from 'zod'

export type DataSource = 'poll' | 'realtime' | 'push' | 'static'

export interface WidgetManifest {
  id: string
  name: string
  icon: string
  configSchema: ZodTypeAny
  dataSource: DataSource
  defaultSize: { colSpan: number; rowSpan: number }
}

export interface WidgetPlugin {
  manifest: WidgetManifest
  component: Component
  settings: Component
}
