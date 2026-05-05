import { useDb } from '../../utils/db'
import { pages, tabs } from '../../db/schema'
import { eq, and, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const db = useDb()

  const [page] = await db.select().from(pages).where(and(eq(pages.slug, id), eq(pages.userId, uid))).limit(1)
  if (!page) throw createError({ statusCode: 404, message: 'Page not found' })

  const pageTabs = await db.select().from(tabs).where(eq(tabs.pageId, id)).orderBy(asc(tabs.position))
  return { ...page, tabs: pageTabs }
})
