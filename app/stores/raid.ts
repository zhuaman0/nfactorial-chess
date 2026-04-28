import { defineStore } from 'pinia'

export interface RaidTarget {
  id: string
  first_name: string
  last_name: string
  avatar_url: string
  gold_balance: number
  raid_wins: number
  defense_wins: number
  points: number
}

export interface ShadowProfile {
  opening_moves: string[]
  estimated_elo: number
  games_analyzed: number
}

interface RaidState {
  targets: RaidTarget[]
  loading: boolean
  activeDefender: RaidTarget | null
  shadowProfile: ShadowProfile | null
  goldStake: number
  shadowMoveIndex: number
}

export const useRaidStore = defineStore('raid', {
  state: (): RaidState => ({
    targets: [],
    loading: false,
    activeDefender: null,
    shadowProfile: null,
    goldStake: 100,
    shadowMoveIndex: 0,
  }),

  getters: {
    nextShadowMove(state): string | null {
      if (!state.shadowProfile) return null
      return state.shadowProfile.opening_moves[state.shadowMoveIndex] ?? null
    },

    shadowExhausted(state): boolean {
      if (!state.shadowProfile) return true
      return state.shadowMoveIndex >= state.shadowProfile.opening_moves.length
    },

    shadowDifficulty(state): 'easy' | 'medium' | 'hard' | 'ai' {
      const elo = state.shadowProfile?.estimated_elo ?? 800
      if (elo < 900)  return 'easy'
      if (elo < 1200) return 'medium'
      if (elo < 1500) return 'hard'
      return 'ai'
    },
  },

  actions: {
    async fetchTargets() {
      const supabase = useSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      this.loading = true
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, gold_balance, raid_wins, defense_wins, points')
          .neq('id', user.id)
          .order('gold_balance', { ascending: false })

        if (error) throw error
        this.targets = (data as RaidTarget[]) ?? []
      } catch (e) {
        console.error('Failed to fetch raid targets:', e)
      } finally {
        this.loading = false
      }
    },

    async startRaid(target: RaidTarget, stake: number) {
      this.activeDefender = target
      this.goldStake = stake
      this.shadowMoveIndex = 0
      this.shadowProfile = null
      this.loading = true
      try {
        const data = await $fetch<ShadowProfile>(`/api/shadow/${target.id}`)
        this.shadowProfile = data
      } catch (e) {
        console.error('Failed to load shadow profile:', e)
        this.shadowProfile = { opening_moves: [], estimated_elo: 800, games_analyzed: 0 }
      } finally {
        this.loading = false
      }
    },

    advanceShadowMove() {
      this.shadowMoveIndex++
    },

    async completeRaid(attackerId: string, won: boolean) {
      if (!this.activeDefender) return
      try {
        await $fetch('/api/raid/complete', {
          method: 'POST',
          body: {
            attackerId,
            defenderId: this.activeDefender.id,
            won,
            goldStake: this.goldStake,
          },
        })
      } catch (e) {
        console.error('Failed to complete raid:', e)
      }
    },

    clearRaid() {
      this.activeDefender = null
      this.shadowProfile = null
      this.shadowMoveIndex = 0
    },
  },
})
