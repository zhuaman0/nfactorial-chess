<template>
  <div class="relative" @mouseenter="open = true" @mouseleave="open = false">
    <slot name="trigger" />

    <Transition name="dropdown">
      <div
        v-if="open"
        :class="[
          'absolute top-full z-50 mt-2',
          align === 'right' ? 'right-0' : 'left-0',
          'min-w-52 rounded-xl overflow-hidden',
          'bg-slate-900/95 backdrop-blur-xl',
          'border border-white/10 shadow-2xl shadow-black/40',
        ]"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps({
  align: {
    type: String as PropType<'left' | 'right'>,
    default: 'right',
  },
})

const open = ref(false)
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
