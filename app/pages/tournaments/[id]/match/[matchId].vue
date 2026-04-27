<template>
  <div class="min-h-screen bg-slate-950 text-white flex flex-col">

    <!-- ── Top bar ────────────────────────────────────────────────────────── -->
    <div class="h-14 flex-shrink-0 flex items-center px-4 gap-4 border-b border-white/8 bg-slate-900/80 backdrop-blur">
      <button @click="leaveGame" class="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Tournament
      </button>

      <div class="flex-1 flex items-center justify-center gap-3">
        <span class="text-orange-500 font-black text-base">♟</span>
        <span class="text-slate-300 text-sm font-semibold">
          {{ playerA?.first_name }} vs {{ playerB?.first_name }}
        </span>
        <span v-if="matchData?.round" class="px-2 py-0.5 bg-slate-800 border border-white/10 rounded-full text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          Round {{ matchData.round }}
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full transition-colors"
          :class="channelConnected ? 'bg-emerald-400 shadow-[0_0_5px_#34d399]' : 'bg-red-400 animate-pulse'">
        </div>
        <span class="text-[11px] text-slate-500">{{ channelConnected ? 'Live' : 'Connecting…' }}</span>
      </div>
    </div>

    <!-- ── Loading ─────────────────────────────────────────────────────────── -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        <span class="text-slate-500 text-sm">Loading match…</span>
      </div>
    </div>

    <!-- ── No access ───────────────────────────────────────────────────────── -->
    <div v-else-if="!isPlayer" class="flex-1 flex items-center justify-center p-6">
      <div class="text-center max-w-sm">
        <p class="text-5xl mb-4">🚫</p>
        <h2 class="text-white font-extrabold text-xl mb-2">Not your match</h2>
        <p class="text-slate-500 text-sm mb-6">You are not a player in this match.</p>
        <button @click="leaveGame" class="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-colors">
          Back to Tournament
        </button>
      </div>
    </div>

    <!-- ── Already finished ────────────────────────────────────────────────── -->
    <div v-else-if="matchData?.result && !gameOver" class="flex-1 flex items-center justify-center p-6">
      <div class="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
        <div class="text-6xl mb-5">{{ matchData.result === 'draw' ? '🤝' : '🏆' }}</div>
        <h2 class="text-white font-black text-2xl mb-2">Match Already Played</h2>
        <p class="text-slate-400 text-sm mb-8">
          <template v-if="matchData.result === 'draw'">The match ended in a draw.</template>
          <template v-else-if="matchData.result === 'a_wins'">{{ playerA?.first_name }} {{ playerA?.last_name }} won.</template>
          <template v-else>{{ playerB?.first_name }} {{ playerB?.last_name }} won.</template>
        </p>
        <button @click="leaveGame" class="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold rounded-2xl">
          View Tournament
        </button>
      </div>
    </div>

    <!-- ── Waiting room ────────────────────────────────────────────────────── -->
    <div v-else-if="!matchData?.result && !bothConnected" class="flex-1 flex items-center justify-center p-6">
      <div class="max-w-sm w-full bg-slate-900 border border-orange-500/20 rounded-3xl p-8 shadow-2xl">
        <div class="relative w-16 h-16 mx-auto mb-6">
          <div class="absolute inset-0 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center text-3xl">♟</div>
        </div>
        <h2 class="text-white font-extrabold text-xl text-center mb-1">Waiting for opponent…</h2>
        <p class="text-slate-500 text-sm text-center mb-8">The game starts when both players connect.</p>

        <div class="flex items-center justify-between gap-4">
          <!-- Player A -->
          <div class="flex flex-col items-center gap-2 flex-1">
            <div class="relative">
              <div class="w-14 h-14 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-black text-xl text-white">
                {{ initials(playerA) }}
              </div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 transition-colors"
                :class="connectedUserIds.includes(matchData?.player_a_id || '') ? 'bg-emerald-400' : 'bg-slate-600'">
              </div>
            </div>
            <div class="text-center">
              <p class="text-white font-semibold text-sm leading-tight">{{ playerA?.first_name || '…' }}</p>
              <p class="text-[11px] text-slate-600 mt-0.5">⬜ White</p>
            </div>
          </div>

          <div class="text-3xl font-black text-slate-700">VS</div>

          <!-- Player B -->
          <div class="flex flex-col items-center gap-2 flex-1">
            <div class="relative">
              <div class="w-14 h-14 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-black text-xl text-white">
                {{ initials(playerB) }}
              </div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 transition-colors"
                :class="connectedUserIds.includes(matchData?.player_b_id || '') ? 'bg-emerald-400' : 'bg-slate-600'">
              </div>
            </div>
            <div class="text-center">
              <p class="text-white font-semibold text-sm leading-tight">{{ playerB?.first_name || '…' }}</p>
              <p class="text-[11px] text-slate-600 mt-0.5">⬛ Black</p>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-white/5 flex justify-center">
          <button @click="leaveGame" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            ← Cancel and go back
          </button>
        </div>
      </div>
    </div>

    <!-- ── Live game ───────────────────────────────────────────────────────── -->
    <div v-else-if="bothConnected || gameOver" class="flex-1 flex flex-col items-center py-4 px-4 overflow-y-auto gap-3">

      <!-- Opponent info bar -->
      <div class="w-full max-w-[560px] flex items-center gap-3 bg-slate-900/70 rounded-2xl px-4 py-2.5 border border-white/8 flex-shrink-0">
        <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-300 flex-shrink-0">
          {{ initials(opponent) }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white font-semibold text-sm truncate">{{ opponent?.first_name }} {{ opponent?.last_name }}</p>
          <p class="text-[11px] text-slate-500">{{ opponentColor === 'w' ? '⬜ White' : '⬛ Black' }}</p>
        </div>
        <div class="w-2 h-2 rounded-full flex-shrink-0"
          :class="connectedUserIds.includes(opponentId || '') ? 'bg-emerald-400 shadow-[0_0_4px_#34d399]' : 'bg-red-400 animate-pulse'">
        </div>
      </div>

      <!-- Chess board -->
      <div
        class="relative grid grid-cols-8 grid-rows-8 w-full max-w-[560px] aspect-square rounded-xl shadow-2xl overflow-hidden border-4 flex-shrink-0"
        :style="{ borderColor: theme.dark }"
        @contextmenu.prevent
      >
        <template v-for="(row, ri) in displayBoard" :key="ri">
          <div
            v-for="(sq, ci) in row"
            :key="ci"
            class="relative flex items-center justify-center transition-colors duration-100"
            :class="[
              isMyTurn && !gameOver ? 'cursor-pointer' : 'cursor-default',
              isSelected(ri, ci) ? 'ring-inset ring-4 ring-yellow-400/80' : '',
              isPossibleMove(ri, ci)
                ? 'after:content-[\'\'] after:absolute after:w-4 after:h-4 after:bg-black/25 after:rounded-full after:z-10'
                : '',
              isPossibleCapture(ri, ci)
                ? 'after:content-[\'\'] after:absolute after:w-full after:h-full after:border-[5px] after:border-black/25 after:rounded-full after:z-10'
                : '',
            ]"
            :style="{ backgroundColor: squareColor(ri, ci) }"
            @click="handleSquareClick(ri, ci)"
          >
            <!-- Rank label -->
            <span
              v-if="ci === 0"
              class="absolute top-0.5 left-0.5 text-[10px] font-bold select-none z-10"
              :style="{ color: coordColor(ri, ci) }"
            >{{ isFlipped ? ri + 1 : 8 - ri }}</span>

            <!-- File label -->
            <span
              v-if="ri === 7"
              class="absolute bottom-0.5 right-0.5 text-[10px] font-bold select-none z-10"
              :style="{ color: coordColor(ri, ci) }"
            >{{ isFlipped ? String.fromCharCode(104 - ci) : String.fromCharCode(97 + ci) }}</span>

            <!-- Piece -->
            <ChessPiece v-if="sq" :type="sq.type" :color="sq.color" />
          </div>
        </template>
      </div>

      <!-- Status bar -->
      <div class="w-full max-w-[560px] bg-slate-900/70 rounded-2xl px-4 py-2.5 border border-white/8 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-3">
          <div
            class="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 flex-shrink-0"
            :class="chess.turn() === 'w'
              ? 'bg-white shadow-[0_0_6px_white]'
              : 'bg-slate-900 border border-slate-500 shadow-[0_0_6px_rgba(0,0,0,0.8)]'"
          ></div>
          <span class="text-sm font-medium">
            <span v-if="gameOver" class="text-slate-400">Game over — {{ gameOver.reason }}</span>
            <span v-else-if="chess.inCheck()" class="text-red-400 font-bold">
              Check! {{ isMyTurn ? 'Your king is in check' : "Opponent's king is in check" }}
            </span>
            <span v-else-if="isMyTurn" class="text-orange-400 font-semibold">Your turn</span>
            <span v-else class="text-slate-500">Opponent's turn…</span>
          </span>
        </div>
        <span class="text-slate-600 text-xs font-mono">{{ Math.ceil(moveHistory.length / 2) }} moves</span>
      </div>

      <!-- My info bar -->
      <div class="w-full max-w-[560px] flex items-center gap-3 bg-slate-900/70 rounded-2xl px-4 py-2.5 border border-orange-500/20 flex-shrink-0">
        <div class="w-8 h-8 rounded-full bg-orange-500/20 ring-1 ring-orange-500/40 flex items-center justify-center font-bold text-sm text-orange-400 flex-shrink-0">
          {{ initials(me) }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white font-semibold text-sm truncate">
            {{ me?.first_name }} {{ me?.last_name }}
            <span class="text-orange-500/60 text-xs">(you)</span>
          </p>
          <p class="text-[11px] text-slate-500">{{ myColor === 'w' ? '⬜ White' : '⬛ Black' }}</p>
        </div>
        <div class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] flex-shrink-0"></div>
      </div>

      <!-- Move history -->
      <div v-if="moveHistory.length > 0" class="w-full max-w-[560px] bg-slate-900/40 rounded-2xl px-4 py-3 border border-white/5 flex-shrink-0">
        <p class="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2">Moves</p>
        <div class="flex flex-wrap gap-x-3 gap-y-0.5">
          <span
            v-for="(san, idx) in moveHistory"
            :key="idx"
            class="text-xs font-mono"
            :class="idx % 2 === 0 ? 'text-slate-300' : 'text-slate-500'"
          >
            <span v-if="idx % 2 === 0" class="text-slate-600 text-[10px] mr-0.5">{{ Math.floor(idx / 2) + 1 }}.</span>{{ san }}
          </span>
        </div>
      </div>
    </div>

    <!-- ── Game Over Modal ─────────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="backdrop">
        <div
          v-if="gameOver"
          class="fixed inset-0 z-[999] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <div
            class="max-w-sm w-full bg-slate-900 rounded-3xl p-8 text-center shadow-2xl border"
            :class="{
              'border-yellow-500/40': myResult === 'win',
              'border-red-500/30': myResult === 'loss',
              'border-white/15': myResult === 'draw',
            }"
          >
            <!-- Glow effect for winner -->
            <div v-if="myResult === 'win'" class="absolute inset-0 rounded-3xl bg-yellow-500/5 pointer-events-none"></div>

            <div class="text-7xl mb-4" :class="myResult === 'win' ? 'animate-bounce' : ''">
              {{ myResult === 'win' ? '🏆' : myResult === 'loss' ? '😔' : '🤝' }}
            </div>

            <h2 class="font-black text-3xl mb-1"
              :class="{
                'text-yellow-400': myResult === 'win',
                'text-red-400': myResult === 'loss',
                'text-white': myResult === 'draw',
              }"
            >
              {{ myResult === 'win' ? 'Victory!' : myResult === 'loss' ? 'Defeated' : 'Draw!' }}
            </h2>

            <p class="text-slate-400 text-sm mb-1">{{ gameOver.reason }}</p>

            <p class="text-slate-600 text-xs mb-8">
              <template v-if="gameOver.result === 'draw'">Neither player wins — well fought!</template>
              <template v-else-if="gameOver.result === 'a_wins'">{{ playerA?.first_name }} wins the match point.</template>
              <template v-else>{{ playerB?.first_name }} wins the match point.</template>
            </p>

            <button
              @click="leaveGame"
              class="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold rounded-2xl text-lg hover:from-orange-400 hover:to-red-400 transition-all"
            >
              Back to Tournament →
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Chess, type Square } from 'chess.js'
import { useTournamentStore } from '~/stores/tournament'
import { useCustomizationStore, ARENA_THEMES } from '~/stores/customization'
import ChessPiece from '~/components/chess/ChessPiece.vue'

definePageMeta({ name: 'TournamentMatch', middleware: 'auth' })

const route        = useRoute()
const tournamentId = route.params.id as string
const matchId      = route.params.matchId as string
const supabase     = useSupabaseClient()
const user         = useSupabaseUser()
const store        = useTournamentStore()
const customization = useCustomizationStore()

const currentUserId = computed(() => user.value?.id ?? null)

// ── Types ─────────────────────────────────────────────────────────────────
interface Profile { id: string; first_name: string; last_name: string; avatar_url: string }
interface MatchData {
  id: string; tournament_id: string; round: number
  player_a_id: string; player_b_id: string
  result: 'a_wins' | 'b_wins' | 'draw' | null; played_at: string | null
}

// ── Match data ─────────────────────────────────────────────────────────────
const loading   = ref(true)
const matchData = ref<MatchData | null>(null)
const playerA   = ref<Profile | null>(null)
const playerB   = ref<Profile | null>(null)

const isPlayer = computed(() =>
  !!currentUserId.value &&
  (currentUserId.value === matchData.value?.player_a_id ||
   currentUserId.value === matchData.value?.player_b_id)
)

// My color: player_a = white, player_b = black
const myColor       = computed<'w' | 'b'>(() => matchData.value?.player_a_id === currentUserId.value ? 'w' : 'b')
const opponentColor = computed<'w' | 'b'>(() => myColor.value === 'w' ? 'b' : 'w')
const isFlipped     = computed(() => myColor.value === 'b')
const me            = computed(() => myColor.value === 'w' ? playerA.value : playerB.value)
const opponent      = computed(() => myColor.value === 'w' ? playerB.value : playerA.value)
const opponentId    = computed(() => myColor.value === 'w' ? matchData.value?.player_b_id : matchData.value?.player_a_id)

// ── Chess state ────────────────────────────────────────────────────────────
const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const fen           = ref(INITIAL_FEN)
const chess         = computed(() => new Chess(fen.value))
const selectedSquare = ref<string | null>(null)
const moveHistory   = ref<string[]>([])
const gameOver      = ref<{ result: 'a_wins' | 'b_wins' | 'draw'; reason: string } | null>(null)
const submitting    = ref(false)

const isMyTurn = computed(() => chess.value.turn() === myColor.value && !gameOver.value)

const myResult = computed(() => {
  if (!gameOver.value) return null
  if (gameOver.value.result === 'draw') return 'draw'
  const imA = matchData.value?.player_a_id === currentUserId.value
  return (imA && gameOver.value.result === 'a_wins') || (!imA && gameOver.value.result === 'b_wins')
    ? 'win' : 'loss'
})

// ── Board display (with flip support) ─────────────────────────────────────
const displayBoard = computed(() => {
  const b = chess.value.board()
  if (!isFlipped.value) return b
  return [...b].reverse().map(r => [...r].reverse())
})

// Convert display grid position → chess square name
const displayToSquare = (dr: number, dc: number): string => {
  if (isFlipped.value) {
    return `${String.fromCharCode(104 - dc)}${dr + 1}` // h→a files, 1→8 ranks
  }
  return `${String.fromCharCode(97 + dc)}${8 - dr}`
}

const possibleMoves = computed(() => {
  if (!selectedSquare.value || !isMyTurn.value) return []
  try {
    return chess.value.moves({ square: selectedSquare.value as Square, verbose: true })
  } catch { return [] }
})

const isSelected      = (dr: number, dc: number) => displayToSquare(dr, dc) === selectedSquare.value
const isPossibleMove  = (dr: number, dc: number) => possibleMoves.value.some((m: any) => m.to === displayToSquare(dr, dc) && !m.captured)
const isPossibleCapture = (dr: number, dc: number) => possibleMoves.value.some((m: any) => m.to === displayToSquare(dr, dc) && m.captured)

// ── Board theme ────────────────────────────────────────────────────────────
const theme       = computed(() => ARENA_THEMES[customization.theme])
const squareColor = (r: number, c: number) => (r + c) % 2 === 0 ? theme.value.light : theme.value.dark
const coordColor  = (r: number, c: number) => (r + c) % 2 === 0 ? theme.value.dark : theme.value.light

// ── Realtime ───────────────────────────────────────────────────────────────
const channelConnected = ref(false)
const connectedUserIds = ref<string[]>([])
const bothConnected    = computed(() => {
  if (!matchData.value) return false
  return connectedUserIds.value.includes(matchData.value.player_a_id) &&
         connectedUserIds.value.includes(matchData.value.player_b_id)
})

let channel: any = null

// ── Move logic ─────────────────────────────────────────────────────────────
const handleSquareClick = (dr: number, dc: number) => {
  if (!isMyTurn.value || !bothConnected.value || gameOver.value) return
  const sq = displayToSquare(dr, dc)

  if (selectedSquare.value === sq) { selectedSquare.value = null; return }

  if (selectedSquare.value) {
    if (!tryMove(selectedSquare.value, sq)) {
      const piece = chess.value.get(sq as Square)
      selectedSquare.value = (piece && piece.color === myColor.value) ? sq : null
    }
  } else {
    const piece = chess.value.get(sq as Square)
    if (piece && piece.color === myColor.value) selectedSquare.value = sq
  }
}

const tryMove = (from: string, to: string): boolean => {
  try {
    const game = new Chess(fen.value)
    const move = game.move({ from, to, promotion: 'q' })
    if (!move) return false

    fen.value = game.fen()
    moveHistory.value.push(move.san)
    selectedSquare.value = null

    channel?.send({ type: 'broadcast', event: 'move', payload: { fen: game.fen(), san: move.san } })
    if (game.isGameOver()) resolveGameOver(game)
    return true
  } catch { return false }
}

const applyRemoteMove = (newFen: string, san: string) => {
  fen.value = newFen
  moveHistory.value.push(san)
  selectedSquare.value = null
  const game = new Chess(newFen)
  if (game.isGameOver()) resolveGameOver(game)
}

const resolveGameOver = (game: Chess) => {
  if (gameOver.value) return
  let result: 'a_wins' | 'b_wins' | 'draw'
  let reason: string

  if (game.isCheckmate())              { result = game.turn() === 'w' ? 'b_wins' : 'a_wins'; reason = 'Checkmate' }
  else if (game.isStalemate())         { result = 'draw'; reason = 'Stalemate' }
  else if (game.isThreefoldRepetition()) { result = 'draw'; reason = 'Threefold repetition' }
  else if (game.isInsufficientMaterial()) { result = 'draw'; reason = 'Insufficient material' }
  else                                  { result = 'draw'; reason = '50-move rule' }

  gameOver.value = { result, reason }
  if (!submitting.value) {
    submitting.value = true
    store.submitResult(matchId, result)
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
const initials = (p: { first_name?: string; last_name?: string } | null) =>
  ((p?.first_name?.[0] || '') + (p?.last_name?.[0] || '')).toUpperCase() || '?'

const leaveGame = () => navigateTo(`/tournaments/${tournamentId}`)

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  const { data: m } = await supabase
    .from('tournament_matches').select('*').eq('id', matchId).single()

  if (!m) { loading.value = false; return }
  matchData.value = m as MatchData

  // Load player profiles
  const { data: profiles } = await supabase
    .from('profiles').select('id, first_name, last_name, avatar_url')
    .in('id', [m.player_a_id, m.player_b_id])

  const pm: Record<string, Profile> = {}
  ;(profiles || []).forEach((p: any) => { pm[p.id] = p })
  playerA.value = pm[m.player_a_id] || null
  playerB.value = pm[m.player_b_id] || null

  loading.value = false

  if (!isPlayer.value || m.result) return

  // Set up Supabase Realtime channel — use userId as presence key
  channel = supabase.channel(`tournament-match:${matchId}`, {
    config: { presence: { key: currentUserId.value! } },
  })

  channel.on('broadcast', { event: 'move' }, ({ payload }: any) => {
    applyRemoteMove(payload.fen, payload.san)
  })

  channel.on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    // Keys are presence keys (= userId strings we set above)
    connectedUserIds.value = Object.keys(state)
  })

  await channel.subscribe(async (status: string) => {
    if (status === 'SUBSCRIBED') {
      channelConnected.value = true
      await channel.track({ userId: currentUserId.value })
    }
  })
})

onUnmounted(() => {
  if (channel) {
    channel.untrack?.()
    channel.unsubscribe?.()
    supabase.removeChannel(channel)
  }
})
</script>

<style scoped>
.backdrop-enter-active, .backdrop-leave-active { transition: opacity 0.3s ease; }
.backdrop-enter-from, .backdrop-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
