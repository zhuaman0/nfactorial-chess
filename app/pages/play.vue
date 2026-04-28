<template>
  <div class="p-4 pb-16 mt-6">
    <main class="max-w-6xl mx-auto">
      <Transition name="page-fade" mode="out-in">

        <!-- ══════════════════════════════════════════ LOBBY ══ -->
        <div v-if="!gameStarted" key="lobby" class="flex flex-col gap-8">

          <!-- Page title -->
          <div>
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Play Chess</h1>
            <p class="text-slate-400 mt-1 text-sm">Choose your mode, customize your setup, and enter the arena.</p>
          </div>

          <!-- ── Mode selector cards ── -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <!-- Practice -->
            <button
              class="relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-200 hover:-translate-y-0.5 group"
              :class="lobbyTab === 'practice'
                ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl shadow-orange-500/30'
                : 'border-slate-200 bg-white hover:border-orange-300 hover:shadow-lg'"
              @click="lobbyTab = 'practice'"
            >
              <div class="absolute inset-0 opacity-5 pointer-events-none" :style="chessBoardBg" />
              <div class="relative flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-4xl">♟</span>
                  <div v-if="lobbyTab === 'practice'" class="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                    <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
                <div>
                  <p class="font-extrabold text-lg" :class="lobbyTab === 'practice' ? 'text-white' : 'text-slate-900'">Practice</p>
                  <p class="text-sm mt-0.5" :class="lobbyTab === 'practice' ? 'text-orange-100/80' : 'text-slate-400'">Play vs AI at any difficulty</p>
                </div>
                <div class="flex gap-1.5">
                  <span v-for="i in 4" :key="i" class="w-2 h-2 rounded-full" :class="lobbyTab === 'practice' ? 'bg-white/60' : 'bg-slate-300'" />
                </div>
              </div>
            </button>

            <!-- Train -->
            <button
              class="relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-200 hover:-translate-y-0.5 group"
              :class="lobbyTab === 'train'
                ? 'border-violet-500 bg-gradient-to-br from-violet-600 to-purple-600 shadow-xl shadow-violet-500/30'
                : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-lg'"
              @click="lobbyTab = 'train'; loadTrainProfile()"
            >
              <div class="absolute inset-0 opacity-5 pointer-events-none" :style="chessBoardBg" />
              <div class="relative flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-4xl">🧬</span>
                  <div v-if="lobbyTab === 'train'" class="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                    <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
                <div>
                  <p class="font-extrabold text-lg" :class="lobbyTab === 'train' ? 'text-white' : 'text-slate-900'">AI Mirror</p>
                  <p class="text-sm mt-0.5" :class="lobbyTab === 'train' ? 'text-violet-100/80' : 'text-slate-400'">Train against your own style</p>
                </div>
                <div class="flex gap-1.5">
                  <span v-for="i in 4" :key="i" class="w-2 h-2 rounded-full" :class="lobbyTab === 'train' ? 'bg-white/60' : 'bg-slate-300'" />
                </div>
              </div>
            </button>

            <!-- Shadow Siege -->
            <button
              class="relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-200 hover:-translate-y-0.5 group"
              :class="lobbyTab === 'siege'
                ? 'border-red-500 bg-gradient-to-br from-red-600 to-orange-600 shadow-xl shadow-red-500/30'
                : 'border-slate-200 bg-white hover:border-red-300 hover:shadow-lg'"
              @click="lobbyTab = 'siege'"
            >
              <div class="absolute inset-0 opacity-5 pointer-events-none" :style="chessBoardBg" />
              <div class="relative flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-4xl">⚔️</span>
                  <div v-if="lobbyTab === 'siege'" class="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                    <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
                <div>
                  <p class="font-extrabold text-lg" :class="lobbyTab === 'siege' ? 'text-white' : 'text-slate-900'">Shadow Siege</p>
                  <p class="text-sm mt-0.5" :class="lobbyTab === 'siege' ? 'text-red-100/80' : 'text-slate-400'">Raid players, steal their gold</p>
                </div>
                <div class="flex gap-1.5">
                  <span v-for="i in 4" :key="i" class="w-2 h-2 rounded-full" :class="lobbyTab === 'siege' ? 'bg-white/60' : 'bg-slate-300'" />
                </div>
              </div>
            </button>

          </div>

          <!-- Shadow Siege lobby -->
          <RaidLobby v-if="lobbyTab === 'siege'" @start-raid="onStartRaid" />

          <!-- Train lobby -->
          <div v-else-if="lobbyTab === 'train'" class="flex flex-col gap-5">
            <div class="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center text-2xl shrink-0">🧬</div>
                <div>
                  <h2 class="text-lg font-extrabold text-slate-900">Your AI Mirror</h2>
                  <p class="text-slate-400 text-sm">Learns your style — grows stronger every game</p>
                </div>
              </div>

              <!-- Stats -->
              <div v-if="trainProfileLoading" class="flex items-center gap-3 text-slate-400 text-sm py-6 justify-center">
                <svg class="animate-spin w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Analyzing your game history…
              </div>
              <div v-else class="grid grid-cols-3 gap-3 mb-6">
                <div class="rounded-xl bg-violet-50 border border-violet-100 p-4 text-center">
                  <p class="text-2xl font-black text-violet-600">{{ trainShadowProfile?.estimated_elo ?? 800 }}</p>
                  <p class="text-xs text-slate-400 mt-1 font-medium">Mirror ELO</p>
                </div>
                <div class="rounded-xl bg-violet-50 border border-violet-100 p-4 text-center">
                  <p class="text-2xl font-black text-violet-600">{{ trainShadowProfile?.games_analyzed ?? 0 }}</p>
                  <p class="text-xs text-slate-400 mt-1 font-medium">Games learned</p>
                </div>
                <div class="rounded-xl bg-violet-50 border border-violet-100 p-4 text-center">
                  <p class="text-2xl font-black text-violet-600">{{ trainShadowProfile?.opening_moves.length ?? 0 }}</p>
                  <p class="text-xs text-slate-400 mt-1 font-medium">Moves memorized</p>
                </div>
              </div>

              <!-- How it works -->
              <div class="rounded-xl bg-slate-50 border border-slate-100 p-4 flex flex-col gap-3 mb-6">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">How it works</p>
                <div v-for="(step, i) in trainSteps" :key="i" class="flex items-start gap-3">
                  <span class="w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{{ i + 1 }}</span>
                  <p class="text-sm text-slate-500" v-html="step"></p>
                </div>
              </div>

              <button
                class="w-full py-4 rounded-xl font-extrabold text-base text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
                @click="startTrainGame()"
              >
                🧬 {{ trainShadowProfile?.games_analyzed ? 'Start Training' : 'Start Training (AI starts easy)' }}
              </button>
            </div>
          </div>

          <!-- Practice lobby grid -->
          <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-5">

            <!-- ── Left 2 cols ── -->
            <div class="lg:col-span-2 flex flex-col gap-5">

              <!-- Choose Opponent -->
              <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div class="flex items-center gap-2 mb-5">
                  <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-base shrink-0">🎯</div>
                  <h2 class="text-base font-extrabold text-slate-900">Choose Difficulty</h2>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="m in MODES"
                    :key="m.value"
                    class="relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-150 text-left hover:-translate-y-0.5"
                    :class="selectedMode === m.value
                      ? `${m.activeBg} ${m.activeBorder}`
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'"
                    @click="selectedMode = m.value"
                  >
                    <span class="text-3xl leading-none shrink-0">{{ m.icon }}</span>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-sm" :class="selectedMode === m.value ? m.activeText : 'text-slate-800'">{{ m.label }}</p>
                      <p class="text-xs text-slate-400 mt-0.5 truncate">{{ m.desc }}</p>
                      <div class="flex gap-1 mt-1.5">
                        <span
                          v-for="d in 4" :key="d"
                          class="w-2 h-1.5 rounded-full transition-colors"
                          :class="d <= m.dots
                            ? (selectedMode === m.value ? m.dotActive : 'bg-slate-300')
                            : 'bg-slate-100'"
                        />
                      </div>
                    </div>
                    <div
                      v-if="selectedMode === m.value"
                      class="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                      :class="m.checkBg"
                    >
                      <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Piece Style -->
              <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div class="flex items-center justify-between mb-5">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-base shrink-0">♛</div>
                    <h2 class="text-base font-extrabold text-slate-900">Piece Style</h2>
                  </div>
                  <NuxtLink to="/shop" class="flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                    🏪 Shop
                  </NuxtLink>
                </div>
                <div class="grid grid-cols-4 gap-3">
                  <button
                    v-for="s in SKINS" :key="s.value"
                    class="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-150 hover:-translate-y-0.5"
                    :class="customization.skin === s.value
                      ? 'border-orange-400 bg-orange-50 shadow-sm'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'"
                    @click="customization.setSkin(s.value)"
                  >
                    <span class="text-3xl leading-none" :class="s.filterClass">♛</span>
                    <p class="font-bold text-xs text-center leading-tight" :class="customization.skin === s.value ? 'text-orange-600' : 'text-slate-700'">{{ s.label }}</p>
                    <div v-if="customization.skin === s.value" class="w-3.5 h-3.5 rounded-full bg-orange-500 flex items-center justify-center">
                      <svg class="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                  </button>

                  <template v-for="ps in premiumSkinsForSelector" :key="ps.id">
                    <button
                      v-if="customization.isSkinOwned(ps.id)"
                      class="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-150 hover:-translate-y-0.5"
                      :class="customization.skin === ps.id
                        ? 'border-amber-400 bg-amber-50 shadow-sm'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'"
                      @click="customization.setSkin(ps.id)"
                    >
                      <img v-if="ps.images['k-w']" :src="ps.images['k-w']" class="w-8 h-8 object-contain" />
                      <span v-else class="text-3xl leading-none">♛</span>
                      <p class="font-bold text-xs text-center" :class="customization.skin === ps.id ? 'text-amber-600' : 'text-slate-700'">{{ ps.name }}</p>
                    </button>
                    <NuxtLink
                      v-else to="/shop"
                      class="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-amber-300 transition-all duration-150 relative group"
                    >
                      <div class="absolute inset-0 rounded-xl bg-white/80 flex flex-col items-center justify-center gap-0.5">
                        <span class="text-lg">🔒</span>
                        <span class="text-[10px] text-amber-500 font-bold">🪙 {{ ps.price }}</span>
                      </div>
                      <img v-if="ps.images['k-w']" :src="ps.images['k-w']" class="w-8 h-8 object-contain opacity-20" />
                      <span v-else class="text-3xl opacity-20">♛</span>
                      <p class="text-xs text-slate-400 font-semibold">{{ ps.name }}</p>
                    </NuxtLink>
                  </template>
                </div>
              </div>

            </div>

            <!-- ── Right col: Arena + Start ── -->
            <div class="flex flex-col gap-5">

              <!-- Arena Theme -->
              <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
                <div class="flex items-center gap-2 mb-5">
                  <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-base shrink-0">🏟</div>
                  <h2 class="text-base font-extrabold text-slate-900">Board Theme</h2>
                </div>
                <div class="flex flex-col gap-2">
                  <button
                    v-for="(t, key) in ARENA_THEMES" :key="key"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all duration-150 w-full text-left"
                    :class="customization.theme === key
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'"
                    @click="customization.setTheme(key as any)"
                  >
                    <div class="grid grid-cols-2 rounded-md overflow-hidden shrink-0 ring-1 ring-black/10 shadow-sm">
                      <div class="w-5 h-5" :style="{ backgroundColor: t.light }" />
                      <div class="w-5 h-5" :style="{ backgroundColor: t.dark }" />
                      <div class="w-5 h-5" :style="{ backgroundColor: t.dark }" />
                      <div class="w-5 h-5" :style="{ backgroundColor: t.light }" />
                    </div>
                    <span class="text-sm font-semibold flex-1" :class="customization.theme === key ? 'text-orange-600' : 'text-slate-700'">{{ t.name }}</span>
                    <div v-if="customization.theme === key" class="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                      <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Start button -->
              <button
                class="w-full py-5 rounded-2xl font-extrabold text-lg text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2"
                @click="startGame"
              >
                <span>⚔️</span> Start Game
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

            </div>
          </div><!-- end practice grid -->
        </div><!-- end lobby -->

        <!-- ══════════════════════════════════════════ GAME ══ -->
        <div v-else key="game">

          <!-- Dark arena wrapper -->
          <div class="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-white/8 shadow-2xl p-5 md:p-7">

            <!-- Subtle chess-pattern ambient glow -->
            <div class="pointer-events-none absolute inset-0 opacity-[0.03]" :style="chessBoardBg" />
            <div class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-64 bg-orange-500/20 rounded-full blur-3xl" />

            <!-- ── Top bar ── -->
            <div class="relative flex items-center justify-between mb-6">
              <button
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-sm transition-all"
                @click="backToLobby"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Setup
              </button>

              <!-- VS label in the center -->
              <div class="flex items-center gap-3">
                <span class="text-slate-600 text-xs font-bold uppercase tracking-widest">Arena</span>
                <span
                  v-if="isTrainGame"
                  class="text-xs font-bold px-3 py-1 rounded-full border bg-violet-500/20 text-violet-300 border-violet-500/30"
                >🧬 Mirror Training</span>
                <span
                  v-else-if="isRaidGame"
                  class="text-xs font-bold px-3 py-1 rounded-full border bg-red-500/20 text-red-300 border-red-500/30"
                >⚔️ Shadow Siege</span>
                <span
                  v-else
                  class="text-xs font-bold px-3 py-1 rounded-full border"
                  :class="MODES.find(m => m.value === selectedMode)?.badgeClass"
                >{{ MODES.find(m => m.value === selectedMode)?.label }}</span>
              </div>

              <div class="flex items-center gap-3">
                <!-- Fullscreen button -->
                <button
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
                  title="Fullscreen board"
                  @click="isFullscreen = true"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                  Expand
                </button>

                <!-- Engine loader -->
                <div v-if="!sfReady" class="flex items-center gap-1.5 text-orange-400 text-xs font-semibold">
                  <div class="w-3 h-3 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin"></div>
                  Loading…
                </div>
                <div v-else class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#4ade80]" title="Engine ready" />
              </div>
            </div>

            <div class="relative grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-start">

              <!-- ── LEFT: board column ── -->
              <div class="flex flex-col gap-3">

                <!-- Opponent row -->
                <div
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300"
                  :class="chessStore.turn === 'b' && !chessStore.isGameOver
                    ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                    : 'bg-white/4 border-white/8'"
                >
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ring-1"
                    :class="isRaidGame
                      ? 'bg-gradient-to-br from-red-900 to-orange-950 ring-red-500/30'
                      : isTrainGame
                        ? 'bg-gradient-to-br from-violet-900 to-indigo-950 ring-violet-500/30'
                        : selectedMode === 'ai'
                          ? 'bg-gradient-to-br from-purple-900 to-indigo-950 ring-purple-500/30'
                          : 'bg-slate-800 ring-white/10'"
                  >{{ isRaidGame ? '👤' : isTrainGame ? '🧬' : selectedMode === 'ai' ? '🧠' : '🤖' }}</div>
                  <div class="flex-1">
                    <p class="text-white text-sm font-bold leading-tight">{{ opponentName }}</p>
                    <p class="text-slate-500 text-xs mt-0.5">{{ opponentLabel }}</p>
                    <p v-if="isRaidGame && !raidStore.shadowExhausted" class="text-red-400 text-[10px] mt-0.5 font-semibold">
                      Shadow move {{ raidStore.shadowMoveIndex + 1 }}/{{ raidStore.shadowProfile?.opening_moves.length }}
                    </p>
                    <p v-if="isTrainGame && trainShadowProfile && trainShadowMoveIndex < trainShadowProfile.opening_moves.length" class="text-violet-400 text-[10px] mt-0.5 font-semibold">
                      Mirror move {{ trainShadowMoveIndex + 1 }}/{{ trainShadowProfile.opening_moves.length }}
                    </p>
                  </div>
                  <div v-if="chessStore.isAIThinking" class="flex items-center gap-2 text-orange-400 text-xs font-semibold">
                    <span class="flex gap-0.5">
                      <span class="w-1 h-3 bg-orange-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
                      <span class="w-1 h-3 bg-orange-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
                      <span class="w-1 h-3 bg-orange-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
                    </span>
                    Thinking
                  </div>
                  <div v-else-if="chessStore.turn === 'b' && !chessStore.isGameOver"
                    class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
                </div>

                <!-- Castle HP -->
                <div class="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/4 border border-white/8">
                  <span class="text-2xl select-none">🏰</span>
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Castle HP</span>
                      <span class="text-xs font-black tabular-nums" :class="hpTextColor">{{ chessStore.castleHp }}<span class="text-slate-600 font-normal"> / 100</span></span>
                    </div>
                    <div class="h-2.5 bg-slate-800 rounded-full overflow-hidden ring-1 ring-white/5">
                      <div
                        class="h-full rounded-full transition-all duration-700 ease-out"
                        :class="hpBarColor"
                        :style="{ width: `${chessStore.castleHp}%` }"
                      />
                    </div>
                  </div>
                </div>

                <!-- Board -->
                <ChessBoard
                  :disabled="chessStore.turn === 'b' || chessStore.isAIThinking || chessStore.isGameOver || !sfReady"
                  @player-move="onPlayerMove"
                />

                <!-- Player row -->
                <div
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300"
                  :class="chessStore.turn === 'w' && !chessStore.isGameOver && !chessStore.isAIThinking
                    ? 'bg-orange-500/10 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                    : 'bg-white/4 border-white/8'"
                >
                  <div class="relative flex-shrink-0">
                    <UiAvatar :src="avatarSrc" :fallback="profileStore.initials || '?'" size="sm" />
                    <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 shadow" />
                  </div>
                  <div class="flex-1">
                    <p class="text-white text-sm font-bold leading-tight">{{ profileStore.fullName || user?.email || 'You' }}</p>
                    <p class="text-slate-500 text-xs mt-0.5">White · Playing as you</p>
                  </div>
                  <div v-if="chessStore.turn === 'w' && !chessStore.isGameOver && !chessStore.isAIThinking"
                    class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
                </div>
              </div>

              <!-- ── RIGHT: sidebar ── -->
              <div class="flex flex-col gap-4">

                <!-- Game Over -->
                <Transition name="slide-up">
                  <div
                    v-if="chessStore.isGameOver"
                    class="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-center"
                  >
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-20 bg-orange-500/20 blur-2xl pointer-events-none" />
                    <div class="relative">
                      <div class="text-5xl mb-3">{{ gameOverEmoji }}</div>
                      <h3 class="text-white font-extrabold text-lg mb-1">{{ gameOverTitle }}</h3>
                      <p class="text-slate-400 text-sm mb-2 leading-snug">{{ gameOverDescription }}</p>
                      <div v-if="isRaidGame" class="mb-4 py-2 px-4 rounded-xl text-sm font-bold"
                        :class="chessStore.isCheckmate && chessStore.turn === 'b'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'"
                      >
                        {{ chessStore.isCheckmate && chessStore.turn === 'b'
                          ? `🪙 +${raidStore.goldStake} gold stolen!`
                          : `🪙 -${raidStore.goldStake} gold lost` }}
                      </div>
                      <div class="flex flex-col gap-2">
                        <button
                          class="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25"
                          @click="chessStore.resetGame()"
                        >⚔️ Play Again</button>
                        <button
                          class="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/10 transition-all"
                          @click="backToLobby"
                        >Change Setup</button>
                      </div>
                    </div>
                  </div>
                </Transition>

                <!-- Move History -->
                <div class="rounded-2xl bg-white/4 border border-white/8 overflow-hidden">
                  <div class="px-4 py-3 border-b border-white/8 flex items-center justify-between bg-white/3">
                    <div class="flex items-center gap-2">
                      <span class="text-base">📜</span>
                      <p class="text-slate-300 text-xs font-bold uppercase tracking-widest">Move History</p>
                    </div>
                    <span class="text-[10px] font-bold text-slate-600 tabular-nums bg-white/5 px-2 py-0.5 rounded-full">
                      {{ chessStore.moveHistory.length }}
                    </span>
                  </div>
                  <div ref="historyEl" class="overflow-y-auto p-2 font-mono text-sm" style="min-height:200px; max-height:340px">
                    <div v-if="chessStore.moveHistory.length === 0"
                      class="flex flex-col items-center justify-center py-12 gap-2 text-slate-700">
                      <span class="text-4xl">♟</span>
                      <p class="text-xs italic">Make your first move!</p>
                    </div>
                    <div
                      v-for="(pair, i) in movePairs"
                      :key="i"
                      class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <span class="text-slate-700 text-[11px] w-5 shrink-0 tabular-nums group-hover:text-slate-500 transition-colors">{{ i + 1 }}.</span>
                      <span class="text-white font-semibold w-14 text-xs">{{ pair[0] }}</span>
                      <span class="text-slate-500 w-14 text-xs">{{ pair[1] ?? '' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2">
                  <button
                    :disabled="chessStore.moveHistory.length < 2"
                    class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 text-xs font-semibold transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                    @click="chessStore.undoMove()"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 14L4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
                    </svg>
                    Take Back
                  </button>
                  <button
                    class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/40 text-xs font-semibold transition-all"
                    @click="chessStore.resetGame()"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
                    </svg>
                    New Game
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </Transition>
    </main>

    <!-- ══════════════════════════════════════ FULLSCREEN OVERLAY ══ -->
    <Transition name="fs-fade">
      <div
        v-if="isFullscreen && gameStarted"
        style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#020617;display:flex;flex-direction:column;"
      >
        <!-- Top bar -->
        <div class="flex items-center justify-between px-6 py-3 border-b border-white/8 shrink-0">
          <div class="flex items-center gap-3">
            <span class="text-slate-500 text-xs font-bold uppercase tracking-widest">Arena</span>
            <span
              class="text-xs font-bold px-3 py-1 rounded-full border"
              :class="MODES.find(m => m.value === selectedMode)?.badgeClass"
            >{{ MODES.find(m => m.value === selectedMode)?.label }}</span>
          </div>
          <button
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-sm transition-all"
            @click="isFullscreen = false"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
            Exit Fullscreen
          </button>
        </div>

        <!-- Main content -->
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:16px;overflow:hidden;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:12px;height:100%;width:100%;max-width:720px;">

            <!-- Opponent row -->
            <div
              class="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 shrink-0"
              :class="chessStore.turn === 'b' && !chessStore.isGameOver
                ? 'bg-orange-500/10 border-orange-500/40'
                : 'bg-white/4 border-white/8'"
            >
              <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                :class="isRaidGame ? 'bg-gradient-to-br from-red-900 to-orange-950' : isTrainGame ? 'bg-gradient-to-br from-violet-900 to-indigo-950' : 'bg-gradient-to-br from-purple-900 to-indigo-950'"
              >{{ isRaidGame ? '👤' : isTrainGame ? '🧬' : selectedMode === 'ai' ? '🧠' : '🤖' }}</div>
              <div class="flex-1 min-w-0">
                <p class="text-white text-sm font-bold truncate">{{ opponentName }}</p>
                <p class="text-slate-500 text-xs">{{ opponentLabel }}</p>
              </div>
              <div v-if="chessStore.isAIThinking" class="flex items-center gap-2 text-orange-400 text-xs font-semibold shrink-0">
                <span class="flex gap-0.5">
                  <span class="w-1 h-3 bg-orange-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
                  <span class="w-1 h-3 bg-orange-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
                  <span class="w-1 h-3 bg-orange-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
                </span>
                Thinking
              </div>
              <div v-else-if="chessStore.turn === 'b' && !chessStore.isGameOver"
                class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] animate-pulse shrink-0" />
            </div>

            <!-- Castle HP -->
            <div class="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/4 border border-white/8 shrink-0">
              <span class="text-xl select-none">🏰</span>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1.5">
                  <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Castle HP</span>
                  <span class="text-xs font-black tabular-nums" :class="hpTextColor">{{ chessStore.castleHp }}<span class="text-slate-600 font-normal"> / 100</span></span>
                </div>
                <div class="h-2.5 bg-slate-800 rounded-full overflow-hidden ring-1 ring-white/5">
                  <div
                    class="h-full rounded-full transition-all duration-700 ease-out"
                    :class="hpBarColor"
                    :style="{ width: `${chessStore.castleHp}%` }"
                  />
                </div>
              </div>
            </div>

            <!-- Board: fills the remaining space -->
            <div style="flex:1;width:100%;min-height:0;display:flex;align-items:center;justify-content:center;">
              <ChessBoard
                :disabled="chessStore.turn === 'b' || chessStore.isAIThinking || chessStore.isGameOver || !sfReady"
                @player-move="onPlayerMove"
              />
            </div>

            <!-- Player row -->
            <div
              class="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 shrink-0"
              :class="chessStore.turn === 'w' && !chessStore.isGameOver && !chessStore.isAIThinking
                ? 'bg-orange-500/10 border-orange-500/40'
                : 'bg-white/4 border-white/8'"
            >
              <div class="relative shrink-0">
                <UiAvatar :src="avatarSrc" :fallback="profileStore.initials || '?'" size="sm" />
                <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 shadow" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white text-sm font-bold truncate">{{ profileStore.fullName || user?.email || 'You' }}</p>
                <p class="text-slate-500 text-xs">White · Playing as you</p>
              </div>
              <div v-if="chessStore.turn === 'w' && !chessStore.isGameOver && !chessStore.isAIThinking"
                class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] animate-pulse shrink-0" />
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useChessStore, type Difficulty } from '~/stores/chess'
import { useProfileStore } from '~/stores/profile'
import { useCustomizationStore, ARENA_THEMES } from '~/stores/customization'
import { useRaidStore, type RaidTarget } from '~/stores/raid'
import { SKIN_CATALOG } from '~/data/skins'

import ChessBoard from '~/components/chess/ChessBoard.vue'
import RaidLobby from '~/components/raid/RaidLobby.vue'

definePageMeta({ name: 'Play' })

const chessStore    = useChessStore()
const profileStore  = useProfileStore()
const customization = useCustomizationStore()
const premiumSkinsForSelector = SKIN_CATALOG

const raidStore     = useRaidStore()
const user          = useSupabaseUser()
const historyEl     = ref<HTMLElement | null>(null)
const advisor       = useAdvisor()

const { isReady: sfReady, init: sfInit, getBestMove, getBestMoveAtDepth, destroy: sfDestroy } = useStockfish()

const gameStarted  = ref(false)
const selectedMode = ref<Difficulty>('medium')
const lobbyTab     = ref<'practice' | 'train' | 'siege'>('practice')
const isRaidGame   = ref(false)
const isTrainGame  = ref(false)

interface TrainShadowProfile { opening_moves: string[]; estimated_elo: number; games_analyzed: number }
const trainShadowProfile    = ref<TrainShadowProfile | null>(null)
const trainShadowMoveIndex  = ref(0)
const trainProfileLoading   = ref(false)
const isFullscreen = ref(false)

watch(isFullscreen, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})
onUnmounted(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

// ── Castle HP bar colours ──────────────────────────────────────────────────
const hpBarColor = computed(() => {
  if (chessStore.castleHp > 60) return 'bg-gradient-to-r from-emerald-500 to-green-400'
  if (chessStore.castleHp > 30) return 'bg-gradient-to-r from-yellow-500 to-amber-400'
  return 'bg-gradient-to-r from-red-600 to-red-400 animate-pulse'
})
const hpTextColor = computed(() => {
  if (chessStore.castleHp > 60) return 'text-emerald-400'
  if (chessStore.castleHp > 30) return 'text-amber-400'
  return 'text-red-400'
})

// ── Material counting (proxy for blunder detection until Step 3 adds eval) ─
// Returns white_material - black_material in pawn units.
const PIECE_VAL: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 }
function materialScore(fen: string): number {
  let score = 0
  for (const ch of (fen.split(' ')[0] ?? '')) {
    const v = PIECE_VAL[ch.toLowerCase()]
    if (v) score += ch === ch.toUpperCase() ? v : -v
  }
  return score
}

const trainSteps = [
  'The AI opens with your own most-played moves — learn to defend against yourself.',
  `Plays at depth matched to your estimated ELO (currently <strong class="text-slate-700">depth ${trainCurrentDepth}</strong>).`,
  'Every game you play is saved — the Mirror gets smarter as you improve.',
]

// Snapshot material right after player moves, before AI replies.
let materialSnapshot = 0
function onPlayerMove(_payload: { fenBefore: string; fenAfter: string }) {
  materialSnapshot = materialScore(_payload.fenAfter)
}

// After AI replies, compare material to detect captures against the player.
watch(() => chessStore.turn, (newTurn, oldTurn) => {
  if (!gameStarted.value || chessStore.isGameOver) return

  // AI just finished its move → turn flipped back to white
  if (newTurn === 'w' && oldTurn === 'b') {
    const lost = materialSnapshot - materialScore(chessStore.fen)
    if (lost >= 9) {
      chessStore.damageHp(25)
      advisor.show("THE QUEEN! SOUND THE ALARM! 🚨 Regroup, My Lord!", 'panic')
    } else if (lost >= 5) {
      chessStore.damageHp(15)
      advisor.show("Our Rook has fallen! Hold the line! 🏰", 'panic')
    } else if (lost >= 3) {
      chessStore.damageHp(10)
      advisor.show("We lost a piece, My Lord! Stay focused! 🛡️", 'panic')
    } else if (lost >= 1) {
      chessStore.damageHp(5)
      advisor.show("A soldier lost! Every pawn matters! 🏰", 'neutral')
    }
  }
})

// React to check & checkmate events
watch(() => chessStore.isCheck, (inCheck) => {
  if (!inCheck || !gameStarted.value || chessStore.isCheckmate) return
  if (chessStore.turn === 'w') {
    advisor.show("MY LORD! You are in CHECK! Move your King to safety! 👑", 'panic', 6000)
  } else {
    advisor.show("Their King is in check! Finish them! ⚔️", 'praise', 3000)
  }
})

const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}

const MODES = [
  {
    value: 'easy'   as Difficulty, label: 'Easy Bot',   icon: '🤖', desc: 'Beginner friendly',  dots: 1,
    activeBg: 'bg-emerald-500/15', activeBorder: 'border-emerald-500/40', activeText: 'text-emerald-300',
    dotActive: 'bg-emerald-400', checkBg: 'bg-emerald-500 text-white',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    value: 'medium' as Difficulty, label: 'Medium Bot', icon: '🤖', desc: 'Decent challenge',   dots: 2,
    activeBg: 'bg-blue-500/15',    activeBorder: 'border-blue-500/40',    activeText: 'text-blue-300',
    dotActive: 'bg-blue-400',    checkBg: 'bg-blue-500 text-white',
    badgeClass: 'bg-blue-500/20    text-blue-300    border-blue-500/30',
  },
  {
    value: 'hard'   as Difficulty, label: 'Hard Bot',   icon: '🤖', desc: 'Will fight back',    dots: 3,
    activeBg: 'bg-orange-500/15',  activeBorder: 'border-orange-500/40',  activeText: 'text-orange-300',
    dotActive: 'bg-orange-400',  checkBg: 'bg-orange-500 text-white',
    badgeClass: 'bg-orange-500/20  text-orange-300  border-orange-500/30',
  },
  {
    value: 'ai'     as Difficulty, label: 'Max AI',     icon: '🧠', desc: 'Nearly unbeatable',  dots: 4,
    activeBg: 'bg-purple-500/15',  activeBorder: 'border-purple-500/40',  activeText: 'text-purple-300',
    dotActive: 'bg-purple-400',  checkBg: 'bg-purple-500 text-white',
    badgeClass: 'bg-purple-500/20  text-purple-300  border-purple-500/30',
  },
]

const SKINS = [
  { value: 'classic' as const, label: 'Classic', desc: 'Traditional',   filterClass: '' },
  { value: 'neon'    as const, label: 'Neon',    desc: 'Glowing',       filterClass: 'preview-neon-b'  },
  { value: 'royal'   as const, label: 'Royal',   desc: 'Golden pieces', filterClass: 'preview-royal-b' },
  { value: 'pixel'   as const, label: 'Pixel',   desc: 'Unicode style', filterClass: 'preview-pixel'   },
]

const avatarSrc = computed(() => {
  const meta = user.value?.user_metadata || {}
  return profileStore.avatarUrl || meta.picture || meta.avatar_url || ''
})

function eloToDepth(elo: number): number {
  if (elo < 900)  return 1
  if (elo < 1100) return 2
  if (elo < 1300) return 3
  if (elo < 1500) return 5
  if (elo < 1700) return 8
  return 12
}

const trainCurrentDepth = computed(() =>
  eloToDepth(trainShadowProfile.value?.estimated_elo ?? 800)
)

async function loadTrainProfile() {
  const supabase = useSupabaseClient()
  const { data: { user: u } } = await supabase.auth.getUser()
  if (!u) return
  trainProfileLoading.value = true
  try {
    const data = await $fetch<TrainShadowProfile>(`/api/shadow/${u.id}`)
    trainShadowProfile.value = data
  } catch {
    trainShadowProfile.value = { opening_moves: [], estimated_elo: 800, games_analyzed: 0 }
  } finally {
    trainProfileLoading.value = false
  }
}

async function startTrainGame() {
  isRaidGame.value = false
  isTrainGame.value = true
  trainShadowMoveIndex.value = 0
  if (!trainShadowProfile.value) await loadTrainProfile()
  chessStore.setDifficulty('train')
  chessStore.resetGame()
  gameStarted.value = true
  sfInit()
  const elo = trainShadowProfile.value?.estimated_elo ?? 800
  advisor.show(`Mirror ELO ${elo} — The AI has studied your games. Fight yourself! 🧬`, 'neutral', 4000)
}

function startGame() {
  isRaidGame.value = false
  isTrainGame.value = false
  chessStore.setDifficulty(selectedMode.value)
  chessStore.resetGame()
  gameStarted.value = true
  sfInit()
  advisor.show("The battle begins! Show no mercy, My Lord! ⚔️", 'neutral', 3500)
}

async function onStartRaid(target: RaidTarget, stake: number) {
  await raidStore.startRaid(target, stake)
  isRaidGame.value = true
  chessStore.setDifficulty(raidStore.shadowDifficulty)
  chessStore.resetGame()
  gameStarted.value = true
  sfInit()
  const name = `${target.first_name} ${target.last_name}`.trim()
  advisor.show(`Raiding ${name}'s kingdom! Their Shadow fights for them! ⚔️`, 'panic', 4000)
}

function backToLobby() {
  sfDestroy()
  chessStore.resetGame()
  gameStarted.value = false
  isRaidGame.value = false
  isTrainGame.value = false
  isFullscreen.value = false
  trainShadowMoveIndex.value = 0
  raidStore.clearRaid()
  advisor.hide()
}

const opponentName = computed(() => {
  if (isRaidGame.value && raidStore.activeDefender) {
    const d = raidStore.activeDefender
    return `Shadow of ${d.first_name} ${d.last_name}`.trim()
  }
  if (isTrainGame.value) return 'Your AI Mirror'
  return selectedMode.value === 'ai' ? 'Grandmaster AI' : 'Stockfish Bot'
})
const opponentLabel = computed(() => {
  if (isRaidGame.value && raidStore.shadowProfile) {
    return `Est. ${raidStore.shadowProfile.estimated_elo} ELO · ${raidStore.shadowProfile.games_analyzed} games learned`
  }
  if (isTrainGame.value && trainShadowProfile.value) {
    return `Mirror ELO ${trainShadowProfile.value.estimated_elo} · Depth ${trainCurrentDepth.value} · ${trainShadowProfile.value.games_analyzed} games`
  }
  if (selectedMode.value === 'ai') return 'Max Depth · Depth 18'
  const map: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }
  return map[selectedMode.value] ?? selectedMode.value
})

const movePairs = computed(() => {
  const pairs: [string, string?][] = []
  for (let i = 0; i < chessStore.moveHistory.length; i += 2) {
    pairs.push([chessStore.moveHistory[i]!, chessStore.moveHistory[i + 1]])
  }
  return pairs
})

watch(() => chessStore.moveHistory.length, async () => {
  await nextTick()
  if (historyEl.value) historyEl.value.scrollTop = historyEl.value.scrollHeight
})

async function animateAndApplyMove(from: string, to: string, promotion: string) {
  // Clear the thinking overlay, then animate the piece sliding
  chessStore.isAIThinking = false
  const piece = chessStore.game.get(from as any)
  if (piece) {
    chessStore.pendingAiMove = { from, to, type: piece.type, color: piece.color }
    await new Promise(resolve => setTimeout(resolve, 520))
    chessStore.pendingAiMove = null
  }
  if (!chessStore.isGameOver) {
    chessStore.makeMove(from, to, promotion)
  }
}

watch(
  () => [chessStore.turn, chessStore.isGameOver, sfReady.value, gameStarted.value] as const,
  async ([turn, gameOver, ready, started]) => {
    if (!started || turn !== 'b' || gameOver || !ready || chessStore.isAIThinking) return
    chessStore.isAIThinking = true
    try {
      // Shadow Siege: play from the defender's opening book first
      if (isRaidGame.value && !raidStore.shadowExhausted) {
        const shadowSan = raidStore.nextShadowMove
        if (shadowSan) {
          const { Chess } = await import('chess.js')
          const game = new Chess(chessStore.fen)
          try {
            const m = game.move(shadowSan)
            if (m && !chessStore.isGameOver) {
              await animateAndApplyMove(m.from, m.to, m.promotion ?? 'q')
              raidStore.advanceShadowMove()
              return
            }
          } catch {
            // Shadow move illegal in this position — fall through to Stockfish
          }
        }
      }

      // Train mode: play user's own opening moves, then adaptive-depth Stockfish
      if (isTrainGame.value) {
        const profile = trainShadowProfile.value
        if (profile && trainShadowMoveIndex.value < profile.opening_moves.length) {
          const san = profile.opening_moves[trainShadowMoveIndex.value]
          if (san) {
            const { Chess } = await import('chess.js')
            const game = new Chess(chessStore.fen)
            try {
              const m = game.move(san)
              if (m && !chessStore.isGameOver) {
                await animateAndApplyMove(m.from, m.to, m.promotion ?? 'q')
                trainShadowMoveIndex.value++
                return
              }
            } catch { /* fall through */ }
          }
        }
        // Opening exhausted — use Stockfish at ELO-based depth
        const depth = eloToDepth(profile?.estimated_elo ?? 800)
        const move = await getBestMoveAtDepth(chessStore.fen, depth)
        if (move && !chessStore.isGameOver) {
          await animateAndApplyMove(move.from, move.to, move.promotion ?? 'q')
        }
        return
      }

      // Easy mode: always plays a weak move so beginners can train
      if (chessStore.difficulty === 'easy') {
        const { Chess } = await import('chess.js')
        const g = new Chess(chessStore.fen)
        const legal = g.moves({ verbose: true })
        if (legal.length > 0) {
          // Prefer pawn moves and non-captures to play passively; fall back to any random move
          const passive = legal.filter(m => m.piece === 'p' && !m.captured)
          const pool = passive.length > 0 ? passive : legal
          const pick = pool[Math.floor(Math.random() * pool.length)]!
          if (!chessStore.isGameOver) {
            await animateAndApplyMove(pick.from, pick.to, pick.promotion ?? 'q')
          }
          return
        }
      }
      // All other difficulties: Stockfish at the configured depth
      const move = await getBestMove(chessStore.fen, chessStore.difficulty)
      if (move && !chessStore.isGameOver) {
        await animateAndApplyMove(move.from, move.to, move.promotion ?? 'q')
      }
    } finally {
      chessStore.isAIThinking = false
    }
  },
  { immediate: true }
)

watch(() => chessStore.isGameOver, async (over) => {
  if (!over) return
  const playerWon = chessStore.isCheckmate && chessStore.turn === 'b'
  const playerLost = chessStore.isCheckmate && chessStore.turn === 'w'

  if (playerWon) {
    if (isRaidGame.value) {
      advisor.show(`RAID SUCCESS! You crushed the Shadow! 🪙 +${raidStore.goldStake} gold stolen! 👑`, 'praise', 0)
    } else {
      advisor.show("CHECKMATE! You conquered the realm! ALL HAIL THE CHAMPION! 🏆", 'praise', 0)
    }
  } else if (playerLost) {
    if (isRaidGame.value) {
      advisor.show(`The Shadow held the line! 🪙 -${raidStore.goldStake} gold lost. Regroup and try again!`, 'panic', 0)
    } else {
      advisor.show("The castle has fallen… But every knight learns from defeat! 💙", 'panic', 0)
    }
  }

  if (isRaidGame.value && user.value) {
    await raidStore.completeRaid(user.value.id, playerWon)
    await profileStore.fetchProfile() // refresh gold balance
  }
  await chessStore.saveGame()
})

const gameOverEmoji = computed(() => {
  if (chessStore.isCheckmate) return chessStore.turn === 'w' ? '🤖' : '🏆'
  return '🤝'
})
const gameOverTitle = computed(() => {
  if (chessStore.isCheckmate) return chessStore.turn === 'w' ? `${opponentName.value} wins!` : 'You win!'
  return "It's a draw!"
})
const gameOverDescription = computed(() => {
  if (chessStore.isCheckmate) {
    return chessStore.turn === 'w'
      ? 'The AI found checkmate. Try an easier setting!'
      : 'Amazing! You checkmated the AI.'
  }
  return 'The game ended in a draw.'
})

onMounted(async () => {
  customization.load()
  await profileStore.fetchProfile()
  if (!profileStore.profile?.first_name && user.value) {
    await profileStore.syncFromOAuth(user.value)
  }
})

onUnmounted(() => { sfDestroy() })
</script>

<style scoped>
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(8px); }
.page-fade-leave-to   { opacity: 0; transform: translateY(-8px); }

.slide-up-enter-active { transition: all 0.3s ease; }
.slide-up-enter-from   { opacity: 0; transform: translateY(12px); }

.fs-fade-enter-active, .fs-fade-leave-active { transition: opacity 0.2s ease; }
.fs-fade-enter-from, .fs-fade-leave-to { opacity: 0; }

.preview-neon-b {
  filter: sepia(1) saturate(8) hue-rotate(260deg) brightness(1.3)
          drop-shadow(0 0 5px #cc44ff) drop-shadow(0 0 10px #8800cc);
}
.preview-royal-b {
  filter: sepia(1) saturate(4) hue-rotate(15deg) brightness(0.7);
}
.preview-pixel {
  font-family: 'Segoe UI Symbol', 'Apple Color Emoji', sans-serif;
  color: #94a3b8;
}
</style>
