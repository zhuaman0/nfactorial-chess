<template>
  <div class="p-4 pb-16">
    <main class="max-w-7xl mx-auto mt-6 flex flex-col gap-8">

      <!-- ───── HERO HEADER ───── -->
      <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <span v-for="fp in floatingPieces" :key="fp.key"
            class="absolute text-white/[0.04] font-bold select-none leading-none"
            :style="fp.style">{{ fp.piece }}</span>
        </div>
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" :style="chessBoardBg"></div>
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative flex flex-col lg:flex-row items-start gap-8">
          <div class="flex-1">
            <div class="flex items-center gap-4 mb-4">
              <div class="relative flex-shrink-0">
                <div class="absolute inset-0 rounded-2xl bg-orange-500/40 animate-ping-slow"></div>
                <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(249,115,22,0.5)]">
                  ⚔️
                </div>
              </div>
              <div>
                <h1 class="text-4xl font-extrabold text-white tracking-tight">Daily Quests</h1>
                <p class="text-slate-400 mt-1">Complete quests. Earn XP. Master chess — piece by piece.</p>
              </div>
            </div>

            <!-- Level tiers -->
            <div class="flex flex-wrap gap-2 mt-6">
              <div
                v-for="tier in levelTiers"
                :key="tier.level"
                class="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-default select-none hover:scale-105 transition-transform duration-200"
                :class="tier.badgeClass"
              >
                <span class="text-xl leading-none">{{ tier.piece }}</span>
                <div>
                  <p class="text-xs font-bold leading-none" :class="tier.nameClass">{{ tier.label }}</p>
                  <p class="text-[10px] text-slate-500 mt-0.5 leading-none">{{ tier.pts }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex-shrink-0 grid grid-cols-3 gap-3 lg:w-80">
            <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
              <p class="text-orange-400 text-2xl font-black">{{ questsStore.quests.length }}</p>
              <p class="text-slate-500 text-xs mt-1">Total Quests</p>
            </div>
            <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
              <p class="text-emerald-400 text-2xl font-black">{{ questsStore.completedCount }}</p>
              <p class="text-slate-500 text-xs mt-1">Completed</p>
            </div>
            <div class="bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-center">
              <p class="text-yellow-400 text-2xl font-black">{{ questsStore.totalPointsEarned }}</p>
              <p class="text-slate-500 text-xs mt-1">XP Earned</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ───── SORT & FILTER BAR ───── -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <!-- Filter chips -->
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="f in filterOptions"
            :key="f.value"
            @click="filterBy = f.value"
            :class="[
              'px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200',
              filterBy === f.value
                ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-orange-500/50 hover:text-slate-200'
            ]"
          >{{ f.label }}</button>
        </div>

        <!-- Spacer -->
        <div class="flex-1 hidden sm:block"></div>

        <!-- Sort select -->
        <div class="flex items-center gap-2">
          <span class="text-slate-500 text-xs font-bold uppercase tracking-widest">Sort by</span>
          <div class="flex gap-1">
            <button
              v-for="s in sortOptions"
              :key="s.value"
              @click="sortBy = s.value"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200',
                sortBy === s.value
                  ? 'bg-slate-700 border-slate-500 text-white'
                  : 'bg-transparent border-slate-700 text-slate-500 hover:text-slate-300'
              ]"
            >{{ s.label }}</button>
          </div>
        </div>
      </div>

      <!-- ───── QUEST GRID ───── -->
      <div v-if="questsStore.loading" class="flex flex-col items-center gap-4 py-20">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin"></div>
          <div class="absolute inset-3 flex items-center justify-center text-2xl">⚔️</div>
        </div>
        <span class="text-slate-500 text-sm">Loading quests...</span>
      </div>

      <div v-else-if="sortedQuests.length === 0" class="py-20 text-center">
        <p class="text-6xl mb-4">🔍</p>
        <p class="text-white font-bold text-lg">No quests match this filter</p>
        <p class="text-slate-500 text-sm mt-1">Try a different filter</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(quest, i) in sortedQuests"
          :key="quest.id"
          @click="navigateTo(`/quests/${quest.id}`)"
          class="group relative bg-slate-900/80 border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-fade-in-up"
          :class="[
            quest.userQuest?.status === 'completed'
              ? 'border-emerald-500/30 hover:border-emerald-500/50'
              : 'border-white/10 hover:border-orange-500/40'
          ]"
          :style="{ animationDelay: `${i * 40}ms` }"
        >
          <!-- Completed shimmer overlay -->
          <div v-if="quest.userQuest?.status === 'completed'" class="absolute inset-0 rounded-2xl bg-emerald-500/[0.04] pointer-events-none"></div>

          <!-- Top row: icon + level badge + status -->
          <div class="flex items-start justify-between mb-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-transform duration-300 group-hover:scale-110"
              :class="getLevelTier(quest.level).badgeClass"
            >{{ quest.icon }}</div>

            <div class="flex flex-col items-end gap-1.5">
              <!-- Level badge -->
              <div class="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase" :class="getLevelTier(quest.level).badgeClass">
                <span>{{ getLevelTier(quest.level).piece }}</span>
                <span :class="getLevelTier(quest.level).nameClass">{{ getLevelTier(quest.level).label }}</span>
              </div>
              <!-- Type badge -->
              <div :class="[
                'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border',
                quest.type === 'quiz'
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                  : 'bg-purple-500/20 border-purple-500/40 text-purple-400'
              ]">
                {{ quest.type === 'quiz' ? '📋 Quiz' : '♞ Trainer' }}
              </div>
            </div>
          </div>

          <!-- Title & description -->
          <h3 class="text-white font-bold mb-1 group-hover:text-orange-400 transition-colors duration-200 line-clamp-1">{{ quest.title }}</h3>
          <p class="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{{ quest.description }}</p>

          <!-- Bottom row: points + status -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="text-yellow-400 text-sm">⭐</span>
              <span class="text-yellow-400 font-black text-sm">+{{ quest.points }} XP</span>
              <span class="text-slate-600 text-xs ml-1 capitalize">· {{ quest.category }}</span>
            </div>

            <!-- Status indicator -->
            <div v-if="quest.userQuest?.status === 'completed'" class="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              Done
            </div>
            <div v-else-if="quest.userQuest?.status === 'in_progress'" class="flex items-center gap-1 text-orange-400 text-xs font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block"></span>
              In Progress
            </div>
            <div v-else class="text-slate-600 text-xs font-bold">Start →</div>
          </div>

          <!-- Completed score bar -->
          <div v-if="quest.userQuest?.status === 'completed'" class="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <span class="text-slate-500 text-xs">Score</span>
            <span class="text-emerald-400 font-bold text-xs">{{ quest.userQuest.score }} / {{ quest.points }} XP</span>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useQuestsStore } from '~/stores/quests'

definePageMeta({ name: 'Quests' })

const questsStore = useQuestsStore()
onMounted(() => questsStore.fetchQuests())

// ── Level tier config ──
const levelTiers = [
  { level: 'pawn',   piece: '♙', label: 'Pawn',   pts: '10–15 XP', badgeClass: 'bg-slate-700/80 border-slate-600',        nameClass: 'text-slate-300'   },
  { level: 'knight', piece: '♘', label: 'Knight', pts: '20–25 XP', badgeClass: 'bg-orange-500/20 border-orange-500/40',   nameClass: 'text-orange-400'  },
  { level: 'bishop', piece: '♗', label: 'Bishop', pts: '30–35 XP', badgeClass: 'bg-emerald-500/20 border-emerald-500/40', nameClass: 'text-emerald-400' },
  { level: 'rook',   piece: '♖', label: 'Rook',   pts: '40–50 XP', badgeClass: 'bg-blue-500/20 border-blue-500/40',       nameClass: 'text-blue-400'    },
  { level: 'queen',  piece: '♕', label: 'Queen',  pts: '60–80 XP', badgeClass: 'bg-purple-500/20 border-purple-500/40',   nameClass: 'text-purple-400'  },
  { level: 'king',   piece: '♔', label: 'King',   pts: '100+ XP',  badgeClass: 'bg-yellow-500/20 border-yellow-500/40',   nameClass: 'text-yellow-400'  },
]

function getLevelTier(level: string) {
  return levelTiers.find(t => t.level === level) ?? levelTiers[0]!
}

// ── Sort & filter ──
const sortBy = ref<'level' | 'points' | 'name' | 'type' | 'status'>('level')
const filterBy = ref<'all' | 'not_started' | 'in_progress' | 'completed'>('all')

const sortOptions = [
  { value: 'level',  label: 'Level'  },
  { value: 'points', label: 'Points' },
  { value: 'name',   label: 'Name'   },
  { value: 'type',   label: 'Type'   },
  { value: 'status', label: 'Status' },
] as const

const filterOptions = [
  { value: 'all',          label: 'All'          },
  { value: 'not_started',  label: 'Not Started'  },
  { value: 'in_progress',  label: 'In Progress'  },
  { value: 'completed',    label: 'Completed ✓'  },
] as const

const sortedQuests = computed(() => {
  let list = questsStore.questsWithProgress

  if (filterBy.value !== 'all') {
    list = list.filter(q => {
      const s = q.userQuest?.status ?? 'not_started'
      return s === filterBy.value
    })
  }

  const statusOrder: Record<string, number> = { completed: 0, in_progress: 1, not_started: 2 }

  return [...list].sort((a, b) => {
    switch (sortBy.value) {
      case 'level':  return a.level_order - b.level_order || a.points - b.points
      case 'points': return b.points - a.points
      case 'name':   return a.title.localeCompare(b.title)
      case 'type':   return a.type.localeCompare(b.type)
      case 'status': {
        const aS = a.userQuest?.status ?? 'not_started'
        const bS = b.userQuest?.status ?? 'not_started'
        return statusOrder[aS]! - statusOrder[bS]!
      }
      default: return 0
    }
  })
})

// ── Visual decorations ──
const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}
const floatingPieces = [
  { key: 0, piece: '♔', style: { left: '2%',  top: '5%',  fontSize: '72px', animation: 'float-bob 12s ease-in-out infinite', animationDelay: '0s'   } },
  { key: 1, piece: '♕', style: { left: '88%', top: '5%',  fontSize: '56px', animation: 'float-bob 9s ease-in-out infinite',  animationDelay: '-3s'  } },
  { key: 2, piece: '♘', style: { left: '50%', top: '70%', fontSize: '48px', animation: 'float-bob 14s ease-in-out infinite', animationDelay: '-7s'  } },
  { key: 3, piece: '♗', style: { left: '20%', top: '60%', fontSize: '40px', animation: 'float-bob 11s ease-in-out infinite', animationDelay: '-2s'  } },
  { key: 4, piece: '♖', style: { left: '72%', top: '40%', fontSize: '44px', animation: 'float-bob 10s ease-in-out infinite', animationDelay: '-5s'  } },
  { key: 5, piece: '♙', style: { left: '35%', top: '18%', fontSize: '36px', animation: 'float-bob 8s ease-in-out infinite',  animationDelay: '-1s'  } },
]
</script>

<style scoped>
@keyframes float-bob {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-18px) rotate(3deg); }
  66%       { transform: translateY(-8px) rotate(-2deg); }
}
@keyframes ping-slow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50%       { transform: scale(1.25); opacity: 0; }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-ping-slow  { animation: ping-slow 2.5s ease-in-out infinite; }
.animate-fade-in-up { animation: fade-in-up 0.4s ease-out both; }
</style>
