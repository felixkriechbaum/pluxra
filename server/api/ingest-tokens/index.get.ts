import { useDb } from '../../utils/db'
import { ingestTokens } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const db = useDb()
  return db.select({
    id: ingestTokens.id,
    widgetId: ingestTokens.widgetId,
    label: ingestTokens.label,
    expiresAt: ingestTokens.expiresAt,
    lastUsedAt: ingestTokens.lastUsedAt,
  }).from(ingestTokens).where(eq(ingestTokens.userId, uid))
})
