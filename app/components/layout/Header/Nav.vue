<template>
  <nav class="hidden md:flex items-center gap-1">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
      :class="isActive(item.to)
        ? 'text-slate-900/100'
        : 'text-slate-900/100'"
    >
      {{ item.label }}
      <span
        v-if="item.badge === 'friends' && (friendsStore.pendingInCount || chatStore.totalUnread)"
        class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-slate-900/100 text-[10px] font-bold flex items-center justify-center"
      >
        {{ friendsStore.pendingInCount + chatStore.totalUnread }}
      </span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { useFriendsStore } from '~/stores/friends'
import { useChatStore }    from '~/stores/chat'

const route        = useRoute()
const friendsStore = useFriendsStore()
const chatStore    = useChatStore()

const items = [
  { label: 'Game',        to: '/',            badge: null },
  { label: 'Quests',      to: '/quests',      badge: null },
  { label: 'Leaderboard', to: '/leaderboard', badge: null },
  { label: 'Play Chess',  to: '/play',        badge: null },
  { label: 'Friends',     to: '/friends',     badge: 'friends' },
]

const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)

// Pre-load friend request count when user is logged in
const user = useSupabaseUser()
watch(user, (u) => { if (u) friendsStore.fetchAll() }, { immediate: true })
</script>
