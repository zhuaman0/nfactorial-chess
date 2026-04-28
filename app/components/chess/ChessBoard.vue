<template>
  <div class="chess-container flex flex-col items-center">
    <!-- Board -->
    <div
      class="relative grid grid-cols-8 grid-rows-8 w-full max-w-[600px] aspect-square rounded-lg shadow-2xl overflow-hidden border-4"
      :style="{ borderColor: theme.dark }"
      @contextmenu.prevent
    >
      <template v-for="(row, rowIndex) in board" :key="rowIndex">
        <div
          v-for="(square, colIndex) in row"
          :key="colIndex"
          class="relative flex items-center justify-center transition-colors duration-150"
          :class="[
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            isSelected(rowIndex, colIndex) ? 'selected-square' : '',
            isPossibleMove(rowIndex, colIndex)
              ? 'after:content-[\'\'] after:absolute after:w-4 after:h-4 after:bg-black/20 after:rounded-full after:z-10'
              : '',
            isPossibleCapture(rowIndex, colIndex)
              ? 'after:content-[\'\'] after:absolute after:w-full after:h-full after:border-4 after:border-black/20 after:rounded-full after:z-10'
              : '',
          ]"
          :style="{
            backgroundColor: squareColor(rowIndex, colIndex),
            boxShadow: isSelected(rowIndex, colIndex) ? 'inset 0 0 0 3px rgba(255,220,0,0.7)' : '',
          }"
          @click="!disabled && handleSquareClick(rowIndex, colIndex)"
        >
          <!-- Last-move highlight overlay -->
          <div
            v-if="isLastMoveSquare(rowIndex, colIndex)"
            class="absolute inset-0 bg-yellow-400/30 pointer-events-none z-[1]"
          />

          <!-- Coordinates -->
          <span
            v-if="colIndex === 0"
            class="absolute top-0.5 left-0.5 text-[10px] font-bold select-none z-10"
            :style="{ color: coordColor(rowIndex, colIndex) }"
          >{{ 8 - rowIndex }}</span>
          <span
            v-if="rowIndex === 7"
            class="absolute bottom-0.5 right-0.5 text-[10px] font-bold select-none z-10"
            :style="{ color: coordColor(rowIndex, colIndex) }"
          >{{ String.fromCharCode(97 + colIndex) }}</span>

          <!-- Piece (hidden while its floating clone is animating away) -->
          <ChessPiece
            v-if="square"
            :type="square.type"
            :color="square.color"
            :class="{ 'opacity-0': isHiddenPiece(rowIndex, colIndex) }"
          />
        </div>
      </template>

      <!-- Sliding piece (player or AI move animation) -->
      <Transition name="fade">
        <div
          v-if="activePending"
          class="absolute z-30 pointer-events-none piece-slide"
          :style="floatingPieceStyle"
        >
          <ChessPiece
            :type="(activePending.type as any)"
            :color="(activePending.color as any)"
          />
        </div>
      </Transition>

      <!-- AI Thinking Overlay -->
      <Transition name="fade">
        <div
          v-if="chessStore.isAIThinking"
          class="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 z-20"
        >
          <div class="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span class="text-white font-semibold text-sm tracking-wide drop-shadow">Thinking…</span>
        </div>
      </Transition>
    </div>

    <!-- Status Bar -->
    <div class="mt-3 w-full max-w-[600px] flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10">
      <div class="flex items-center gap-2.5">
        <div
          class="w-2.5 h-2.5 rounded-full flex-shrink-0"
          :class="chessStore.turn === 'w'
            ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]'
            : 'bg-slate-600'"
        ></div>
        <span class="text-slate-300 text-sm font-medium">
          {{ chessStore.isAIThinking ? 'Opponent thinking…' : chessStore.pendingPlayerMove ? 'Moving…' : chessStore.pendingAiMove ? 'Opponent moving…' : chessStore.turn === 'w' ? 'Your turn' : "Opponent's turn" }}
        </span>
        <span
          v-if="chessStore.isCheck && !chessStore.isGameOver"
          class="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase tracking-wider"
        >⚠ Check!</span>
      </div>
      <div class="flex gap-1">
        <button
          :disabled="disabled || chessStore.moveHistory.length < 2"
          class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          title="Take Back"
          @click="chessStore.undoMove()"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 14L4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
          </svg>
        </button>
        <button
          class="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
          title="New Game"
          @click="chessStore.resetGame()"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChessStore } from '~/stores/chess'
import { useCustomizationStore, ARENA_THEMES } from '~/stores/customization'
import ChessPiece from './ChessPiece.vue'

defineProps({
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits<{
  'player-move': [payload: { fenBefore: string; fenAfter: string }]
}>()

const chessStore = useChessStore()
const advisor = useAdvisor()
const customization = useCustomizationStore()
const board = computed(() => chessStore.board)

const theme = computed(() => ARENA_THEMES[customization.theme])

const squareColor = (row: number, col: number) =>
  (row + col) % 2 === 0 ? theme.value.light : theme.value.dark

const coordColor = (row: number, col: number) =>
  (row + col) % 2 === 0 ? theme.value.dark : theme.value.light

const coordsToSquare = (row: number, col: number) =>
  `${String.fromCharCode(97 + col)}${8 - row}`

function squareToRowCol(sq: string) {
  const col = sq.charCodeAt(0) - 97
  const row = 8 - parseInt(sq[1] ?? '0')
  return { row, col }
}

const isSelected = (row: number, col: number) =>
  chessStore.selectedSquare === coordsToSquare(row, col)

const isPossibleMove = (row: number, col: number) => {
  const sq = coordsToSquare(row, col)
  return (chessStore.possibleMoves as any[]).some((m: any) => m.to === sq && !m.captured)
}

const isPossibleCapture = (row: number, col: number) => {
  const sq = coordsToSquare(row, col)
  return (chessStore.possibleMoves as any[]).some((m: any) => m.to === sq && m.captured)
}

const isLastMoveSquare = (row: number, col: number) => {
  const lm = chessStore.lastMove
  if (!lm) return false
  const sq = coordsToSquare(row, col)
  return sq === lm.from || sq === lm.to
}

// Active pending move: player takes priority (it fires first), then AI
const activePending = computed(() => chessStore.pendingPlayerMove || chessStore.pendingAiMove)

// Hide the source piece while its floating clone is sliding
const isHiddenPiece = (row: number, col: number) => {
  const pending = activePending.value
  if (!pending) return false
  const { row: fromRow, col: fromCol } = squareToRowCol(pending.from)
  return row === fromRow && col === fromCol
}

// Floating piece slides from source → target using CSS transitions
const animatingToTarget = ref(false)

watch(activePending, (pending) => {
  if (pending) {
    animatingToTarget.value = false
    nextTick(() => {
      requestAnimationFrame(() => { animatingToTarget.value = true })
    })
  } else {
    animatingToTarget.value = false
  }
})

const floatingPieceStyle = computed(() => {
  const pending = activePending.value
  if (!pending) return {}
  const { row: fromRow, col: fromCol } = squareToRowCol(pending.from)
  const { row: toRow, col: toCol } = squareToRowCol(pending.to)
  const row = animatingToTarget.value ? toRow : fromRow
  const col = animatingToTarget.value ? toCol : fromCol
  return {
    width: '12.5%',
    height: '12.5%',
    left: `${col * 12.5}%`,
    top: `${row * 12.5}%`,
    transition: animatingToTarget.value
      ? 'left 0.48s cubic-bezier(0.25,0.46,0.45,0.94), top 0.48s cubic-bezier(0.25,0.46,0.45,0.94)'
      : 'none',
  }
})

const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }
const getPieceValue = (type?: string) => (type ? (PIECE_VALUES[type] ?? 0) : 0)

const handleSquareClick = async (row: number, col: number) => {
  // Block clicks while any piece is sliding
  if (activePending.value || chessStore.isAIThinking) return

  const square = coordsToSquare(row, col)

  if (chessStore.selectedSquare === square) {
    chessStore.selectSquare(null)
    return
  }

  if (chessStore.selectedSquare) {
    const from = chessStore.selectedSquare
    const isValidDest = (chessStore.possibleMoves as any[]).some((m: any) => m.to === square)

    if (isValidDest) {
      const fenBefore = chessStore.fen
      const capturedValue = getPieceValue(chessStore.game.get(square as any)?.type)
      const piece = chessStore.game.get(from as any)

      // Deselect and start slide animation
      chessStore.selectSquare(null)
      if (piece) {
        chessStore.pendingPlayerMove = { from, to: square, type: piece.type, color: piece.color }
        await new Promise(resolve => setTimeout(resolve, 500))
        chessStore.pendingPlayerMove = null
      }

      const ok = chessStore.makeMove(from, square)
      if (ok) {
        if (capturedValue >= 9) advisor.show("BY THE KING! You captured their QUEEN! GLORY! 👑", 'praise', 4000)
        else if (capturedValue >= 5) advisor.show("Excellent! Their Rook is yours, My Lord! ⚔️", 'praise', 3000)
        else if (capturedValue >= 3) advisor.show("Well played! You took their piece! Press on! ⚔️", 'praise', 3000)
        emit('player-move', { fenBefore, fenAfter: chessStore.fen })
      }
    } else {
      // Click on a different own piece → reselect it
      const piece = chessStore.game.get(square as any)
      if (piece && piece.color === chessStore.turn) {
        chessStore.selectSquare(square)
      } else {
        chessStore.selectSquare(null)
      }
    }
  } else {
    const piece = chessStore.game.get(square as any)
    if (piece && piece.color === chessStore.turn) {
      chessStore.selectSquare(square)
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.piece-slide {
  will-change: left, top;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
}
</style>
