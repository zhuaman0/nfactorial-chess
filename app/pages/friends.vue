<template>
  <div class="p-4 pb-16 mt-6">
    <main class="max-w-3xl mx-auto flex flex-col gap-6">

      <!-- Page header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Friends</h1>
          <p class="text-slate-400 text-sm mt-0.5">Manage your connections and chat in real time</p>
        </div>
        <div v-if="friendsStore.pendingInCount" class="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-xl px-3 py-1.5">
          <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span class="text-blue-300 text-sm font-medium">{{ friendsStore.pendingInCount }} new request{{ friendsStore.pendingInCount > 1 ? 's' : '' }}</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-slate-800/60 border border-white/8 rounded-xl p-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors relative"
          :class="activeTab === tab.key
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:text-white'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span
            v-if="tab.key === 'requests' && friendsStore.pendingInCount"
            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold"
          >{{ friendsStore.pendingInCount }}</span>
        </button>
      </div>

      <!-- ── My Friends ── -->
      <div v-if="activeTab === 'friends'">
        <div v-if="friendsStore.loading" class="flex justify-center py-16">
          <div class="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="friendsStore.friends.length === 0" class="text-center py-16">
          <p class="text-4xl mb-3">👥</p>
          <p class="text-slate-400">No friends yet.</p>
          <p class="text-slate-500 text-sm mt-1">Search for players to add them.</p>
        </div>

        <div v-else class="flex flex-col gap-2">
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

      <!-- ── Friend Requests ── -->
      <div v-else-if="activeTab === 'requests'">
        <div v-if="friendsStore.pendingIn.length === 0 && friendsStore.pendingOut.length === 0" class="text-center py-16">
          <p class="text-4xl mb-3">📭</p>
          <p class="text-slate-400">No pending requests.</p>
        </div>

        <div v-else class="flex flex-col gap-6">
          <!-- Incoming -->
          <div v-if="friendsStore.pendingIn.length">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Incoming</p>
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

          <!-- Outgoing -->
          <div v-if="friendsStore.pendingOut.length">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Sent</p>
            <div class="flex flex-col gap-2">
              <FriendsUserCard
                v-for="f in friendsStore.pendingOut"
                :key="f.id"
                :user="f.friend"
                :friendship="f"
                subtitle="Request sent"
                @cancel="friendsStore.declineRequest($event)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ── Find Players ── -->
      <div v-else-if="activeTab === 'search'">
        <!-- Search input -->
        <div class="relative mb-4">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name…"
            class="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 transition-colors"
          />
          <div v-if="friendsStore.searching" class="absolute right-3 top-1/2 -translate-y-1/2">
            <div class="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>

        <!-- Results -->
        <div v-if="searchQuery && friendsStore.searchResults.length === 0 && !friendsStore.searching" class="text-center py-10">
          <p class="text-slate-400">No players found for "{{ searchQuery }}"</p>
        </div>

        <div v-else class="flex flex-col gap-2">
          <FriendsUserCard
            v-for="u in friendsStore.searchResults"
            :key="u.id"
            :user="u"
            :friendship="u.friendship"
            @add="friendsStore.sendRequest($event)"
            @accept="friendsStore.acceptRequest($event)"
            @decline="friendsStore.declineRequest($event)"
            @cancel="friendsStore.declineRequest($event)"
            @message="openChat"
          />
        </div>

        <p v-if="!searchQuery" class="text-center text-slate-500 text-sm py-10">
          Type a name to find players
        </p>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useFriendsStore } from '~/stores/friends'
import { useChatStore }   from '~/stores/chat'
import type { FriendProfile } from '~/stores/friends'

definePageMeta({ middleware: 'auth' })

const friendsStore = useFriendsStore()
const chatStore    = useChatStore()

const activeTab  = ref<'friends' | 'requests' | 'search'>('friends')
const searchQuery = ref('')

const tabs = [
  { key: 'friends',  label: 'My Friends'   },
  { key: 'requests', label: 'Requests'     },
  { key: 'search',   label: 'Find Players' },
] as const;

// Debounced search
let searchTimer: ReturnType<typeof setTimeout>
watch(searchQuery, (q) => {
  clearTimeout(searchTimer)
  if (!q.trim()) { friendsStore.searchResults = []; return }
  searchTimer = setTimeout(() => friendsStore.searchUsers(q), 300)
})

const openChat = async (friend: FriendProfile) => {
  await chatStore.openWith(friend)
}

onMounted(() => friendsStore.fetchAll())
</script>
