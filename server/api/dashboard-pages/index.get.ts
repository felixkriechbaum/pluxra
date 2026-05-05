import { useDb } from '../../utils/db'
import { pages, tabs } from '../../db/schema'
import { eq, asc, inArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const db = useDb()

  const userPages = await db.select().from(pages).where(eq(pages.userId, uid)).orderBy(asc(pages.position))
  if (!userPages.length) return []

  const allTabs = await db.select().from(tabs)
    .where(inArray(tabs.pageId, userPages.map(p => p.id)))
    .orderBy(asc(tabs.position))

  return userPages.map(p => ({ ...p, tabs: allTabs.filter(t => t.pageId === p.id) }))
})
