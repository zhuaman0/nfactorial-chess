<template>
  <div class="p-4 pb-16 mt-6">
    <main class="max-w-6xl mx-auto">
      <Transition name="page-fade" mode="out-in">

        <!-- ══════════════════════════════════════════ LOBBY ══ -->
        <div v-if="!gameStarted" key="lobby" class="flex flex-col gap-6">

          <!-- Banner -->
          <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 shadow-2xl">
            <div class="absolute inset-0 opacity-10 pointer-events-none" :style="chessBoardBg"></div>
            <div class="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative flex items-center justify-between px-10 py-8">
              <div>
                <h1 class="text-4xl font-extrabold text-white drop-shadow-lg">Play Chess</h1>
                <p class="text-orange-100/80 mt-1">Set up your match and enter the arena</p>
              </div>
              <span class="text-7xl drop-shadow-2xl select-none hidden sm:block">♟</span>
            </div>
          </div>

          <!-- Main grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- ── Left 2 cols ── -->
            <div class="lg:col-span-2 flex flex-col gap-6">

              <!-- Choose Opponent -->
              <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-7 shadow-2xl">
                <div class="absolute -top-8 -right-8 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="relative">
                  <div class="flex items-center gap-2 mb-5">
                    <span class="text-xl">🎯</span>
                    <h2 class="text-lg font-extrabold text-white">Choose Opponent</h2>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      v-for="m in MODES"
                      :key="m.value"
                      class="relative flex flex-col items-start gap-3 p-5 rounded-2xl border transition-all duration-200 text-left group hover:-translate-y-0.5"
                      :class="selectedMode === m.value
                        ? `${m.activeBg} ${m.activeBorder} shadow-lg`
                        : 'bg-slate-800/60 border-white/8 hover:border-white/20'"
                      @click="selectedMode = m.value"
                    >
                      <!-- Selected checkmark -->
                      <div
                        v-if="selectedMode === m.value"
                        class="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                        :class="m.checkBg"
                      >✓</div>

                      <span class="text-3xl leading-none">{{ m.icon }}</span>
                      <div>
                        <p class="font-bold text-sm leading-tight" :class="selectedMode === m.value ? m.activeText : 'text-white'">{{ m.label }}</p>
                        <p class="text-xs mt-0.5 text-slate-500 leading-tight">{{ m.desc }}</p>
                      </div>
                      <!-- Difficulty dots -->
                      <div class="flex gap-1 mt-1">
                        <span
                          v-for="d in 4"
                          :key="d"
                          class="w-1.5 h-1.5 rounded-full"
                          :class="d <= m.dots
                            ? (selectedMode === m.value ? m.dotActive : 'bg-slate-400')
                            : 'bg-slate-700'"
                        ></span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Piece Style -->
              <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-7 shadow-2xl">
                <div class="absolute -bottom-8 -left-8 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div class="relative">
                  <div class="flex items-center gap-2 mb-5">
                    <span class="text-xl">♛</span>
                    <h2 class="text-lg font-extrabold text-white">Piece Style</h2>
                  </div>
                  <div class="grid grid-cols-4 gap-3">
                    <button
                      v-for="s in SKINS"
                      :key="s.value"
                      class="flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
                      :class="customization.skin === s.value
                        ? 'bg-orange-500/15 border-orange-500/40 shadow-lg shadow-orange-500/10'
                        : 'bg-slate-800/60 border-white/8 hover:border-white/20'"
                      @click="customization.setSkin(s.value)"
                    >
                      <span class="text-4xl leading-none" :class="s.filterClass">♛</span>
                      <div class="text-center">
                        <p class="font-bold text-xs leading-tight" :class="customization.skin === s.value ? 'text-orange-300' : 'text-white'">{{ s.label }}</p>
                        <p class="text-[10px] text-slate-600 mt-0.5">{{ s.desc }}</p>
                      </div>
                      <div v-if="customization.skin === s.value" class="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[9px] font-black">✓</div>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <!-- ── Right col: Arena + Start ── -->
            <div class="flex flex-col gap-6">

              <!-- Arena Theme -->
              <div class="relative overflow-hidden bg-white border border-orange-500/20 rounded-3xl p-7 shadow-2xl flex-1">
                <div class="absolute -top-8 -right-8 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div class="relative">
                  <div class="flex items-center gap-2 mb-5">
                    <span class="text-xl">🏟</span>
                    <h2 class="text-lg font-extrabold text-slate-900">Arena</h2>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button
                      v-for="(t, key) in ARENA_THEMES"
                      :key="key"
                      class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-150 w-full text-left"
                      :class="customization.theme === key
                        ? 'border-orange-500/40 bg-orange-50 shadow-sm'
                        : 'border-slate-200 hover:border-orange-500/20 hover:bg-slate-50'"
                      @click="customization.setTheme(key as any)"
                    >
                      <!-- 2×2 swatch -->
                      <div class="grid grid-cols-2 rounded-lg overflow-hidden shrink-0 ring-1 ring-black/10 shadow-sm">
                        <div class="w-5 h-5" :style="{ backgroundColor: t.light }"></div>
                        <div class="w-5 h-5" :style="{ backgroundColor: t.dark }"></div>
                        <div class="w-5 h-5" :style="{ backgroundColor: t.dark }"></div>
                        <div class="w-5 h-5" :style="{ backgroundColor: t.light }"></div>
                      </div>
                      <span class="text-sm font-semibold flex-1" :class="customization.theme === key ? 'text-orange-600' : 'text-slate-700'">{{ t.name }}</span>
                      <div v-if="customization.theme === key" class="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">✓</div>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Start button -->
              <button
                class="w-full py-5 rounded-2xl font-extrabold text-lg text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3"
                @click="startGame"
              >
                <span class="text-2xl">⚔️</span>
                Start Game
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════ GAME ══ -->
        <div v-else key="game">
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
              <span
                class="text-xs font-semibold px-2.5 py-1 rounded-full border"
                :class="MODES.find(m => m.value === selectedMode)?.badgeClass"
              >
                {{ MODES.find(m => m.value === selectedMode)?.label }}
              </span>
              <span class="text-xs text-slate-500">{{ SKINS.find(s => s.value === customization.skin)?.label }} skin</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
            <!-- ── Left: Board ── -->
            <div class="flex flex-col gap-3">
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

              <!-- Castle HP Bar -->
              <div class="bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <span class="text-xl select-none flex-shrink-0">🏰</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Castle HP</span>
                    <span class="text-xs font-black tabular-nums" :class="hpTextColor">
                      {{ chessStore.castleHp }} / 100
                    </span>
                  </div>
                  <div class="w-full h-2.5 bg-slate-700/80 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-700 ease-out"
                      :class="hpBarColor"
                      :style="{ width: `${chessStore.castleHp}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <ChessBoard
                :disabled="chessStore.turn === 'b' || chessStore.isAIThinking || chessStore.isGameOver || !sfReady"
                @player-move="onPlayerMove"
              />

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

            <!-- ── Right: Sidebar ── -->
            <div class="flex flex-col gap-4">
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

              <div v-if="!sfReady" class="bg-slate-800/60 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div class="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin shrink-0"></div>
                <p class="text-slate-400 text-sm">Loading chess engine…</p>
              </div>

              <Transition name="slide-up">
                <div
                  v-if="chessStore.isGameOver"
                  class="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-5"
                >
                  <div class="text-3xl mb-2">{{ gameOverEmoji }}</div>
                  <h3 class="text-white font-bold text-lg mb-1">{{ gameOverTitle }}</h3>
                  <p class="text-slate-400 text-sm mb-4">{{ gameOverDescription }}</p>
                  <div class="flex gap-2">
                    <UiButton variant="primary" size="sm" @click="chessStore.resetGame()">Play Again</UiButton>
                    <UiButton variant="outline" size="sm" @click="backToLobby">Change Setup</UiButton>
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

definePageMeta({ name: 'Play', middleware: 'auth' })

const chessStore    = useChessStore()
const profileStore  = useProfileStore()
const customization = useCustomizationStore()
const user          = useSupabaseUser()
const historyEl     = ref<HTMLElement | null>(null)
const advisor       = useAdvisor()

const { isReady: sfReady, init: sfInit, getBestMove, destroy: sfDestroy } = useStockfish()

const gameStarted  = ref(false)
const selectedMode = ref<Difficulty>('medium')

// ── Castle HP bar colours ──────────────────────────────────────────────────
const hpBarColor = computed(() => {
  if (chessStore.castleHp > 60) return 'bg-gradient-to-r from-emerald-500 to-green-400'
  if (chessStore.castleHp > 30) return 'bg-gradient-to-r from-yellow-500 to-amber-400'
  return 'bg-gradient-to-r from-red-600 to-red-400 animate-pulse'
})
const hpTextColor = computed(() => {
  if (chessStore.castleHp > 60) return 'text-emerald-400'
  if (chessStore.castleHp > 30) return 'text-amber-400'
  return 'text-red-400'
})

// ── Material counting (proxy for blunder detection until Step 3 adds eval) ─
// Returns white_material - black_material in pawn units.
const PIECE_VAL: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 }
function materialScore(fen: string): number {
  let score = 0
  for (const ch of fen.split(' ')[0]) {
    const v = PIECE_VAL[ch.toLowerCase()]
    if (v) score += ch === ch.toUpperCase() ? v : -v
  }
  return score
}

// Snapshot material right after player moves, before AI replies.
let materialSnapshot = 0
function onPlayerMove(_payload: { fenBefore: string; fenAfter: string }) {
  materialSnapshot = materialScore(_payload.fenAfter)
}

// After AI replies, compare material to detect captures against the player.
watch(() => chessStore.turn, (newTurn, oldTurn) => {
  if (!gameStarted.value || chessStore.isGameOver) return

  // AI just finished its move → turn flipped back to white
  if (newTurn === 'w' && oldTurn === 'b') {
    const lost = materialSnapshot - materialScore(chessStore.fen)
    if (lost >= 9) {
      chessStore.damageHp(25)
      advisor.show("THE QUEEN! SOUND THE ALARM! 🚨 Regroup, My Lord!", 'panic')
    } else if (lost >= 5) {
      chessStore.damageHp(15)
      advisor.show("Our Rook has fallen! Hold the line! 🏰", 'panic')
    } else if (lost >= 3) {
      chessStore.damageHp(10)
      advisor.show("We lost a piece, My Lord! Stay focused! 🛡️", 'panic')
    } else if (lost >= 1) {
      chessStore.damageHp(5)
      advisor.show("A soldier lost! Every pawn matters! 🏰", 'neutral')
    }
  }
})

// React to check & checkmate events
watch(() => chessStore.isCheck, (inCheck) => {
  if (!inCheck || !gameStarted.value || chessStore.isCheckmate) return
  if (chessStore.turn === 'w') {
    advisor.show("MY LORD! You are in CHECK! Move your King to safety! 👑", 'panic', 6000)
  } else {
    advisor.show("Their King is in check! Finish them! ⚔️", 'praise', 3000)
  }
})

const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

const MODES = [
  {
    value: 'easy'   as Difficulty, label: 'Easy Bot',   icon: '🤖', desc: 'Beginner friendly',  dots: 1,
    activeBg: 'bg-emerald-500/15', activeBorder: 'border-emerald-500/40', activeText: 'text-emerald-300',
    dotActive: 'bg-emerald-400', checkBg: 'bg-emerald-500 text-white',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    value: 'medium' as Difficulty, label: 'Medium Bot', icon: '🤖', desc: 'Decent challenge',   dots: 2,
    activeBg: 'bg-blue-500/15',    activeBorder: 'border-blue-500/40',    activeText: 'text-blue-300',
    dotActive: 'bg-blue-400',    checkBg: 'bg-blue-500 text-white',
    badgeClass: 'bg-blue-500/20    text-blue-300    border-blue-500/30',
  },
  {
    value: 'hard'   as Difficulty, label: 'Hard Bot',   icon: '🤖', desc: 'Will fight back',    dots: 3,
    activeBg: 'bg-orange-500/15',  activeBorder: 'border-orange-500/40',  activeText: 'text-orange-300',
    dotActive: 'bg-orange-400',  checkBg: 'bg-orange-500 text-white',
    badgeClass: 'bg-orange-500/20  text-orange-300  border-orange-500/30',
  },
  {
    value: 'ai'     as Difficulty, label: 'Max AI',     icon: '🧠', desc: 'Nearly unbeatable',  dots: 4,
    activeBg: 'bg-purple-500/15',  activeBorder: 'border-purple-500/40',  activeText: 'text-purple-300',
    dotActive: 'bg-purple-400',  checkBg: 'bg-purple-500 text-white',
    badgeClass: 'bg-purple-500/20  text-purple-300  border-purple-500/30',
  },
]

const SKINS = [
  { value: 'classic' as const, label: 'Classic', desc: 'Traditional',   filterClass: '' },
  { value: 'neon'    as const, label: 'Neon',    desc: 'Glowing',       filterClass: 'preview-neon-b'  },
  { value: 'royal'   as const, label: 'Royal',   desc: 'Golden pieces', filterClass: 'preview-royal-b' },
  { value: 'pixel'   as const, label: 'Pixel',   desc: 'Unicode style', filterClass: 'preview-pixel'   },
]

const avatarSrc = computed(() => {
  const meta = user.value?.user_metadata || {}
  return profileStore.avatarUrl || meta.picture || meta.avatar_url || ''
})

function startGame() {
  chessStore.setDifficulty(selectedMode.value)
  chessStore.resetGame()
  gameStarted.value = true
  sfInit()
  advisor.show("The battle begins! Show no mercy, My Lord! ⚔️", 'neutral', 3500)
}

function backToLobby() {
  sfDestroy()
  chessStore.resetGame()
  gameStarted.value = false
  advisor.hide()
}

const opponentName = computed(() =>
  selectedMode.value === 'ai' ? 'Grandmaster AI' : 'Stockfish Bot'
)
const opponentLabel = computed(() => {
  if (selectedMode.value === 'ai') return 'Max Depth · Depth 18'
  const map: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
  return map[selectedMode.value] ?? selectedMode.value
})

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

watch(() => chessStore.isGameOver, async (over) => {
  if (!over) return
  if (chessStore.isCheckmate && chessStore.turn === 'b') {
    advisor.show("CHECKMATE! You conquered the realm! ALL HAIL THE CHAMPION! 🏆", 'praise', 0)
  } else if (chessStore.isCheckmate && chessStore.turn === 'w') {
    advisor.show("The castle has fallen… But every knight learns from defeat! 💙", 'panic', 0)
  }
  await chessStore.saveGame()
})

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

onMounted(async () => {
  customization.load()
  await profileStore.fetchProfile()
  if (!profileStore.profile?.first_name && user.value) {
    await profileStore.syncFromOAuth(user.value)
  }
})

onUnmounted(() => { sfDestroy() })
</script>

<style scoped>
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(8px); }
.page-fade-leave-to   { opacity: 0; transform: translateY(-8px); }

.slide-up-enter-active { transition: all 0.3s ease; }
.slide-up-enter-from   { opacity: 0; transform: translateY(12px); }

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
