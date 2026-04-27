<template>
  <div class="relative overflow-hidden bg-white border border-orange-500/20 rounded-3xl p-10 shadow-2xl">
    <div class="absolute -top-10 -right-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative flex flex-col lg:flex-row items-start gap-10">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">📰</span>
          <h2 class="text-3xl font-extrabold text-slate-900">Chess News</h2>
          <span class="ml-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold rounded-full uppercase tracking-wider animate-pulse">Live</span>
        </div>
        <p class="text-slate-600 text-lg leading-relaxed mb-8">
          Stay up to date with <span class="text-orange-500 font-semibold">tournaments, grandmaster insights</span>, and the latest chess world news — all in one place.
        </p>
        <div class="flex flex-col gap-3">
          <div v-for="(item, i) in newsTeaser" :key="i"
            class="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 hover:border-orange-500/40 rounded-2xl transition-all duration-300 group cursor-pointer"
            @click="navigateTo('/news')"
          >
            <span class="text-2xl flex-shrink-0">{{ item.emoji }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-slate-900 font-semibold text-sm group-hover:text-orange-500 transition-colors truncate">{{ item.title }}</p>
              <p class="text-slate-400 text-xs mt-0.5">{{ item.date }} · {{ item.category }}</p>
            </div>
            <span class="text-orange-500 text-xs font-bold flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">Read →</span>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 flex flex-col items-center gap-4 lg:w-52">
        <div class="w-full bg-orange-50 border border-orange-200 rounded-2xl p-6 flex flex-col items-center gap-3">
          <span class="text-4xl">📰</span>
          <p class="text-orange-500 text-2xl font-black">6+</p>
          <p class="text-slate-500 text-xs text-center">Articles this week</p>
        </div>
        <div class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-1">
          <p class="text-slate-900 text-lg font-bold">Daily</p>
          <p class="text-slate-500 text-xs">New articles</p>
        </div>
        <UiButton variant="primary" class="w-full text-sm" @click="navigateTo('/news')">
          Read All News
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const newsTeaser = [
  { emoji: '♔', title: 'Magnus Carlsen hints at return to classical chess in 2026', date: 'Apr 26', category: 'World News' },
  { emoji: '🤖', title: 'New AI discovers 17 unknown opening moves never played by humans', date: 'Apr 24', category: 'Technology' },
  { emoji: '🏆', title: 'Norway Chess 2026: Carlsen dominates with 3 Armageddon wins', date: 'Apr 25', category: 'Tournament' },
]
</script>
