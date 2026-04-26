<template>
  <div class="chess-container flex flex-col items-center">
    <!-- Board -->
    <div
      class="relative grid grid-cols-8 grid-rows-8 w-full max-w-[600px] aspect-square rounded-lg shadow-2xl overflow-hidden border-4 border-slate-700"
      @contextmenu.prevent
    >
      <template v-for="(row, rowIndex) in board" :key="rowIndex">
        <div
          v-for="(square, colIndex) in row"
          :key="colIndex"
          :class="[
            'relative flex items-center justify-center transition-colors duration-150',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            (rowIndex + colIndex) % 2 === 0 ? 'bg-[#EBECD0]' : 'bg-[#779556]',
            isSelected(rowIndex, colIndex) ? '!bg-yellow-200/60' : '',
            isPossibleMove(rowIndex, colIndex)
              ? 'after:content-[\'\'] after:absolute after:w-4 after:h-4 after:bg-black/10 after:rounded-full'
              : '',
            isPossibleCapture(rowIndex, colIndex)
              ? 'after:content-[\'\'] after:absolute after:w-full after:h-full after:border-4 after:border-black/10 after:rounded-full'
              : '',
          ]"
          @click="!disabled && handleSquareClick(rowIndex, colIndex)"
        >
          <!-- Coordinates -->
          <span
            v-if="colIndex === 0"
            :class="['absolute top-0.5 left-0.5 text-[10px] font-bold select-none', (rowIndex + colIndex) % 2 === 0 ? 'text-[#779556]' : 'text-[#EBECD0]']"
          >{{ 8 - rowIndex }}</span>
          <span
            v-if="rowIndex === 7"
            :class="['absolute bottom-0.5 right-0.5 text-[10px] font-bold select-none', (rowIndex + colIndex) % 2 === 0 ? 'text-[#779556]' : 'text-[#EBECD0]']"
          >{{ String.fromCharCode(97 + colIndex) }}</span>

          <!-- Piece -->
          <ChessPiece v-if="square" :type="square.type" :color="square.color" />
        </div>
      </template>

      <!-- AI Thinking Overlay -->
      <Transition name="fade">
        <div
          v-if="chessStore.isAIThinking"
          class="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 z-10"
        >
          <div class="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span class="text-white font-semibold text-sm tracking-wide drop-shadow">Stockfish is thinking…</span>
        </div>
      </Transition>
    </div>

    <!-- Status Bar -->
    <div class="mt-4 w-full max-w-[600px] bg-slate-800/70 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div
          class="w-3.5 h-3.5 rounded-full ring-2 ring-white/20"
          :class="chessStore.turn === 'w' ? 'bg-white shadow-[0_0_8px_white]' : 'bg-slate-900 shadow-[0_0_8px_#000]'"
        ></div>
        <span class="text-white text-sm font-medium">
          {{ chessStore.isAIThinking ? 'AI is thinking…' : chessStore.turn === 'w' ? "Your turn" : "AI's turn" }}
        </span>
        <span v-if="chessStore.isCheck && !chessStore.isGameOver" class="text-red-400 text-xs font-bold uppercase tracking-wider">Check!</span>
      </div>

      <div class="flex gap-1">
        <button
          :disabled="disabled || chessStore.moveHistory.length < 2"
          class="p-2 rounded-lg transition-colors text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
          title="Take Back"
          @click="chessStore.undoMove()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 14L4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
          </svg>
        </button>
        <button
          class="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-300"
          title="New Game"
          @click="chessStore.resetGame()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChessStore } from '~/stores/chess'
import ChessPiece from './ChessPiece.vue'

defineProps({
  disabled: { type: Boolean, default: false },
})

const chessStore = useChessStore()
const board = computed(() => chessStore.board)

const coordsToSquare = (row: number, col: number) =>
  `${String.fromCharCode(97 + col)}${8 - row}`

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

const handleSquareClick = (row: number, col: number) => {
  const square = coordsToSquare(row, col)

  if (chessStore.selectedSquare === square) {
    chessStore.selectSquare(null)
    return
  }

  if (chessStore.selectedSquare) {
    const ok = chessStore.makeMove(chessStore.selectedSquare, square)
    if (!ok) {
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
</style>
