<template>
  <div class="relative overflow-hidden bg-white border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
    <div class="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative flex flex-col lg:flex-row items-start gap-10">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">⚔️</span>
          <h2 class="text-3xl font-extrabold text-slate-900">Daily Quests</h2>
          <span class="ml-2 px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-500 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
        </div>
        <p class="text-slate-600 text-lg leading-relaxed mb-8">
          Complete daily quests to earn <span class="text-orange-500 font-semibold">XP & Points</span>. Defeat bots, solve puzzles, win matches — every quest brings you closer to the top of the leaderboard.
        </p>

        <div class="flex flex-col gap-3">
          <div
            v-for="quest in quests"
            :key="quest.id"
            class="group bg-slate-50 border border-slate-200 hover:border-orange-500/40 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer"
          >
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0', quest.done ? 'bg-orange-500/20' : 'bg-slate-200']">
              {{ quest.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <p :class="['font-semibold text-sm', quest.done ? 'text-orange-500 line-through' : 'text-slate-900']">{{ quest.name }}</p>
                <span class="text-orange-500 text-xs font-bold flex-shrink-0 ml-2">+{{ quest.xp }} XP</span>
              </div>
              <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
                  :style="{ width: quest.done ? '100%' : `${quest.progress}%` }"
                ></div>
              </div>
              <p class="text-slate-400 text-xs mt-1">{{ quest.done ? 'Completed!' : `${quest.current}/${quest.total}` }}</p>
            </div>
            <div v-if="quest.done" class="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 flex flex-col items-center gap-4 lg:w-52">
        <div class="w-full bg-orange-50 border border-orange-200 rounded-2xl p-6 flex flex-col items-center gap-2">
          <span class="text-4xl">🏆</span>
          <p class="text-orange-500 text-3xl font-black">{{ totalPoints }}</p>
          <p class="text-slate-500 text-xs">Total Quest Points</p>
        </div>
        <div class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-1">
          <p class="text-slate-900 text-lg font-bold">{{ questsCompleted }}/{{ quests.length }}</p>
          <p class="text-slate-500 text-xs">Today's quests done</p>
        </div>
        <UiButton variant="primary" class="w-full text-sm" @click="navigateTo('/quests')">
          Start Quest
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const quests = ref([
  { id: 1, icon: '♟️', name: 'Win a game vs Easy Bot', xp: 50, current: 1, total: 1, progress: 100, done: true },
  { id: 2, icon: '🎯', name: 'Solve 3 daily puzzles', xp: 30, current: 2, total: 3, progress: 66, done: false },
  { id: 3, icon: '⚡', name: 'Play 5 Bullet games', xp: 80, current: 3, total: 5, progress: 60, done: false },
  { id: 4, icon: '👑', name: "Win with the King's Gambit", xp: 120, current: 0, total: 1, progress: 0, done: false },
])
const totalPoints = ref(1240)
const questsCompleted = computed(() => quests.value.filter(q => q.done).length)
</script>
