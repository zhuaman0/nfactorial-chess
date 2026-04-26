<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors duration-100"
    :class="danger
      ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
      : 'text-slate-300 hover:text-white hover:bg-white/8'"
  >
    <span v-if="icon" class="text-base leading-none">{{ icon }}</span>
    <slot />
  </NuxtLink>

  <button
    v-else
    type="button"
    class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors duration-100"
    :class="danger
      ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
      : 'text-slate-300 hover:text-white hover:bg-white/8'"
    @click="$emit('click')"
  >
    <span v-if="icon" class="text-base leading-none">{{ icon }}</span>
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps({
  to:     { type: String,  default: undefined },
  icon:   { type: String,  default: undefined },
  danger: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>
