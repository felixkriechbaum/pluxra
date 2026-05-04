import { useDb } from '../../utils/db'
import { pages } from '../../db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const bodySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
  position: z.number().int().min(0).optional(),
})

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  await db.update(pages).set(body).where(and(eq(pages.id, id), eq(pages.userId, uid)))
  return { ok: true }
})
