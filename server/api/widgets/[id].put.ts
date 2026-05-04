import { useDb } from '../../utils/db'
import { widgets } from '../../db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const bodySchema = z.object({
  colStart: z.number().int().min(1).optional(),
  colSpan: z.number().int().min(1).optional(),
  rowStart: z.number().int().min(1).optional(),
  rowSpan: z.number().int().min(1).optional(),
  config: z.record(z.unknown()).optional(),
})

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  await db.update(widgets).set(body).where(and(eq(widgets.id, id), eq(widgets.userId, uid)))
  return { ok: true }
})
