<template>
  <div class="relative overflow-hidden bg-white border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
    <div class="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative flex flex-col lg:flex-row items-start gap-10">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">⚔️</span>
          <h2 class="text-3xl font-extrabold text-slate-900">Daily Quests</h2>
          <span class="ml-2 px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-500 text-xs font-bold rounded-full uppercase tracking-wider">Active</span>
        </div>
        <p class="text-slate-600 text-lg leading-relaxed mb-8">
          Complete daily quests to earn <span class="text-orange-500 font-semibold">XP & Points</span>. Every quest brings you closer to the top of the leaderboard.
        </p>

        <!-- Loading -->
        <div v-if="questsStore.loading" class="flex items-center gap-3 py-6 text-slate-400 text-sm">
          <div class="w-5 h-5 border-2 border-orange-400/40 border-t-orange-400 rounded-full animate-spin"></div>
          Loading quests…
        </div>

        <div v-else class="flex flex-col gap-3">
          <div
            v-for="quest in previewQuests"
            :key="quest.id"
            @click="navigateTo(`/quests/${quest.id}`)"
            class="group bg-slate-50 border border-slate-200 hover:border-orange-500/40 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer"
          >
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0', isCompleted(quest) ? 'bg-orange-500/20' : 'bg-slate-200']">
              {{ quest.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <p :class="['font-semibold text-sm', isCompleted(quest) ? 'text-orange-500 line-through' : 'text-slate-900']">{{ quest.title }}</p>
                <span class="text-orange-500 text-xs font-bold flex-shrink-0 ml-2">+{{ quest.points }} XP</span>
              </div>
              <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
                  :style="{ width: isCompleted(quest) ? '100%' : '0%' }"
                ></div>
              </div>
              <p class="text-slate-400 text-xs mt-1">{{ isCompleted(quest) ? 'Completed!' : quest.description }}</p>
            </div>
            <div v-if="isCompleted(quest)" class="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 flex flex-col items-center gap-4 lg:w-52">
        <div class="w-full bg-orange-50 border border-orange-200 rounded-2xl p-6 flex flex-col items-center gap-2">
          <span class="text-4xl">🏆</span>
          <p class="text-orange-500 text-3xl font-black">{{ questsStore.totalPointsEarned }}</p>
          <p class="text-slate-500 text-xs">Total XP Earned</p>
        </div>
        <div class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-1">
          <p class="text-slate-900 text-lg font-bold">{{ questsStore.completedCount }}/{{ questsStore.quests.length }}</p>
          <p class="text-slate-500 text-xs">Quests completed</p>
        </div>
        <UiButton variant="primary" class="w-full text-sm" @click="navigateTo('/quests')">
          View All Quests
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuestsStore } from '~/stores/quests'

const questsStore = useQuestsStore()

onMounted(() => { questsStore.fetchQuests() })

const previewQuests = computed(() => questsStore.questsWithProgress.slice(0, 4))

const isCompleted = (quest: typeof previewQuests.value[0]) =>
  quest.userQuest?.status === 'completed'
</script>
