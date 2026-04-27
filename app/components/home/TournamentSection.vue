<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
    <div class="absolute -top-16 -right-16 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-16 -left-16 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative flex flex-col lg:flex-row items-center gap-10">
      <div class="flex-shrink-0 flex flex-col items-center gap-4">
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-orange-500/20 blur-2xl animate-pulse"></div>
          <div class="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(249,115,22,0.5)]">
            🏆
          </div>
        </div>
        <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 w-52">
          <p class="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-3 text-center">Live Standings</p>
          <div v-for="(row, i) in mockStandings" :key="i" class="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
            <div class="flex items-center gap-2">
              <span class="text-slate-600 text-xs font-mono w-4">{{ i + 1 }}</span>
              <span class="text-xs">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉' }}</span>
              <span class="text-slate-200 text-xs font-medium">{{ row.name }}</span>
            </div>
            <span class="text-orange-400 font-black text-sm">{{ row.pts }}</span>
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">⚽</span>
          <h2 class="text-3xl font-extrabold text-white">Chess Leagues</h2>
          <span class="ml-2 px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold rounded-full uppercase tracking-wider">New</span>
        </div>
        <p class="text-slate-300 text-lg leading-relaxed mb-6">
          Create a private tournament room, invite up to <span class="text-orange-400 font-semibold">10 players</span>, and compete in a <span class="text-orange-400 font-semibold">round-robin league</span> — just like the Premier League. Every player faces every other player. Points for wins, standings update live.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
            <p class="text-orange-400 text-2xl font-black">10</p>
            <p class="text-slate-400 text-xs mt-1">Max Players</p>
          </div>
          <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
            <p class="text-orange-400 text-2xl font-black">3pts</p>
            <p class="text-slate-400 text-xs mt-1">Per Win</p>
          </div>
          <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
            <p class="text-orange-400 text-2xl font-black">1pt</p>
            <p class="text-slate-400 text-xs mt-1">Per Draw</p>
          </div>
        </div>
        <UiButton variant="primary" class="!w-auto px-8" @click="navigateTo('/tournaments')">
          Start a Tournament 🏆
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mockStandings = [
  { name: 'Magnus', pts: 12 },
  { name: 'Hikaru', pts: 9 },
  { name: 'Fabiano', pts: 7 },
]
</script>
