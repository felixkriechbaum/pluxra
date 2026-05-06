import type { WidgetPlugin } from './types'
import { bookmarksPlugin } from './bookmarks'
import { serverStatsPlugin } from './server-stats'
import { nasStatsPlugin } from './nas-stats'
import { iframePlugin } from './iframe'
import { weatherPlugin } from './weather'
import { rssPlugin } from './rss'
import { customPlugin } from './custom'

export const widgetRegistry: Record<string, WidgetPlugin> = {
  bookmarks: bookmarksPlugin,
  'server-stats': serverStatsPlugin,
  'nas-stats': nasStatsPlugin,
  iframe: iframePlugin,
  weather: weatherPlugin,
  rss: rssPlugin,
  custom: customPlugin,
}

export function getWidget(id: string): WidgetPlugin {
  const plugin = widgetRegistry[id]
  if (!plugin) throw new Error(`Unknown widget plugin: ${id}`)
  return plugin
}
