import { defineStore } from 'pinia'

export interface LeaderboardEntry {
  id: string
  first_name: string
  last_name: string
  avatar_url: string
  wins: number
  total_games: number
}

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    entries: [] as LeaderboardEntry[],
    loading: false,
  }),

  actions: {
    async fetchLeaderboard() {
      const supabase = useSupabaseClient()
      this.loading = true
      try {
        const { data, error } = await supabase.rpc('get_leaderboard')
        if (error) throw error
        this.entries = (data as any[] || []).map((r: any) => ({
          id:          r.id,
          first_name:  r.first_name || '',
          last_name:   r.last_name  || '',
          avatar_url:  r.avatar_url || '',
          wins:        Number(r.wins)        || 0,
          total_games: Number(r.total_games) || 0,
        }))
      } catch (e) {
        console.error('Leaderboard error:', e)
      } finally {
        this.loading = false
      }
    },
  },
})
