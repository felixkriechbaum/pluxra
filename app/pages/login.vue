<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="w-full max-w-sm space-y-4 rounded-lg border p-8">
      <h1 class="text-2xl font-semibold">Sign in</h1>
      <Button class="w-full" @click="loginWithGoogle">Continue with Google</Button>
      <Button class="w-full" variant="outline" @click="loginWithGitHub">Continue with GitHub</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

definePageMeta({ layout: false })

const { loginWithGoogle, loginWithGitHub, user } = useUser()
const router = useRouter()

watch(user, (u) => {
  if (u) router.push('/')
}, { immediate: true })
</script>
