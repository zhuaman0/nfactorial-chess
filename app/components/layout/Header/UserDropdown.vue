<template>
  <!-- Avatar trigger -->
  <button
    type="button"
    class="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors p-0.5"
    @click="open = true"
    aria-label="Open profile"
  >
    <UiAvatar :src="avatarSrc" :fallback="profileStore.initials" size="sm" />
  </button>

  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div v-if="open" class="fixed inset-0 z-[998] bg-slate-950/60 backdrop-blur-sm" @click="open = false" />
    </Transition>

    <!-- Panel -->
    <Transition name="panel">
      <div v-if="open" class="fixed top-0 right-0 bottom-0 z-[999] w-[320px] max-w-[95vw] flex flex-col bg-slate-950 border-l border-white/8 shadow-2xl overflow-y-auto" role="dialog" aria-modal="true">

        <!-- Close -->
        <button
          class="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 flex items-center justify-center text-sm transition-all"
          @click="open = false"
          aria-label="Close"
        >✕</button>

        <!-- ── Hero ──────────────────────────────────────────────────── -->
        <div class="relative overflow-hidden px-6 pt-10 pb-8 bg-gradient-to-br from-orange-600 via-amber-500 to-orange-500">
          <div class="absolute inset-0 opacity-10 pointer-events-none" :style="chessBoardBg"></div>
          <div class="absolute -top-8 -right-8 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative flex flex-col items-center text-center gap-3">
            <div class="ring-4 ring-white/30 rounded-full shadow-2xl">
              <UiAvatar :src="avatarSrc" :fallback="profileStore.initials" size="lg" />
            </div>
            <div>
              <h2 class="text-white font-extrabold text-xl leading-tight">{{ profileStore.fullName || 'Player' }}</h2>
              <p class="text-orange-100/80 text-xs mt-0.5">{{ user?.email }}</p>
            </div>
            <div class="flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-white">
              <span>⭐</span> Level {{ userLevel }} · {{ levelTitle }}
            </div>
          </div>
        </div>

        <!-- ── XP Bar ─────────────────────────────────────────────────── -->
        <div class="px-6 py-5 border-b border-white/8">
          <div class="flex justify-between text-xs font-semibold mb-2">
            <span class="text-slate-400">XP Progress</span>
            <span class="text-orange-400">{{ xpCurrent }} / {{ xpNext }} XP</span>
          </div>
          <div class="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700 relative"
              :style="{ width: xpPercent + '%' }"
            >
              <div class="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-sm rounded-full"></div>
            </div>
          </div>
          <p class="text-slate-600 text-xs mt-1.5 text-right">{{ xpNext - xpCurrent }} XP until Level {{ userLevel + 1 }}</p>
        </div>

        <!-- ── Streak ─────────────────────────────────────────────────── -->
        <div class="px-6 py-4 border-b border-white/8">
          <div class="flex items-center gap-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl px-4 py-3">
            <span class="text-3xl leading-none">🔥</span>
            <div class="flex-1">
              <p class="text-orange-400 font-black text-lg leading-none">{{ streakDays }} days</p>
              <p class="text-slate-500 text-xs mt-0.5">Current streak</p>
            </div>
            <div class="flex gap-1">
              <span
                v-for="i in 7"
                :key="i"
                class="w-2 h-2 rounded-full transition-all"
                :class="i <= streakDays ? 'bg-orange-500 shadow-[0_0_6px_#f97316]' : 'bg-white/15'"
              />
            </div>
          </div>
        </div>

        <!-- ── Quick stats ────────────────────────────────────────────── -->
        <div class="px-6 py-4 border-b border-white/8">
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-white/5 border border-white/8 rounded-2xl p-3 text-center">
              <p class="text-white font-black text-lg leading-none">{{ profileStore.profile?.points ?? 0 }}</p>
              <p class="text-slate-500 text-[10px] mt-1 uppercase tracking-wide">XP</p>
            </div>
            <div class="bg-white/5 border border-white/8 rounded-2xl p-3 text-center">
              <p class="text-white font-black text-lg leading-none">{{ friendsStore.friends.length }}</p>
              <p class="text-slate-500 text-[10px] mt-1 uppercase tracking-wide">Friends</p>
            </div>
            <div class="bg-white/5 border border-white/8 rounded-2xl p-3 text-center">
              <p class="text-white font-black text-lg leading-none">{{ questsStore.completedCount }}</p>
              <p class="text-slate-500 text-[10px] mt-1 uppercase tracking-wide">Quests</p>
            </div>
          </div>
        </div>

        <!-- ── Nav actions ────────────────────────────────────────────── -->
        <div class="px-6 py-4 flex flex-col gap-2 flex-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-150 group"
            :class="isActive(item.to)
              ? 'bg-orange-500/15 border-orange-500/30 text-white'
              : 'bg-white/5 border-white/8 text-slate-300 hover:bg-white/10 hover:border-white/15'"
            @click="open = false"
          >
            <span class="text-xl w-7 text-center flex-shrink-0">{{ item.icon }}</span>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm leading-tight">{{ item.label }}</p>
              <p class="text-xs mt-0.5" :class="isActive(item.to) ? 'text-orange-300/70' : 'text-slate-600'">{{ item.sub }}</p>
            </div>
            <svg class="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>

        <!-- ── Sign out ───────────────────────────────────────────────── -->
        <div class="px-6 py-5 border-t border-white/8">
          <button
            class="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/15 hover:border-red-500/40 font-semibold text-sm transition-all"
            @click="handleLogout"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import { useAuthStore }    from '~/stores/auth'
import { useFriendsStore } from '~/stores/friends'
import { useQuestsStore }  from '~/stores/quests'

const profileStore = useProfileStore()
const authStore    = useAuthStore()
const friendsStore = useFriendsStore()
const questsStore  = useQuestsStore()
const user  = useSupabaseUser()
const route = useRoute()
const open  = ref(false)

const avatarSrc = computed(() => {
  const meta = user.value?.user_metadata || {}
  return profileStore.avatarUrl || meta.picture || meta.avatar_url || ''
})

const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

const points     = computed(() => profileStore.profile?.points ?? 0)
const streakDays = computed(() => profileStore.profile?.current_streak ?? 0)
const { level: userLevel, title: levelTitle, xpCurrent, xpNext, xpPercent } = useLevel(points)

const navItems = [
  { icon: '🏠', label: 'Home',        sub: 'Dashboard & overview',   to: '/'           },
  { icon: '⚔️', label: 'Play Chess',  sub: 'Start a new game',        to: '/play'       },
  { icon: '📋', label: 'Quests',      sub: 'Daily challenges',        to: '/quests'     },
  { icon: '🏆', label: 'Leaderboard', sub: 'Global rankings',         to: '/leaderboard'},
  { icon: '👥', label: 'Players',     sub: 'Find & connect',          to: '/friends'    },
  { icon: '🏆', label: 'Tournaments', sub: 'Compete & climb rankings', to: '/tournaments'},
  { icon: '📰', label: 'News',        sub: 'Updates & chess tips',    to: '/news'       },
  { icon: '👤', label: 'Profile',     sub: 'Edit your info & avatar', to: '/profile'    },
]

const isActive = (to: string) => to === '/' ? route.path === '/' : route.path.startsWith(to)

const handleLogout = async () => {
  open.value = false
  await authStore.logout()
  navigateTo('/login')
}

onMounted(async () => {
  await Promise.all([
    profileStore.fetchProfile(),
    friendsStore.fetchAll(),
    questsStore.fetchQuests(),
  ])
})

onMounted(() => {
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') open.value = false }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})
</script>

<style scoped>
.backdrop-enter-active, .backdrop-leave-active { transition: opacity 0.25s ease; }
.backdrop-enter-from, .backdrop-leave-to { opacity: 0; }

.panel-enter-active, .panel-leave-active { transition: transform 0.3s cubic-bezier(.4,0,.2,1); }
.panel-enter-from, .panel-leave-to { transform: translateX(100%); }
.panel-enter-to, .panel-leave-from { transform: translateX(0); }
</style>
