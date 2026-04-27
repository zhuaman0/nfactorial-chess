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


      <template v-if="user">
        <NuxtLink to="/profile" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <UiAvatar 
            :src="profileStore.avatarUrl" 
            :fallback="profileStore.initials" 
            size="sm" 
          />
          <span class="text-slate-300 text-sm hidden sm:inline">
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

const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/login')
}
</script>
