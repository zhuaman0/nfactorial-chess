<template>
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

    <!-- More dropdown -->
    <div class="relative" ref="dropdownRef">
      <button
        @click="open = !open"
        class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
        :class="open ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
      >
        More
        <svg
          class="w-3.5 h-3.5 transition-transform duration-200"
          :class="open ? 'rotate-180' : ''"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Transition name="dropdown">
        <div
          v-if="open"
          class="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
        >
          <NuxtLink
            v-for="item in moreItems"
            :key="item.to"
            :to="item.to"
            @click="open = false"
            class="flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors duration-150"
            :class="isActive(item.to)
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
          >
            <span class="text-base leading-none">{{ item.icon }}</span>
            {{ item.label }}
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const open  = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Close on outside click
onMounted(() => {
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
function onClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

// Close on route change
watch(() => route.path, () => { open.value = false })

const mainItems = [
  { label: 'Game',       to: '/'        },
  { label: 'Quests',     to: '/quests'  },
  { label: 'Play Chess', to: '/play'    },
  { label: 'Players',    to: '/friends' },
]

const moreItems = [
  { label: 'Leaderboard', to: '/leaderboard', icon: '🏆' },
  { label: 'Tournaments', to: '/tournaments', icon: '🎯' },
  { label: 'News',        to: '/news',        icon: '📰' },
  { label: 'Shop',        to: '/shop',        icon: '🏪' },
  { label: 'Upgrade',     to: '/upgrade',     icon: '👑' },
]

const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)
</script>

<style scoped>
.dropdown-enter-active { transition: opacity 0.15s ease, transform 0.15s ease }
.dropdown-leave-active { transition: opacity 0.1s ease,  transform 0.1s ease  }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) }
</style>
