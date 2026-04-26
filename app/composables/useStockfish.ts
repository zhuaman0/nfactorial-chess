// Stockfish UCI Web Worker composable
// Loads /public/stockfish.js (Stockfish 18 lite, single-threaded WASM)

interface StockfishMove {
  from: string
  to: string
  promotion?: string
}

const DEPTH_MAP: Record<string, number> = {
  easy:   2,
  medium: 6,
  hard:   12,
}

export function useStockfish() {
  const worker = shallowRef<Worker | null>(null)
  const isReady = ref(false)

  let pendingResolve: ((move: StockfishMove) => void) | null = null

  function init() {
    if (!import.meta.client || worker.value) return

    try {
      worker.value = new Worker('/stockfish.js')

      worker.value.onmessage = (e: MessageEvent) => {
        const line = String(typeof e.data === 'string' ? e.data : e.data ?? '')

        if (line === 'uciok') {
          worker.value!.postMessage('isready')
        } else if (line === 'readyok') {
          isReady.value = true
        } else if (line.startsWith('bestmove')) {
          const token = line.split(' ')[1]
          if (token && token !== '(none)' && pendingResolve) {
            const from       = token.slice(0, 2)
            const to         = token.slice(2, 4)
            const promotion  = token.length > 4 ? token[4] : undefined
            pendingResolve({ from, to, promotion })
          }
          pendingResolve = null
        }
      }

      worker.value.onerror = (e) => {
        console.error('[Stockfish] Worker error:', e)
      }

      worker.value.postMessage('uci')
    } catch (err) {
      console.error('[Stockfish] Failed to start worker:', err)
    }
  }

  function getBestMove(
    fen: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): Promise<StockfishMove | null> {
    return new Promise((resolve) => {
      if (!worker.value || !isReady.value) {
        resolve(null)
        return
      }

      // Cancel any previous pending
      pendingResolve = resolve as (m: StockfishMove) => void

      worker.value.postMessage('stop')
      worker.value.postMessage(`position fen ${fen}`)
      worker.value.postMessage(`go depth ${DEPTH_MAP[difficulty] ?? 6}`)
    })
  }

  function destroy() {
    pendingResolve = null
    worker.value?.terminate()
    worker.value = null
    isReady.value = false
  }

  return { isReady, init, getBestMove, destroy }
}
