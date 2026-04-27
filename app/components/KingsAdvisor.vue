<template>
  <Transition name="advisor">
    <div
      v-if="visible"
      class="fixed bottom-6 left-6 z-50 flex flex-row-reverse items-end gap-3 max-w-xs pointer-events-none"
    >
      <!-- Speech bubble -->
      <div
        class="relative flex-1 rounded-2xl rounded-bl-none p-4 shadow-2xl border pointer-events-auto"
        :class="bubbleClass"
      >
        <!-- Bubble tail -->
        <div
          class="absolute -bottom-2 left-0 w-4 h-4 rotate-45 border-l border-b"
          :class="tailClass"
        ></div>

        <p class="text-[10px] font-extrabold uppercase tracking-widest mb-1.5" :class="labelClass">
          ⚔️ King's Advisor
        </p>
        <p class="text-sm leading-snug font-medium" :class="textClass">
          {{ message }}
        </p>

        <button
          class="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-40 hover:opacity-100 transition-opacity pointer-events-auto"
          :class="closeClass"
          @click="hide"
        >✕</button>
      </div>

      <!-- Mascot avatar -->
      <div
        class="relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border-2 flex-shrink-0 select-none pointer-events-auto"
        :class="mascotClass"
      >
        {{ mascotEmoji }}
        <!-- Pulsing ring on panic -->
        <div
          v-if="emotion === 'panic'"
          class="absolute inset-0 rounded-2xl border-2 border-red-500/70 animate-ping"
        ></div>
        <!-- Glow on praise -->
        <div
          v-if="emotion === 'praise'"
          class="absolute inset-0 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.5)]"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { visible, message, emotion, hide } = useAdvisor()

const mascotEmoji = computed(() => {
  if (emotion.value === 'panic')  return '😱'
  if (emotion.value === 'praise') return '👑'
  return '🧙'
})

const bubbleClass = computed(() => {
  if (emotion.value === 'panic')  return 'bg-red-950/95 border-red-500/50 backdrop-blur-md'
  if (emotion.value === 'praise') return 'bg-amber-950/95 border-amber-400/50 backdrop-blur-md'
  return 'bg-slate-900/95 border-orange-500/40 backdrop-blur-md'
})

const tailClass = computed(() => {
  if (emotion.value === 'panic')  return 'bg-red-950/95 border-red-500/50'
  if (emotion.value === 'praise') return 'bg-amber-950/95 border-amber-400/50'
  return 'bg-slate-900/95 border-orange-500/40'
})

const mascotClass = computed(() => {
  if (emotion.value === 'panic')  return 'bg-red-900/80 border-red-500/60'
  if (emotion.value === 'praise') return 'bg-amber-900/80 border-amber-400/60'
  return 'bg-slate-800 border-orange-500/40'
})

const labelClass = computed(() => {
  if (emotion.value === 'panic')  return 'text-red-400'
  if (emotion.value === 'praise') return 'text-amber-400'
  return 'text-orange-400'
})

const textClass = computed(() => {
  if (emotion.value === 'panic')  return 'text-red-100'
  if (emotion.value === 'praise') return 'text-amber-100'
  return 'text-slate-200'
})

const closeClass = computed(() => {
  if (emotion.value === 'panic')  return 'text-red-300 hover:bg-red-800/50'
  if (emotion.value === 'praise') return 'text-amber-300 hover:bg-amber-800/50'
  return 'text-slate-300 hover:bg-slate-700'
})
</script>

<style scoped>
.advisor-enter-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.advisor-leave-active {
  transition: transform 0.25s ease-in, opacity 0.2s ease;
}
.advisor-enter-from,
.advisor-leave-to {
  transform: translateY(120%);
  opacity: 0;
}
</style>
