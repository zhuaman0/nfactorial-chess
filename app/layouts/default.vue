<template>
  <div class="min-h-screen flex flex-col">
    <LayoutHeader />
    <div class="flex-1">
      <slot />
    </div>
    <ChatPanel />
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chat'

const chatStore = useChatStore()
const user      = useSupabaseUser()

// Start global realtime subscription for incoming messages
onMounted(() => {
  if (user.value) chatStore.subscribeGlobal()
})

watch(user, (u) => {
  if (u) chatStore.subscribeGlobal()
  else   chatStore.unsubscribeGlobal()
})

onUnmounted(() => chatStore.unsubscribeGlobal())
</script>
