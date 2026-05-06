import { useDb } from '../../utils/db'
import { widgetTemplates } from '../../db/schema'
import { z } from 'zod'
import { randomUUID } from 'uncrypto'

const bodySchema = z.object({
  name: z.string().min(1).max(255),
  icon: z.string().default('puzzle'),
  color: z.string().default('#6366f1'),
  config: z.record(z.unknown()).default({}),
})

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()
  const id = randomUUID()
  await db.insert(widgetTemplates).values({ id, userId: uid, ...body })
  return { id, userId: uid, ...body }
})
