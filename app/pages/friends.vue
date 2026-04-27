<template>
  <div class="p-4 pb-16">
    <main class="max-w-7xl mx-auto mt-6 flex flex-col gap-8">

      <!-- ── Banner ──────────────────────────────────────────────────────── -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 shadow-2xl p-10">
        <div class="absolute inset-0 opacity-10" :style="chessBoardBg"></div>
        <div class="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-orange-800/30 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 class="text-4xl font-extrabold text-white drop-shadow-lg">Players</h1>
            <p class="text-orange-100/80 mt-1">Discover top players and grow your network</p>
          </div>
          <div class="flex gap-4">
            <div class="bg-white/15 border border-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[80px]">
              <p class="text-white text-2xl font-black">{{ friendsStore.friends.length }}</p>
              <p class="text-orange-100 text-xs mt-0.5">Contacts</p>
            </div>
            <div class="bg-white/15 border border-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[80px]">
              <p class="text-white text-2xl font-black">{{ friendsStore.searchResults.length }}</p>
              <p class="text-orange-100 text-xs mt-0.5">Players</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Top Players ─────────────────────────────────────────────────── -->
      <div>
        <div class="flex items-center gap-3 mb-5">
          <span class="text-2xl">🏆</span>
          <h2 class="text-xl font-extrabold text-slate-800">Top Players</h2>
          <span class="px-2.5 py-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold rounded-full">
            Top {{ Math.min(5, leaderboardStore.entries.length) }}
          </span>
        </div>

        <div v-if="leaderboardStore.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="i in 5" :key="i" class="h-44 bg-white/5 border border-white/8 rounded-2xl animate-pulse"></div>
        </div>

        <div v-else-if="topPlayers.length === 0" class="text-center py-8 text-slate-500 text-sm">
          No leaderboard data yet.
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            v-for="(player, i) in topPlayers"
            :key="player.id"
            :class="[
              'relative overflow-hidden rounded-2xl p-5 flex flex-col items-center text-center gap-3 border shadow-lg transition-all duration-200 hover:-translate-y-1',
              i === 0 ? 'bg-gradient-to-b from-amber-900/60 to-slate-900 border-amber-500/50' :
              i === 1 ? 'bg-gradient-to-b from-slate-600/60 to-slate-900 border-slate-400/40' :
              i === 2 ? 'bg-gradient-to-b from-orange-900/50 to-slate-900 border-orange-700/50' :
                        'bg-gradient-to-b from-slate-800 to-slate-900 border-white/8'
            ]"
          >
            <!-- Rank badge -->
            <div
              :class="[
                'absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black',
                i === 0 ? 'bg-amber-400 text-amber-900' :
                i === 1 ? 'bg-slate-300 text-slate-700' :
                i === 2 ? 'bg-orange-600 text-white' :
                          'bg-slate-700 text-slate-400'
              ]"
            >
              {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}` }}
            </div>

            <UiAvatar :src="player.avatar_url" :fallback="player.initials" size="lg" />
            <div class="w-full">
              <p class="text-white font-bold text-sm truncate leading-tight">{{ player.fullName }}</p>
              <p class="text-slate-400 text-xs mt-0.5">{{ player.wins }} wins</p>
            </div>

            <!-- Contact button -->
            <button
              v-if="!player.friendship"
              class="w-full py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 text-xs font-bold transition-all"
              @click="friendsStore.sendRequest(player.id)"
            >+ Add</button>
            <button
              v-else-if="player.friendship.status === 'pending' && player.friendship.isSentByMe"
              class="w-full py-1.5 rounded-xl bg-slate-700/60 border border-white/8 text-slate-400 text-xs font-medium"
              disabled
            >Pending…</button>
            <span
              v-else-if="player.friendship.status === 'accepted'"
              class="text-xs text-emerald-400 font-semibold flex items-center gap-1"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Contact
            </span>
          </div>
        </div>
      </div>

      <!-- ── All Players ──────────────────────────────────────────────────── -->
      <div>
        <div class="flex items-center gap-3 mb-5">
          <span class="text-2xl">👥</span>
          <h2 class="text-xl font-extrabold text-white">All Players</h2>
        </div>

        <!-- Search -->
        <div class="relative mb-5">
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

        <!-- Skeletons -->
        <div v-if="friendsStore.searching" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div v-for="i in 6" :key="i" class="h-20 bg-white/5 border border-white/8 rounded-2xl animate-pulse"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="friendsStore.searchResults.length === 0" class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/20 rounded-3xl p-16 shadow-2xl text-center">
          <p class="text-5xl mb-4">🔍</p>
          <p class="text-white text-lg font-bold">{{ searchQuery ? `No results for "${searchQuery}"` : 'No other players yet' }}</p>
          <p v-if="searchQuery" class="text-slate-400 text-sm mt-1">Try a different name.</p>
        </div>

        <!-- Grid -->
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
import { useFriendsStore }     from '~/stores/friends'
import { useChatStore }        from '~/stores/chat'
import { useLeaderboardStore } from '~/stores/leaderboard'
import type { FriendProfile }  from '~/stores/friends'

definePageMeta({ name: 'Friends', middleware: 'auth' })

const friendsStore     = useFriendsStore()
const chatStore        = useChatStore()
const leaderboardStore = useLeaderboardStore()

const searchQuery = ref('')

const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

const topPlayers = computed(() =>
  leaderboardStore.entries.slice(0, 5).map(entry => ({
    ...entry,
    fullName:   `${entry.first_name} ${entry.last_name}`.trim() || entry.id.slice(0, 8),
    initials:   ((entry.first_name[0] || '') + (entry.last_name[0] || '')).toUpperCase() || '?',
    friendship: friendsStore.allFriendships.find(f => f.friend.id === entry.id) ?? null,
  }))
)

let searchTimer: ReturnType<typeof setTimeout>
watch(searchQuery, (q) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => friendsStore.loadUsers(q), 300)
})

const openChat = async (friend: FriendProfile) => {
  await chatStore.openWith(friend)
}

onMounted(async () => {
  await Promise.all([
    friendsStore.fetchAll(),
    leaderboardStore.fetchLeaderboard(),
  ])
  await friendsStore.loadUsers('')
})
</script>
