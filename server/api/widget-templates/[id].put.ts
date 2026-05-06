import { useDb } from '../../utils/db'
import { widgetTemplates } from '../../db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  config: z.record(z.unknown()).optional(),
})

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()
  await db.update(widgetTemplates).set(body).where(and(eq(widgetTemplates.id, id), eq(widgetTemplates.userId, uid)))
  return { ok: true }
})
