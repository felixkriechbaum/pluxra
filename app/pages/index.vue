<template>
  <div />
</template>

<script setup lang="ts">
const { user } = useUser()
const { pages } = usePages()
const router = useRouter()

watchEffect(() => {
  if (!user.value) {
    router.push('/login')
    return
  }
  const list = pages.value as any[]
  if (list?.length) router.push(`/${list[0].slug}`)
})
</script>
