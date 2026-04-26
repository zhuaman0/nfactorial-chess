<template>
  <footer class="relative mt-16 border-t border-white/10 bg-slate-900 overflow-hidden">
    <!-- Subtle chessboard top edge -->
    <div class="w-full h-1.5 chess-stripe"></div>

    <!-- Glow blobs -->
    <div class="absolute -top-20 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-20 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative max-w-7xl mx-auto px-6 pt-12 pb-8">
      <!-- Top grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

        <!-- Brand -->
        <div class="md:col-span-1 flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
              ♟
            </div>
            <span class="text-white font-extrabold text-xl tracking-tight">ChessArena</span>
          </div>
          <p class="text-slate-500 text-sm leading-relaxed">
            The modern chess platform built for players who take the game seriously — and love every second of it.
          </p>
          <!-- Social icons -->
          <div class="flex items-center gap-3 mt-1">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
              class="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-200"
            >
              <span class="text-base leading-none">{{ social.icon }}</span>
            </a>
          </div>
        </div>

        <!-- Links: Play -->
        <div class="flex flex-col gap-3">
          <h4 class="text-white font-bold text-sm uppercase tracking-widest mb-1">Play</h4>
          <a v-for="link in playLinks" :key="link.label" :href="link.href"
            class="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 w-fit">
            {{ link.label }}
          </a>
        </div>

        <!-- Links: Learn -->
        <div class="flex flex-col gap-3">
          <h4 class="text-white font-bold text-sm uppercase tracking-widest mb-1">Learn</h4>
          <a v-for="link in learnLinks" :key="link.label" :href="link.href"
            class="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 w-fit">
            {{ link.label }}
          </a>
        </div>

        <!-- Links: Community -->
        <div class="flex flex-col gap-3">
          <h4 class="text-white font-bold text-sm uppercase tracking-widest mb-1">Community</h4>
          <a v-for="link in communityLinks" :key="link.label" :href="link.href"
            class="text-slate-400 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 w-fit">
            {{ link.label }}
          </a>
        </div>
      </div>

      <!-- Divider with chess pieces -->
      <div class="flex items-center gap-4 mb-6">
        <div class="flex-1 h-px bg-white/10"></div>
        <div class="flex items-center gap-2 text-slate-700 text-lg select-none">
          <span>♙</span><span>♘</span><span>♗</span><span>♖</span><span>♕</span><span>♔</span>
        </div>
        <div class="flex-1 h-px bg-white/10"></div>
      </div>

      <!-- Bottom bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <p>© {{ new Date().getFullYear() }} ChessArena. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <a href="/privacy" class="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="/terms" class="hover:text-slate-400 transition-colors">Terms of Service</a>
          <a href="/contact" class="hover:text-slate-400 transition-colors">Contact</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socials = [
  { label: 'Twitter', icon: '𝕏', href: '#' },
  { label: 'Discord', icon: '💬', href: '#' },
  { label: 'GitHub', icon: '🐙', href: '#' },
  { label: 'Instagram', icon: '📸', href: '#' },
]

const playLinks = [
  { label: 'Play vs Human', href: '/play' },
  { label: 'Play vs Bot', href: '/play/bot' },
  { label: 'Daily Puzzles', href: '/puzzles' },
  { label: 'Tournaments', href: '/tournaments' },
  { label: 'Bullet & Blitz', href: '/play' },
]

const learnLinks = [
  { label: 'AI Chess Coach', href: '/ai-coach' },
  { label: 'Opening Explorer', href: '/openings' },
  { label: 'Game Analysis', href: '/analysis' },
  { label: 'Video Lessons', href: '/lessons' },
]

const communityLinks = [
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Meet Players IRL', href: '/meet' },
  { label: 'Daily Quests', href: '/quests' },
  { label: 'Forum', href: '/forum' },
  { label: 'Hall of Fame', href: '/hall-of-fame' },
]
</script>

<style scoped>
.chess-stripe {
  background-image: repeating-linear-gradient(
    90deg,
    #1e293b 0px,
    #1e293b 16px,
    #0f172a 16px,
    #0f172a 32px
  );
}
</style>
