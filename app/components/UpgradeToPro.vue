<template>
  <div class="relative overflow-hidden rounded-2xl border border-yellow-500/40 bg-gradient-to-b from-stone-900 via-stone-900 to-black p-8 shadow-2xl shadow-yellow-900/20">
    <!-- Glow accent -->
    <div class="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />

    <!-- Crown badge -->
    <div class="mb-6 flex items-center gap-3">
      <span class="text-4xl">👑</span>
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-yellow-400">Royal Pass</h2>
        <p class="text-sm text-stone-400">Chess Siege — Pro Edition</p>
      </div>
      <span class="ml-auto rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-300 ring-1 ring-yellow-500/40">
        ONE-TIME $9.99
      </span>
    </div>

    <!-- Divider -->
    <div class="mb-6 h-px bg-gradient-to-r from-transparent via-yellow-700/50 to-transparent" />

    <!-- Benefits list -->
    <ul class="mb-8 space-y-3">
      <li v-for="benefit in benefits" :key="benefit.text" class="flex items-start gap-3">
        <span class="mt-0.5 text-lg leading-none">{{ benefit.icon }}</span>
        <div>
          <p class="font-semibold text-stone-100">{{ benefit.title }}</p>
          <p class="text-sm text-stone-400">{{ benefit.text }}</p>
        </div>
      </li>
    </ul>

    <!-- CTA button -->
    <button
      :disabled="loading"
      class="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-3.5 text-center font-bold text-black shadow-lg shadow-yellow-900/40 transition-all hover:from-yellow-400 hover:to-amber-500 hover:shadow-yellow-700/50 disabled:cursor-not-allowed disabled:opacity-60"
      @click="handleUpgrade"
    >
      <span v-if="!loading">⚔️ Claim Your Royal Pass</span>
      <span v-else class="flex items-center justify-center gap-2">
        <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Preparing Checkout…
      </span>
    </button>

    <p v-if="errorMsg" class="mt-3 text-center text-sm text-red-400">{{ errorMsg }}</p>
    <p class="mt-4 text-center text-xs text-stone-500">Secured by Stripe · No subscription · Lifetime access</p>
  </div>
</template>

<script setup lang="ts">
const benefits = [
  {
    icon: '❤️',
    title: 'Unlimited HP in Survival Mode',
    text: 'Never run out of lives — siege as long as you dare.',
  },
  {
    icon: '🧠',
    title: 'Advanced AI Coach',
    text: 'Deep LLM analysis of every move with strategic coaching.',
  },
  {
    icon: '🖤',
    title: 'Obsidian Board Skin',
    text: 'Exclusive dark-fantasy pieces and board unavailable to free players.',
  },
]

const loading = ref(false)
const errorMsg = ref('')

const supabase = useSupabaseClient()

async function handleUpgrade() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    navigateTo('/login')
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const { url } = await $fetch<{ url: string }>('/api/create-checkout-session', {
      method: 'POST',
      body: { userId: session.user.id, userEmail: session.user.email },
    })
    window.location.href = url
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
