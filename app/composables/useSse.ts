export function useSse(widgetId: string) {
  const data = ref<unknown>(null)
  const { getIdToken } = useUser()

  onMounted(async () => {
    const token = await getIdToken()
    const es = new EventSource(`/api/sse/${widgetId}?token=${encodeURIComponent(token)}`)
    es.onmessage = (e) => { data.value = JSON.parse(e.data) }
    onUnmounted(() => es.close())
  })

  return { data: readonly(data) }
}
