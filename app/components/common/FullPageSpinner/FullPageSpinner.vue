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
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/85 backdrop-blur-md"
        :aria-label="label || 'Loading'"
        role="status"
        aria-live="polite"
      >
        <div class="flex flex-col items-center gap-5">
          <!-- Conic ring spinner -->
          <div class="relative w-18 h-18 flex items-center justify-center">
            <div class="w-[72px] h-[72px] rounded-full animate-spin shadow-[0_0_24px_rgba(249,115,22,0.35)]"
              style="background: conic-gradient(from 0deg, #f97316 0%, #fb923c 25%, transparent 60%)"
            >
              <!-- Inner cutout -->
              <div class="absolute inset-[9px] rounded-full bg-white" />
            </div>
          </div>

          <p v-if="label" class="text-sm font-medium text-gray-500 tracking-wide font-[Inter,sans-serif] m-0">
            {{ label }}
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
}>(), {
  visible: true,
  label: '',
})
</script>
