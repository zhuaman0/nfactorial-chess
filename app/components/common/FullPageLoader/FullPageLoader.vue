<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50/90 backdrop-blur-md"
        role="status"
        aria-live="polite"
        :aria-label="label || 'Loading…'"
      >
        <div class="bg-white rounded-2xl px-12 py-10 min-w-[260px] flex flex-col items-center gap-5 shadow-[0_4px_6px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.10)]">

          <!-- Chess king icon with pulse -->
          <div class="relative w-16 h-16 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-orange-100 animate-ping opacity-60" />
            <svg
              class="relative w-10 h-10 text-orange-500 animate-bounce"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="24" y="4" width="16" height="6" rx="3" fill="currentColor"/>
              <rect x="29" y="1" width="6" height="12" rx="3" fill="currentColor"/>
              <rect x="16" y="20" width="32" height="8" rx="2" fill="currentColor"/>
              <path d="M12 56 L20 28 H44 L52 56 Z" fill="currentColor"/>
            </svg>
          </div>

          <!-- Sliding progress bar -->
          <div class="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full w-2/5 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 animate-[slide_1.6s_ease-in-out_infinite]" />
          </div>

          <!-- Labels -->
          <p class="text-[15px] font-semibold text-gray-900 m-0 text-center font-[Inter,sans-serif]">
            {{ label || 'Loading…' }}
          </p>
          <p v-if="subtitle" class="text-[13px] text-gray-400 m-0 text-center font-[Inter,sans-serif]">
            {{ subtitle }}
          </p>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  visible?: boolean
  label?: string
  subtitle?: string
}>(), {
  visible: true,
  label: 'Loading…',
  subtitle: '',
})
</script>

<style>
@keyframes slide {
  0%   { transform: translateX(-120%); }
  50%  { transform: translateX(50%);   }
  100% { transform: translateX(280%);  }
}
</style>
