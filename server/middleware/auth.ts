import { useFirebaseAdmin } from '../utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // Ingest endpoint uses its own token auth
  if (url.pathname.startsWith('/api/ingest/')) return

  // Only guard API routes
  if (!url.pathname.startsWith('/api/')) return

  const authorization = getHeader(event, 'authorization')
  if (!authorization?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Missing Bearer token' })
  }

  const idToken = authorization.slice(7)
  try {
    const decoded = await useFirebaseAdmin().verifyIdToken(idToken)
    event.context.uid = decoded.uid
    event.context.email = decoded.email ?? ''
  }
  catch {
    throw createError({ statusCode: 401, message: 'Invalid or expired token' })
  }
})
