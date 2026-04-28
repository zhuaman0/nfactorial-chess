import { defineStore } from 'pinia'
import { Chess, type Square, type Move } from 'chess.js'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'ai' | 'train'

export const useChessStore = defineStore('chess', {
  state: () => ({
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    selectedSquare: null as string | null,
    moveHistory: [] as string[],
    isAIThinking: false,
    difficulty: 'medium' as Difficulty,
    castleHp: 100,
    lastMove: null as { from: string; to: string } | null,
    pendingAiMove: null as { from: string; to: string; type: string; color: string } | null,
    pendingPlayerMove: null as { from: string; to: string; type: string; color: string } | null,
  }),

  getters: {
    game(state): Chess {
      return new Chess(state.fen)
    },

    turn(): 'w' | 'b' {
      return this.game.turn()
    },

    isGameOver(): boolean {
      return this.game.isGameOver()
    },

    isCheck(): boolean {
      return this.game.inCheck()
    },

    isCheckmate(): boolean {
      return this.game.isCheckmate()
    },

    isDraw(): boolean {
      return this.game.isDraw()
    },

    board(): any[][] {
      return this.game.board()
    },

    possibleMoves(state): Move[] {
      if (!state.selectedSquare) return []
      const game = new Chess(state.fen)
      return game.moves({ square: state.selectedSquare as Square, verbose: true })
    },
  },

  actions: {
    selectSquare(square: string | null) {
      this.selectedSquare = square
    },

    makeMove(from: string, to: string, promotion: string = 'q'): boolean {
      try {
        const game = new Chess(this.fen)
        const move = game.move({ from, to, promotion })
        if (move) {
          this.fen = game.fen()
          this.moveHistory.push(move.san)
          this.selectedSquare = null
          this.lastMove = { from, to }
          return true
        }
        return false
      } catch {
        return false
      }
    },

    // Undo 2 moves (player + AI response) so it's always the player's turn after undo
    undoMove() {
      const game = new Chess(this.fen)
      const movesToUndo = Math.min(2, this.moveHistory.length)
      for (let i = 0; i < movesToUndo; i++) {
        game.undo()
      }
      this.fen = game.fen()
      this.moveHistory = this.moveHistory.slice(0, -movesToUndo)
      this.selectedSquare = null
    },

    damageHp(amount: number) {
      this.castleHp = Math.max(0, this.castleHp - amount)
    },

    resetGame() {
      this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      this.moveHistory = []
      this.selectedSquare = null
      this.isAIThinking = false
      this.castleHp = 100
      this.lastMove = null
      this.pendingAiMove = null
      this.pendingPlayerMove = null
    },

    setDifficulty(d: Difficulty) {
      this.difficulty = d
    },

    async saveGame(): Promise<boolean> {
      const user = useSupabaseUser()
      // Snapshot plain values from reactive Pinia state immediately
      const moves = Array.from(this.moveHistory as string[])
      const fen   = String(this.fen)
      const userId = String(user.value?.id || '')

      if (!userId || moves.length === 0) return false

      let winner = 'Draw'
      let result = '1/2-1/2'
      if (this.isCheckmate) {
        winner = this.turn === 'w' ? 'Stockfish' : 'You'
        result = this.turn === 'w' ? '0-1' : '1-0'
      }

      try {
        const res = await window.fetch('/api/games/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            whiteName: 'You',
            blackName: this.difficulty === 'ai' ? 'Grandmaster AI' : `Stockfish (${this.difficulty})`,
            winner,
            result,
            moves,
            fen,
          }),
        })
        if (!res.ok) throw new Error(await res.text())
        return true
      } catch (e) {
        console.error('Failed to save game:', e)
        return false
      }
    },
  },
})
