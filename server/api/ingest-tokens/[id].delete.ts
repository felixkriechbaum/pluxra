import { useDb } from '../../utils/db'
import { ingestTokens } from '../../db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const db = useDb()

  await db.delete(ingestTokens).where(and(eq(ingestTokens.id, id), eq(ingestTokens.userId, uid)))
  return { ok: true }
})
