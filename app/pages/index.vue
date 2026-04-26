<template>
  <div class="p-4 pb-16">
    <main class="max-w-7xl mx-auto mt-6 flex flex-col gap-10">

      <!-- Hero Section -->
      <div class="relative overflow-hidden bg-white backdrop-blur-lg border border-white/10 rounded-3xl p-12 shadow-2xl">
        <div class="flex justify-between w-full">
          <div>
            <h1 class="text-5xl font-extrabold text-orange-500/80 mb-6 tracking-tight">
              Master the <span class="text-slate-900/100">Game</span>
            </h1>
            <p class="text-slate-400 text-lg mb-10 max-w-2xl">
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
          <div><img src="../assets/img/ChessPng__1_-removebg-preview.png" class="h-[300px]" alt=""></div>
        </div>
      </div>

      <!-- Features / Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-800 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
          <div class="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
            <span class="text-2xl">📈</span>
          </div>
          <h3 class="text-white font-bold mb-2">Track Progress</h3>
          <p class="text-slate-500 text-sm">Detailed history of every move and game result.</p>
        </div>
        <div class="bg-slate-800 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
          <div class="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="text-white font-bold mb-2">Community</h3>
          <p class="text-slate-500 text-sm">Compete with players from all around the world.</p>
        </div>
        <div class="bg-slate-800 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
          <div class="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
            <span class="text-2xl">🧠</span>
          </div>
          <h3 class="text-white font-bold mb-2">Sharpen Skills</h3>
          <p class="text-slate-500 text-sm">Analyze your games to improve your strategic thinking.</p>
        </div>
      </div>

      <!-- ───── STRIKE BLOCK ───── -->
      <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
        <!-- Chessboard pattern overlay -->
        <div class="absolute inset-0 opacity-5 pointer-events-none" :style="chessBoardBg"></div>
        <!-- Glow -->
        <div class="absolute -top-16 -right-16 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative flex flex-col lg:flex-row items-center gap-10">
          <!-- Strike animation -->
          <div class="flex-shrink-0 flex flex-col items-center gap-3">
            <p class="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Your current streak</p>
            <div class="relative flex items-center justify-center">
              <!-- Ring pulse -->
              <div class="absolute w-36 h-36 rounded-full border-2 border-orange-500/40 animate-ping-slow"></div>
              <div class="absolute w-28 h-28 rounded-full border border-orange-400/30 animate-ping-slower"></div>
              <!-- Flame circle -->
              <div class="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.5)]">
                <span class="text-5xl leading-none">🔥</span>
                <span class="text-white font-black text-2xl mt-1">{{ currentStreak }}</span>
              </div>
            </div>
            <!-- Streak days row -->
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

          <!-- Info -->
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

      <!-- ───── QUEST BLOCK ───── -->
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

            <!-- Quest list -->
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

          <!-- Points panel -->
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

      <!-- ───── MEET IRL BLOCK ───── -->
      <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
        <div class="absolute -top-16 -left-16 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-20 -right-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative flex flex-col lg:flex-row items-center gap-10">
          <!-- Avatar cluster animation -->
          <div class="flex-shrink-0 relative w-48 h-48">
            <!-- Orbiting dots -->
            <div class="absolute inset-0 rounded-full border border-orange-500/20 animate-spin-very-slow"></div>
            <div class="absolute inset-4 rounded-full border border-orange-500/10 animate-spin-reverse-slow"></div>

            <!-- Center avatar -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                ♚
              </div>
            </div>

            <!-- Orbiting player avatars -->
            <div
              v-for="(avatar, i) in orbitAvatars"
              :key="i"
              class="absolute w-10 h-10 rounded-full border-2 border-slate-700 flex items-center justify-center text-lg bg-slate-800 shadow-lg"
              :style="avatarOrbitStyle(i, orbitAvatars.length)"
            >
              {{ avatar }}
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-3xl">📍</span>
              <h2 class="text-3xl font-extrabold text-white">Meet Over the Board</h2>
            </div>
            <p class="text-slate-300 text-lg leading-relaxed mb-6">
              Chess is more than a digital game. Find <span class="text-orange-400 font-semibold">real players near you</span>, set up an over-the-board match, and experience the thrill of face-to-face competition. From coffee shops to tournaments — the board is everywhere.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
                <p class="text-orange-400 text-xl font-black">{{ nearbyPlayers }}+</p>
                <p class="text-slate-400 text-xs mt-1">Players Nearby</p>
              </div>
              <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
                <p class="text-orange-400 text-xl font-black">{{ meetupsThisWeek }}</p>
                <p class="text-slate-400 text-xs mt-1">Meetups This Week</p>
              </div>
              <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
                <p class="text-orange-400 text-xl font-black">{{ citiesActive }}</p>
                <p class="text-slate-400 text-xs mt-1">Active Cities</p>
              </div>
            </div>
            <UiButton variant="primary" class="!w-auto px-8" @click="navigateTo('/meet')">
              Find Players Near Me 📍
            </UiButton>
          </div>
        </div>
      </div>

      <!-- ───── AI HELPER BLOCK ───── -->
      <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
        <div class="absolute -top-10 -right-10 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative flex flex-col lg:flex-row items-center gap-10">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-3xl">🤖</span>
              <h2 class="text-3xl font-extrabold text-white">AI Chess Coach</h2>
              <span class="ml-2 px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold rounded-full uppercase tracking-wider">Beta</span>
            </div>
            <p class="text-slate-300 text-lg leading-relaxed mb-6">
              Get <span class="text-orange-400 font-semibold">instant analysis</span> of your games, personalized opening recommendations, and move-by-move explanations — powered by AI. Like having a grandmaster in your pocket.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div v-for="feature in aiFeatures" :key="feature.label" class="flex items-start gap-3 bg-slate-800/70 border border-orange-500/10 rounded-xl p-4">
                <span class="text-2xl flex-shrink-0">{{ feature.icon }}</span>
                <div>
                  <p class="text-white font-semibold text-sm">{{ feature.label }}</p>
                  <p class="text-slate-500 text-xs mt-0.5">{{ feature.desc }}</p>
                </div>
              </div>
            </div>
            <UiButton variant="primary" class="!w-auto px-8" @click="navigateTo('/ai-coach')">
              Ask AI Coach 🤖
            </UiButton>
          </div>

          <!-- Animated chat preview -->
          <div class="flex-shrink-0 w-full lg:w-80 flex flex-col gap-2">
            <div
              v-for="(msg, i) in aiMessages"
              :key="i"
              :class="[
                'rounded-2xl px-4 py-3 text-sm max-w-[90%] transition-all duration-500',
                msg.role === 'ai'
                  ? 'bg-orange-500/20 border border-orange-500/30 text-orange-100 self-start rounded-tl-sm'
                  : 'bg-slate-700 border border-white/5 text-slate-200 self-end rounded-tr-sm ml-auto'
              ]"
            >
              <span v-if="msg.role === 'ai'" class="text-orange-400 font-bold text-xs block mb-1">AI Coach</span>
              <span v-else class="text-slate-400 font-bold text-xs block mb-1">You</span>
              {{ msg.text }}
            </div>
            <!-- Typing indicator -->
            <div class="bg-orange-500/10 border border-orange-500/20 rounded-2xl rounded-tl-sm px-4 py-3 self-start flex items-center gap-1.5 w-16">
              <span class="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
              <span class="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
              <span class="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

definePageMeta({
  middleware: 'auth'
})

const profileStore = useProfileStore()
const user = useSupabaseUser()

onMounted(async () => {
  await profileStore.fetchProfile()
})

// ── Chessboard background pattern ──
const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

// ── Strike data ──
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

// ── Quest data ──
const quests = ref([
  { id: 1, icon: '♟️', name: 'Win a game vs Easy Bot', xp: 50, current: 1, total: 1, progress: 100, done: true },
  { id: 2, icon: '🎯', name: 'Solve 3 daily puzzles', xp: 30, current: 2, total: 3, progress: 66, done: false },
  { id: 3, icon: '⚡', name: 'Play 5 Bullet games', xp: 80, current: 3, total: 5, progress: 60, done: false },
  { id: 4, icon: '👑', name: 'Win with the King\'s Gambit', xp: 120, current: 0, total: 1, progress: 0, done: false },
])
const totalPoints = ref(1240)
const questsCompleted = computed(() => quests.value.filter(q => q.done).length)

// ── Meet IRL data ──
const nearbyPlayers = ref(34)
const meetupsThisWeek = ref(6)
const citiesActive = ref(12)
const orbitAvatars = ['♙', '♞', '♜', '♛', '♝', '♟']

function avatarOrbitStyle(index: number, total: number) {
  const angle = (index / total) * 360
  const rad = (angle * Math.PI) / 180
  const r = 72 // orbit radius px
  const cx = 96 // center of 192px container
  const cy = 96
  const x = cx + r * Math.cos(rad) - 20
  const y = cy + r * Math.sin(rad) - 20
  return { left: `${x}px`, top: `${y}px` }
}

// ── AI helper data ──
const aiFeatures = [
  { icon: '🔍', label: 'Game Analysis', desc: 'Deep dive into every move after your game ends.' },
  { icon: '📚', label: 'Opening Book', desc: 'Learn the best openings for your playing style.' },
  { icon: '💡', label: 'Hint System', desc: 'Get a nudge in the right direction during a game.' },
  { icon: '📊', label: 'Weakness Report', desc: 'AI identifies your recurring mistakes and patterns.' },
]
const aiMessages = [
  { role: 'user', text: 'Why did I lose that game?' },
  { role: 'ai', text: 'You blundered on move 24 with Nd5??. After Bxd5, white gained a decisive material advantage. You should have played Nf4 instead, keeping pressure on the center.' },
  { role: 'user', text: 'What opening should I study?' },
]
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
@keyframes spin-very-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes spin-reverse-slow {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

.animate-ping-slow {
  animation: ping-slow 2.5s ease-in-out infinite;
}
.animate-ping-slower {
  animation: ping-slower 3.5s ease-in-out infinite;
}
.animate-spin-very-slow {
  animation: spin-very-slow 20s linear infinite;
}
.animate-spin-reverse-slow {
  animation: spin-reverse-slow 14s linear infinite;
}
</style>
