<template>
  <div class="p-4 mt-6 pb-16">
    <main class="max-w-2xl mx-auto flex flex-col gap-6">

      <!-- Profile Card -->
      <div class="bg-slate-800/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg overflow-hidden">

        <!-- Profile Header -->
        <div class="relative h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div class="absolute -bottom-12 left-8">
            <div class="relative group cursor-pointer" @click="triggerFileInput">
              <UiAvatar
                :src="avatarSrc"
                :fallback="profileStore.initials"
                size="xl"
              />
              <div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span v-if="profileStore.uploading" class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
              />
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="pt-16 px-8 pb-8">
          <h1 class="text-2xl font-bold text-white mb-1">Edit Profile</h1>
          <p class="text-slate-400 text-sm mb-8">Update your personal information</p>

          <form @submit.prevent="handleSave" class="space-y-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UiInput
                id="firstName"
                v-model="firstName"
                label="First Name"
                placeholder="Magnus"
              />
              <UiInput
                id="lastName"
                v-model="lastName"
                label="Last Name"
                placeholder="Carlsen"
              />
            </div>

            <div class="mb-6">
              <label class="block mb-2 text-sm font-medium text-slate-400">Email</label>
              <div class="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-slate-500 cursor-not-allowed">
                {{ userEmail }}
              </div>
            </div>

            <div class="flex gap-4 pt-2">
              <UiButton type="submit" variant="primary" :loading="profileStore.loading">
                Save Changes
              </UiButton>
            </div>

            <p v-if="profileStore.successMsg" class="text-emerald-400 text-sm mt-3 text-center">
              {{ profileStore.successMsg }}
            </p>
            <p v-if="profileStore.errorMsg" class="text-red-400 text-sm mt-3 text-center">
              {{ profileStore.errorMsg }}
            </p>
          </form>
        </div>
      </div>

      <!-- XP Stats Card -->
      <div class="bg-slate-800/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6">
        <h2 class="text-lg font-bold text-white mb-4">Quest Progress</h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-slate-900/60 border border-yellow-500/20 rounded-xl p-4 text-center">
            <p class="text-yellow-400 text-3xl font-black">{{ profileStore.profile?.points ?? 0 }}</p>
            <p class="text-slate-500 text-xs mt-1">Total XP</p>
          </div>
          <div class="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p class="text-emerald-400 text-3xl font-black">{{ questsStore.completedCount }}</p>
            <p class="text-slate-500 text-xs mt-1">Completed</p>
          </div>
          <div class="bg-slate-900/60 border border-orange-500/20 rounded-xl p-4 text-center">
            <p class="text-orange-400 text-3xl font-black">{{ questsStore.quests.length }}</p>
            <p class="text-slate-500 text-xs mt-1">Total Quests</p>
          </div>
        </div>
      </div>

      <!-- Completed Quests List -->
      <div class="bg-slate-800/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6">
        <h2 class="text-lg font-bold text-white mb-4">Completed Quests</h2>

        <div v-if="questsStore.loading" class="flex justify-center py-8">
          <div class="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="completedQuests.length === 0" class="text-center py-10">
          <p class="text-4xl mb-3">⚔️</p>
          <p class="text-slate-400 font-medium">No completed quests yet</p>
          <p class="text-slate-600 text-sm mt-1">Head to the quests page to start earning XP!</p>
          <UiButton variant="primary" class="!w-auto px-6 mt-4" @click="navigateTo('/quests')">
            Browse Quests
          </UiButton>
        </div>

        <div v-else class="flex flex-col gap-3">
          <div
            v-for="item in completedQuests"
            :key="item.quest.id"
            class="flex items-center gap-4 bg-slate-900/60 border border-emerald-500/20 rounded-xl px-4 py-3"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-emerald-500/10 border border-emerald-500/30 flex-shrink-0">
              {{ item.quest.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold text-sm truncate">{{ item.quest.title }}</p>
              <p class="text-slate-500 text-xs capitalize">{{ item.quest.level }} · {{ item.quest.category }}</p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <span class="text-yellow-400 text-sm">⭐</span>
              <span class="text-yellow-400 font-bold text-sm">+{{ item.userQuest.score }} XP</span>
            </div>
            <svg class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import { useQuestsStore } from '~/stores/quests'

definePageMeta({
  middleware: 'auth'
})

const profileStore = useProfileStore()
const questsStore = useQuestsStore()
const user = useSupabaseUser()

const firstName = ref('')
const lastName = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const userEmail = computed(() => user.value?.email || '')
const avatarSrc = computed(() => {
  const meta = user.value?.user_metadata || {}
  return profileStore.avatarUrl || meta.picture || meta.avatar_url || ''
})

const completedQuests = computed(() =>
  questsStore.userQuests
    .filter(uq => uq.status === 'completed')
    .map(uq => ({
      userQuest: uq,
      quest: questsStore.getQuestById(uq.quest_id),
    }))
    .filter(item => item.quest != null) as { userQuest: typeof questsStore.userQuests[0], quest: NonNullable<ReturnType<typeof questsStore.getQuestById>> }[]
)

onMounted(async () => {
  await Promise.all([
    profileStore.fetchProfile(),
    questsStore.fetchQuests(),
  ])

  if (!profileStore.profile?.first_name && !profileStore.profile?.last_name && user.value) {
    await profileStore.syncFromOAuth(user.value)
  }

  const meta = user.value?.user_metadata || {}
  firstName.value = profileStore.profile?.first_name || meta.given_name || meta.name?.split(' ')[0] || ''
  lastName.value = profileStore.profile?.last_name || meta.family_name || meta.name?.split(' ').slice(1).join(' ') || ''
})

const handleSave = async () => {
  await profileStore.updateProfile(firstName.value, lastName.value)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    profileStore.errorMsg = 'Image must be smaller than 2MB'
    return
  }

  await profileStore.uploadAvatar(file)
}
</script>
