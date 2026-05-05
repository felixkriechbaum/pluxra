<template>
  <div />
</template>

<script setup lang="ts">
const { user } = useUser()
const { tabs } = useTabs()
const router = useRouter()

watchEffect(() => {
  if (!user.value) {
    router.push('/login')
    return
  }
  const list = tabs.value
  if (list?.length) router.push(`/${list[0].id}`)
})
</script>
