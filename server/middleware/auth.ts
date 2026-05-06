import { useFirebaseAdmin } from '../utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // Ingest endpoint uses its own token auth
  if (url.pathname.startsWith('/api/ingest/')) return

  // Public proxy endpoints — no user context needed
  if (url.pathname === '/api/weather') return
  if (url.pathname === '/api/rss') return

  // Only guard API routes
  if (!url.pathname.startsWith('/api/')) return

  // EventSource can't set headers — allow token as query param for SSE
  const queryToken = getQuery(event).token as string | undefined
  const authorization = getHeader(event, 'authorization')
  const rawToken = queryToken ?? (authorization?.startsWith('Bearer ') ? authorization.slice(7) : null)

  if (!rawToken) {
    throw createError({ statusCode: 401, message: 'Missing Bearer token' })
  }

  const idToken = rawToken
  try {
    const decoded = await useFirebaseAdmin().verifyIdToken(idToken)
    event.context.uid = decoded.uid
    event.context.email = decoded.email ?? ''
  }
  catch {
    throw createError({ statusCode: 401, message: 'Invalid or expired token' })
  }
})
