<template>
  <div class="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl transition-colors">
    <!-- Avatar -->
    <UiAvatar :src="user.avatar_url" :fallback="user.initials" size="sm" />

    <!-- Name -->
    <div class="flex-1 min-w-0">
      <p class="text-white text-sm font-semibold truncate">{{ user.fullName }}</p>
      <p v-if="subtitle" class="text-slate-500 text-xs truncate">{{ subtitle }}</p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 shrink-0">
      <!-- No relation → Add Friend -->
      <template v-if="!friendship">
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs font-semibold transition-colors"
          @click="$emit('add', user.id)"
        >
          <span>+ Add</span>
        </button>
      </template>

      <!-- Pending outgoing -->
      <template v-else-if="friendship.status === 'pending' && friendship.isSentByMe">
        <span class="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-400 text-xs font-medium">Pending</span>
        <button
          class="px-2 py-1.5 rounded-lg text-slate-500 hover:bg-white/8 text-xs transition-colors"
          title="Cancel request"
          @click="$emit('cancel', friendship.id)"
        >✕</button>
      </template>

      <!-- Pending incoming -->
      <template v-else-if="friendship.status === 'pending' && !friendship.isSentByMe">
        <button
          class="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold transition-colors"
          @click="$emit('accept', friendship.id)"
        >Accept</button>
        <button
          class="px-2 py-1.5 rounded-lg text-slate-500 hover:bg-white/8 text-xs transition-colors"
          @click="$emit('decline', friendship.id)"
        >✕</button>
      </template>

      <!-- Accepted → Message + Remove -->
      <template v-else-if="friendship.status === 'accepted'">
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs font-semibold transition-colors"
          @click="$emit('message', user)"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Message
        </button>
        <button
          class="px-2 py-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors"
          title="Remove friend"
          @click="$emit('remove', friendship.id)"
        >✕</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FriendProfile, Friendship } from '~/stores/friends'

const props = defineProps<{
  user:       FriendProfile
  friendship: Friendship | null
  subtitle?:  string
}>()

defineEmits<{
  add:     [userId: string]
  accept:  [friendshipId: string]
  decline: [friendshipId: string]
  cancel:  [friendshipId: string]
  remove:  [friendshipId: string]
  message: [user: FriendProfile]
}>()
</script>
