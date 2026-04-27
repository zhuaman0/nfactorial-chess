import { defineStore } from 'pinia'
import { Chess, type Square, type Move } from 'chess.js'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'ai'

export const useChessStore = defineStore('chess', {
  state: () => ({
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    selectedSquare: null as string | null,
    moveHistory: [] as string[],
    isAIThinking: false,
    difficulty: 'medium' as Difficulty,
    castleHp: 100,
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
    },

    setDifficulty(d: Difficulty) {
      this.difficulty = d
    },

    async saveGame(): Promise<boolean> {
      const supabase = useSupabaseClient()
      const user = useSupabaseUser()
      if (!user.value || this.moveHistory.length === 0) return false

      try {
        let winner = 'Draw'
        let result = '1/2-1/2'
        if (this.isCheckmate) {
          winner = this.turn === 'w' ? 'Stockfish' : 'You'
          result = this.turn === 'w' ? '0-1' : '1-0'
        }

        const { error } = await supabase
          .from('games')
          .insert({
            user_id: user.value.id,
            white_name: 'You',
            black_name: this.difficulty === 'ai' ? 'Grandmaster AI' : `Stockfish (${this.difficulty})`,
            winner,
            result,
            moves: this.moveHistory,
            fen: this.fen,
          } as never)

        if (error) throw error
        return true
      } catch (e) {
        console.error('Failed to save game:', e)
        return false
      }
    },
  },
})
