<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-slate-400">Confirming your account...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'Confirm', layout: false })

const user = useSupabaseUser()
const profileStore = useProfileStore()

watch(user, async (newUser) => {
  if (newUser) {
    await profileStore.syncFromOAuth(newUser)
    navigateTo('/')
  }
}, { immediate: true })
</script>
