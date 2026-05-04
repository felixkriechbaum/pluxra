export function useIngestTokens() {
  const { getIdToken } = useUser()

  async function authHeaders() {
    const token = await getIdToken()
    return { Authorization: `Bearer ${token}` }
  }

  const { data: tokens, refresh } = useFetch('/api/ingest-tokens', { headers: authHeaders })

  const newTokenRaw = ref<string | null>(null)

  async function createToken(widgetId: string, label: string, lifetimeMs: number) {
    const headers = await authHeaders()
    const result = await $fetch<{ id: string; rawToken: string; label: string; expiresAt: string }>(
      '/api/ingest-tokens',
      { method: 'POST', headers, body: { widgetId, label, lifetimeMs } },
    )
    newTokenRaw.value = result.rawToken
    await refresh()
    return result
  }

  async function deleteToken(id: string) {
    const headers = await authHeaders()
    await $fetch(`/api/ingest-tokens/${id}`, { method: 'DELETE', headers })
    await refresh()
  }

  function clearNewToken() { newTokenRaw.value = null }

  return { tokens, createToken, deleteToken, newTokenRaw: readonly(newTokenRaw), clearNewToken, refresh }
}
