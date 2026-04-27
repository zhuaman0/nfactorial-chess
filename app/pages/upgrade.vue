<template>
  <div class="min-h-screen bg-stone-950 p-6">
    <div class="mx-auto max-w-md pt-12">
      <NuxtLink to="/" class="mb-8 inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-200">
        ← Back to Siege
      </NuxtLink>
      <ClientOnly>
        <div v-if="profileStore.isPro" class="rounded-2xl border border-yellow-500/30 bg-stone-900 p-8 text-center">
          <p class="text-4xl mb-3">👑</p>
          <p class="font-bold text-yellow-400 text-lg">You already have the Royal Pass!</p>
          <NuxtLink to="/" class="mt-4 inline-block text-sm text-stone-400 hover:text-white">← Back to home</NuxtLink>
        </div>
        <UpgradeToPro v-else />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
definePageMeta({ name: 'Upgrade', middleware: 'auth' })
const profileStore = useProfileStore()
</script>
