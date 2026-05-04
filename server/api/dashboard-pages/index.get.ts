import { useDb } from '../../utils/db'
import { pages } from '../../db/schema'
import { eq, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const db = useDb()
  return db.select().from(pages).where(eq(pages.userId, uid)).orderBy(asc(pages.position))
})
