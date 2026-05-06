import { useDb } from '../../utils/db'
import { ingestTokens, ingestTokenWidgets, ingestData } from '../../db/schema'
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

  const createdAt = new Date()
  await db.update(ingestTokens).set({ lastUsedAt: createdAt }).where(eq(ingestTokens.id, token.id))

  // Fire to all linked widgets
  const links = await db.select().from(ingestTokenWidgets).where(eq(ingestTokenWidgets.tokenId, token.id))
  await Promise.all(links.map(async (link) => {
    const id = randomUUID()
    await db.insert(ingestData).values({ id, widgetId: link.widgetId, tokenId: token.id, payload, createdAt })
    useIngestEmitter().emit(`widget:${link.widgetId}`, payload)
  }))

  // Fallback: still support old widgetId column if no links exist
  if (!links.length && token.widgetId) {
    const id = randomUUID()
    await db.insert(ingestData).values({ id, widgetId: token.widgetId, tokenId: token.id, payload, createdAt })
    useIngestEmitter().emit(`widget:${token.widgetId}`, payload)
  }

  return { ok: true }
})
