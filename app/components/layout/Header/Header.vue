<template>
  <header class="sticky top-0 z-40 px-4 pt-4">
    <div
      class="flex items-center justify-between px-5 py-3
            bg-white border border-slate-900/100 backdrop-blur-xl
            rounded-2xl
            max-w-7xl mx-auto"
    >
      <LayoutHeaderLogo />
      <LayoutHeaderNav />

      <div class="flex items-center gap-2">
        <LayoutHeaderAuth v-if="!user" />
        <LayoutHeaderUserDropdown v-else />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
</script>
