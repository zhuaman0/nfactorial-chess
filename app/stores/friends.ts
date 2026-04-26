import { defineStore } from 'pinia'

export interface FriendProfile {
  id: string
  first_name: string
  last_name: string
  avatar_url: string
  fullName: string
  initials: string
}

export interface Friendship {
  id: string
  requester_id: string
  addressee_id: string
  status: 'pending' | 'accepted' | 'declined'
  friend: FriendProfile
  isSentByMe: boolean
}

export interface UserSearchResult extends FriendProfile {
  friendship: Friendship | null
}

function buildProfile(row: any): FriendProfile {
  const f = row.first_name || ''
  const l = row.last_name  || ''
  return {
    id:         row.id,
    first_name: f,
    last_name:  l,
    avatar_url: row.avatar_url || '',
    fullName:   `${f} ${l}`.trim() || row.id.slice(0, 8),
    initials:   ((f[0] || '') + (l[0] || '')).toUpperCase() || '?',
  }
}

// Get the current user ID reliably from the session cache
async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = useSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

export const useFriendsStore = defineStore('friends', {
  state: () => ({
    friends:        [] as Friendship[],
    pendingIn:      [] as Friendship[],
    pendingOut:     [] as Friendship[],
    searchResults:  [] as UserSearchResult[],
    loading:        false,
    searching:      false,
    error:          '' as string,
    allFriendships: [] as Friendship[],
  }),

  getters: {
    pendingInCount: (s) => s.pendingIn.length,
  },

  actions: {
    // ── Fetch all friendships involving the current user ─────────────────
    async fetchAll() {
      const supabase = useSupabaseClient()
      const myId     = await getCurrentUserId()
      if (!myId) return

      this.loading = true
      this.error   = ''
      try {
        const { data, error } = await supabase
          .from('friendships')
          .select(`
            id, requester_id, addressee_id, status,
            requester:profiles!friendships_requester_id_fkey(id, first_name, last_name, avatar_url),
            addressee:profiles!friendships_addressee_id_fkey(id, first_name, last_name, avatar_url)
          `)
          .or(`requester_id.eq.${myId},addressee_id.eq.${myId}`)

        if (error) { this.error = error.message; return }

        const rows = (data || []).map((row: any) => {
          const isSentByMe = row.requester_id === myId
          const friendRow  = isSentByMe ? row.addressee : row.requester
          return {
            id:           row.id,
            requester_id: row.requester_id,
            addressee_id: row.addressee_id,
            status:       row.status,
            isSentByMe,
            friend:       buildProfile(friendRow),
          } as Friendship
        })

        this.allFriendships = rows
        this.friends    = rows.filter(r => r.status === 'accepted')
        this.pendingIn  = rows.filter(r => r.status === 'pending' && !r.isSentByMe)
        this.pendingOut = rows.filter(r => r.status === 'pending' &&  r.isSentByMe)
      } finally {
        this.loading = false
      }
    },

    // ── Load all users (or filtered by name) for Find Players tab ────────
    async loadUsers(query: string = '') {
      const supabase = useSupabaseClient()
      const userId   = await getCurrentUserId()
      if (!userId) return

      this.searching = true
      try {
        let qb = supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .neq('id', userId)
          .order('first_name', { ascending: true })
          .limit(60)

        if (query.trim()) {
          const term = query.trim()
          qb = qb.or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%`)
        }

        const { data, error } = await qb
        if (error) { this.error = error.message; return }

        this.searchResults = (data || []).map((row: any) => ({
          ...buildProfile(row),
          friendship: this.allFriendships.find(f => f.friend.id === row.id) ?? null,
        }))
      } finally {
        this.searching = false
      }
    },

    // ── Re-annotate search results with latest friendship data ────────────
    annotateSearch() {
      this.searchResults = this.searchResults.map(r => ({
        ...r,
        friendship: this.allFriendships.find(f => f.friend.id === r.id) ?? null,
      }))
    },

    // ── Send friend request ───────────────────────────────────────────────
    async sendRequest(addresseeId: string) {
      const supabase    = useSupabaseClient()
      const requesterId = await getCurrentUserId()
      if (!requesterId) return

      const { error } = await supabase
        .from('friendships')
        .insert({ requester_id: requesterId, addressee_id: addresseeId } as never)

      if (!error) {
        await this.fetchAll()
        this.annotateSearch()
      }
    },

    // ── Accept incoming request ───────────────────────────────────────────
    async acceptRequest(friendshipId: string) {
      const supabase = useSupabaseClient()
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted', updated_at: new Date().toISOString() } as never)
        .eq('id', friendshipId)

      if (!error) {
        await this.fetchAll()
        this.annotateSearch()
      }
    },

    // ── Decline / cancel request ──────────────────────────────────────────
    async declineRequest(friendshipId: string) {
      const supabase = useSupabaseClient()
      await supabase.from('friendships').delete().eq('id', friendshipId)
      await this.fetchAll()
      this.annotateSearch()
    },

    // ── Remove friend ─────────────────────────────────────────────────────
    async removeFriend(friendshipId: string) {
      const supabase = useSupabaseClient()
      await supabase.from('friendships').delete().eq('id', friendshipId)
      await this.fetchAll()
      this.annotateSearch()
    },
  },
})
