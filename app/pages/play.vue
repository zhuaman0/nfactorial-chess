<template>
  <div class="p-4 pb-12 mt-6">
    <main class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

        <!-- ── Left: Board Column ───────────────────────────────────────── -->
        <div class="flex flex-col gap-3">

          <!-- AI Player Card (Black) -->
          <div class="flex items-center justify-between bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-950 border-2 border-white/10 flex items-center justify-center text-base select-none">♚</div>
              <div>
                <p class="text-white text-sm font-semibold leading-tight">Stockfish AI</p>
                <p class="text-slate-500 text-xs leading-tight capitalize">{{ chessStore.difficulty }}</p>
              </div>
            </div>
            <div v-if="chessStore.isAIThinking" class="flex items-center gap-1.5 text-blue-400 text-xs font-medium">
              <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              thinking…
            </div>
            <div v-else-if="chessStore.turn === 'b' && !chessStore.isGameOver" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>

          <!-- Chess Board -->
          <ChessBoard :disabled="chessStore.turn === 'b' || chessStore.isAIThinking || chessStore.isGameOver" />

          <!-- Human Player Card (White) -->
          <div class="flex items-center justify-between bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5">
            <div class="flex items-center gap-3">
              <UiAvatar :src="avatarSrc" :fallback="profileStore.initials || '?'" size="sm" />
              <div>
                <p class="text-white text-sm font-semibold leading-tight">{{ profileStore.fullName || user?.email || 'You' }}</p>
                <p class="text-slate-500 text-xs leading-tight">Playing as White</p>
              </div>
            </div>
            <div v-if="chessStore.turn === 'w' && !chessStore.isGameOver && !chessStore.isAIThinking" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
        </div>

        <!-- ── Right: Sidebar ───────────────────────────────────────────── -->
        <div class="flex flex-col gap-4">

          <!-- Difficulty Selector -->
          <div class="bg-slate-800/60 border border-white/10 rounded-2xl p-4">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Difficulty</p>
            <div class="flex gap-2">
              <button
                v-for="level in difficulties"
                :key="level.value"
                class="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 border"
                :class="chessStore.difficulty === level.value
                  ? `${level.activeClass} border-transparent`
                  : 'text-slate-400 border-white/10 hover:border-white/20 hover:text-white'"
                @click="changeDifficulty(level.value as Difficulty)"
              >
                {{ level.label }}
              </button>
            </div>
          </div>

          <!-- Move History -->
          <div class="bg-slate-800/60 border border-white/10 rounded-2xl p-4 flex flex-col min-h-[280px] max-h-[380px]">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Move History</p>
            <div ref="historyEl" class="flex-1 overflow-y-auto space-y-0.5 font-mono text-sm pr-1">
              <div
                v-for="(pair, i) in movePairs"
                :key="i"
                class="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors"
              >
                <span class="text-slate-600 text-xs w-5 shrink-0">{{ i + 1 }}.</span>
                <span class="text-white w-16">{{ pair[0] }}</span>
                <span class="text-slate-400 w-16">{{ pair[1] ?? '' }}</span>
              </div>
              <div v-if="chessStore.moveHistory.length === 0" class="text-slate-500 italic text-center py-6 text-xs">
                Make your first move!
              </div>
            </div>
          </div>

          <!-- Stockfish Status -->
          <div v-if="!sfReady" class="bg-slate-800/60 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div class="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin shrink-0"></div>
            <p class="text-slate-400 text-sm">Loading Stockfish engine…</p>
          </div>

          <!-- Game Over Card -->
          <Transition name="slide-up">
            <div
              v-if="chessStore.isGameOver"
              class="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-5"
            >
              <div class="text-3xl mb-2">{{ gameOverEmoji }}</div>
              <h3 class="text-white font-bold text-lg mb-1">{{ gameOverTitle }}</h3>
              <p class="text-slate-400 text-sm mb-4">{{ gameOverDescription }}</p>
              <UiButton variant="primary" size="sm" @click="startNewGame">
                Play Again
              </UiButton>
            </div>
          </Transition>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useChessStore, type Difficulty } from '~/stores/chess'
import { useProfileStore } from '~/stores/profile'
import ChessBoard from '~/components/chess/ChessBoard.vue'

definePageMeta({ middleware: 'auth' })

const chessStore = useChessStore()
const profileStore = useProfileStore()
const user = useSupabaseUser()
const historyEl = ref<HTMLElement | null>(null)

const { isReady: sfReady, init: sfInit, getBestMove, destroy: sfDestroy } = useStockfish()

// ── Avatar ────────────────────────────────────────────────────────────────
const avatarSrc = computed(() => {
  const meta = user.value?.user_metadata || {}
  return profileStore.avatarUrl || meta.picture || meta.avatar_url || ''
})

// ── Difficulty ────────────────────────────────────────────────────────────
const difficulties = [
  { value: 'easy',   label: 'Easy',   activeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { value: 'medium', label: 'Medium', activeClass: 'bg-blue-500/20    text-blue-300    border-blue-500/40'    },
  { value: 'hard',   label: 'Hard',   activeClass: 'bg-red-500/20     text-red-300     border-red-500/40'     },
]

function changeDifficulty(d: Difficulty) {
  chessStore.setDifficulty(d)
  chessStore.resetGame()
}

// ── Move pairs (1. e4  e5 format) ────────────────────────────────────────
const movePairs = computed(() => {
  const pairs: [string, string?][] = []
  for (let i = 0; i < chessStore.moveHistory.length; i += 2) {
    pairs.push([chessStore.moveHistory[i], chessStore.moveHistory[i + 1]])
  }
  return pairs
})

// Auto-scroll history to bottom
watch(() => chessStore.moveHistory.length, async () => {
  await nextTick()
  if (historyEl.value) historyEl.value.scrollTop = historyEl.value.scrollHeight
})

// ── AI move trigger ────────────────────────────────────────────────────────
watch(
  () => [chessStore.turn, chessStore.isGameOver, sfReady.value] as const,
  async ([turn, gameOver, ready]) => {
    if (turn !== 'b' || gameOver || !ready || chessStore.isAIThinking) return

    chessStore.isAIThinking = true
    try {
      const move = await getBestMove(chessStore.fen, chessStore.difficulty)
      if (move && !chessStore.isGameOver) {
        chessStore.makeMove(move.from, move.to, move.promotion ?? 'q')
      }
    } finally {
      chessStore.isAIThinking = false
    }
  },
  { immediate: true }
)

// ── Auto-save on game over ────────────────────────────────────────────────
watch(() => chessStore.isGameOver, async (over) => {
  if (over) await chessStore.saveGame()
})

// ── Game over display ─────────────────────────────────────────────────────
const gameOverEmoji = computed(() => {
  if (chessStore.isCheckmate) return chessStore.turn === 'w' ? '🤖' : '🏆'
  return '🤝'
})
const gameOverTitle = computed(() => {
  if (chessStore.isCheckmate) return chessStore.turn === 'w' ? 'Stockfish wins!' : 'You win!'
  return "It's a draw!"
})
const gameOverDescription = computed(() => {
  if (chessStore.isCheckmate) {
    return chessStore.turn === 'w'
      ? 'The AI found a checkmate. Try an easier difficulty!'
      : 'Amazing! You checkmated the AI.'
  }
  return 'The game ended in a draw.'
})

function startNewGame() {
  chessStore.resetGame()
}

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(async () => {
  sfInit()
  await profileStore.fetchProfile()
  if (!profileStore.profile?.first_name && user.value) {
    await profileStore.syncFromOAuth(user.value)
  }
  chessStore.resetGame()
})

onUnmounted(() => {
  sfDestroy()
})
</script>

<style scoped>
.slide-up-enter-active { transition: all 0.3s ease; }
.slide-up-enter-from   { opacity: 0; transform: translateY(12px); }
</style>
