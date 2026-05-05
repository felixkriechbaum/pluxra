import { useDb } from '../../utils/db'
import { tabs, pages } from '../../db/schema'
import { eq, count } from 'drizzle-orm'
import { z } from 'zod'
import { randomUUID } from 'uncrypto'

const bodySchema = z.object({
  title: z.string().min(1).max(255),
})

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [page] = await db.select().from(pages).where(eq(pages.userId, uid)).limit(1)
  if (!page) throw createError({ statusCode: 404, message: 'No default page found' })

  const [{ value: pos }] = await db.select({ value: count() }).from(tabs).where(eq(tabs.pageId, page.id))
  const id = randomUUID()
  await db.insert(tabs).values({ id, pageId: page.id, title: body.title, position: pos })
  return { id, pageId: page.id, title: body.title, position: pos }
})
