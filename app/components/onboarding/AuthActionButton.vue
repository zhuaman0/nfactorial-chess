<template>
  <Button size="sm" variant="secondary" :to="to" class="w-full">
    {{ $t(`onboarding.${labelKey}`) }}
  </Button>
</template>

<script setup lang="ts">
// Nuxt auto-imports the `Button` component from `~/components/ui/Button/Button.vue`
defineProps<{
  to: string;
  labelKey: 'sign_up' | 'log_in';
}>()
</script>
