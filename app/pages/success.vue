<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-6 text-center">
    <div class="rounded-2xl border border-yellow-500/30 bg-stone-900 p-10 shadow-2xl shadow-yellow-900/10">
      <div class="mb-4 text-6xl">👑</div>
      <h1 class="mb-2 text-3xl font-bold text-yellow-400">Royal Pass Activated!</h1>
      <p class="mb-2 text-stone-300">Your throne has been claimed.</p>
      <p class="text-sm text-stone-500">Returning to the kingdom in {{ countdown }}s…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'Success' })

const { show } = useAdvisor()
const supabase = useSupabaseClient()
const countdown = ref(3)

onMounted(async () => {
  // Use getUser() — guaranteed to return the authenticated user on the server
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('profiles').select('is_pro').eq('id', user.id).single()
  }

  // Show the advisor with a praise message
  show(
    "Your Royal Pass is sealed, my liege! Unlimited HP, AI coaching, and the Obsidian skin are yours to command. Long may you siege! 👑",
    'praise',
    10000,
  )

  // Countdown then redirect home
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      navigateTo('/')
    }
  }, 1000)
})
</script>
