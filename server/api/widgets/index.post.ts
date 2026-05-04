import { useDb } from '../../utils/db'
import { widgets, tabs, pages } from '../../db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { randomUUID } from 'uncrypto'

const bodySchema = z.object({
  tabId: z.string().uuid(),
  pluginId: z.string().min(1).max(100),
  colStart: z.number().int().min(1),
  colSpan: z.number().int().min(1),
  rowStart: z.number().int().min(1),
  rowSpan: z.number().int().min(1),
  config: z.record(z.unknown()).default({}),
})

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [tab] = await db.select().from(tabs).where(eq(tabs.id, body.tabId)).limit(1)
  if (!tab) throw createError({ statusCode: 404, message: 'Tab not found' })
  const [page] = await db.select().from(pages).where(and(eq(pages.id, tab.pageId), eq(pages.userId, uid))).limit(1)
  if (!page) throw createError({ statusCode: 403, message: 'Forbidden' })

  const id = randomUUID()
  await db.insert(widgets).values({ id, userId: uid, ...body })
  return { id, ...body }
})
