<template>
  <div class="min-h-screen bg-slate-950 flex">

    <!-- ── Left decorative panel ──────────────────────────────────────── -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <!-- Glow blobs -->
      <div class="absolute -top-20 -left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <!-- Chessboard pattern -->
      <div class="absolute inset-0 opacity-5 pointer-events-none" :style="chessBoardBg"></div>

      <div class="relative flex flex-col items-center text-center gap-8 max-w-md">
        <!-- Chess piece -->
        <img src="../assets/img/ChessPng__1_-removebg-preview.png" class="h-52 drop-shadow-2xl" alt="Chess" />

        <!-- Headline -->
        <div>
          <h1 class="text-5xl font-extrabold text-white leading-tight">
            Master the <span class="text-orange-500">Game</span>
          </h1>
          <p class="text-slate-400 text-lg mt-3 leading-relaxed">
            Play, compete and climb the global leaderboard.
          </p>
        </div>

        <!-- Feature bullets -->
        <div class="flex flex-col gap-3 w-full">
          <div v-for="f in features" :key="f.text" class="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl px-5 py-3">
            <span class="text-2xl flex-shrink-0">{{ f.icon }}</span>
            <div class="text-left">
              <p class="text-white font-semibold text-sm">{{ f.title }}</p>
              <p class="text-slate-500 text-xs mt-0.5">{{ f.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Right form panel ───────────────────────────────────────────── -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-950 lg:bg-slate-900/50">
      <div class="w-full max-w-md">

        <!-- Logo (mobile only) -->
        <div class="flex items-center justify-center gap-2 mb-8 lg:hidden">
          <span class="text-3xl">♚</span>
          <span class="text-white font-extrabold text-xl">nFactorial Chess</span>
        </div>

        <!-- Card -->
        <div class="relative overflow-hidden bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div class="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative">
            <h2 class="text-3xl font-extrabold text-white mb-1">Welcome back</h2>
            <p class="text-slate-400 text-sm mb-8">Sign in to continue your chess journey</p>

            <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
              <!-- Email -->
              <div>
                <label class="block text-sm font-semibold text-slate-400 mb-2">Email</label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="grandmaster@example.com"
                  required
                  class="w-full px-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-semibold text-slate-400 mb-2">Password</label>
                <input
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  class="w-full px-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>

              <p v-if="authStore.errorMsg" class="text-red-400 text-sm text-center -mt-1">{{ authStore.errorMsg }}</p>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="authStore.loading"
                class="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
              >
                <span v-if="authStore.loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-else>Sign In →</span>
              </button>
            </form>

            <!-- Divider -->
            <div class="flex items-center gap-4 my-6">
              <div class="flex-1 h-px bg-white/10"></div>
              <span class="text-slate-600 text-xs uppercase tracking-wider">or</span>
              <div class="flex-1 h-px bg-white/10"></div>
            </div>

            <!-- Google -->
            <button
              class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white font-medium text-sm cursor-pointer"
              @click="handleGoogleSignIn"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <!-- Footer link -->
            <p class="text-center text-sm text-slate-500 mt-6">
              Don't have an account?
              <NuxtLink to="/register" class="text-orange-400 hover:text-orange-300 font-semibold transition-colors">Sign Up</NuxtLink>
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ name: 'Login', layout: false })

const authStore = useAuthStore()
const email    = ref('')
const password = ref('')

const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

const features = [
  { icon: '⚔️', title: 'Play vs AI or Friends', text: 'Challenge the Stockfish engine or invite a friend.' },
  { icon: '📈', title: 'Track Your Progress',   text: 'Full game history, XP, and leaderboard rankings.' },
  { icon: '⚡', title: 'Daily Quests',           text: 'Complete quests every day to earn bonus XP.' },
]

const handleSubmit = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) navigateTo('/')
}

const handleGoogleSignIn = async () => {
  await authStore.loginWithGoogle()
}
</script>
