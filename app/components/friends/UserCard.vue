<template>
  <div class="relative overflow-hidden flex items-center gap-4 p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/8 hover:border-orange-500/30 rounded-2xl transition-all duration-200 group">
    <!-- Subtle glow on hover -->
    <div class="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/3 rounded-2xl transition-colors pointer-events-none"></div>

    <!-- Avatar -->
    <div class="relative flex-shrink-0">
      <UiAvatar :src="user.avatar_url" :fallback="user.initials" size="md" />
      <!-- Online dot (decorative) -->
      <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></div>
    </div>

    <!-- Info -->
    <div class="relative flex-1 min-w-0">
      <p class="text-white font-bold text-sm truncate leading-tight">{{ user.fullName }}</p>
      <p v-if="subtitle" class="text-slate-500 text-xs truncate mt-0.5">{{ subtitle }}</p>
      <p v-else class="text-slate-600 text-xs mt-0.5">Chess Player</p>
    </div>

    <!-- Actions -->
    <div class="relative flex items-center gap-2 shrink-0">

      <!-- No relation → Add Friend -->
      <template v-if="!friendship">
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 text-xs font-bold transition-all"
          @click="$emit('add', user.id)"
        >
          + Add
        </button>
      </template>

      <!-- Pending outgoing -->
      <template v-else-if="friendship.status === 'pending' && friendship.isSentByMe">
        <span class="px-3 py-1.5 rounded-xl bg-slate-700/60 border border-white/8 text-slate-400 text-xs font-medium">Pending…</span>
        <button
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
          title="Cancel request"
          @click="$emit('cancel', friendship.id)"
        >✕</button>
      </template>

      <!-- Pending incoming -->
      <template v-else-if="friendship.status === 'pending' && !friendship.isSentByMe">
        <button
          class="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition-all"
          @click="$emit('accept', friendship.id)"
        >Accept</button>
        <button
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
          @click="$emit('decline', friendship.id)"
        >✕</button>
      </template>

      <!-- Accepted → Message + Remove -->
      <template v-else-if="friendship.status === 'accepted'">
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 text-xs font-bold transition-all"
          @click="$emit('message', user)"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat
        </button>
        <button
          class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
          title="Remove friend"
          @click="$emit('remove', friendship.id)"
        >✕</button>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { FriendProfile, Friendship } from '~/stores/friends'

defineProps<{
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
