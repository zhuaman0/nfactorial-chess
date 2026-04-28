<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
    <div class="absolute -top-16 -left-16 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-20 -right-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative flex flex-col lg:flex-row items-center gap-10">
      <div class="flex-shrink-0 relative w-48 h-48">
        <div class="absolute inset-0 rounded-full border border-orange-500/20 animate-spin-very-slow"></div>
        <div class="absolute inset-4 rounded-full border border-orange-500/10 animate-spin-reverse-slow"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(249,115,22,0.4)]">♚</div>
        </div>
        <div
          v-for="(avatar, i) in orbitAvatars"
          :key="i"
          class="absolute w-10 h-10 rounded-full border-2 border-slate-700 flex items-center justify-center text-lg bg-slate-800 shadow-lg"
          :style="avatarOrbitStyle(i, orbitAvatars.length)"
        >{{ avatar }}</div>
      </div>

      <div class="flex-1">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">👥</span>
          <h2 class="text-3xl font-extrabold text-white">Our Community</h2>
        </div>
        <p class="text-slate-300 text-lg leading-relaxed mb-6">
          Join <span class="text-orange-400 font-semibold">real players</span> from around the world. Challenge friends, climb the leaderboard, and make your mark in our growing chess community.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
            <p class="text-orange-400 text-xl font-black">{{ stats.players }}</p>
            <p class="text-slate-400 text-xs mt-1">Registered Players</p>
          </div>
          <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
            <p class="text-orange-400 text-xl font-black">{{ stats.games }}</p>
            <p class="text-slate-400 text-xs mt-1">Games Played</p>
          </div>
          <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
            <p class="text-orange-400 text-xl font-black">24/7</p>
            <p class="text-slate-400 text-xs mt-1">Always Online</p>
          </div>
        </div>
        <UiButton variant="primary" class="!w-auto px-8" @click="navigateTo('/friends')">
          Find Players 👥
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stats = ref({ players: 0, games: 0 })

onMounted(async () => {
  try {
    const data = await $fetch<{ players: number; games: number }>('/api/stats/platform')
    stats.value = data
  } catch {}
})

const orbitAvatars = ['♙', '♞', '♜', '♛', '♝', '♟']

function avatarOrbitStyle(index: number, total: number) {
  const angle = (index / total) * 360
  const rad   = (angle * Math.PI) / 180
  const r = 72, cx = 96, cy = 96
  return { left: `${cx + r * Math.cos(rad) - 20}px`, top: `${cy + r * Math.sin(rad) - 20}px` }
}
</script>

<style scoped>
@keyframes spin-very-slow    { from { transform: rotate(0deg)   } to { transform: rotate(360deg)  } }
@keyframes spin-reverse-slow { from { transform: rotate(360deg) } to { transform: rotate(0deg)    } }
.animate-spin-very-slow    { animation: spin-very-slow    20s linear infinite }
.animate-spin-reverse-slow { animation: spin-reverse-slow 14s linear infinite }
</style>
