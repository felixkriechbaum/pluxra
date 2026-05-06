import { useDb } from '../../utils/db'
import { ingestTokens, ingestTokenWidgets, widgets } from '../../db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { z } from 'zod'

const bodySchema = z.object({
  widgetIds: z.array(z.string().uuid()).min(1),
})

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [token] = await db.select({ id: ingestTokens.id })
    .from(ingestTokens)
    .where(and(eq(ingestTokens.id, id), eq(ingestTokens.userId, uid)))
  if (!token) throw createError({ statusCode: 404, message: 'Not found' })

  const owned = await db.select({ id: widgets.id }).from(widgets)
    .where(and(inArray(widgets.id, body.widgetIds), eq(widgets.userId, uid)))
  if (owned.length !== body.widgetIds.length)
    throw createError({ statusCode: 403, message: 'Forbidden' })

  await db.delete(ingestTokenWidgets).where(eq(ingestTokenWidgets.tokenId, id))
  await db.insert(ingestTokenWidgets).values(body.widgetIds.map(wid => ({ tokenId: id, widgetId: wid })))

  return { ok: true }
})
