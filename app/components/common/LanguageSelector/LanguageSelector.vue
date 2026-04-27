<template>
  <UiDropdown align="right">
    <template #trigger>
      <button class="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100" aria-label="Select Language">
        <FlagIcon :flag="currentFlag" class="text-xl" />
      </button>
    </template>

    <UiDropdownItem 
      v-for="lang in LANGUAGES" 
      :key="lang.code"
      @click="selectLanguage(lang.code)"
      :class="{ 'bg-white/10 text-white': currentLocaleCode === lang.code }"
    >
      <FlagIcon :flag="lang.flag" class="text-base mr-2" />
      {{ lang.label }}
    </UiDropdownItem>
  </UiDropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNuxtApp } from '#imports'
import { LANGUAGES } from './constants'
import FlagIcon from './FlagIcon.vue'

const nuxtApp = useNuxtApp()

const currentLocaleCode = computed(() => {
  const loc = nuxtApp.$locale
  return (loc && loc.value ? loc.value : loc) || 'en'
})

const currentFlag = computed(() => {
  return LANGUAGES.find(l => l.code === currentLocaleCode.value)?.flag || '🇬🇧'
})

const selectLanguage = (code: string) => {
  if (nuxtApp.$setLocale) {
    nuxtApp.$setLocale(code)
  }
}
</script>
