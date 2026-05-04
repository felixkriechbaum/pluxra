import { useDb } from '../../utils/db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const email = event.context.email as string
  const db = useDb()

  const existing = await db.select().from(users).where(eq(users.id, uid)).limit(1)
  if (existing.length === 0) {
    await db.insert(users).values({ id: uid, email })
  }

  return { uid, email }
})
