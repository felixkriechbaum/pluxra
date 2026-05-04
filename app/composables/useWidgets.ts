export function useWidgets(tabId: Ref<string>) {
  const { getIdToken } = useUser()

  async function authHeaders() {
    const token = await getIdToken()
    return { Authorization: `Bearer ${token}` }
  }

  const { data: widgets, refresh } = useFetch(
    () => `/api/widgets?tabId=${tabId.value}`,
    { headers: authHeaders },
  )

  async function createWidget(body: {
    tabId: string
    pluginId: string
    colStart: number
    colSpan: number
    rowStart: number
    rowSpan: number
    config?: Record<string, unknown>
  }) {
    const headers = await authHeaders()
    await $fetch('/api/widgets', { method: 'POST', headers, body })
    await refresh()
  }

  async function updateWidget(id: string, patch: Record<string, unknown>) {
    const headers = await authHeaders()
    await $fetch(`/api/widgets/${id}`, { method: 'PUT', headers, body: patch })
    await refresh()
  }

  async function deleteWidget(id: string) {
    const headers = await authHeaders()
    await $fetch(`/api/widgets/${id}`, { method: 'DELETE', headers })
    await refresh()
  }

  return { widgets, createWidget, updateWidget, deleteWidget, refresh }
}
