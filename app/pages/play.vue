<template>
  <div class="p-4 pb-16 mt-6">
    <main class="max-w-6xl mx-auto">
      <Transition name="page-fade" mode="out-in">

        <!-- ══════════════════════════════════════════ LOBBY ══ -->
        <div v-if="!gameStarted" key="lobby" class="flex flex-col gap-6">

          <!-- Banner -->
          <div
            class="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500"
            :class="lobbyTab === 'siege'
              ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-500'
              : 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500'"
          >
            <div class="absolute inset-0 opacity-10 pointer-events-none" :style="chessBoardBg"></div>
            <div class="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative flex items-center justify-between px-10 py-8">
              <div>
                <h1 class="text-4xl font-extrabold text-white drop-shadow-lg">
                  {{ lobbyTab === 'siege' ? '⚔️ Shadow Siege' : 'Play Chess' }}
                </h1>
                <p class="text-orange-100/80 mt-1">
                  {{ lobbyTab === 'siege' ? 'Raid players — fight their Shadow AI — steal their gold' : 'Set up your match and enter the arena' }}
                </p>
              </div>
              <span class="text-7xl drop-shadow-2xl select-none hidden sm:block">
                {{ lobbyTab === 'siege' ? '🏰' : '♟' }}
              </span>
            </div>
          </div>

          <!-- Tab switcher -->
          <div class="flex gap-2 p-1 rounded-2xl bg-slate-800/50 border border-white/8 w-fit">
            <button
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              :class="lobbyTab === 'practice'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'text-slate-400 hover:text-white'"
              @click="lobbyTab = 'practice'"
            >♟ Practice</button>
            <button
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              :class="lobbyTab === 'siege'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-slate-400 hover:text-white'"
              @click="lobbyTab = 'siege'"
            >⚔️ Shadow Siege</button>
          </div>

          <!-- Shadow Siege lobby -->
          <RaidLobby v-if="lobbyTab === 'siege'" @start-raid="onStartRaid" />

          <!-- Practice lobby grid -->
          <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">

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
          </div><!-- end practice grid -->
        </div><!-- end lobby -->

        <!-- ══════════════════════════════════════════ GAME ══ -->
        <div v-else key="game">

          <!-- Dark arena wrapper -->
          <div class="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-white/8 shadow-2xl p-5 md:p-7">

            <!-- Subtle chess-pattern ambient glow -->
            <div class="pointer-events-none absolute inset-0 opacity-[0.03]" :style="chessBoardBg" />
            <div class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-64 bg-orange-500/20 rounded-full blur-3xl" />

            <!-- ── Top bar ── -->
            <div class="relative flex items-center justify-between mb-6">
              <button
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-sm transition-all"
                @click="backToLobby"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Setup
              </button>

              <!-- VS label in the center -->
              <div class="flex items-center gap-3">
                <span class="text-slate-600 text-xs font-bold uppercase tracking-widest">Arena</span>
                <span
                  class="text-xs font-bold px-3 py-1 rounded-full border"
                  :class="MODES.find(m => m.value === selectedMode)?.badgeClass"
                >{{ MODES.find(m => m.value === selectedMode)?.label }}</span>
              </div>

              <!-- Engine loader -->
              <div v-if="!sfReady" class="flex items-center gap-1.5 text-orange-400 text-xs font-semibold">
                <div class="w-3 h-3 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin"></div>
                Loading…
              </div>
              <div v-else class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#4ade80]" title="Engine ready" />
            </div>

            <div class="relative grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-start">

              <!-- ── LEFT: board column ── -->
              <div class="flex flex-col gap-3">

                <!-- Opponent row -->
                <div
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300"
                  :class="chessStore.turn === 'b' && !chessStore.isGameOver
                    ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                    : 'bg-white/4 border-white/8'"
                >
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ring-1"
                    :class="isRaidGame
                      ? 'bg-gradient-to-br from-red-900 to-orange-950 ring-red-500/30'
                      : selectedMode === 'ai'
                        ? 'bg-gradient-to-br from-purple-900 to-indigo-950 ring-purple-500/30'
                        : 'bg-slate-800 ring-white/10'"
                  >{{ isRaidGame ? '👤' : selectedMode === 'ai' ? '🧠' : '🤖' }}</div>
                  <div class="flex-1">
                    <p class="text-white text-sm font-bold leading-tight">{{ opponentName }}</p>
                    <p class="text-slate-500 text-xs mt-0.5">{{ opponentLabel }}</p>
                    <p v-if="isRaidGame && !raidStore.shadowExhausted" class="text-red-400 text-[10px] mt-0.5 font-semibold">
                      Shadow move {{ raidStore.shadowMoveIndex + 1 }}/{{ raidStore.shadowProfile?.opening_moves.length }}
                    </p>
                  </div>
                  <div v-if="chessStore.isAIThinking" class="flex items-center gap-2 text-orange-400 text-xs font-semibold">
                    <span class="flex gap-0.5">
                      <span class="w-1 h-3 bg-orange-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
                      <span class="w-1 h-3 bg-orange-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
                      <span class="w-1 h-3 bg-orange-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
                    </span>
                    Thinking
                  </div>
                  <div v-else-if="chessStore.turn === 'b' && !chessStore.isGameOver"
                    class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
                </div>

                <!-- Castle HP -->
                <div class="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/4 border border-white/8">
                  <span class="text-2xl select-none">🏰</span>
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Castle HP</span>
                      <span class="text-xs font-black tabular-nums" :class="hpTextColor">{{ chessStore.castleHp }}<span class="text-slate-600 font-normal"> / 100</span></span>
                    </div>
                    <div class="h-2.5 bg-slate-800 rounded-full overflow-hidden ring-1 ring-white/5">
                      <div
                        class="h-full rounded-full transition-all duration-700 ease-out"
                        :class="hpBarColor"
                        :style="{ width: `${chessStore.castleHp}%` }"
                      />
                    </div>
                  </div>
                </div>

                <!-- Board -->
                <ChessBoard
                  :disabled="chessStore.turn === 'b' || chessStore.isAIThinking || chessStore.isGameOver || !sfReady"
                  @player-move="onPlayerMove"
                />

                <!-- Player row -->
                <div
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300"
                  :class="chessStore.turn === 'w' && !chessStore.isGameOver && !chessStore.isAIThinking
                    ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                    : 'bg-white/4 border-white/8'"
                >
                  <div class="relative flex-shrink-0">
                    <UiAvatar :src="avatarSrc" :fallback="profileStore.initials || '?'" size="sm" />
                    <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 shadow" />
                  </div>
                  <div class="flex-1">
                    <p class="text-white text-sm font-bold leading-tight">{{ profileStore.fullName || user?.email || 'You' }}</p>
                    <p class="text-slate-500 text-xs mt-0.5">White · Playing as you</p>
                  </div>
                  <div v-if="chessStore.turn === 'w' && !chessStore.isGameOver && !chessStore.isAIThinking"
                    class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
                </div>
              </div>

              <!-- ── RIGHT: sidebar ── -->
              <div class="flex flex-col gap-4">

                <!-- Game Over -->
                <Transition name="slide-up">
                  <div
                    v-if="chessStore.isGameOver"
                    class="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-center"
                  >
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-20 bg-orange-500/20 blur-2xl pointer-events-none" />
                    <div class="relative">
                      <div class="text-5xl mb-3">{{ gameOverEmoji }}</div>
                      <h3 class="text-white font-extrabold text-lg mb-1">{{ gameOverTitle }}</h3>
                      <p class="text-slate-400 text-sm mb-2 leading-snug">{{ gameOverDescription }}</p>
                      <div v-if="isRaidGame" class="mb-4 py-2 px-4 rounded-xl text-sm font-bold"
                        :class="chessStore.isCheckmate && chessStore.turn === 'b'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'"
                      >
                        {{ chessStore.isCheckmate && chessStore.turn === 'b'
                          ? `🪙 +${raidStore.goldStake} gold stolen!`
                          : `🪙 -${raidStore.goldStake} gold lost` }}
                      </div>
                      <div class="flex flex-col gap-2">
                        <button
                          class="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25"
                          @click="chessStore.resetGame()"
                        >⚔️ Play Again</button>
                        <button
                          class="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/10 transition-all"
                          @click="backToLobby"
                        >Change Setup</button>
                      </div>
                    </div>
                  </div>
                </Transition>

                <!-- Move History -->
                <div class="rounded-2xl bg-white/4 border border-white/8 overflow-hidden">
                  <div class="px-4 py-3 border-b border-white/8 flex items-center justify-between bg-white/3">
                    <div class="flex items-center gap-2">
                      <span class="text-base">📜</span>
                      <p class="text-slate-300 text-xs font-bold uppercase tracking-widest">Move History</p>
                    </div>
                    <span class="text-[10px] font-bold text-slate-600 tabular-nums bg-white/5 px-2 py-0.5 rounded-full">
                      {{ chessStore.moveHistory.length }}
                    </span>
                  </div>
                  <div ref="historyEl" class="overflow-y-auto p-2 font-mono text-sm" style="min-height:200px; max-height:340px">
                    <div v-if="chessStore.moveHistory.length === 0"
                      class="flex flex-col items-center justify-center py-12 gap-2 text-slate-700">
                      <span class="text-4xl">♟</span>
                      <p class="text-xs italic">Make your first move!</p>
                    </div>
                    <div
                      v-for="(pair, i) in movePairs"
                      :key="i"
                      class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <span class="text-slate-700 text-[11px] w-5 shrink-0 tabular-nums group-hover:text-slate-500 transition-colors">{{ i + 1 }}.</span>
                      <span class="text-white font-semibold w-14 text-xs">{{ pair[0] }}</span>
                      <span class="text-slate-500 w-14 text-xs">{{ pair[1] ?? '' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2">
                  <button
                    :disabled="chessStore.moveHistory.length < 2"
                    class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 text-xs font-semibold transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                    @click="chessStore.undoMove()"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 14L4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
                    </svg>
                    Take Back
                  </button>
                  <button
                    class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/40 text-xs font-semibold transition-all"
                    @click="chessStore.resetGame()"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
                    </svg>
                    New Game
                  </button>
                </div>

              </div>
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
import { useRaidStore, type RaidTarget } from '~/stores/raid'
import ChessBoard from '~/components/chess/ChessBoard.vue'
import RaidLobby from '~/components/raid/RaidLobby.vue'

definePageMeta({ name: 'Play', middleware: 'auth' })

const chessStore    = useChessStore()
const profileStore  = useProfileStore()
const customization = useCustomizationStore()
const raidStore     = useRaidStore()
const user          = useSupabaseUser()
const historyEl     = ref<HTMLElement | null>(null)
const advisor       = useAdvisor()

const { isReady: sfReady, init: sfInit, getBestMove, destroy: sfDestroy } = useStockfish()

const gameStarted  = ref(false)
const selectedMode = ref<Difficulty>('medium')
const lobbyTab     = ref<'practice' | 'siege'>('practice')
const isRaidGame   = ref(false)

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
  isRaidGame.value = false
  chessStore.setDifficulty(selectedMode.value)
  chessStore.resetGame()
  gameStarted.value = true
  sfInit()
  advisor.show("The battle begins! Show no mercy, My Lord! ⚔️", 'neutral', 3500)
}

async function onStartRaid(target: RaidTarget, stake: number) {
  await raidStore.startRaid(target, stake)
  isRaidGame.value = true
  chessStore.setDifficulty(raidStore.shadowDifficulty)
  chessStore.resetGame()
  gameStarted.value = true
  sfInit()
  const name = `${target.first_name} ${target.last_name}`.trim()
  advisor.show(`Raiding ${name}'s kingdom! Their Shadow fights for them! ⚔️`, 'panic', 4000)
}

function backToLobby() {
  sfDestroy()
  chessStore.resetGame()
  gameStarted.value = false
  isRaidGame.value = false
  raidStore.clearRaid()
  advisor.hide()
}

const opponentName = computed(() => {
  if (isRaidGame.value && raidStore.activeDefender) {
    const d = raidStore.activeDefender
    return `Shadow of ${d.first_name} ${d.last_name}`.trim()
  }
  return selectedMode.value === 'ai' ? 'Grandmaster AI' : 'Stockfish Bot'
})
const opponentLabel = computed(() => {
  if (isRaidGame.value && raidStore.shadowProfile) {
    return `Est. ${raidStore.shadowProfile.estimated_elo} ELO · ${raidStore.shadowProfile.games_analyzed} games learned`
  }
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
      // Shadow Siege: play from the defender's opening book first
      if (isRaidGame.value && !raidStore.shadowExhausted) {
        const shadowSan = raidStore.nextShadowMove
        if (shadowSan) {
          const { Chess } = await import('chess.js')
          const game = new Chess(chessStore.fen)
          try {
            const m = game.move(shadowSan)
            if (m && !chessStore.isGameOver) {
              chessStore.makeMove(m.from, m.to, m.promotion ?? 'q')
              raidStore.advanceShadowMove()
              return
            }
          } catch {
            // Shadow move illegal in this position — fall through to Stockfish
          }
        }
      }
      // Fallback: Stockfish at the defender's estimated difficulty
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
  const playerWon = chessStore.isCheckmate && chessStore.turn === 'b'
  const playerLost = chessStore.isCheckmate && chessStore.turn === 'w'

  if (playerWon) {
    if (isRaidGame.value) {
      advisor.show(`RAID SUCCESS! You crushed the Shadow! 🪙 +${raidStore.goldStake} gold stolen! 👑`, 'praise', 0)
    } else {
      advisor.show("CHECKMATE! You conquered the realm! ALL HAIL THE CHAMPION! 🏆", 'praise', 0)
    }
  } else if (playerLost) {
    if (isRaidGame.value) {
      advisor.show(`The Shadow held the line! 🪙 -${raidStore.goldStake} gold lost. Regroup and try again!`, 'panic', 0)
    } else {
      advisor.show("The castle has fallen… But every knight learns from defeat! 💙", 'panic', 0)
    }
  }

  if (isRaidGame.value && user.value) {
    await raidStore.completeRaid(user.value.id, playerWon)
    await profileStore.fetchProfile() // refresh gold balance
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
