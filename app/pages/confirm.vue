<template>
  <div class="flex items-center justify-center min-h-screen bg-slate-950">
    <div class="text-center">
      <template v-if="!errorMsg">
        <div class="w-10 h-10 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-slate-400 text-sm">Signing you in…</p>
      </template>
      <template v-else>
        <p class="text-4xl mb-4">⚠️</p>
        <p class="text-red-400 font-bold mb-2">Sign-in failed</p>
        <p class="text-slate-500 text-sm mb-6 max-w-xs">{{ errorMsg }}</p>
        <a href="/login" class="text-orange-400 underline text-sm hover:text-orange-300">← Back to login</a>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'Confirm', layout: false })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const profileStore = useProfileStore()
const route = useRoute()
const errorMsg = ref('')

onMounted(async () => {
  // OAuth provider error (e.g. user denied access)
  const providerError = route.query.error as string | undefined
  if (providerError) {
    errorMsg.value = (route.query.error_description as string) || providerError
    return
  }

  // PKCE flow: Supabase sends back ?code=... in the query string.
  // The Supabase JS client does NOT auto-exchange query-string codes,
  // so we must call exchangeCodeForSession explicitly.
  const code = route.query.code as string | undefined
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) errorMsg.value = error.message
    // After exchange, onAuthStateChange fires and user watcher below redirects.
  }
})

watch(user, async (newUser) => {
  if (newUser) {
    await profileStore.syncFromOAuth(newUser)
    navigateTo('/')
  }
}, { immediate: true })
</script>
