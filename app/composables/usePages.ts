export function usePages() {
  const { idToken, getIdToken } = useUser()

  async function authHeaders() {
    const token = await getIdToken()
    return { Authorization: `Bearer ${token}` }
  }

  const { data: pages, refresh } = useAsyncData('dashboard-pages', async () => {
    if (!idToken.value) return null
    return $fetch('/api/dashboard-pages', {
      headers: { Authorization: `Bearer ${idToken.value}` },
    })
  }, { watch: [idToken] })

  async function createPage(title: string, slug: string) {
    const headers = await authHeaders()
    await $fetch('/api/dashboard-pages', { method: 'POST', headers, body: { title, slug } })
    await refresh()
  }

  async function updatePage(id: string, patch: { title?: string; slug?: string; position?: number }) {
    const headers = await authHeaders()
    await $fetch(`/api/dashboard-pages/${id}`, { method: 'PUT', headers, body: patch })
    await refresh()
  }

  async function deletePage(id: string) {
    const headers = await authHeaders()
    await $fetch(`/api/dashboard-pages/${id}`, { method: 'DELETE', headers })
    await refresh()
  }

  async function createTab(pageId: string, title: string) {
    const headers = await authHeaders()
    await $fetch('/api/tabs', { method: 'POST', headers, body: { pageId, title } })
    await refresh()
  }

  return { pages, createPage, updatePage, deletePage, createTab, refresh }
}
