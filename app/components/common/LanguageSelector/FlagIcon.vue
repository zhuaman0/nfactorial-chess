<template>
  <span class="leading-none">{{ flag }}</span>
</template>

<script setup lang="ts">
defineProps<{
  flag: string
}>()
</script>
