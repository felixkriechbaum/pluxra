import { useDb } from '../../utils/db'
import { widgets } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const db = useDb()
  return db.select({ id: widgets.id, pluginId: widgets.pluginId, tabId: widgets.tabId })
    .from(widgets).where(eq(widgets.userId, uid))
})
