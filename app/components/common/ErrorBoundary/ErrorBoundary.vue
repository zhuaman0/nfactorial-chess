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
        class="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-gray-50/90 backdrop-blur-md"
        role="alertdialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="bg-white rounded-3xl px-12 py-11 w-full max-w-md flex flex-col items-center gap-4 shadow-2xl animate-[pop_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">

          <!-- Icon -->
          <div class="w-18 h-18 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center">
            <svg class="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <!-- Text -->
          <h2 class="text-xl font-bold text-gray-900 text-center m-0 font-[Inter,sans-serif]">
            {{ title }}
          </h2>
          <p class="text-sm text-gray-500 text-center leading-relaxed m-0 font-[Inter,sans-serif]">
            {{ message }}
          </p>

          <!-- Collapsible error detail -->
          <details v-if="errorDetail" class="w-full">
            <summary class="text-xs text-gray-400 cursor-pointer text-center list-none select-none hover:text-orange-500 transition-colors duration-150">
              View error details
            </summary>
            <pre class="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-[11px] text-red-500 whitespace-pre-wrap break-all max-h-28 overflow-y-auto font-mono">{{ errorDetail }}</pre>
          </details>

          <!-- Actions -->
          <div class="flex gap-3 flex-wrap justify-center mt-1">
            <button
              v-if="showRetry"
              id="error-boundary-retry-btn"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-orange-500 to-orange-400 shadow-[0_4px_14px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:opacity-85 transition-all duration-150 cursor-pointer border-0"
              @click="emit('retry')"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Try Again
            </button>

            <button
              v-if="showGoHome"
              id="error-boundary-home-btn"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:opacity-85 transition-all duration-150 cursor-pointer border-0"
              @click="goHome"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Go Home
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const router = useRouter()

withDefaults(defineProps<{
  visible?: boolean
  title?: string
  message?: string
  errorDetail?: string
  showRetry?: boolean
  showGoHome?: boolean
}>(), {
  visible: true,
  title: 'Something went wrong',
  message: 'An unexpected error occurred. Please try again or return to the homepage.',
  errorDetail: '',
  showRetry: true,
  showGoHome: true,
})

const emit = defineEmits<{
  (e: 'retry'): void
}>()

function goHome() {
  router.push('/')
}
</script>

<style>
@keyframes pop {
  from { transform: scale(0.85); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}
</style>
