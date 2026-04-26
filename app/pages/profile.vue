<template>
  <div class="p-4 pb-16">
    <main class="max-w-7xl mx-auto mt-6 flex flex-col gap-6">

      <!-- ── Top Banner ──────────────────────────────────────────────────── -->
      <div class="relative overflow-hidden rounded-3xl h-44 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 shadow-2xl">
        <div class="absolute inset-0 opacity-10" :style="chessBoardBg"></div>
        <div class="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-orange-800/30 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative h-full flex items-end px-10 pb-6 gap-6">
          <!-- Avatar -->
          <div class="relative group cursor-pointer flex-shrink-0 -mb-14" @click="triggerFileInput">
            <div class="ring-4 ring-orange-500/60 rounded-full shadow-2xl">
              <UiAvatar :src="avatarSrc" :fallback="profileStore.initials" size="xl" />
            </div>
            <div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span v-if="profileStore.uploading" class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
          </div>
          <!-- Name + email -->
          <div class="pb-1">
            <h1 class="text-3xl font-extrabold text-white drop-shadow-lg">{{ profileStore.fullName || 'Your Name' }}</h1>
            <p class="text-orange-100/80 text-sm">{{ userEmail }}</p>
          </div>
        </div>
      </div>

      <!-- ── Stats Row ───────────────────────────────────────────────────── -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div class="bg-slate-800 border border-orange-500/20 rounded-2xl p-5 text-center">
          <p class="text-orange-400 text-3xl font-black">{{ profileStore.profile?.points ?? 0 }}</p>
          <p class="text-slate-400 text-xs mt-1 uppercase tracking-wide">Total XP</p>
        </div>
        <div class="bg-slate-800 border border-orange-500/20 rounded-2xl p-5 text-center">
          <p class="text-orange-400 text-3xl font-black">{{ friendsStore.friends.length }}</p>
          <p class="text-slate-400 text-xs mt-1 uppercase tracking-wide">Friend{{ friendsStore.friends.length !== 1 ? 's' : '' }}</p>
        </div>
        <div class="bg-slate-800 border border-orange-500/20 rounded-2xl p-5 text-center">
          <p class="text-orange-400 text-3xl font-black">{{ questsStore.completedCount }}</p>
          <p class="text-slate-400 text-xs mt-1 uppercase tracking-wide">Quests Done</p>
        </div>
        <div class="bg-slate-800 border border-orange-500/20 rounded-2xl p-5 text-center">
          <p class="text-orange-400 text-3xl font-black">{{ questsStore.quests.length }}</p>
          <p class="text-slate-400 text-xs mt-1 uppercase tracking-wide">Total Quests</p>
        </div>
      </div>

      <!-- ── Two-column layout ──────────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- ── LEFT: Edit Profile ──────────────────────────────────────── -->
        <div class="lg:col-span-1 flex flex-col gap-6">

          <!-- Edit Card -->
          <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-7 shadow-2xl">
            <div class="absolute -top-10 -right-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative">
              <div class="flex items-center gap-2 mb-5">
                <span class="text-xl">✏️</span>
                <h2 class="text-lg font-extrabold text-white">Edit Profile</h2>
              </div>
              <form @submit.prevent="handleSave" class="flex flex-col gap-4">
                <UiInput id="firstName" v-model="firstName" label="First Name" placeholder="Magnus" />
                <UiInput id="lastName"  v-model="lastName"  label="Last Name"  placeholder="Carlsen" />
                <div>
                  <label class="block mb-2 text-sm font-medium text-slate-400">Email</label>
                  <div class="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-lg text-slate-500 text-sm cursor-not-allowed">
                    {{ userEmail }}
                  </div>
                </div>
                <UiButton type="submit" variant="primary" :loading="profileStore.loading">
                  Save Changes
                </UiButton>
                <p v-if="profileStore.successMsg" class="text-emerald-400 text-sm text-center">{{ profileStore.successMsg }}</p>
                <p v-if="profileStore.errorMsg"   class="text-red-400   text-sm text-center">{{ profileStore.errorMsg }}</p>
              </form>
            </div>
          </div>

          <!-- Friends Card -->
          <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-7 shadow-2xl">
            <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-2">
                  <span class="text-xl">👥</span>
                  <h2 class="text-lg font-extrabold text-white">Friends</h2>
                  <span class="px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold rounded-full">
                    {{ friendsStore.friends.length }}
                  </span>
                </div>
                <button
                  class="text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                  @click="navigateTo('/friends')"
                >
                  Manage →
                </button>
              </div>

              <!-- Loading -->
              <div v-if="friendsStore.loading" class="flex justify-center py-6">
                <div class="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              </div>

              <!-- Empty -->
              <div v-else-if="friendsStore.friends.length === 0" class="text-center py-6">
                <p class="text-2xl mb-2">🤝</p>
                <p class="text-slate-400 text-sm font-medium">No friends yet</p>
                <button
                  class="mt-3 text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                  @click="navigateTo('/friends')"
                >
                  Find Players →
                </button>
              </div>

              <!-- List -->
              <div v-else class="flex flex-col gap-2">
                <div
                  v-for="f in friendsStore.friends"
                  :key="f.id"
                  class="flex items-center gap-3 bg-slate-800/60 border border-white/8 rounded-xl px-3 py-2.5 hover:border-orange-500/30 transition-colors"
                >
                  <UiAvatar :src="f.friend.avatar_url" :fallback="f.friend.initials" size="sm" />
                  <div class="flex-1 min-w-0">
                    <p class="text-white font-semibold text-sm truncate leading-tight">{{ f.friend.fullName }}</p>
                  </div>
                  <div class="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ── RIGHT: Quests ───────────────────────────────────────────── -->
        <div class="lg:col-span-2 flex flex-col gap-6">

          <!-- Quest Progress -->
          <div class="relative overflow-hidden bg-white border border-orange-500/20 rounded-3xl p-8 shadow-2xl">
            <div class="absolute -top-10 -right-10 w-56 h-56 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative">
              <div class="flex items-center gap-3 mb-6">
                <span class="text-2xl">📊</span>
                <h2 class="text-xl font-extrabold text-slate-900">Quest Progress</h2>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div class="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
                  <p class="text-orange-500 text-3xl font-black">{{ profileStore.profile?.points ?? 0 }}</p>
                  <p class="text-slate-500 text-xs mt-1 uppercase tracking-wide">Total XP</p>
                </div>
                <div class="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
                  <p class="text-orange-500 text-3xl font-black">{{ questsStore.completedCount }}</p>
                  <p class="text-slate-500 text-xs mt-1 uppercase tracking-wide">Completed</p>
                </div>
                <div class="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
                  <p class="text-orange-500 text-3xl font-black">{{ questsStore.quests.length }}</p>
                  <p class="text-slate-500 text-xs mt-1 uppercase tracking-wide">Total</p>
                </div>
              </div>

              <!-- Progress bar -->
              <div class="mt-5">
                <div class="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Overall progress</span>
                  <span>{{ questsStore.completedCount }}/{{ questsStore.quests.length }}</span>
                </div>
                <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
                    :style="{ width: questsStore.quests.length ? `${Math.round((questsStore.completedCount / questsStore.quests.length) * 100)}%` : '0%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Completed Quests List -->
          <div class="relative overflow-hidden bg-white border border-orange-500/20 rounded-3xl p-8 shadow-2xl">
            <div class="absolute -bottom-10 -left-10 w-56 h-56 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative">
              <div class="flex items-center gap-3 mb-6">
                <span class="text-2xl">⚔️</span>
                <h2 class="text-xl font-extrabold text-slate-900">Completed Quests</h2>
                <span class="px-2.5 py-0.5 bg-orange-500/20 border border-orange-500/40 text-orange-500 text-xs font-bold rounded-full">
                  {{ completedQuests.length }}
                </span>
              </div>

              <!-- Loading -->
              <div v-if="questsStore.loading" class="flex justify-center py-10">
                <div class="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
              </div>

              <!-- Empty -->
              <div v-else-if="completedQuests.length === 0" class="text-center py-10">
                <p class="text-4xl mb-3">⚔️</p>
                <p class="text-slate-600 font-medium">No completed quests yet</p>
                <p class="text-slate-400 text-sm mt-1">Head to quests to start earning XP!</p>
                <UiButton variant="primary" class="!w-auto px-6 mt-4" @click="navigateTo('/quests')">
                  Browse Quests
                </UiButton>
              </div>

              <!-- List -->
              <div v-else class="flex flex-col gap-3">
                <div
                  v-for="item in completedQuests"
                  :key="item.quest.id"
                  class="flex items-center gap-4 bg-slate-50 border border-slate-200 hover:border-orange-500/40 rounded-2xl px-4 py-3 transition-colors"
                >
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-orange-500/10 border border-orange-500/30 flex-shrink-0">
                    {{ item.quest.icon }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-slate-900 font-semibold text-sm truncate">{{ item.quest.title }}</p>
                    <p class="text-slate-400 text-xs capitalize">{{ item.quest.level }} · {{ item.quest.category }}</p>
                  </div>
                  <div class="flex items-center gap-1 flex-shrink-0">
                    <span class="text-orange-500 text-sm">⭐</span>
                    <span class="text-orange-500 font-bold text-sm">+{{ item.userQuest.score }} XP</span>
                  </div>
                  <div class="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import { useQuestsStore }  from '~/stores/quests'
import { useFriendsStore } from '~/stores/friends'

definePageMeta({ middleware: 'auth' })

const profileStore = useProfileStore()
const questsStore  = useQuestsStore()
const friendsStore = useFriendsStore()
const user = useSupabaseUser()

const firstName = ref('')
const lastName  = ref('')
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

const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

onMounted(async () => {
  await Promise.all([
    profileStore.fetchProfile(),
    questsStore.fetchQuests(),
    friendsStore.fetchAll(),
  ])

  if (!profileStore.profile?.first_name && !profileStore.profile?.last_name && user.value) {
    await profileStore.syncFromOAuth(user.value)
  }

  const meta = user.value?.user_metadata || {}
  firstName.value = profileStore.profile?.first_name || meta.given_name || meta.name?.split(' ')[0] || ''
  lastName.value  = profileStore.profile?.last_name  || meta.family_name || meta.name?.split(' ').slice(1).join(' ') || ''
})

const handleSave = async () => {
  await profileStore.updateProfile(firstName.value, lastName.value)
}

const triggerFileInput = () => { fileInput.value?.click() }

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { profileStore.errorMsg = 'Image must be smaller than 2MB'; return }
  await profileStore.uploadAvatar(file)
}
</script>
