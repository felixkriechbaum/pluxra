export function useIngestTokens() {
  const { idToken, getIdToken } = useUser()

  async function authHeaders() {
    const token = await getIdToken()
    return { Authorization: `Bearer ${token}` }
  }

  const { data: tokens, refresh } = useFetch('/api/ingest-tokens', {
    headers: computed(() => idToken.value ? { Authorization: `Bearer ${idToken.value}` } : {}),
    watch: [idToken],
  })

  async function createToken(widgetIds: string[], label: string, lifetimeMs: number) {
    const headers = await authHeaders()
    await $fetch('/api/ingest-tokens', {
      method: 'POST', headers, body: { widgetIds, label, lifetimeMs },
    })
    await refresh()
  }

  async function updateTokenWidgets(id: string, widgetIds: string[]) {
    const headers = await authHeaders()
    await $fetch(`/api/ingest-tokens/${id}`, { method: 'PATCH', headers, body: { widgetIds } })
    await refresh()
  }

  async function deleteToken(id: string) {
    const headers = await authHeaders()
    await $fetch(`/api/ingest-tokens/${id}`, { method: 'DELETE', headers })
    await refresh()
  }

  return { tokens, createToken, updateTokenWidgets, deleteToken, refresh }
}
