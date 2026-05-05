import { useDb } from '../../utils/db'
import { pages, tabs } from '../../db/schema'
import { eq, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const db = useDb()

  const [page] = await db.select().from(pages).where(eq(pages.userId, uid)).limit(1)
  if (!page) return []

  return db.select().from(tabs).where(eq(tabs.pageId, page.id)).orderBy(asc(tabs.position))
})
