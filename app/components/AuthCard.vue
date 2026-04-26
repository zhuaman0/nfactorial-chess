<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md p-8 bg-surface backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg">
      <h1 class="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        {{ title }}
      </h1>
      <p class="text-center text-slate-400 mb-8 text-sm">
        {{ subtitle }}
      </p>
      
      <slot></slot>
      
      <div class="mt-6 text-center text-sm">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  }
})
</script>
