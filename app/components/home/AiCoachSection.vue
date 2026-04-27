<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
    <div class="absolute -top-10 -right-10 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative flex flex-col lg:flex-row items-center gap-10">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">🤖</span>
          <h2 class="text-3xl font-extrabold text-white">AI Chess Coach</h2>
          <span class="ml-2 px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold rounded-full uppercase tracking-wider">Beta</span>
        </div>
        <p class="text-slate-300 text-lg leading-relaxed mb-6">
          Get <span class="text-orange-400 font-semibold">instant analysis</span> of your games, personalized opening recommendations, and move-by-move explanations — powered by AI. Like having a grandmaster in your pocket.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div v-for="feature in aiFeatures" :key="feature.label" class="flex items-start gap-3 bg-slate-800/70 border border-orange-500/10 rounded-xl p-4">
            <span class="text-2xl flex-shrink-0">{{ feature.icon }}</span>
            <div>
              <p class="text-white font-semibold text-sm">{{ feature.label }}</p>
              <p class="text-slate-500 text-xs mt-0.5">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
        <UiButton variant="primary" class="!w-auto px-8" @click="navigateTo('/ai-coach')">
          Ask AI Coach 🤖
        </UiButton>
      </div>

      <div class="flex-shrink-0 w-full lg:w-80 flex flex-col gap-2">
        <div
          v-for="(msg, i) in aiMessages"
          :key="i"
          :class="[
            'rounded-2xl px-4 py-3 text-sm max-w-[90%] transition-all duration-500',
            msg.role === 'ai'
              ? 'bg-orange-500/20 border border-orange-500/30 text-orange-100 self-start rounded-tl-sm'
              : 'bg-slate-700 border border-white/5 text-slate-200 self-end rounded-tr-sm ml-auto'
          ]"
        >
          <span v-if="msg.role === 'ai'" class="text-orange-400 font-bold text-xs block mb-1">AI Coach</span>
          <span v-else class="text-slate-400 font-bold text-xs block mb-1">You</span>
          {{ msg.text }}
        </div>
        <div class="bg-orange-500/10 border border-orange-500/20 rounded-2xl rounded-tl-sm px-4 py-3 self-start flex items-center gap-1.5 w-16">
          <span class="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
          <span class="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
          <span class="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const aiFeatures = [
  { icon: '🔍', label: 'Game Analysis', desc: 'Deep dive into every move after your game ends.' },
  { icon: '📚', label: 'Opening Book', desc: 'Learn the best openings for your playing style.' },
  { icon: '💡', label: 'Hint System', desc: 'Get a nudge in the right direction during a game.' },
  { icon: '📊', label: 'Weakness Report', desc: 'AI identifies your recurring mistakes and patterns.' },
]
const aiMessages = [
  { role: 'user', text: 'Why did I lose that game?' },
  { role: 'ai', text: 'You blundered on move 24 with Nd5??. After Bxd5, white gained a decisive material advantage. You should have played Nf4 instead, keeping pressure on the center.' },
  { role: 'user', text: 'What opening should I study?' },
]
</script>
