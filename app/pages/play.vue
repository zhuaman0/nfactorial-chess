<template>
  <div class="p-4 pb-16 mt-6">
    <main class="max-w-6xl mx-auto">

      <!-- ══════════════════════════════════════════════════ LOBBY ══ -->
      <Transition name="page-fade" mode="out-in">
        <div v-if="!gameStarted" key="lobby" class="max-w-2xl mx-auto">

          <!-- Header -->
          <div class="text-center mb-8">
            <div class="text-5xl mb-3">♟</div>
            <h1 class="text-3xl font-bold text-white">Play Chess</h1>
            <p class="text-slate-400 mt-1 text-sm">Set up your game before starting</p>
          </div>

          <!-- Choose Opponent -->
          <div class="bg-slate-800/60 border border-white/10 rounded-2xl p-5 mb-4">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Choose Opponent</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                v-for="m in MODES"
                :key="m.value"
                class="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-150"
                :class="selectedMode === m.value
                  ? `${m.activeClass} border-transparent`
                  : 'border-white/10 hover:border-white/20 text-slate-400 hover:text-white bg-slate-900/40'"
                @click="selectedMode = m.value"
              >
                <span class="text-2xl">{{ m.icon }}</span>
                <div class="text-center">
                  <p class="text-sm font-semibold leading-tight">{{ m.label }}</p>
                  <p class="text-xs opacity-70 mt-0.5 leading-tight">{{ m.desc }}</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Piece Style -->
          <div class="bg-slate-800/60 border border-white/10 rounded-2xl p-5 mb-4">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Piece Style</p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                v-for="s in SKINS"
                :key="s.value"
                class="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-150"
                :class="customization.skin === s.value
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'border-white/10 hover:border-white/20 text-slate-400 hover:text-white bg-slate-900/40'"
                @click="customization.setSkin(s.value)"
              >
                <!-- Piece preview with skin filter -->
                <span class="text-3xl leading-none" :class="s.filterClass">♛</span>
                <div class="text-center">
                  <p class="text-sm font-semibold leading-tight">{{ s.label }}</p>
                  <p class="text-xs opacity-60 mt-0.5">{{ s.desc }}</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Arena Theme -->
          <div class="bg-slate-800/60 border border-white/10 rounded-2xl p-5 mb-6">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Arena</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(t, key) in ARENA_THEMES"
                :key="key"
                class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150"
                :class="customization.theme === key
                  ? 'border-white/40 bg-white/10 text-white'
                  : 'border-white/10 hover:border-white/20 text-slate-400 hover:text-white bg-slate-900/40'"
                @click="customization.setTheme(key as any)"
              >
                <!-- Two-square swatch -->
                <div class="flex rounded overflow-hidden shrink-0 ring-1 ring-white/20">
                  <div class="w-4 h-4" :style="{ backgroundColor: t.light }"></div>
                  <div class="w-4 h-4" :style="{ backgroundColor: t.dark }"></div>
                </div>
                <span class="text-sm font-medium">{{ t.name }}</span>
                <svg v-if="customization.theme === key" class="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Start Game Button -->
          <button
            class="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-150 active:scale-[0.98]"
            :class="startBtnClass"
            @click="startGame"
          >
            Start Game →
          </button>
        </div>

        <!-- ══════════════════════════════════════════════════ GAME ══ -->
        <div v-else key="game">
          <!-- Back to Setup -->
          <div class="flex items-center justify-between mb-4">
            <button
              class="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
              @click="backToLobby"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to Setup
            </button>
            <div class="flex items-center gap-2">
              <!-- Mode badge -->
              <span
                class="text-xs font-semibold px-2.5 py-1 rounded-full border"
                :class="MODES.find(m => m.value === selectedMode)?.badgeClass"
              >
                {{ MODES.find(m => m.value === selectedMode)?.label }}
              </span>
              <!-- Skin badge -->
              <span class="text-xs text-slate-500">{{ SKINS.find(s => s.value === customization.skin)?.label }} skin</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

            <!-- ── Left: Board ──────────────────────────────────── -->
            <div class="flex flex-col gap-3">

              <!-- Opponent Card -->
              <div class="flex items-center justify-between bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center text-base select-none"
                    :class="selectedMode === 'ai' ? 'bg-gradient-to-br from-purple-900 to-indigo-950' : 'bg-slate-950'"
                  >
                    {{ selectedMode === 'ai' ? '🧠' : '🤖' }}
                  </div>
                  <div>
                    <p class="text-white text-sm font-semibold leading-tight">{{ opponentName }}</p>
                    <p class="text-slate-500 text-xs leading-tight">{{ opponentLabel }}</p>
                  </div>
                </div>
                <div v-if="chessStore.isAIThinking" class="flex items-center gap-1.5 text-blue-400 text-xs font-medium">
                  <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  thinking…
                </div>
                <div v-else-if="chessStore.turn === 'b' && !chessStore.isGameOver" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              </div>

              <!-- Chess Board -->
              <ChessBoard :disabled="chessStore.turn === 'b' || chessStore.isAIThinking || chessStore.isGameOver || !sfReady" />

              <!-- Player Card -->
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

            <!-- ── Right: Sidebar ───────────────────────────────── -->
            <div class="flex flex-col gap-4">

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

              <!-- Stockfish Loading -->
              <div v-if="!sfReady" class="bg-slate-800/60 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div class="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin shrink-0"></div>
                <p class="text-slate-400 text-sm">Loading chess engine…</p>
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
                  <div class="flex gap-2">
                    <UiButton variant="primary" size="sm" @click="chessStore.resetGame()">
                      Play Again
                    </UiButton>
                    <UiButton variant="ghost" size="sm" @click="backToLobby">
                      Change Setup
                    </UiButton>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useChessStore, type Difficulty } from '~/stores/chess'
import { useProfileStore } from '~/stores/profile'
import { useCustomizationStore, ARENA_THEMES } from '~/stores/customization'
import ChessBoard from '~/components/chess/ChessBoard.vue'

definePageMeta({ middleware: 'auth' })

const chessStore     = useChessStore()
const profileStore   = useProfileStore()
const customization  = useCustomizationStore()
const user           = useSupabaseUser()
const historyEl      = ref<HTMLElement | null>(null)

const { isReady: sfReady, init: sfInit, getBestMove, destroy: sfDestroy } = useStockfish()

// ── State ─────────────────────────────────────────────────────────────────
const gameStarted  = ref(false)
const selectedMode = ref<Difficulty>('medium')

// ── Mode / skin config ────────────────────────────────────────────────────
const MODES = [
  { value: 'easy'   as Difficulty, label: 'Easy Bot',    icon: '🤖', desc: 'Beginner friendly',  activeClass: 'bg-emerald-500/20 text-emerald-300', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { value: 'medium' as Difficulty, label: 'Medium Bot',  icon: '🤖', desc: 'Decent challenge',   activeClass: 'bg-blue-500/20    text-blue-300',    badgeClass: 'bg-blue-500/20    text-blue-300    border-blue-500/30'    },
  { value: 'hard'   as Difficulty, label: 'Hard Bot',    icon: '🤖', desc: 'Will fight hard',    activeClass: 'bg-orange-500/20  text-orange-300',  badgeClass: 'bg-orange-500/20  text-orange-300  border-orange-500/30'  },
  { value: 'ai'     as Difficulty, label: 'Max AI',      icon: '🧠', desc: 'Nearly unbeatable',  activeClass: 'bg-purple-500/20  text-purple-300',  badgeClass: 'bg-purple-500/20  text-purple-300  border-purple-500/30'  },
]

const SKINS = [
  { value: 'classic' as const, label: 'Classic', desc: 'Traditional',    filterClass: '' },
  { value: 'neon'    as const, label: 'Neon',    desc: 'Glowing',        filterClass: 'preview-neon-b'  },
  { value: 'royal'   as const, label: 'Royal',   desc: 'Golden pieces',  filterClass: 'preview-royal-b' },
  { value: 'pixel'   as const, label: 'Pixel',   desc: 'Unicode style',  filterClass: 'preview-pixel'   },
]

// ── Avatar ────────────────────────────────────────────────────────────────
const avatarSrc = computed(() => {
  const meta = user.value?.user_metadata || {}
  return profileStore.avatarUrl || meta.picture || meta.avatar_url || ''
})

// ── Start / back ──────────────────────────────────────────────────────────
const startBtnClass = computed(() => {
  const m = MODES.find(x => x.value === selectedMode.value)
  const base = 'text-white shadow-lg'
  if (selectedMode.value === 'easy')   return `${base} bg-emerald-600 hover:bg-emerald-500`
  if (selectedMode.value === 'medium') return `${base} bg-blue-600    hover:bg-blue-500`
  if (selectedMode.value === 'hard')   return `${base} bg-orange-600  hover:bg-orange-500`
  return `${base} bg-purple-600 hover:bg-purple-500`
})

function startGame() {
  chessStore.setDifficulty(selectedMode.value)
  chessStore.resetGame()
  gameStarted.value = true
  sfInit()
}

function backToLobby() {
  sfDestroy()
  chessStore.resetGame()
  gameStarted.value = false
}

// ── Opponent labels ───────────────────────────────────────────────────────
const opponentName = computed(() =>
  selectedMode.value === 'ai' ? 'Grandmaster AI' : 'Stockfish Bot'
)
const opponentLabel = computed(() => {
  if (selectedMode.value === 'ai') return 'Max Depth · Depth 18'
  const map: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
  return map[selectedMode.value] ?? selectedMode.value
})

// ── Move pairs (1. e4  e5 format) ─────────────────────────────────────────
const movePairs = computed(() => {
  const pairs: [string, string?][] = []
  for (let i = 0; i < chessStore.moveHistory.length; i += 2) {
    pairs.push([chessStore.moveHistory[i], chessStore.moveHistory[i + 1]])
  }
  return pairs
})

watch(() => chessStore.moveHistory.length, async () => {
  await nextTick()
  if (historyEl.value) historyEl.value.scrollTop = historyEl.value.scrollHeight
})

// ── AI move trigger ────────────────────────────────────────────────────────
watch(
  () => [chessStore.turn, chessStore.isGameOver, sfReady.value, gameStarted.value] as const,
  async ([turn, gameOver, ready, started]) => {
    if (!started || turn !== 'b' || gameOver || !ready || chessStore.isAIThinking) return
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
  if (chessStore.isCheckmate) return chessStore.turn === 'w' ? `${opponentName.value} wins!` : 'You win!'
  return "It's a draw!"
})
const gameOverDescription = computed(() => {
  if (chessStore.isCheckmate) {
    return chessStore.turn === 'w'
      ? 'The AI found checkmate. Try an easier setting!'
      : 'Amazing! You checkmated the AI.'
  }
  return 'The game ended in a draw.'
})

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(async () => {
  customization.load()
  await profileStore.fetchProfile()
  if (!profileStore.profile?.first_name && user.value) {
    await profileStore.syncFromOAuth(user.value)
  }
})

onUnmounted(() => {
  sfDestroy()
})
</script>

<style scoped>
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(8px); }
.page-fade-leave-to   { opacity: 0; transform: translateY(-8px); }

.slide-up-enter-active { transition: all 0.3s ease; }
.slide-up-enter-from   { opacity: 0; transform: translateY(12px); }

/* Skin filter previews (used on the ♛ preview in lobby) */
.preview-neon-b {
  filter: sepia(1) saturate(8) hue-rotate(260deg) brightness(1.3)
          drop-shadow(0 0 5px #cc44ff) drop-shadow(0 0 10px #8800cc);
}
.preview-royal-b {
  filter: sepia(1) saturate(4) hue-rotate(15deg) brightness(0.7);
}
.preview-pixel {
  font-family: 'Segoe UI Symbol', 'Apple Color Emoji', sans-serif;
  color: #94a3b8;
}
</style>
