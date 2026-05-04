import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

let _app: App | null = null

function getAdminApp(): App {
  if (_app) return _app
  if (getApps().length > 0) {
    _app = getApps()[0]
    return _app
  }
  const config = useRuntimeConfig()
  _app = initializeApp({
    credential: cert({
      projectId: config.firebaseProjectId as string,
      clientEmail: config.firebaseClientEmail as string,
      privateKey: (config.firebasePrivateKey as string).replace(/\\n/g, '\n'),
    }),
  })
  return _app
}

export function useFirebaseAdmin() {
  return getAuth(getAdminApp())
}
