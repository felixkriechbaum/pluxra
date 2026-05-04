import { useDb } from '../../utils/db'
import { pages } from '../../db/schema'
import { eq, count } from 'drizzle-orm'
import { z } from 'zod'
import { randomUUID } from 'uncrypto'

const bodySchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
})

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [{ value: pos }] = await db.select({ value: count() }).from(pages).where(eq(pages.userId, uid))
  const id = randomUUID()
  await db.insert(pages).values({ id, userId: uid, title: body.title, slug: body.slug, position: pos })
  return { id, title: body.title, slug: body.slug, position: pos }
})
