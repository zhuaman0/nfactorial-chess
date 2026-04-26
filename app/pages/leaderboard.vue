<template>
  <div class="p-4 pb-16">
    <main class="max-w-7xl mx-auto mt-6 flex flex-col gap-8">

      <!-- ───── HERO HEADER ───── -->
      <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-yellow-500/20 rounded-3xl p-10 shadow-2xl">
        <!-- Floating chess pieces background -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <span
            v-for="fp in floatingPieces"
            :key="fp.key"
            class="absolute text-white/[0.04] font-bold select-none leading-none"
            :style="fp.style"
          >{{ fp.piece }}</span>
        </div>
        <!-- Chessboard overlay -->
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" :style="chessBoardBg"></div>
        <!-- Glow orbs -->
        <div class="absolute -top-20 -right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-20 -left-16 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative">
          <!-- Title row -->
          <div class="flex items-center gap-5 mb-8">
            <div class="relative flex-shrink-0">
              <div class="absolute inset-0 rounded-2xl bg-yellow-500/40 animate-ping-slow"></div>
              <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(234,179,8,0.5)]">
                ♔
              </div>
            </div>
            <div>
              <h1 class="text-4xl font-extrabold text-white tracking-tight">Global Leaderboard</h1>
              <p class="text-slate-400 mt-1">Climb the ranks. Earn your title. Prove your mastery.</p>
            </div>
          </div>

          <!-- Rank tiers legend -->
          <div class="flex flex-wrap gap-2">
            <div
              v-for="tier in rankTiers"
              :key="tier.name"
              class="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-default select-none transition-transform duration-200 hover:scale-105"
              :class="tier.badgeClass"
            >
              <span class="text-xl leading-none">{{ tier.piece }}</span>
              <div>
                <p class="text-xs font-bold leading-none" :class="tier.nameClass">{{ tier.name }}</p>
                <p class="text-[10px] text-slate-500 mt-0.5 leading-none">{{ tier.range }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ───── TOP 3 PODIUM ───── -->
      <div v-if="!leaderboardStore.loading && podium">
        <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-5 text-center">⚔ Hall of Champions ⚔</p>

        <div class="flex items-end justify-center gap-3">

          <!-- 2nd place — Queen -->
          <div class="flex-1 max-w-[190px] flex flex-col items-center gap-3 animate-rise" style="animation-delay: 150ms">
            <div class="flex items-center gap-1 mb-1">
              <span class="text-lg">♕</span>
              <p class="text-purple-400 text-xs font-bold uppercase tracking-wider">Queen</p>
            </div>
            <div class="relative">
              <div class="absolute -inset-1.5 rounded-full bg-purple-500/30 blur-md"></div>
              <UiAvatar
                :src="podium.second.avatar_url"
                :fallback="(podium.second.first_name?.[0] || 'U').toUpperCase()"
                size="lg"
                class="relative ring-2 ring-purple-400/60"
              />
            </div>
            <div class="text-center">
              <p class="text-white font-bold">{{ podium.second.first_name }}</p>
              <p class="text-slate-400 text-sm">{{ podium.second.last_name }}</p>
              <p class="text-purple-300 font-black text-xl mt-1">{{ podium.second.wins }}</p>
              <p class="text-slate-600 text-xs">wins</p>
            </div>
            <div class="w-full h-20 bg-gradient-to-b from-purple-900/40 to-slate-800/60 rounded-t-2xl flex items-center justify-center border-t-2 border-purple-500/40">
              <span class="text-purple-400 font-black text-4xl">2</span>
            </div>
          </div>

          <!-- 1st place — King -->
          <div class="flex-1 max-w-[220px] flex flex-col items-center gap-3 animate-rise" style="animation-delay: 0ms">
            <div class="flex items-center gap-1 mb-1">
              <span class="text-xl">♔</span>
              <p class="text-yellow-400 text-xs font-bold uppercase tracking-wider">King</p>
            </div>
            <div class="relative">
              <div class="absolute -inset-3 rounded-full bg-yellow-500/25 blur-xl animate-pulse"></div>
              <div class="absolute -inset-0.5 rounded-full border-2 border-yellow-500/60 animate-ping-slow"></div>
              <UiAvatar
                :src="podium.first.avatar_url"
                :fallback="(podium.first.first_name?.[0] || 'U').toUpperCase()"
                size="xl"
                class="relative ring-3 ring-yellow-500/80 shadow-[0_0_30px_rgba(234,179,8,0.5)]"
              />
              <div class="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl animate-float-crown">♛</div>
            </div>
            <div class="text-center">
              <p class="text-white font-extrabold text-lg">{{ podium.first.first_name }}</p>
              <p class="text-slate-400 text-sm">{{ podium.first.last_name }}</p>
              <p class="text-yellow-400 font-black text-3xl mt-1">{{ podium.first.wins }}</p>
              <p class="text-slate-500 text-xs">wins</p>
            </div>
            <div class="w-full h-32 bg-gradient-to-b from-yellow-500/20 to-yellow-900/10 rounded-t-2xl flex items-center justify-center border-t-2 border-yellow-500/60 shadow-[0_-4px_20px_rgba(234,179,8,0.2)]">
              <span class="text-yellow-400 font-black text-5xl">1</span>
            </div>
          </div>

          <!-- 3rd place — Queen -->
          <div class="flex-1 max-w-[190px] flex flex-col items-center gap-3 animate-rise" style="animation-delay: 300ms">
            <div class="flex items-center gap-1 mb-1">
              <span class="text-lg">♕</span>
              <p class="text-purple-400 text-xs font-bold uppercase tracking-wider">Queen</p>
            </div>
            <div class="relative">
              <div class="absolute -inset-1.5 rounded-full bg-amber-700/30 blur-md"></div>
              <UiAvatar
                :src="podium.third.avatar_url"
                :fallback="(podium.third.first_name?.[0] || 'U').toUpperCase()"
                size="lg"
                class="relative ring-2 ring-amber-600/60"
              />
            </div>
            <div class="text-center">
              <p class="text-white font-bold">{{ podium.third.first_name }}</p>
              <p class="text-slate-400 text-sm">{{ podium.third.last_name }}</p>
              <p class="text-amber-400 font-black text-xl mt-1">{{ podium.third.wins }}</p>
              <p class="text-slate-600 text-xs">wins</p>
            </div>
            <div class="w-full h-12 bg-gradient-to-b from-amber-900/30 to-slate-800/60 rounded-t-2xl flex items-center justify-center border-t-2 border-amber-700/40">
              <span class="text-amber-600 font-black text-4xl">3</span>
            </div>
          </div>

        </div>
      </div>

      <!-- ───── FULL RANKINGS TABLE ───── -->
      <div class="relative overflow-hidden bg-slate-900/80 backdrop-blur border border-white/10 rounded-3xl shadow-2xl">
        <!-- Table header bar -->
        <div class="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
          <h2 class="text-white font-extrabold text-xl flex items-center gap-2">
            <span class="text-orange-400">♟</span> All Rankings
          </h2>
          <span class="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full">
            {{ leaderboardStore.entries.length }} Players
          </span>
        </div>

        <!-- Column headers -->
        <div class="grid grid-cols-12 px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-widest border-b border-white/5 bg-slate-900/50">
          <div class="col-span-1">#</div>
          <div class="col-span-1">Tier</div>
          <div class="col-span-5">Player</div>
          <div class="col-span-2 text-center">Wins</div>
          <div class="col-span-3 text-right">Win Rate</div>
        </div>

        <!-- Loading state -->
        <div v-if="leaderboardStore.loading" class="py-20 flex flex-col items-center gap-4">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin"></div>
            <div class="absolute inset-3 flex items-center justify-center text-2xl">♞</div>
          </div>
          <span class="text-slate-500 text-sm">Loading rankings...</span>
        </div>

        <!-- Rows -->
        <div v-else class="divide-y divide-white/[0.04]">
          <div
            v-for="(entry, index) in leaderboardStore.entries"
            :key="entry.id"
            class="grid grid-cols-12 items-center px-6 py-4 transition-all duration-300 hover:bg-white/[0.03] group animate-fade-in-up"
            :style="{ animationDelay: `${Math.min(index * 35, 600)}ms` }"
            :class="index === 0 ? 'bg-yellow-500/[0.04]' : ''"
          >
            <!-- Position -->
            <div class="col-span-1">
              <span class="font-black font-mono text-sm" :class="rankNumColor(index)">{{ index + 1 }}</span>
            </div>

            <!-- Chess tier badge -->
            <div class="col-span-1">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center text-base border transition-all duration-200 group-hover:scale-110 group-hover:shadow-md"
                :class="getTier(index).badgeClass"
                :title="getTier(index).name"
              >{{ getTier(index).piece }}</div>
            </div>

            <!-- Player info -->
            <div class="col-span-5 flex items-center gap-3">
              <UiAvatar
                :src="entry.avatar_url"
                :fallback="(entry.first_name?.[0] || 'U').toUpperCase()"
                size="sm"
                :class="[
                  index === 0 ? 'ring-2 ring-yellow-500/70 shadow-[0_0_10px_rgba(234,179,8,0.35)]' :
                  index < 3  ? 'ring-1 ring-purple-500/50' : ''
                ]"
              />
              <div>
                <p class="font-bold text-sm text-white group-hover:text-orange-400 transition-colors duration-200">
                  {{ entry.first_name }} {{ entry.last_name }}
                </p>
                <p class="text-[10px] font-bold uppercase tracking-wider" :class="getTier(index).nameClass">
                  {{ getTier(index).name }}
                </p>
              </div>
            </div>

            <!-- Wins -->
            <div class="col-span-2 text-center">
              <span class="text-white font-bold tabular-nums">{{ entry.wins }}</span>
            </div>

            <!-- Win rate + bar -->
            <div class="col-span-3 flex flex-col items-end gap-1">
              <span class="font-mono font-bold text-sm tabular-nums" :class="index === 0 ? 'text-yellow-400' : 'text-emerald-400'">
                {{ winRate(entry) }}%
              </span>
              <div class="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000 ease-out"
                  :class="index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'"
                  :style="{ width: `${winRate(entry)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useLeaderboardStore } from '~/stores/leaderboard'

definePageMeta({
  middleware: 'auth'
})

const leaderboardStore = useLeaderboardStore()

onMounted(() => {
  leaderboardStore.fetchLeaderboard()
})

// ── Chessboard background ──
const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

// ── Rank tiers ──
const rankTiers = [
  { name: 'King',   piece: '♔', range: 'Rank #1',      badgeClass: 'bg-yellow-500/20 border-yellow-500/40',   nameClass: 'text-yellow-400'  },
  { name: 'Queen',  piece: '♕', range: 'Rank #2–3',    badgeClass: 'bg-purple-500/20 border-purple-500/40',   nameClass: 'text-purple-400'  },
  { name: 'Rook',   piece: '♖', range: 'Rank #4–10',   badgeClass: 'bg-blue-500/20 border-blue-500/40',       nameClass: 'text-blue-400'    },
  { name: 'Bishop', piece: '♗', range: 'Rank #11–25',  badgeClass: 'bg-emerald-500/20 border-emerald-500/40', nameClass: 'text-emerald-400' },
  { name: 'Knight', piece: '♘', range: 'Rank #26–50',  badgeClass: 'bg-orange-500/20 border-orange-500/40',   nameClass: 'text-orange-400'  },
  { name: 'Pawn',   piece: '♙', range: 'Rank #51+',    badgeClass: 'bg-slate-700/80 border-slate-600',        nameClass: 'text-slate-400'   },
]

type Tier = { name: string; piece: string; range: string; badgeClass: string; nameClass: string }

function getTier(index: number): Tier {
  if (index === 0)  return rankTiers[0] as Tier
  if (index <= 2)   return rankTiers[1] as Tier
  if (index <= 9)   return rankTiers[2] as Tier
  if (index <= 24)  return rankTiers[3] as Tier
  if (index <= 49)  return rankTiers[4] as Tier
  return rankTiers[5] as Tier
}

function rankNumColor(index: number) {
  if (index === 0) return 'text-yellow-400'
  if (index === 1) return 'text-slate-300'
  if (index === 2) return 'text-amber-600'
  return 'text-slate-600'
}

function winRate(entry: { wins: number; total_games: number }) {
  if (!entry.total_games) return 0
  return Math.round((entry.wins / entry.total_games) * 100)
}

const podium = computed(() => {
  const e = leaderboardStore.entries
  if (e.length < 3 || !e[0] || !e[1] || !e[2]) return null
  return { first: e[0], second: e[1], third: e[2] }
})

// ── Floating chess pieces (fixed positions for SSR safety) ──
const floatingPieces = [
  { key: 0,  piece: '♔', style: { left: '3%',  top: '8%',  fontSize: '72px', animation: 'float-bob 12s ease-in-out infinite',  animationDelay: '0s'    } },
  { key: 1,  piece: '♕', style: { left: '88%', top: '5%',  fontSize: '56px', animation: 'float-bob 9s ease-in-out infinite',   animationDelay: '-3s'   } },
  { key: 2,  piece: '♖', style: { left: '50%', top: '72%', fontSize: '48px', animation: 'float-bob 14s ease-in-out infinite',  animationDelay: '-7s'   } },
  { key: 3,  piece: '♗', style: { left: '20%', top: '62%', fontSize: '40px', animation: 'float-bob 11s ease-in-out infinite',  animationDelay: '-2s'   } },
  { key: 4,  piece: '♘', style: { left: '72%', top: '38%', fontSize: '44px', animation: 'float-bob 10s ease-in-out infinite',  animationDelay: '-5s'   } },
  { key: 5,  piece: '♙', style: { left: '35%', top: '18%', fontSize: '36px', animation: 'float-bob 8s ease-in-out infinite',   animationDelay: '-1s'   } },
  { key: 6,  piece: '♚', style: { left: '60%', top: '80%', fontSize: '52px', animation: 'float-bob 13s ease-in-out infinite',  animationDelay: '-9s'   } },
  { key: 7,  piece: '♛', style: { left: '12%', top: '83%', fontSize: '42px', animation: 'float-bob 11s ease-in-out infinite',  animationDelay: '-4s'   } },
  { key: 8,  piece: '♜', style: { left: '80%', top: '68%', fontSize: '38px', animation: 'float-bob 15s ease-in-out infinite',  animationDelay: '-6s'   } },
  { key: 9,  piece: '♝', style: { left: '42%', top: '44%', fontSize: '46px', animation: 'float-bob 10s ease-in-out infinite',  animationDelay: '-8s'   } },
]
</script>

<style scoped>
@keyframes float-bob {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-20px) rotate(4deg); }
  66%       { transform: translateY(-8px) rotate(-3deg); }
}
@keyframes ping-slow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50%       { transform: scale(1.25); opacity: 0; }
}
@keyframes float-crown {
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50%       { transform: translateX(-50%) translateY(-6px); }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-ping-slow     { animation: ping-slow 2.5s ease-in-out infinite; }
.animate-float-crown   { animation: float-crown 3s ease-in-out infinite; }
.animate-rise          { animation: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
.animate-fade-in-up    { animation: fade-in-up 0.4s ease-out both; }
</style>
