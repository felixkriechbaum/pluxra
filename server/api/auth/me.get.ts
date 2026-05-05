import { useDb } from '../../utils/db'
import { users, pages } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'uncrypto'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const email = event.context.email as string
  const db = useDb()

  const existing = await db.select().from(users).where(eq(users.id, uid)).limit(1)
  if (existing.length === 0) {
    await db.insert(users).values({ id: uid, email })
  }

  const [existingPage] = await db.select().from(pages).where(eq(pages.userId, uid)).limit(1)
  let pageId: string
  if (existingPage) {
    pageId = existingPage.id
  }
  else {
    pageId = randomUUID()
    await db.insert(pages).values({ id: pageId, userId: uid, title: 'Default', slug: 'default', position: 0 })
  }

  return { uid, email, pageId }
})
