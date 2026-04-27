<template>
  <component 
    :is="to ? NuxtLink : 'button'"
    :to="to"
    :type="!to ? type : undefined" 
    :class="[
      'inline-flex items-center justify-center rounded-lg font-semibold cursor-pointer',
      'transition-all duration-200 ease-in-out relative font-sans',
      'active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-center',
      sizeClasses,
      variantClasses,
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="absolute w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
    <span :class="{ 'opacity-0': loading }">
      <slot></slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import type { PropType } from 'vue'

const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps({
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  },
  variant: {
    type: String as PropType<'primary' | 'outline' | 'primary-dark' | 'outline-dark' | 'secondary'>,
    default: 'primary'
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  to: {
    type: String,
    default: undefined
  }
})

const sizeClasses = computed(() => {
  const map: Record<string, string> = {
    sm: 'py-1.5 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-3.5 px-8 text-lg',
  }
  return map[props.size]
})

const variantClasses = computed(() => {
  if (props.variant === 'primary') {
    return 'bg-blue-500 text-white border-none hover:bg-blue-600'
  }
  if (props.variant === 'secondary') {
    return 'bg-gray-100 text-gray-700 border-none hover:bg-gray-200'
  }
  if (props.variant === 'primary-dark') {
    return 'bg-white text-slate-900 border-none hover:bg-slate-100'
  }
  if (props.variant === 'outline-dark') {
    return 'bg-transparent border border-slate-900 text-slate-900 hover:bg-slate-900/10'
  }
  return 'bg-transparent border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
})
</script>
