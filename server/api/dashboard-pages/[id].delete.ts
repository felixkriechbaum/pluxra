import { useDb } from '../../utils/db'
import { pages } from '../../db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const db = useDb()

  await db.delete(pages).where(and(eq(pages.id, id), eq(pages.userId, uid)))
  return { ok: true }
})
