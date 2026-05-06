import { useDb } from '../../utils/db'
import { ingestData, widgets, tabs, pages } from '../../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { z } from 'zod'

const querySchema = z.object({ widgetId: z.string().uuid() })

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const query = await getValidatedQuery(event, querySchema.parse)
  const db = useDb()

  const [widget] = await db.select().from(widgets).where(eq(widgets.id, query.widgetId)).limit(1)
  if (!widget) throw createError({ statusCode: 404, message: 'Widget not found' })

  const [tab] = await db.select().from(tabs).where(eq(tabs.id, widget.tabId)).limit(1)
  const [page] = await db.select().from(pages).where(and(eq(pages.id, tab.pageId), eq(pages.userId, uid))).limit(1)
  if (!page) throw createError({ statusCode: 403, message: 'Forbidden' })

  const rows = await db.select({ payload: ingestData.payload, createdAt: ingestData.createdAt })
    .from(ingestData)
    .where(eq(ingestData.widgetId, query.widgetId))
    .orderBy(desc(ingestData.createdAt))
    .limit(10)

  return rows.reverse()
})
