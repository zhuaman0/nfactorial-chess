<template>
  <div class="p-4 pb-16">
    <main class="max-w-7xl mx-auto mt-6 flex flex-col gap-10">
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeStreakSection />
      <HomeQuestsSection />
      <HomeMeetSection />
      <HomeAiCoachSection />
      <HomeTournamentSection />
      <div v-if="isMounted && !profileStore.isPro" class="max-w-md mx-auto w-full">
        <UpgradeToPro />
      </div>
      <HomeNewsSection />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

definePageMeta({
  name: 'Home',
  
})

const profileStore = useProfileStore()
const isMounted = ref(false)

onMounted(async () => {
  await profileStore.fetchProfile()
  isMounted.value = true
  profileStore.checkin()
})
</script>
