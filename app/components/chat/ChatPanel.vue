<template>
  <Transition name="chat-slide">
    <div
      v-if="chatStore.openFriend"
      class="fixed bottom-0 right-6 z-50 w-80 flex flex-col rounded-t-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden"
      style="max-height: 520px"
    >
      <!-- Header -->
      <div
        class="flex items-center gap-3 px-4 py-3 bg-slate-800 border-b border-white/10 cursor-pointer select-none"
        @click="chatStore.toggleMinimize()"
      >
        <UiAvatar
          :src="chatStore.openFriend.avatar_url"
          :fallback="chatStore.openFriend.initials"
          size="sm"
        />
        <div class="flex-1 min-w-0">
          <p class="text-white text-sm font-semibold truncate leading-tight">{{ chatStore.openFriend.fullName }}</p>
          <p class="text-emerald-400 text-xs leading-tight">Online</p>
        </div>
        <button
          class="p-1 text-slate-400 hover:text-white transition-colors"
          @click.stop="chatStore.close()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body (hidden when minimized) -->
      <template v-if="!chatStore.minimized">
        <!-- Messages -->
        <div
          ref="messagesEl"
          class="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-900/95 backdrop-blur-xl"
          style="min-height: 320px; max-height: 380px"
        >
          <div v-if="chatStore.loading" class="flex justify-center pt-8">
            <div class="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
          </div>

          <template v-else>
            <div v-if="chatStore.messages.length === 0" class="text-center text-slate-500 text-xs pt-10">
              No messages yet. Say hello! 👋
            </div>

            <div
              v-for="msg in chatStore.messages"
              :key="msg.id"
              class="flex"
              :class="msg.sender_id === myId ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words"
                :class="msg.sender_id === myId
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-700 text-slate-100 rounded-bl-sm'"
              >
                {{ msg.content }}
                <div class="text-[10px] mt-0.5 opacity-60 text-right">
                  {{ formatTime(msg.created_at) }}
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Input -->
        <div class="flex items-center gap-2 px-3 py-2.5 bg-slate-800 border-t border-white/10">
          <input
            v-model="draft"
            type="text"
            placeholder="Write a message…"
            maxlength="2000"
            class="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50 transition-colors"
            @keydown.enter.exact.prevent="send"
          />
          <button
            :disabled="!draft.trim() || chatStore.sending"
            class="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            @click="send"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </template>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chat'

const chatStore = useChatStore()
const user      = useSupabaseUser()
const myId      = computed(() => user.value?.id ?? '')

const draft      = ref('')
const messagesEl = ref<HTMLElement | null>(null)

const send = async () => {
  if (!draft.value.trim()) return
  const text = draft.value
  draft.value = ''
  await chatStore.sendMessage(text)
}

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Auto-scroll to bottom when messages change
watch(
  () => chatStore.messages.length,
  async () => {
    await nextTick()
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  }
)
</script>

<style scoped>
.chat-slide-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.chat-slide-leave-active { transition: all 0.2s ease; }
.chat-slide-enter-from, .chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}
</style>
