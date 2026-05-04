import { useDb } from '../../utils/db'
import { widgets } from '../../db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const db = useDb()

  await db.delete(widgets).where(and(eq(widgets.id, id), eq(widgets.userId, uid)))
  return { ok: true }
})
