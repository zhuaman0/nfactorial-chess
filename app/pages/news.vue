<template>
  <div class="p-4 pb-16">
    <main class="max-w-7xl mx-auto mt-6 flex flex-col gap-8">

      <!-- ── Banner ──────────────────────────────────────────────────────── -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 shadow-2xl p-10">
        <div class="absolute inset-0 opacity-10 pointer-events-none" :style="chessBoardBg"></div>
        <div class="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-orange-800/30 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 class="text-4xl font-extrabold text-white drop-shadow-lg">News & Updates</h1>
            <p class="text-orange-100/80 mt-1">Latest chess news, platform updates and tips</p>
          </div>
          <div class="flex gap-4">
            <div class="bg-white/15 border border-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[80px]">
              <p class="text-white text-2xl font-black">{{ articles.length }}</p>
              <p class="text-orange-100 text-xs mt-0.5">Articles</p>
            </div>
            <div class="bg-white/15 border border-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-[80px]">
              <p class="text-white text-2xl font-black">{{ categories.length }}</p>
              <p class="text-orange-100 text-xs mt-0.5">Categories</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Featured Article ────────────────────────────────────────────── -->
      <div
        class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-8 shadow-2xl cursor-pointer hover:-translate-y-1 transition-all duration-200 group"
        @click="activeArticle = featured"
      >
        <div class="absolute -top-16 -right-16 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative flex flex-col lg:flex-row gap-8 items-start">
          <!-- Icon block -->
          <div class="flex-shrink-0 w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-5xl shadow-xl shadow-orange-500/30">
            {{ featured.icon }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-3">
              <span class="px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold rounded-full uppercase tracking-wider">
                ⭐ Featured
              </span>
              <span class="px-3 py-1 bg-white/5 border border-white/10 text-slate-400 text-xs font-bold rounded-full">
                {{ featured.category }}
              </span>
              <span class="text-slate-600 text-xs">{{ featured.date }}</span>
            </div>
            <h2 class="text-2xl font-extrabold text-white group-hover:text-orange-400 transition-colors leading-tight mb-3">
              {{ featured.title }}
            </h2>
            <p class="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{{ featured.body }}</p>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xs">♟</div>
                <span class="text-slate-400 text-xs">{{ featured.author }}</span>
              </div>
              <span class="text-slate-600 text-xs">{{ featured.readTime }} min read</span>
              <span class="ml-auto text-orange-400 text-sm font-semibold group-hover:underline">Read more →</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Category Filter ─────────────────────────────────────────────── -->
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="cat in ['All', ...categories]"
          :key="cat"
          class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
          :class="activeCategory === cat
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
            : 'bg-slate-800/80 border border-white/8 text-slate-400 hover:text-white hover:border-white/20'"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- ── Two-column layout ──────────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- ── Left: Articles Grid ── -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <div
            v-for="article in filteredArticles"
            :key="article.id"
            class="group relative overflow-hidden flex gap-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/8 hover:border-orange-500/30 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
            @click="activeArticle = article"
          >
            <!-- Icon -->
            <div
              class="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              :class="categoryColor(article.category)"
            >{{ article.icon }}</div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-xs font-bold px-2 py-0.5 rounded-full border" :class="categoryBadge(article.category)">
                  {{ article.category }}
                </span>
                <span class="text-slate-600 text-xs">{{ article.date }}</span>
                <span class="text-slate-600 text-xs ml-auto">{{ article.readTime }}m read</span>
              </div>
              <h3 class="text-white font-bold text-sm leading-tight group-hover:text-orange-400 transition-colors mb-1.5">
                {{ article.title }}
              </h3>
              <p class="text-slate-500 text-xs leading-relaxed line-clamp-2">{{ article.body }}</p>
            </div>
          </div>

          <div v-if="filteredArticles.length === 0" class="text-center py-12 text-slate-500">
            No articles in this category yet.
          </div>
        </div>

        <!-- ── Right: Sidebar ── -->
        <div class="flex flex-col gap-6">

          <!-- Chess Tip of the Day -->
          <div class="relative overflow-hidden bg-white border border-orange-500/20 rounded-3xl p-6 shadow-2xl">
            <div class="absolute -top-8 -right-8 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-xl">💡</span>
                <h3 class="text-slate-900 font-extrabold">Tip of the Day</h3>
              </div>
              <div
                v-for="(tip, i) in tips"
                :key="i"
                class="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0"
              >
                <span class="text-lg flex-shrink-0 mt-0.5">{{ tip.icon }}</span>
                <div>
                  <p class="text-slate-900 font-semibold text-sm">{{ tip.title }}</p>
                  <p class="text-slate-500 text-xs mt-0.5 leading-relaxed">{{ tip.body }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-6 shadow-2xl">
            <div class="absolute -bottom-8 -left-8 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="relative">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-xl">⚡</span>
                <h3 class="text-white font-extrabold">Quick Actions</h3>
              </div>
              <div class="flex flex-col gap-2">
                <NuxtLink
                  v-for="link in quickLinks"
                  :key="link.to"
                  :to="link.to"
                  class="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 hover:border-orange-500/30 hover:bg-orange-500/5 rounded-xl transition-all group"
                >
                  <span class="text-lg">{{ link.icon }}</span>
                  <span class="text-slate-300 text-sm font-semibold group-hover:text-white transition-colors">{{ link.label }}</span>
                  <svg class="w-4 h-4 text-slate-600 group-hover:text-orange-400 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>

        </div>
      </div>

    </main>

    <!-- ── Article Modal ──────────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="activeArticle" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="activeArticle = null">
          <div class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" @click="activeArticle = null"></div>
          <div class="relative bg-slate-900 border border-orange-500/30 rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <button
              class="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-sm transition-all"
              @click="activeArticle = null"
            >✕</button>

            <div class="relative">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold rounded-full">
                  {{ activeArticle.category }}
                </span>
                <span class="text-slate-500 text-xs">{{ activeArticle.date }}</span>
                <span class="text-slate-600 text-xs">{{ activeArticle.readTime }} min read</span>
              </div>

              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-3xl mb-5 shadow-lg">
                {{ activeArticle.icon }}
              </div>

              <h2 class="text-2xl font-extrabold text-white mb-4 leading-tight">{{ activeArticle.title }}</h2>
              <p class="text-slate-400 text-sm leading-relaxed mb-4">{{ activeArticle.body }}</p>
              <p class="text-slate-500 text-sm leading-relaxed">{{ activeArticle.extra }}</p>

              <div class="flex items-center gap-2 mt-6 pt-5 border-t border-white/8">
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-sm">♟</div>
                <span class="text-slate-400 text-sm font-semibold">{{ activeArticle.author }}</span>
                <span class="text-slate-600 text-xs ml-auto">nFactorial Chess Editorial</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'News' })

const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

interface Article {
  id: number
  icon: string
  category: string
  title: string
  body: string
  extra: string
  date: string
  author: string
  readTime: number
}

const activeCategory = ref('All')
const activeArticle  = ref<Article | null>(null)

const articles: Article[] = [
  {
    id: 1, icon: '♔', category: 'Platform',
    title: 'Introducing Daily Quests — Earn XP Every Day',
    body: 'We\'ve launched a brand-new quest system that rewards you for playing every day. Complete daily challenges to earn XP, unlock badges, and boost your leaderboard ranking. Quests reset at midnight and scale in difficulty as you progress.',
    extra: 'The quest system includes 3 tiers — Beginner, Intermediate, and Expert — each offering progressively higher XP rewards. Streak bonuses multiply your earnings the longer you play consecutively.',
    date: 'Apr 27, 2026', author: 'nFactorial Team', readTime: 3,
  },
  {
    id: 2, icon: '🌍', category: 'Chess News',
    title: 'Magnus Carlsen Announces Return to World Championship',
    body: 'In a stunning announcement, Magnus Carlsen has confirmed he will challenge the reigning World Champion in a 14-game match scheduled for late 2026. The chess world erupts as the greatest player of all time makes his return.',
    extra: 'Carlsen, who voluntarily stepped down from his title in 2023, cited renewed motivation and a desire to test himself against the new generation of champions. Tickets are expected to sell out within hours of release.',
    date: 'Apr 25, 2026', author: 'Chess Desk', readTime: 4,
  },
  {
    id: 3, icon: '🤖', category: 'Platform',
    title: 'AI Coach Beta — Ask the Engine Anything',
    body: 'Our AI Chess Coach is now live in beta. Powered by advanced language models combined with Stockfish analysis, it can explain your blunders, suggest openings tailored to your style, and give real-time hints during practice games.',
    extra: 'During beta, AI Coach is available for all users. Post-beta, it will remain free for up to 10 analyses per day, with unlimited access for premium users.',
    date: 'Apr 22, 2026', author: 'nFactorial Team', readTime: 2,
  },
  {
    id: 4, icon: '⚔️', category: 'Tournaments',
    title: 'Spring Cup 2026 — Final Results & Winners',
    body: 'The Spring Cup 2026 concluded with an epic final between two of our top-ranked players. After 7 grueling rounds of round-robin play, the champion emerged with a perfect 7/7 score — a performance that will be remembered for years.',
    extra: 'Over 48 players registered across 6 brackets. The average game length was 42 moves, and 12% of games ended in stalemate. Trophies and XP bonuses have been distributed to all podium finishers.',
    date: 'Apr 20, 2026', author: 'Tournament Office', readTime: 3,
  },
  {
    id: 5, icon: '📚', category: 'Tips',
    title: 'The Italian Game — Why It\'s Perfect for Beginners',
    body: 'The Italian Game (1.e4 e5 2.Nf3 Nc6 3.Bc4) is one of the oldest recorded chess openings, dating back to the 16th century. It\'s beginner-friendly yet rich enough to challenge experienced players.',
    extra: 'Key ideas include controlling the center with pawns, developing knights before bishops, and avoiding moving the same piece twice in the opening. The Giuoco Piano and Evans Gambit are popular sub-variations worth studying.',
    date: 'Apr 18, 2026', author: 'Chess Academy', readTime: 5,
  },
  {
    id: 6, icon: '🔥', category: 'Platform',
    title: 'Streak System Update — New Bonuses & Milestones',
    body: 'We\'ve upgraded the daily streak system with milestone rewards at 7, 14, 30, and 100-day marks. Each milestone unlocks exclusive profile borders, badge colors, and XP multiplier boosts.',
    extra: 'Players who already have an active streak will automatically receive credit for any milestones they\'ve already passed. Check your profile to see your current streak bonus.',
    date: 'Apr 15, 2026', author: 'nFactorial Team', readTime: 2,
  },
  {
    id: 7, icon: '♟', category: 'Chess News',
    title: 'Hikaru Nakamura Breaks Blitz Speed Record on Live Stream',
    body: 'In front of 200,000 live viewers, Hikaru Nakamura completed a 5-minute blitz game in under 2 minutes while maintaining a 98% accuracy rate. The clip has gone viral across social media platforms.',
    extra: 'Nakamura\'s pre-move usage was flagged as exceptional — he correctly pre-moved on 14 consecutive opponent responses. Chess analysts called it "a once-in-a-decade display of board vision."',
    date: 'Apr 12, 2026', author: 'Chess Desk', readTime: 3,
  },
  {
    id: 8, icon: '🏆', category: 'Tournaments',
    title: 'Weekly Blitz Tournament — Every Sunday at 7PM',
    body: 'Starting this week, nFactorial Chess hosts a weekly Blitz Tournament every Sunday evening. All skill levels welcome — the field is split into Beginner, Club, and Master brackets automatically based on your ELO.',
    extra: 'Prizes include XP bonuses, exclusive tournament badges, and a featured spot on the weekly leaderboard. Top finishers also receive priority seeding in the monthly championship.',
    date: 'Apr 10, 2026', author: 'Tournament Office', readTime: 2,
  },
]

const featured = articles[0]!

const filteredArticles = computed(() =>
  activeCategory.value === 'All'
    ? articles.slice(1)
    : articles.slice(1).filter(a => a.category === activeCategory.value)
)

const categories = [...new Set(articles.map(a => a.category))]

const tips = [
  { icon: '🎯', title: 'Control the center', body: 'Occupy or attack the e4, e5, d4, d5 squares in the opening.' },
  { icon: '🐴', title: 'Knights before bishops', body: 'Develop your knights first — their destination is usually clearer.' },
  { icon: '🏰', title: 'Castle early', body: 'Get your king to safety before launching attacks.' },
  { icon: '👀', title: 'Check your blunders', body: 'Before every move, ask: can my opponent capture something for free?' },
]

const quickLinks = [
  { icon: '⚔️', label: 'Play a Game',       to: '/play'        },
  { icon: '📋', label: 'Daily Quests',       to: '/quests'      },
  { icon: '🏆', label: 'Leaderboard',        to: '/leaderboard' },
  { icon: '🥊', label: 'Tournaments',        to: '/tournaments' },
]

function categoryColor(cat: string) {
  const map: Record<string, string> = {
    'Platform':   'bg-orange-500/15 border border-orange-500/30',
    'Chess News': 'bg-blue-500/15 border border-blue-500/30',
    'Tournaments':'bg-amber-500/15 border border-amber-500/30',
    'Tips':       'bg-emerald-500/15 border border-emerald-500/30',
  }
  return map[cat] ?? 'bg-slate-700/60 border border-white/10'
}

function categoryBadge(cat: string) {
  const map: Record<string, string> = {
    'Platform':   'bg-orange-500/20 border-orange-500/40 text-orange-400',
    'Chess News': 'bg-blue-500/20 border-blue-500/40 text-blue-400',
    'Tournaments':'bg-amber-500/20 border-amber-500/40 text-amber-400',
    'Tips':       'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
  }
  return map[cat] ?? 'bg-slate-700 border-slate-600 text-slate-400'
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }
</style>
