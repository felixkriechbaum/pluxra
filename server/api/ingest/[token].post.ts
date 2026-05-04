import { useDb } from '../../utils/db'
import { ingestTokens, ingestData } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { useIngestEmitter } from '../../utils/ingest-emitter'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'uncrypto'

export default defineEventHandler(async (event) => {
  const rawToken = getRouterParam(event, 'token')!
  const payload = await readBody(event)
  const db = useDb()

  const allTokens = await db.select().from(ingestTokens)
  const matchResults = await Promise.all(
    allTokens.map(async t => ({ t, ok: await bcrypt.compare(rawToken, t.tokenHash) })),
  )
  const matched = matchResults.find(r => r.ok)

  if (!matched) throw createError({ statusCode: 401, message: 'Invalid token' })

  const token = matched.t
  if (new Date(token.expiresAt) < new Date()) {
    throw createError({ statusCode: 401, message: 'Token expired' })
  }

  const id = randomUUID()
  const createdAt = new Date()
  await db.insert(ingestData).values({ id, widgetId: token.widgetId, tokenId: token.id, payload, createdAt })
  await db.update(ingestTokens).set({ lastUsedAt: createdAt }).where(eq(ingestTokens.id, token.id))

  useIngestEmitter().emit(`widget:${token.widgetId}`, payload)

  return { ok: true }
})
