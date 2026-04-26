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
  const l = row.last_name || ''
  return {
    id:         row.id,
    first_name: f,
    last_name:  l,
    avatar_url: row.avatar_url || '',
    fullName:   `${f} ${l}`.trim() || row.id.slice(0, 8),
    initials:   ((f[0] || '') + (l[0] || '')).toUpperCase() || '?',
  }
}

export const useFriendsStore = defineStore('friends', {
  state: () => ({
    friends:       [] as Friendship[],
    pendingIn:     [] as Friendship[], // received requests
    pendingOut:    [] as Friendship[], // sent requests
    searchResults: [] as UserSearchResult[],
    loading:       false,
    searching:     false,
    error:         '' as string,
    allFriendships:[] as Friendship[], // raw cache for annotation
  }),

  getters: {
    pendingInCount: (s) => s.pendingIn.length,
  },

  actions: {
    // ── fetch all friendships and split by status ────────────────────────
    async fetchAll() {
      const supabase = useSupabaseClient()
      const user     = useSupabaseUser()
      if (!user.value) return

      this.loading = true
      this.error = ''
      try {
        const myId = user.value.id
        const { data, error } = await supabase
          .from('friendships')
          .select(`
            id, requester_id, addressee_id, status,
            requester:profiles!friendships_requester_id_fkey(id, first_name, last_name, avatar_url),
            addressee:profiles!friendships_addressee_id_fkey(id, first_name, last_name, avatar_url)
          `)

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

    // ── search users by name ─────────────────────────────────────────────
    async searchUsers(query: string) {
      const supabase = useSupabaseClient()
      const user     = useSupabaseUser()
      if (!user.value || !query.trim()) {
        this.searchResults = []
        return
      }

      const userId = user.value?.id
      if (!userId) { this.searching = false; return }

      this.searching = true
      try {
        const q = query.trim()
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .or(`first_name.ilike.*${q}*,last_name.ilike.*${q}*`)
          .neq('id', userId)
          .limit(20)

        if (error) { this.error = error.message; return }

        this.searchResults = (data || []).map((row: any) => {
          const profile    = buildProfile(row)
          const friendship = this.allFriendships.find(
            f => f.friend.id === row.id
          ) ?? null
          return { ...profile, friendship }
        })
      } finally {
        this.searching = false
      }
    },

    // ── send friend request ──────────────────────────────────────────────
    async sendRequest(addresseeId: string) {
      const supabase = useSupabaseClient()
      const user     = useSupabaseUser()
      if (!user.value) return

      const { error } = await supabase
        .from('friendships')
        .insert({ requester_id: user.value.id, addressee_id: addresseeId } as never)

      if (!error) await this.fetchAll()
    },

    // ── accept incoming request ──────────────────────────────────────────
    async acceptRequest(friendshipId: string) {
      const supabase = useSupabaseClient()
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted', updated_at: new Date().toISOString() } as never)
        .eq('id', friendshipId)

      if (!error) await this.fetchAll()
    },

    // ── decline / cancel request ─────────────────────────────────────────
    async declineRequest(friendshipId: string) {
      const supabase = useSupabaseClient()
      await supabase.from('friendships').delete().eq('id', friendshipId)
      await this.fetchAll()
    },

    // ── unfriend ─────────────────────────────────────────────────────────
    async removeFriend(friendshipId: string) {
      const supabase = useSupabaseClient()
      await supabase.from('friendships').delete().eq('id', friendshipId)
      await this.fetchAll()
    },

    // annotate search results after fetching friendships
    annotateSearch() {
      this.searchResults = this.searchResults.map(r => ({
        ...r,
        friendship: this.allFriendships.find(f => f.friend.id === r.id) ?? null,
      }))
    },
  },
})
