import { defineStore } from 'pinia'
import type { FriendProfile } from './friends'

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

async function getMyId(): Promise<string | null> {
  try {
    const supabase = useSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    openFriend: null as FriendProfile | null,
    messages:   [] as Message[],
    loading:    false,
    sending:    false,
    minimized:  false,
    unread:     {} as Record<string, number>,
    _channel:   null as any,
  }),

  getters: {
    totalUnread: (s) => Object.values(s.unread).reduce((a, b) => a + b, 0),
  },

  actions: {
    // ── Open chat with a friend ───────────────────────────────────────────
    async openWith(friend: FriendProfile) {
      this.openFriend = friend
      this.minimized  = false
      if (this.unread[friend.id]) this.unread[friend.id] = 0
      await this.fetchMessages(friend.id)
    },

    close() {
      this.openFriend = null
      this.messages   = []
      this.minimized  = false
    },

    toggleMinimize() {
      this.minimized = !this.minimized
      if (!this.minimized && this.openFriend) {
        this.unread[this.openFriend.id] = 0
      }
    },

    // ── Load message history ──────────────────────────────────────────────
    async fetchMessages(friendId: string) {
      const supabase = useSupabaseClient()
      const myId     = await getMyId()
      if (!myId) return

      this.loading  = true
      this.messages = []
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(
            `and(sender_id.eq.${myId},receiver_id.eq.${friendId}),` +
            `and(sender_id.eq.${friendId},receiver_id.eq.${myId})`
          )
          .order('created_at', { ascending: true })
          .limit(100)

        if (error) throw error
        this.messages = data as Message[]
      } finally {
        this.loading = false
      }
    },

    // ── Send a message ────────────────────────────────────────────────────
    async sendMessage(content: string) {
      const supabase = useSupabaseClient()
      const myId     = await getMyId()
      if (!myId || !this.openFriend || !content.trim()) return

      this.sending = true
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            sender_id:   myId,
            receiver_id: this.openFriend.id,
            content:     content.trim(),
          } as never)
          .select()
          .single()

        if (error) throw error
        if (data && !this.messages.find(m => m.id === (data as any).id)) {
          this.messages.push(data as Message)
        }
      } finally {
        this.sending = false
      }
    },

    // ── Subscribe to incoming messages ────────────────────────────────────
    async subscribeGlobal() {
      const supabase = useSupabaseClient()
      if (this._channel) return

      const myId = await getMyId()
      if (!myId) return

      this._channel = supabase
        .channel(`inbox:${myId}`)
        .on(
          'postgres_changes' as any,
          {
            event:  'INSERT',
            schema: 'public',
            table:  'messages',
            filter: `receiver_id=eq.${myId}`,
          },
          (payload: any) => {
            const msg = payload.new as Message
            if (this.openFriend?.id === msg.sender_id) {
              if (!this.messages.find(m => m.id === msg.id)) {
                this.messages.push(msg)
              }
              if (!this.minimized) return
            }
            this.unread[msg.sender_id] = (this.unread[msg.sender_id] ?? 0) + 1
          }
        )
        .subscribe()
    },

    unsubscribeGlobal() {
      if (this._channel) {
        const supabase = useSupabaseClient()
        supabase.removeChannel(this._channel)
        this._channel = null
      }
    },
  },
})
