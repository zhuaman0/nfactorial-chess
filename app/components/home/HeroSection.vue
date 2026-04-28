<template>
  <div class="relative overflow-hidden bg-white backdrop-blur-lg border border-white/10 rounded-3xl p-12 shadow-2xl">
    <div class="flex justify-between w-full items-center">
      <div>
        <!-- Personalised greeting when logged in -->
        <p v-if="user && profileStore.profile" class="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-widest">
          Welcome back, {{ profileStore.profile.first_name || 'Player' }} 👋
        </p>
        <h1 class="text-5xl font-extrabold text-orange-500/80 mb-4 tracking-tight">
          Master the <span class="text-slate-900">Game</span>
        </h1>

        <!-- Real XP + streak pill row -->
        <div v-if="user && profileStore.profile" class="flex flex-wrap gap-3 mb-6">
          <div class="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 text-sm font-bold text-orange-600">
            ⭐ {{ profileStore.profile.points }} XP · Level {{ level }}
          </div>
          <div class="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 text-sm font-bold text-slate-700">
            🔥 {{ profileStore.profile.current_streak }} day streak
          </div>
          <div class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-sm font-bold text-amber-600">
            🪙 {{ profileStore.profile.gold_balance }} gold
          </div>
        </div>

        <p v-else class="text-slate-400 text-lg mb-10 max-w-2xl">
          Experience chess like never before. Play against friends, track your progress,
          and climb the global ranks in our modern arena.
        </p>

        <div class="flex flex-col sm:flex-row gap-4">
          <UiButton variant="primary-dark" class="!w-auto px-10 text-lg" @click="navigateTo('/play')">
            Play Now
          </UiButton>
          <UiButton variant="outline-dark" class="!w-auto px-10 text-lg" @click="navigateTo('/leaderboard')">
            Leaderboard
          </UiButton>
        </div>
      </div>
      <div class="hidden sm:block">
        <img src="~/assets/img/ChessPng__1_-removebg-preview.png" class="h-[260px]" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const profileStore = useProfileStore()
const user = useSupabaseUser()
const { level } = useLevel(computed(() => profileStore.profile?.points ?? 0))
</script>

