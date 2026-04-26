import { defineStore } from 'pinia'
import type { FriendProfile } from './friends'

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    openFriend:  null as FriendProfile | null,
    messages:    [] as Message[],
    loading:     false,
    sending:     false,
    minimized:   false,
    unread:      {} as Record<string, number>, // friendId → count
    _channel:    null as any,
  }),

  getters: {
    totalUnread: (s) => Object.values(s.unread).reduce((a, b) => a + b, 0),
  },

  actions: {
    // ── open chat with a friend ──────────────────────────────────────────
    async openWith(friend: FriendProfile) {
      this.openFriend = friend
      this.minimized  = false
      // clear unread for this friend
      if (this.unread[friend.id]) {
        this.unread[friend.id] = 0
      }
      await this.fetchMessages(friend.id)
    },

    close() {
      this.openFriend = null
      this.messages   = []
      this.minimized  = false
    },

    toggleMinimize() {
      this.minimized = !this.minimized
      // clear unread when expanding
      if (!this.minimized && this.openFriend) {
        this.unread[this.openFriend.id] = 0
      }
    },

    // ── load history ─────────────────────────────────────────────────────
    async fetchMessages(friendId: string) {
      const supabase = useSupabaseClient()
      const user     = useSupabaseUser()
      if (!user.value) return

      this.loading  = true
      this.messages = []
      const myId    = user.value.id

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

    // ── send a message ────────────────────────────────────────────────────
    async sendMessage(content: string) {
      const supabase = useSupabaseClient()
      const user     = useSupabaseUser()
      if (!user.value || !this.openFriend || !content.trim()) return

      this.sending = true
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            sender_id:   user.value.id,
            receiver_id: this.openFriend.id,
            content:     content.trim(),
          } as never)
          .select()
          .single()

        if (error) throw error
        // Optimistically add (realtime will also fire, dedupe by id)
        if (data && !this.messages.find(m => m.id === (data as any).id)) {
          this.messages.push(data as Message)
        }
      } finally {
        this.sending = false
      }
    },

    // ── subscribe to incoming messages (call once on app mount) ──────────
    subscribeGlobal() {
      const supabase = useSupabaseClient()
      const user     = useSupabaseUser()
      if (!user.value || this._channel) return

      const myId = user.value.id

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

            // If this message is from the currently open chat, append it
            if (this.openFriend?.id === msg.sender_id) {
              if (!this.messages.find(m => m.id === msg.id)) {
                this.messages.push(msg)
              }
              // mark read if not minimized
              if (!this.minimized) return
            }

            // Otherwise increment unread count
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
