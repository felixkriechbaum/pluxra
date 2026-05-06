import { useDb } from '../../utils/db'
import { widgetTemplates } from '../../db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const db = useDb()
  await db.delete(widgetTemplates).where(and(eq(widgetTemplates.id, id), eq(widgetTemplates.userId, uid)))
  return { ok: true }
})
