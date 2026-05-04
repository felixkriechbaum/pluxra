<template>
  <div />
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getIdToken } = useUser()

const { data: page } = useFetch(
  () => `/api/dashboard-pages/${route.params.page}`,
  {
    headers: async () => {
      const token = await getIdToken()
      return { Authorization: `Bearer ${token}` }
    },
  },
)

watchEffect(() => {
  const p = page.value as any
  if (p?.tabs?.length) {
    router.replace(`/${route.params.page}/${p.tabs[0].id}`)
  }
})
</script>
