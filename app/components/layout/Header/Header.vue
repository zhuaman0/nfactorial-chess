<template>
  <header class="sticky top-0 z-40 px-4 pt-4">
    <div
      class="flex items-center justify-between px-5 py-3
            bg-white border border-slate-900/100 backdrop-blur-xl
            rounded-2xl
            max-w-7xl mx-auto"
    >
      <LayoutHeaderLogo />
      <LayoutHeaderNav />

      <div class="flex items-center gap-2">
        <LanguageSelector />

        <template v-if="user">
          <!-- Free user: show buy button -->
          <NuxtLink
            v-if="isMounted && !profileStore.isPro"
            to="/upgrade"
            class="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 px-3 py-1.5 text-xs font-bold text-black shadow-md hover:from-yellow-400 hover:to-amber-500 transition-all"
          >
            👑 Royal Pass
          </NuxtLink>

          <!-- Pro user: show badge -->
          <span
            v-else-if="isMounted && profileStore.isPro"
            class="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-3 py-1.5 text-xs font-bold text-yellow-500"
          >
            👑 PRO
          </span>

          <LayoutHeaderNotificationBell />
          <LayoutHeaderUserDropdown />
        </template>

        <LayoutHeaderAuth v-else />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import LanguageSelector from '~/components/common/LanguageSelector/LanguageSelector.vue'
import { useProfileStore } from '~/stores/profile'

const user         = useSupabaseUser()
const profileStore = useProfileStore()
const isMounted    = ref(false)

onMounted(() => { isMounted.value = true })
</script>
