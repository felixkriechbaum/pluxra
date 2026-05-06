export interface WidgetTemplate {
  id: string
  name: string
  icon: string
  color: string
  config: Record<string, unknown>
}

export function useWidgetTemplates() {
  const { idToken, getIdToken } = useUser()

  async function authHeaders() {
    const token = await getIdToken()
    return { Authorization: `Bearer ${token}` }
  }

  const { data: templates, refresh } = useAsyncData('widget-templates', async () => {
    if (!idToken.value) return [] as WidgetTemplate[]
    return $fetch<WidgetTemplate[]>('/api/widget-templates', {
      headers: { Authorization: `Bearer ${idToken.value}` },
    })
  }, { watch: [idToken], default: () => [] as WidgetTemplate[] })

  async function createTemplate(body: Omit<WidgetTemplate, 'id'>) {
    const headers = await authHeaders()
    const result = await $fetch<WidgetTemplate>('/api/widget-templates', { method: 'POST', headers, body })
    await refresh()
    return result
  }

  async function updateTemplate(id: string, patch: Partial<Omit<WidgetTemplate, 'id'>>) {
    const headers = await authHeaders()
    await $fetch(`/api/widget-templates/${id}`, { method: 'PUT', headers, body: patch })
    await refresh()
  }

  async function deleteTemplate(id: string) {
    const headers = await authHeaders()
    await $fetch(`/api/widget-templates/${id}`, { method: 'DELETE', headers })
    await refresh()
  }

  return { templates, createTemplate, updateTemplate, deleteTemplate, refresh }
}
