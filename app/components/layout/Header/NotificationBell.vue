<template>
  <div class="relative" ref="bellRef">
    <!-- Bell button -->
    <button
      class="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors"
      @click="open = !open"
      aria-label="Notifications"
    >
      <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span
        v-if="totalCount > 0"
        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow"
      >{{ totalCount > 9 ? '9+' : totalCount }}</span>
    </button>

    <!-- Dropdown -->
    <Transition name="bell-drop">
      <div
        v-if="open"
        class="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <p class="font-bold text-slate-900 text-sm">Notifications</p>
          <span
            v-if="totalCount > 0"
            class="px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-bold rounded-full"
          >{{ totalCount }} new</span>
        </div>

        <!-- Unified notification list -->
        <div class="max-h-96 overflow-y-auto divide-y divide-slate-50">

          <!-- Empty state -->
          <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-10 gap-2">
            <span class="text-3xl">🔔</span>
            <p class="text-slate-600 text-sm font-semibold">You're all caught up!</p>
            <p class="text-slate-400 text-xs">No new notifications</p>
          </div>

          <!-- Each notification -->
          <div
            v-for="n in notifications"
            :key="n.key"
            class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
            :class="{ 'cursor-pointer': n.type === 'message' }"
            @click="n.type === 'message' && openChat(n)"
          >
            <!-- Avatar + type icon -->
            <div class="relative flex-shrink-0">
              <UiAvatar :src="n.friend.avatar_url" :fallback="n.friend.initials" size="sm" />
              <span
                class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] border-2 border-white"
                :class="n.type === 'request' ? 'bg-orange-500' : 'bg-blue-500'"
              >{{ n.type === 'request' ? '🤝' : '💬' }}</span>
            </div>

            <!-- Text -->
            <div class="flex-1 min-w-0">
              <p class="text-slate-900 font-semibold text-sm truncate leading-tight">{{ n.friend.fullName }}</p>
              <p class="text-slate-400 text-xs mt-0.5">
                {{ n.type === 'request' ? 'Wants to connect with you' : `${n.count} new message${n.count > 1 ? 's' : ''}` }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex-shrink-0">
              <!-- Friend request: accept / decline -->
              <div v-if="n.type === 'request'" class="flex gap-1.5">
                <button
                  class="w-7 h-7 rounded-lg bg-orange-500 text-white text-xs font-black flex items-center justify-center hover:bg-orange-600 transition-colors"
                  @click.stop="accept(n.id)"
                >✓</button>
                <button
                  class="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center hover:bg-slate-200 transition-colors"
                  @click.stop="decline(n.id)"
                >✕</button>
              </div>

              <!-- Message: unread badge -->
              <span
                v-else
                class="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center"
              >{{ n.count > 9 ? '9+' : n.count }}</span>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div v-if="totalCount > 0" class="border-t border-slate-100 px-4 py-2.5">
          <button
            class="text-xs text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            @click="navigateTo('/friends'); open = false"
          >View all players →</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useFriendsStore } from '~/stores/friends'
import { useChatStore }    from '~/stores/chat'

const friendsStore = useFriendsStore()
const chatStore    = useChatStore()

const open    = ref(false)
const bellRef = ref<HTMLElement | null>(null)

// Merge friend requests + unread messages into one list
const notifications = computed(() => {
  const items: any[] = []

  for (const req of friendsStore.pendingIn) {
    items.push({
      key:    `req-${req.id}`,
      type:   'request',
      id:     req.id,
      friend: req.friend,
    })
  }

  for (const [friendId, count] of Object.entries(chatStore.unread)) {
    if (!count) continue
    const f = friendsStore.friends.find(fr => fr.friend.id === friendId)
    if (!f) continue
    items.push({
      key:    `msg-${friendId}`,
      type:   'message',
      id:     friendId,
      friend: f.friend,
      count,
    })
  }

  return items
})

const totalCount = computed(() => friendsStore.pendingInCount + chatStore.totalUnread)

const accept  = async (id: string) => { await friendsStore.acceptRequest(id) }
const decline = async (id: string) => { await friendsStore.declineRequest(id) }

const openChat = async (n: any) => {
  await chatStore.openWith(n.friend)
  open.value = false
}

onMounted(() => {
  const handler = (e: MouseEvent) => {
    if (bellRef.value && !bellRef.value.contains(e.target as Node)) {
      open.value = false
    }
  }
  document.addEventListener('mousedown', handler)
  onUnmounted(() => document.removeEventListener('mousedown', handler))
})
</script>

<style scoped>
.bell-drop-enter-active,
.bell-drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.bell-drop-enter-from,
.bell-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
