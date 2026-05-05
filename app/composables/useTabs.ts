export function useTabs() {
  const { idToken, getIdToken } = useUser()

  async function authHeaders() {
    const token = await getIdToken()
    return { Authorization: `Bearer ${token}` }
  }

  const { data: tabs, refresh } = useAsyncData('tabs', async () => {
    if (!idToken.value) return null
    return $fetch<{ id: string; title: string; position: number; cols: number; rows: number }[]>('/api/tabs', {
      headers: { Authorization: `Bearer ${idToken.value}` },
    })
  }, { watch: [idToken] })

  async function createTab(title: string) {
    const headers = await authHeaders()
    const tab = await $fetch<{ id: string; title: string; position: number }>('/api/tabs', { method: 'POST', headers, body: { title } })
    await refresh()
    return tab
  }

  async function deleteTab(id: string) {
    const headers = await authHeaders()
    await $fetch(`/api/tabs/${id}`, { method: 'DELETE', headers })
    await refresh()
  }

  async function updateTab(id: string, patch: { title?: string; position?: number; cols?: number; rows?: number }) {
    const headers = await authHeaders()
    await $fetch(`/api/tabs/${id}`, { method: 'PUT', headers, body: patch })
    await refresh()
  }

  return { tabs, createTab, deleteTab, updateTab, refresh }
}
