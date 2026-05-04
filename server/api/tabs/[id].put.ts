import { useDb } from '../../utils/db'
import { tabs, pages } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const bodySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  position: z.number().int().min(0).optional(),
})

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [tab] = await db.select().from(tabs).where(eq(tabs.id, id)).limit(1)
  if (!tab) throw createError({ statusCode: 404, message: 'Tab not found' })
  const [page] = await db.select().from(pages).where(eq(pages.id, tab.pageId)).limit(1)
  if (!page || page.userId !== uid) throw createError({ statusCode: 403, message: 'Forbidden' })

  await db.update(tabs).set(body).where(eq(tabs.id, id))
  return { ok: true }
})
