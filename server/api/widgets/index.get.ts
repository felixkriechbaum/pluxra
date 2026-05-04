import { useDb } from '../../utils/db'
import { widgets, tabs, pages } from '../../db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const querySchema = z.object({ tabId: z.string().uuid() })

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const query = await getValidatedQuery(event, querySchema.parse)
  const db = useDb()

  const [tab] = await db.select().from(tabs).where(eq(tabs.id, query.tabId)).limit(1)
  if (!tab) throw createError({ statusCode: 404, message: 'Tab not found' })
  const [page] = await db.select().from(pages).where(and(eq(pages.id, tab.pageId), eq(pages.userId, uid))).limit(1)
  if (!page) throw createError({ statusCode: 403, message: 'Forbidden' })

  return db.select().from(widgets).where(eq(widgets.tabId, query.tabId))
})
