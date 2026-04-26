<template>
  <div class="mb-6">
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium text-slate-400">
      {{ label }}
    </label>
    <input 
      :id="id"
      :type="type" 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white font-sans
             transition-all duration-200 ease-in-out
             focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
             placeholder:text-slate-500"
      :placeholder="placeholder" 
      :required="required"
      :minlength="minlength"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  minlength: {
    type: [Number, String],
    default: undefined
  }
})

defineEmits(['update:modelValue'])
</script>
