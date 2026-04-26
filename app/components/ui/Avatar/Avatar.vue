<template>
  <div 
    :class="[
      'relative rounded-full overflow-hidden flex items-center justify-center font-bold text-white',
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      sizeClasses,
    ]"
  >
    <img 
      v-if="src" 
      :src="src" 
      :alt="alt" 
      class="w-full h-full object-cover"
    />
    <span v-else :class="textSizeClass">{{ fallback }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Avatar'
  },
  fallback: {
    type: String,
    default: '?'
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
    default: 'md'
  }
})

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  }
  return sizes[props.size]
})

const textSizeClass = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
    xl: 'text-4xl',
  }
  return sizes[props.size]
})
</script>
