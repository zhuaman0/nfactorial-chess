<template>
  <div class="flex flex-col gap-5">

    <!-- Header -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-orange-600 to-amber-500 shadow-2xl px-8 py-7">
      <div class="absolute inset-0 opacity-10 pointer-events-none" :style="chessBoardBg" />
      <div class="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div class="relative flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-white drop-shadow">⚔️ Shadow Siege</h1>
          <p class="text-orange-100/80 mt-1 text-sm">Raid players — defeat their Shadow AI — steal their gold</p>
        </div>
        <div class="hidden sm:flex flex-col items-end gap-1">
          <span class="text-xs text-orange-200/70 font-semibold uppercase tracking-widest">Your Gold</span>
          <span class="text-3xl font-black text-white drop-shadow">🪙 {{ profileStore.profile?.gold_balance ?? 0 }}</span>
        </div>
      </div>
    </div>

    <!-- How it works -->
    <div class="grid grid-cols-3 gap-3">
      <div v-for="step in HOW_IT_WORKS" :key="step.title"
        class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-800/50 border border-white/8 text-center">
        <span class="text-2xl">{{ step.icon }}</span>
        <p class="text-white text-xs font-bold">{{ step.title }}</p>
        <p class="text-slate-500 text-[11px] leading-snug">{{ step.desc }}</p>
      </div>
    </div>

    <!-- Stake selector -->
    <div class="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-800/50 border border-white/8">
      <span class="text-xl">🪙</span>
      <span class="text-slate-300 text-sm font-semibold flex-1">Gold Stake per Raid</span>
      <div class="flex gap-2">
        <button
          v-for="amount in [50, 100, 200, 500]"
          :key="amount"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          :class="selectedStake === amount
            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
            : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'"
          @click="selectedStake = amount"
        >{{ amount }}</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="raidStore.loading" class="flex items-center justify-center py-16 gap-3 text-slate-500">
      <div class="w-5 h-5 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
      <span class="text-sm">Scouting targets…</span>
    </div>

    <!-- Target list -->
    <div v-else class="flex flex-col gap-3">
      <p class="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">
        {{ raidStore.targets.length }} Players Available
      </p>

      <div
        v-for="(target, idx) in raidStore.targets"
        :key="target.id"
        class="flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 group"
        :class="idx === 0
          ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60'
          : 'bg-slate-800/40 border-white/8 hover:border-white/20 hover:bg-slate-800/70'"
      >
        <!-- Rank -->
        <div class="w-7 text-center shrink-0">
          <span v-if="idx === 0" class="text-lg">👑</span>
          <span v-else-if="idx === 1" class="text-lg">🥈</span>
          <span v-else-if="idx === 2" class="text-lg">🥉</span>
          <span v-else class="text-slate-600 text-sm font-bold tabular-nums">#{{ idx + 1 }}</span>
        </div>

        <!-- Avatar -->
        <div class="relative shrink-0">
          <UiAvatar :src="target.avatar_url" :fallback="initials(target)" size="sm" />
        </div>

        <!-- Name + stats -->
        <div class="flex-1 min-w-0">
          <p class="text-white font-bold text-sm truncate">{{ target.first_name }} {{ target.last_name }}</p>
          <div class="flex items-center gap-3 mt-0.5">
            <span class="text-[11px] text-slate-500">⚔️ {{ target.raid_wins }} raids won</span>
            <span class="text-[11px] text-slate-500">🛡 {{ target.defense_wins }} defended</span>
          </div>
        </div>

        <!-- Gold -->
        <div class="text-right shrink-0">
          <p class="text-amber-400 font-black text-base tabular-nums">🪙 {{ target.gold_balance }}</p>
          <p class="text-[10px] text-slate-600 mt-0.5">{{ target.points ?? 0 }} XP</p>
        </div>

        <!-- Attack button -->
        <button
          class="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          :class="canAfford
            ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/20 hover:from-red-500 hover:to-orange-400 active:scale-95'
            : 'bg-slate-700/50 text-slate-600 cursor-not-allowed'"
          :disabled="!canAfford"
          @click="canAfford && emit('start-raid', target, selectedStake)"
        >
          <span>⚔️</span>
          Raid
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="raidStore.targets.length === 0"
        class="flex flex-col items-center justify-center py-16 gap-3 text-slate-600">
        <span class="text-5xl">🏰</span>
        <p class="text-sm">No other players to raid yet.</p>
        <p class="text-xs">Invite friends to Chess Siege!</p>
      </div>

      <!-- Can't afford warning -->
      <div v-if="!canAfford"
        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        <span>⚠️</span>
        You need at least {{ selectedStake }} gold to raid. Play vs AI to earn more!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRaidStore, type RaidTarget } from '~/stores/raid'
import { useProfileStore } from '~/stores/profile'

const emit = defineEmits<{ 'start-raid': [target: RaidTarget, stake: number] }>()

const raidStore    = useRaidStore()
const profileStore = useProfileStore()
const selectedStake = ref(100)

const canAfford = computed(() =>
  (profileStore.profile?.gold_balance ?? 0) >= selectedStake.value
)

const initials = (t: RaidTarget) =>
  ((t.first_name?.[0] ?? '') + (t.last_name?.[0] ?? '')).toUpperCase() || '?'

const HOW_IT_WORKS = [
  { icon: '🎯', title: 'Pick a Target', desc: 'Choose any player ranked by their gold balance' },
  { icon: '🤖', title: 'Fight Their Shadow', desc: "Their AI plays exactly like them — same openings, same style" },
  { icon: '🪙', title: 'Win Their Gold', desc: 'Win the game, steal the staked gold from their vault' },
]

const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '32px 32px',
}

onMounted(() => raidStore.fetchTargets())
</script>
