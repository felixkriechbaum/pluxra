import { useDb } from '../../utils/db'
import { ingestTokens, ingestTokenWidgets } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const db = useDb()

  const rows = await db.select({
    id: ingestTokens.id,
    label: ingestTokens.label,
    expiresAt: ingestTokens.expiresAt,
    lastUsedAt: ingestTokens.lastUsedAt,
  }).from(ingestTokens).where(eq(ingestTokens.userId, uid))

  if (!rows.length) return []

  const allLinks = await Promise.all(
    rows.map(r => db.select({ widgetId: ingestTokenWidgets.widgetId })
      .from(ingestTokenWidgets)
      .where(eq(ingestTokenWidgets.tokenId, r.id))),
  )

  return rows.map((r, i) => ({
    ...r,
    widgetIds: allLinks[i]!.map(l => l.widgetId),
  }))
})
