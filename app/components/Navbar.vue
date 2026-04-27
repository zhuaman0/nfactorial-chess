<template>
  <nav class="flex justify-between items-center px-6 py-4 mb-8 bg-slate-800/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg max-w-6xl mx-auto w-full">
    <NuxtLink to="/" class="flex items-center font-bold gap-2 hover:opacity-80 transition-opacity">
      <span class="text-2xl">♟️</span>
      <span class="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        nFactorial Chess
      </span>
    </NuxtLink>
    
    <div class="flex items-center gap-6">
      <div class="hidden md:flex items-center gap-6 mr-4 border-r border-white/10 pr-6">
        <NuxtLink 
          to="/play" 
          :class="[route.path === '/play' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white transition-colors']"
          class="text-sm"
        >
          Play
        </NuxtLink>
        <NuxtLink 
          to="/leaderboard" 
          :class="[route.path === '/leaderboard' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white transition-colors']"
          class="text-sm"
        >
          Leaderboard
        </NuxtLink>
      </div>
      
      <LanguageSelector />

      <!-- Buy button: only for logged-in free users -->
      <NuxtLink
        v-if="isMounted && user && !profileStore.isPro"
        to="/upgrade"
        class="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 px-3 py-1.5 text-xs font-bold text-black shadow-md shadow-yellow-900/30 hover:from-yellow-400 hover:to-amber-500 transition-all"
      >
        👑 Royal Pass
      </NuxtLink>

      <template v-if="user">
        <NuxtLink to="/profile" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <!-- Avatar with gold ring + crown for Pro users -->
          <div class="relative flex-shrink-0">
            <UiAvatar
              :src="profileStore.avatarUrl"
              :fallback="profileStore.initials"
              size="sm"
              :class="isMounted && profileStore.isPro ? 'ring-2 ring-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] rounded-full' : ''"
            />
            <span v-if="isMounted && profileStore.isPro" class="absolute -top-2 -right-1.5 text-xs leading-none">👑</span>
          </div>

          <!-- Name: gold + "Royal Pass" label for Pro, plain for free -->
          <span v-if="isMounted && profileStore.isPro" class="hidden sm:flex flex-col leading-tight">
            <span class="text-sm font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
              {{ profileStore.fullName || user?.email }}
            </span>
            <span class="text-[10px] font-bold tracking-widest uppercase text-yellow-500/80">Royal Pass</span>
          </span>
          <span v-else class="text-slate-300 text-sm hidden sm:inline">
            {{ profileStore.fullName || user?.email }}
          </span>
        </NuxtLink>
        <UiButton variant="outline" size="sm" @click="handleLogout">Sign Out</UiButton>
      </template>
      <template v-else>
        <AuthActionButton to="/auth/login" labelKey="log_in" />
        <AuthActionButton to="/auth/register" labelKey="sign_up" />
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import LanguageSelector from '~/components/common/LanguageSelector/LanguageSelector.vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const user = useSupabaseUser()
const route = useRoute()
const isMounted = ref(false)

onMounted(() => { isMounted.value = true })

const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/login')
}
</script>
