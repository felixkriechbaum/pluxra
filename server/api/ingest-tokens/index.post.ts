import { useDb } from '../../utils/db'
import { ingestTokens, widgets } from '../../db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { randomUUID } from 'uncrypto'
import bcrypt from 'bcryptjs'

const MAX_LIFETIME_MS = 365 * 24 * 60 * 60 * 1000

const bodySchema = z.object({
  widgetId: z.string().uuid(),
  label: z.string().min(1).max(255),
  lifetimeMs: z.number().int().min(3_600_000).max(MAX_LIFETIME_MS),
})

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [widget] = await db.select().from(widgets).where(and(eq(widgets.id, body.widgetId), eq(widgets.userId, uid))).limit(1)
  if (!widget) throw createError({ statusCode: 403, message: 'Forbidden' })

  const rawToken = randomUUID()
  const tokenHash = await bcrypt.hash(rawToken, 10)
  const expiresAt = new Date(Date.now() + body.lifetimeMs)
  const id = randomUUID()

  await db.insert(ingestTokens).values({
    id,
    userId: uid,
    widgetId: body.widgetId,
    tokenHash,
    label: body.label,
    expiresAt,
  })

  return { id, rawToken, label: body.label, expiresAt }
})
