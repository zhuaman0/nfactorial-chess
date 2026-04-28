<template>
  <!-- Main nav: 4 links + More -->
  <nav class="hidden md:flex items-center gap-1">
    <NuxtLink
      v-for="item in mainItems"
      :key="item.to"
      :to="item.to"
      class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
      :class="isActive(item.to)
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
    >
      {{ item.label }}
    </NuxtLink>

    <!-- More button -->
    <button
      @click="sidebarOpen = true"
      class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150"
    >
      More
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </nav>

  <!-- Sidebar overlay -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        @click="sidebarOpen = false"
      />
    </Transition>

    <Transition name="slide">
      <div
        v-if="sidebarOpen"
        class="fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col"
      >
        <!-- Sidebar header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="text-xl">♟️</span>
            <span class="font-extrabold text-slate-900 text-base">Menu</span>
          </div>
          <button
            @click="sidebarOpen = false"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- All nav links -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <NuxtLink
            v-for="item in allItems"
            :key="item.to"
            :to="item.to"
            @click="sidebarOpen = false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150"
            :class="isActive(item.to)
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
          >
            <span class="text-lg leading-none">{{ item.icon }}</span>
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)

// Close sidebar on route change
watch(() => route.path, () => { sidebarOpen.value = false })

const mainItems = [
  { label: 'Game',       to: '/'         },
  { label: 'Quests',     to: '/quests'   },
  { label: 'Play Chess', to: '/play'     },
  { label: 'Players',    to: '/friends'  },
]

const allItems = [
  { label: 'Game',         to: '/',             icon: '🏠' },
  { label: 'Quests',       to: '/quests',       icon: '⚔️' },
  { label: 'Play Chess',   to: '/play',         icon: '♟️' },
  { label: 'Players',      to: '/friends',      icon: '👥' },
  { label: 'Leaderboard',  to: '/leaderboard',  icon: '🏆' },
  { label: 'Tournaments',  to: '/tournaments',  icon: '🎯' },
  { label: 'News',         to: '/news',         icon: '📰' },
  { label: 'Shop',         to: '/shop',         icon: '🏪' },
  { label: 'Upgrade',      to: '/upgrade',      icon: '👑' },
]

const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease }
.fade-enter-from, .fade-leave-to       { opacity: 0 }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease }
.slide-enter-from, .slide-leave-to       { transform: translateX(100%) }
</style>
