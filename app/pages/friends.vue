<template>
  <div class="p-4 pb-16">
    <main class="max-w-7xl mx-auto mt-6 flex flex-col gap-6">

      <!-- ── Banner ──────────────────────────────────────────────────────── -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 shadow-2xl p-10">
        <div class="absolute inset-0 opacity-10" :style="chessBoardBg"></div>
        <div class="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-orange-800/30 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 class="text-4xl font-extrabold text-white drop-shadow-lg">Friends</h1>
            <p class="text-orange-100/80 mt-1">Manage your connections and find new players</p>
          </div>
          <div class="flex gap-4">
            <div class="bg-white/15 border border-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[80px]">
              <p class="text-white text-2xl font-black">{{ friendsStore.friends.length }}</p>
              <p class="text-orange-100 text-xs mt-0.5">Friends</p>
            </div>
            <div class="bg-white/15 border border-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[80px]">
              <p class="text-white text-2xl font-black">{{ friendsStore.pendingInCount }}</p>
              <p class="text-orange-100 text-xs mt-0.5">Requests</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Tabs ───────────────────────────────────────────────────────── -->
      <div class="flex gap-1 bg-slate-800/80 border border-white/8 rounded-2xl p-1.5">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 relative"
          :class="activeTab === tab.key
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
            : 'text-slate-400 hover:text-white hover:bg-white/5'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span
            v-if="tab.key === 'requests' && friendsStore.pendingInCount"
            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-orange-500 text-[10px] flex items-center justify-center font-black shadow"
          >{{ friendsStore.pendingInCount }}</span>
        </button>
      </div>

      <!-- ══ MY FRIENDS ══════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'friends'">
        <div v-if="friendsStore.loading" class="flex justify-center py-20">
          <div class="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="friendsStore.friends.length === 0" class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/20 rounded-3xl p-16 shadow-2xl text-center">
          <div class="absolute -top-10 -right-10 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <p class="text-6xl mb-4">👥</p>
          <p class="text-white text-xl font-bold mb-2">No friends yet</p>
          <p class="text-slate-400 text-sm mb-6">Head to Find Players to connect with others!</p>
          <button
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
            @click="activeTab = 'search'"
          >
            Find Players →
          </button>
        </div>

        <!-- Friends grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <FriendsUserCard
            v-for="f in friendsStore.friends"
            :key="f.id"
            :user="f.friend"
            :friendship="f"
            @message="openChat"
            @remove="friendsStore.removeFriend($event)"
          />
        </div>
      </div>

      <!-- ══ REQUESTS ════════════════════════════════════════════════════ -->
      <div v-else-if="activeTab === 'requests'">
        <div
          v-if="friendsStore.pendingIn.length === 0 && friendsStore.pendingOut.length === 0"
          class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/20 rounded-3xl p-16 shadow-2xl text-center"
        >
          <div class="absolute -bottom-10 -left-10 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <p class="text-6xl mb-4">📭</p>
          <p class="text-white text-xl font-bold mb-2">No pending requests</p>
          <p class="text-slate-400 text-sm">Requests you send or receive will appear here.</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Incoming -->
          <div v-if="friendsStore.pendingIn.length" class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-6 shadow-2xl">
            <div class="absolute -top-8 -right-8 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-lg">📥</span>
                <p class="text-white font-extrabold">Incoming</p>
                <span class="px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold rounded-full">
                  {{ friendsStore.pendingIn.length }}
                </span>
              </div>
              <div class="flex flex-col gap-2">
                <FriendsUserCard
                  v-for="f in friendsStore.pendingIn"
                  :key="f.id"
                  :user="f.friend"
                  :friendship="f"
                  subtitle="Wants to be your friend"
                  @accept="friendsStore.acceptRequest($event)"
                  @decline="friendsStore.declineRequest($event)"
                />
              </div>
            </div>
          </div>

          <!-- Outgoing -->
          <div v-if="friendsStore.pendingOut.length" class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div class="absolute -bottom-8 -left-8 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-lg">📤</span>
                <p class="text-white font-extrabold">Sent</p>
                <span class="px-2 py-0.5 bg-slate-700 border border-white/10 text-slate-400 text-xs font-bold rounded-full">
                  {{ friendsStore.pendingOut.length }}
                </span>
              </div>
              <div class="flex flex-col gap-2">
                <FriendsUserCard
                  v-for="f in friendsStore.pendingOut"
                  :key="f.id"
                  :user="f.friend"
                  :friendship="f"
                  subtitle="Request sent · waiting for reply"
                  @cancel="friendsStore.declineRequest($event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ FIND PLAYERS ════════════════════════════════════════════════ -->
      <div v-else-if="activeTab === 'search'" class="flex flex-col gap-5">

        <!-- Search bar -->
        <div class="relative">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search players by name…"
            class="w-full bg-slate-800/80 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-slate-500 text-sm outline-none focus:border-orange-500/50 transition-colors shadow-lg"
          />
          <button v-if="searchQuery" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors" @click="searchQuery = ''">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div v-if="friendsStore.searching" class="absolute right-4 top-1/2 -translate-y-1/2">
            <div class="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        </div>

        <!-- Count label -->
        <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider px-1">
          {{ searchQuery ? `Results for "${searchQuery}"` : 'All Players' }}
          <span class="text-slate-600">({{ friendsStore.searchResults.length }})</span>
        </p>

        <!-- Loading skeletons -->
        <div v-if="friendsStore.searching" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div v-for="i in 6" :key="i" class="h-20 bg-white/5 border border-white/8 rounded-2xl animate-pulse"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="friendsStore.searchResults.length === 0" class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/20 rounded-3xl p-16 shadow-2xl text-center">
          <p class="text-5xl mb-4">🔍</p>
          <p class="text-white text-lg font-bold">{{ searchQuery ? `No results for "${searchQuery}"` : 'No other players yet' }}</p>
          <p v-if="searchQuery" class="text-slate-400 text-sm mt-1">Try a different name.</p>
        </div>

        <!-- Players grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <FriendsUserCard
            v-for="u in friendsStore.searchResults"
            :key="u.id"
            :user="u"
            :friendship="u.friendship"
            @add="friendsStore.sendRequest($event)"
            @accept="friendsStore.acceptRequest($event)"
            @decline="friendsStore.declineRequest($event)"
            @cancel="friendsStore.declineRequest($event)"
            @remove="friendsStore.removeFriend($event)"
            @message="openChat"
          />
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useFriendsStore } from '~/stores/friends'
import { useChatStore }    from '~/stores/chat'
import type { FriendProfile } from '~/stores/friends'

definePageMeta({ middleware: 'auth' })

const friendsStore = useFriendsStore()
const chatStore    = useChatStore()

const activeTab   = ref<'friends' | 'requests' | 'search'>('friends')
const searchQuery = ref('')

const tabs = [
  { key: 'friends',  label: 'My Friends'   },
  { key: 'requests', label: 'Requests'     },
  { key: 'search',   label: 'Find Players' },
] as const

const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

watch(activeTab, async (tab) => {
  if (tab === 'search') {
    await friendsStore.fetchAll()
    await friendsStore.loadUsers(searchQuery.value)
  }
})

let searchTimer: ReturnType<typeof setTimeout>
watch(searchQuery, (q) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    if (activeTab.value === 'search') friendsStore.loadUsers(q)
  }, 300)
})

const openChat = async (friend: FriendProfile) => {
  await chatStore.openWith(friend)
}

onMounted(() => friendsStore.fetchAll())
</script>
