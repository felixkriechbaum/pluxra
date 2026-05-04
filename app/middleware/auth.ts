import { onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  if (import.meta.server) return

  const { $firebaseAuth } = useNuxtApp()
  const { user } = useUser()

  if (user.value === null) {
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(
        $firebaseAuth as ReturnType<typeof import('firebase/auth').getAuth>,
        () => { unsubscribe(); resolve() },
      )
    })
  }

  if (!user.value) return navigateTo('/login')
})
