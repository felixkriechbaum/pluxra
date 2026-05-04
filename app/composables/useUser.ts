import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'

const _user = ref<User | null>(null)
const _idToken = ref<string | null>(null)
let _initialized = false

export function useUser() {
  const { $firebaseAuth } = useNuxtApp()

  if (!_initialized && import.meta.client) {
    _initialized = true
    onAuthStateChanged($firebaseAuth as ReturnType<typeof import('firebase/auth').getAuth>, async (user) => {
      _user.value = user
      _idToken.value = user ? await user.getIdToken() : null
    })
  }

  async function loginWithGoogle() {
    await signInWithPopup($firebaseAuth as ReturnType<typeof import('firebase/auth').getAuth>, new GoogleAuthProvider())
  }

  async function loginWithGitHub() {
    await signInWithPopup($firebaseAuth as ReturnType<typeof import('firebase/auth').getAuth>, new GithubAuthProvider())
  }

  async function logout() {
    await signOut($firebaseAuth as ReturnType<typeof import('firebase/auth').getAuth>)
    _idToken.value = null
  }

  async function getIdToken(): Promise<string> {
    if (!_user.value) throw new Error('Not authenticated')
    const token = await _user.value.getIdToken()
    _idToken.value = token
    return token
  }

  return {
    user: readonly(_user),
    idToken: readonly(_idToken),
    loginWithGoogle,
    loginWithGitHub,
    logout,
    getIdToken,
  }
}
