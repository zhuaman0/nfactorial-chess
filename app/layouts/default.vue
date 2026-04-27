<template>
  <div class="min-h-screen flex flex-col">
    <LayoutHeader />
    <div class="flex-1">
      <slot />
    </div>
    <ChatPanel />
    <LayoutFooter />
    <KingsAdvisor />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chat'
import { useProfileStore } from '~/stores/profile'

const chatStore    = useChatStore()
const profileStore = useProfileStore()
const user         = useSupabaseUser()

onMounted(async () => {
  if (user.value) {
    chatStore.subscribeGlobal()
    await profileStore.fetchProfile()
  }
})

watch(user, async (u) => {
  if (u) {
    chatStore.subscribeGlobal()
    await profileStore.fetchProfile()
  } else {
    chatStore.unsubscribeGlobal()
  }
})

onUnmounted(() => chatStore.unsubscribeGlobal())
</script>
