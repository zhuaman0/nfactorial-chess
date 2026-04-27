<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
    <div class="absolute inset-0 opacity-5 pointer-events-none" :style="chessBoardBg"></div>
    <div class="absolute -top-16 -right-16 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative flex flex-col lg:flex-row items-center gap-10">
      <div class="flex-shrink-0 flex flex-col items-center gap-3">
        <p class="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Your current streak</p>
        <div class="relative flex items-center justify-center">
          <div class="absolute w-36 h-36 rounded-full border-2 border-orange-500/40 animate-ping-slow"></div>
          <div class="absolute w-28 h-28 rounded-full border border-orange-400/30 animate-ping-slower"></div>
          <div class="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.5)]">
            <span class="text-5xl leading-none">🔥</span>
            <span class="text-white font-black text-2xl mt-1">{{ currentStreak }}</span>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <div
            v-for="(day, i) in streakDays"
            :key="i"
            :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300',
              day.done
                ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.6)] scale-105'
                : 'bg-slate-700 text-slate-500'
            ]"
          >
            {{ day.label }}
          </div>
        </div>
        <p class="text-slate-500 text-xs mt-1">Play daily to keep your streak alive!</p>
      </div>

      <div class="flex-1">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">🔥</span>
          <h2 class="text-3xl font-extrabold text-white">Daily Strike</h2>
        </div>
        <p class="text-slate-300 text-lg leading-relaxed mb-6">
          Just like the best players in the world train every single day — your <span class="text-orange-400 font-semibold">Strike</span> tracks how many days in a row you've played. Miss a day and it resets. Build your fire, climb higher.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
            <p class="text-orange-400 text-2xl font-black">{{ currentStreak }}</p>
            <p class="text-slate-400 text-xs mt-1">Current Streak</p>
          </div>
          <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
            <p class="text-orange-400 text-2xl font-black">{{ longestStreak }}</p>
            <p class="text-slate-400 text-xs mt-1">Longest Streak</p>
          </div>
          <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
            <p class="text-orange-400 text-2xl font-black">+{{ streakBonus }}%</p>
            <p class="text-slate-400 text-xs mt-1">XP Bonus</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

const currentStreak = ref(7)
const longestStreak = ref(21)
const streakBonus = computed(() => Math.min(currentStreak.value * 5, 50))
const streakDays = ref([
  { label: 'M', done: true },
  { label: 'T', done: true },
  { label: 'W', done: true },
  { label: 'T', done: true },
  { label: 'F', done: true },
  { label: 'S', done: true },
  { label: 'S', done: false },
])
</script>

<style scoped>
@keyframes ping-slow {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 0; }
}
@keyframes ping-slower {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.25); opacity: 0; }
}
.animate-ping-slow {
  animation: ping-slow 2.5s ease-in-out infinite;
}
.animate-ping-slower {
  animation: ping-slower 3.5s ease-in-out infinite;
}
</style>
