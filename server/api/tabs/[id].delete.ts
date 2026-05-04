import { useDb } from '../../utils/db'
import { tabs, pages } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const db = useDb()

  const [tab] = await db.select().from(tabs).where(eq(tabs.id, id)).limit(1)
  if (!tab) throw createError({ statusCode: 404, message: 'Tab not found' })
  const [page] = await db.select().from(pages).where(eq(pages.id, tab.pageId)).limit(1)
  if (!page || page.userId !== uid) throw createError({ statusCode: 403, message: 'Forbidden' })

  await db.delete(tabs).where(eq(tabs.id, id))
  return { ok: true }
})
