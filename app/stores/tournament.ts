import { defineStore } from 'pinia'

// ── Types ────────────────────────────────────────────────────────────────────
export interface Tournament {
  id: string
  name: string
  invite_code: string
  max_players: number
  start_date: string
  end_date: string
  status: 'upcoming' | 'active' | 'finished'
  created_by: string
  created_at: string
  location: string
  participant_count?: number
}

export interface TournamentParticipant {
  user_id: string
  first_name: string
  last_name: string
  avatar_url: string
}

export interface StandingRow {
  user_id: string
  first_name: string
  last_name: string
  avatar_url: string
  wins: number
  draws: number
  losses: number
  played: number
  points: number
}

export interface TournamentMatch {
  id: string
  tournament_id: string
  player_a_id: string
  player_b_id: string
  round: number
  result: 'a_wins' | 'b_wins' | 'draw' | null
  played_at: string | null
  created_at: string
  player_a?: TournamentParticipant
  player_b?: TournamentParticipant
}

// ── Helper: generate a short invite code ────────────────────────────────────
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// ── Helper: build round-robin schedule ──────────────────────────────────────
// Uses the standard "round-robin tournament" rotation algorithm.
function buildRoundRobin(playerIds: string[]): { a: string; b: string; round: number }[] {
  const ids = [...playerIds]
  if (ids.length % 2 !== 0) ids.push('BYE') // pad to even
  const n = ids.length
  const rounds = n - 1
  const matchesPerRound = n / 2
  const fixtures: { a: string; b: string; round: number }[] = []

  for (let r = 0; r < rounds; r++) {
    for (let m = 0; m < matchesPerRound; m++) {
      const home = ids[m]!
      const away = ids[n - 1 - m]!
      if (home !== 'BYE' && away !== 'BYE') {
        fixtures.push({ a: home, b: away, round: r + 1 })
      }
    }
    // Rotate: fix index 0, rotate the rest
    const last = ids.pop()!
    ids.splice(1, 0, last)
  }
  return fixtures
}

// ── Helper: get current user id ──────────────────────────────────────────────
async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = useSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

// ── Store ────────────────────────────────────────────────────────────────────
export const useTournamentStore = defineStore('tournament', {
  state: () => ({
    myTournaments: [] as Tournament[],
    activeTournament: null as Tournament | null,
    participants: [] as TournamentParticipant[],
    standings: [] as StandingRow[],
    matches: [] as TournamentMatch[],
    loading: false,
    actionLoading: false,
    error: '' as string,
    successMsg: '' as string,
  }),

  getters: {
    myMatches: (s) => {
      return (userId: string) =>
        s.matches.filter(m => m.player_a_id === userId || m.player_b_id === userId)
    },
  },

  actions: {
    // ── Fetch all tournaments the user participates in ────────────────────
    async fetchMyTournaments() {
      const supabase = useSupabaseClient()
      const myId = await getCurrentUserId()
      if (!myId) return

      this.loading = true
      this.error = ''
      try {
        // Get tournament IDs the user participates in
        const { data: participations, error: pErr } = await supabase
          .from('tournament_participants')
          .select('tournament_id')
          .eq('user_id', myId)

        if (pErr) { this.error = pErr.message; return }
        const ids = (participations || []).map((p: any) => p.tournament_id)

        if (ids.length === 0) { this.myTournaments = []; return }

        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .in('id', ids)
          .order('created_at', { ascending: false })

        if (error) { this.error = error.message; return }

        // Fetch participant counts
        const { data: counts } = await supabase
          .from('tournament_participants')
          .select('tournament_id')
          .in('tournament_id', ids)

        const countMap: Record<string, number> = {}
        ;(counts || []).forEach((c: any) => {
          countMap[c.tournament_id] = (countMap[c.tournament_id] || 0) + 1
        })

        this.myTournaments = (data || []).map((t: any) => ({
          ...t,
          participant_count: countMap[t.id] || 0,
        }))
      } finally {
        this.loading = false
      }
    },

    // ── Create a new tournament ───────────────────────────────────────────
    async createTournament(payload: {
      name: string
      maxPlayers: number
      startDate: string
      endDate: string
      location: string
    }): Promise<Tournament | null> {
      const supabase = useSupabaseClient()
      const myId = await getCurrentUserId()
      if (!myId) return null

      this.actionLoading = true
      this.error = ''
      try {
        const code = generateCode()

        const { data, error } = await supabase
          .from('tournaments')
          .insert({
            name: payload.name,
            invite_code: code,
            max_players: payload.maxPlayers,
            start_date: payload.startDate,
            end_date: payload.endDate,
            location: payload.location,
            status: 'upcoming',
            created_by: myId,
          } as never)
          .select()
          .single()

        if (error) { this.error = error.message; return null }

        // Auto-join as participant
        await supabase
          .from('tournament_participants')
          .insert({ tournament_id: (data as any).id, user_id: myId } as never)

        this.successMsg = 'Tournament created!'
        await this.fetchMyTournaments()
        return data as Tournament
      } finally {
        this.actionLoading = false
      }
    },

    // ── Join a tournament by invite code ──────────────────────────────────
    async joinByCode(code: string): Promise<Tournament | null> {
      const supabase = useSupabaseClient()
      const myId = await getCurrentUserId()
      if (!myId) return null

      this.actionLoading = true
      this.error = ''
      try {
        // Find the tournament
        const { data: tournament, error: tErr } = await supabase
          .from('tournaments')
          .select('*')
          .eq('invite_code', code.toUpperCase().trim())
          .single()

        if (tErr || !tournament) { this.error = 'Tournament not found. Check your invite code.'; return null }

        // Check capacity
        const { count } = await supabase
          .from('tournament_participants')
          .select('*', { count: 'exact', head: true })
          .eq('tournament_id', (tournament as any).id)

        if ((count ?? 0) >= (tournament as any).max_players) {
          this.error = 'This tournament is full.'
          return null
        }

        // Join
        const { error: joinErr } = await supabase
          .from('tournament_participants')
          .insert({ tournament_id: (tournament as any).id, user_id: myId } as never)

        if (joinErr) {
          if (joinErr.code === '23505') { this.error = 'You are already in this tournament.' }
          else { this.error = joinErr.message }
          return null
        }

        this.successMsg = `Joined "${(tournament as any).name}"!`

        await this.fetchMyTournaments()
        return tournament as Tournament
      } finally {
        this.actionLoading = false
      }
    },

    // ── Fetch a single tournament with participants, matches, standings ────
    async fetchTournament(id: string) {
      const supabase = useSupabaseClient()

      this.loading = true
      this.error = ''
      try {
        // Tournament
        const { data: t, error: tErr } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', id)
          .single()

        if (tErr) { this.error = tErr.message; return }
        this.activeTournament = t as Tournament

        // Step 1: get participant user_ids
        const { data: parts } = await supabase
          .from('tournament_participants')
          .select('user_id')
          .eq('tournament_id', id)

        const userIds = (parts || []).map((p: any) => p.user_id)

        // Step 2: fetch profiles for those user_ids
        const profileRows = userIds.length > 0
          ? (await supabase
              .from('profiles')
              .select('id, first_name, last_name, avatar_url')
              .in('id', userIds)
            ).data || []
          : []

        const profileMap2: Record<string, any> = {}
        profileRows.forEach((pr: any) => { profileMap2[pr.id] = pr })

        this.participants = userIds.map((uid: string) => ({
          user_id: uid,
          first_name: profileMap2[uid]?.first_name || '',
          last_name:  profileMap2[uid]?.last_name  || '',
          avatar_url: profileMap2[uid]?.avatar_url || '',
        }))

        // Matches
        const { data: matchRows } = await supabase
          .from('tournament_matches')
          .select('*')
          .eq('tournament_id', id)
          .order('round', { ascending: true })

        // Enrich matches with participant names
        const profileMap: Record<string, TournamentParticipant> = {}
        this.participants.forEach(p => { profileMap[p.user_id] = p })

        this.matches = (matchRows || []).map((m: any) => ({
          ...m,
          player_a: profileMap[m.player_a_id],
          player_b: profileMap[m.player_b_id],
        }))

        // Compute standings client-side
        this.computeStandings()
      } finally {
        this.loading = false
      }
    },

    // ── Compute standings from current matches state ───────────────────────
    computeStandings() {
      const map: Record<string, StandingRow> = {}

      this.participants.forEach(p => {
        map[p.user_id] = {
          user_id: p.user_id,
          first_name: p.first_name,
          last_name: p.last_name,
          avatar_url: p.avatar_url,
          wins: 0, draws: 0, losses: 0, played: 0, points: 0,
        }
      })

      this.matches.forEach(m => {
        if (!m.result) return
        const a = map[m.player_a_id]
        const b = map[m.player_b_id]
        if (!a || !b) return

        a.played++; b.played++

        if (m.result === 'a_wins') { a.wins++; a.points += 3; b.losses++ }
        else if (m.result === 'b_wins') { b.wins++; b.points += 3; a.losses++ }
        else if (m.result === 'draw') { a.draws++; a.points++; b.draws++; b.points++ }
      })

      this.standings = Object.values(map).sort((x, y) =>
        y.points - x.points || y.wins - x.wins || x.first_name.localeCompare(y.first_name)
      )
    },

    // ── Generate round-robin fixtures for the tournament ─────────────────
    async generateFixtures(tournamentId: string) {
      const supabase = useSupabaseClient()
      this.actionLoading = true
      this.error = ''
      try {
        const playerIds = this.participants.map(p => p.user_id)
        if (playerIds.length < 2) { this.error = 'Need at least 2 players.'; return }

        const fixtures = buildRoundRobin(playerIds)

        const rows = fixtures.map(f => ({
          tournament_id: tournamentId,
          player_a_id: f.a,
          player_b_id: f.b,
          round: f.round,
        }))

        const { error } = await supabase
          .from('tournament_matches')
          .insert(rows as never)

        if (error) { this.error = error.message; return }

        this.successMsg = 'Fixtures generated!'
        await this.fetchTournament(tournamentId)
      } finally {
        this.actionLoading = false
      }
    },

    // ── Submit match result ───────────────────────────────────────────────
    async submitResult(matchId: string, result: 'a_wins' | 'b_wins' | 'draw') {
      const supabase = useSupabaseClient()
      this.actionLoading = true
      this.error = ''
      try {
        const { error } = await supabase
          .from('tournament_matches')
          .update({ result, played_at: new Date().toISOString() } as never)
          .eq('id', matchId)

        if (error) { this.error = error.message; return }

        // Update local state immediately
        const match = this.matches.find(m => m.id === matchId)
        if (match) { match.result = result; match.played_at = new Date().toISOString() }
        this.computeStandings()
        this.successMsg = 'Result submitted!'
      } finally {
        this.actionLoading = false
      }
    },

    // ── Activate tournament (start it) ────────────────────────────────────
    async activateTournament(id: string) {
      const supabase = useSupabaseClient()
      this.actionLoading = true
      try {
        await supabase.from('tournaments').update({ status: 'active' } as never).eq('id', id)
        if (this.activeTournament) this.activeTournament.status = 'active'
        // Generate fixtures if not yet done
        if (this.matches.length === 0) await this.generateFixtures(id)
      } finally {
        this.actionLoading = false
      }
    },

    clearMessages() {
      this.error = ''
      this.successMsg = ''
    },
  },
})
