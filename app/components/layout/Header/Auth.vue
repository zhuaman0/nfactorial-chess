<template>
  <div class="flex items-center gap-2">
    <UiButton variant="outline" size="sm" @click="navigateTo('/login')">
      Login
    </UiButton>
    <UiButton variant="primary" size="sm" @click="navigateTo('/register')">
      Register
    </UiButton>
  </div>
</template>
