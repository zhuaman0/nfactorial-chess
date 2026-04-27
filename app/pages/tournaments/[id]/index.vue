<template>
  <div class="p-4 pb-16">
    <main class="max-w-7xl mx-auto mt-6 flex flex-col gap-8">

      <!-- Loading -->
      <div v-if="store.loading" class="py-32 flex flex-col items-center gap-4">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin"></div>
          <div class="absolute inset-3 flex items-center justify-center text-2xl">♞</div>
        </div>
        <span class="text-slate-500 text-sm">Loading tournament…</span>
      </div>

      <template v-else-if="store.activeTournament">
        <!-- ───── HEADER ───── -->
        <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-8 shadow-2xl">
          <div class="absolute inset-0 opacity-[0.03] pointer-events-none" :style="chessBoardBg"></div>
          <div class="absolute -top-16 -right-16 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div class="flex items-center gap-5">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(249,115,22,0.4)] flex-shrink-0">🏆</div>
              <div>
                <div class="flex items-center gap-3 flex-wrap">
                  <h1 class="text-3xl font-extrabold text-white">{{ store.activeTournament.name }}</h1>
                  <span :class="statusBadge(store.activeTournament.status).cls" class="text-xs font-bold px-3 py-1 rounded-full border">
                    {{ statusBadge(store.activeTournament.status).label }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-4 mt-2 text-slate-400 text-sm">
                  <span>📅 {{ formatDate(store.activeTournament.start_date) }} → {{ formatDate(store.activeTournament.end_date) }}</span>
                  <span>👥 {{ store.participants.length }}/{{ store.activeTournament.max_players }} players</span>
                </div>
              </div>
            </div>

            <!-- Invite code + back -->
            <div class="flex flex-col items-end gap-3">
              <button @click="navigateTo('/tournaments')" class="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                ← Back to Tournaments
              </button>
              <div class="flex items-center gap-3 bg-slate-800/80 border border-orange-500/20 rounded-2xl px-5 py-2.5">
                <div>
                  <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Invite Code</p>
                  <p class="text-orange-400 font-mono font-black text-xl tracking-widest">{{ store.activeTournament.invite_code }}</p>
                </div>
                <button @click="copyCode" class="text-slate-400 hover:text-orange-400 transition-colors p-1.5 hover:bg-orange-500/10 rounded-lg" title="Copy">📋</button>
              </div>

              <!-- Start tournament button (only for creator, upcoming status) -->
              <button
                v-if="isCreator && store.activeTournament.status === 'upcoming' && store.participants.length >= 2"
                @click="handleActivate"
                :disabled="store.actionLoading"
                class="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl text-sm transition-all hover:scale-105 disabled:opacity-50"
              >
                {{ store.actionLoading ? 'Starting…' : '▶ Start Tournament' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ───── TOAST ───── -->
        <Transition name="slide-down">
          <div v-if="store.successMsg || store.error"
            :class="store.error ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'"
            class="border rounded-2xl px-6 py-4 flex items-center justify-between"
          >
            <span class="font-semibold">{{ store.error || store.successMsg }}</span>
            <button @click="store.clearMessages()" class="text-slate-400 hover:text-white ml-4">✕</button>
          </div>
        </Transition>

        <!-- ───── TABS ───── -->
        <div class="flex gap-1 bg-slate-800/60 border border-white/10 rounded-2xl p-1.5 w-fit">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="activeTab === tab.id
              ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
              : 'text-slate-400 hover:text-white'"
            class="px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <!-- ═══ TAB: STANDINGS ═══ -->
        <div v-if="activeTab === 'standings'">
          <div class="relative overflow-hidden bg-slate-900/80 backdrop-blur border border-white/10 rounded-3xl shadow-2xl">
            <!-- Header bar -->
            <div class="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
              <h2 class="text-white font-extrabold text-xl flex items-center gap-2"><span class="text-orange-400">♟</span> League Table</h2>
              <span class="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full">
                {{ store.participants.length }} Players
              </span>
            </div>

            <!-- Column headers -->
            <div class="grid standings-grid px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-widest border-b border-white/5 bg-slate-900/50">
              <div>#</div>
              <div>Player</div>
              <div class="text-center">MP</div>
              <div class="text-center">W</div>
              <div class="text-center">D</div>
              <div class="text-center">L</div>
              <div class="text-center font-extrabold text-orange-500/60">Pts</div>
              <div class="text-right">Form</div>
            </div>

            <!-- Empty state -->
            <div v-if="store.standings.length === 0" class="py-16 text-center text-slate-500">
              <p class="text-3xl mb-3">📋</p>
              <p>No participants yet. Share the invite code!</p>
            </div>

            <!-- Rows -->
            <div v-else class="divide-y divide-white/[0.04]">
              <div
                v-for="(row, i) in store.standings"
                :key="row.user_id"
                class="grid standings-grid items-center px-6 py-4 transition-all duration-300 hover:bg-white/[0.03] group animate-fade-in-up"
                :style="{ animationDelay: `${i * 40}ms` }"
                :class="[
                  i === 0 ? 'bg-yellow-500/[0.04]' : '',
                  row.user_id === currentUserId ? 'ring-1 ring-orange-500/30 bg-orange-500/[0.03]' : ''
                ]"
              >
                <!-- Rank -->
                <div class="flex items-center gap-1.5">
                  <span class="font-black font-mono text-sm" :class="rankColor(i)">{{ i + 1 }}</span>
                  <span v-if="i === 0">🥇</span>
                  <span v-else-if="i === 1">🥈</span>
                  <span v-else-if="i === 2">🥉</span>
                </div>
                <!-- Player -->
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    :class="i === 0 ? 'bg-yellow-500/30 text-yellow-300 ring-1 ring-yellow-500/50' : 'bg-slate-700 text-slate-300'"
                  >
                    {{ initials(row) }}
                  </div>
                  <div>
                    <p class="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors leading-tight">
                      {{ row.first_name }} {{ row.last_name }}
                      <span v-if="row.user_id === currentUserId" class="text-orange-500/70 text-xs ml-1">(you)</span>
                    </p>
                  </div>
                </div>
                <!-- Stats -->
                <div class="text-center text-slate-400 text-sm tabular-nums">{{ row.played }}</div>
                <div class="text-center text-emerald-400 font-bold text-sm tabular-nums">{{ row.wins }}</div>
                <div class="text-center text-slate-400 text-sm tabular-nums">{{ row.draws }}</div>
                <div class="text-center text-red-400 text-sm tabular-nums">{{ row.losses }}</div>
                <!-- Points -->
                <div class="text-center">
                  <span class="font-black text-lg" :class="i === 0 ? 'text-yellow-400' : 'text-orange-400'">{{ row.points }}</span>
                </div>
                <!-- Win rate bar -->
                <div class="flex flex-col items-end gap-1">
                  <span class="text-xs font-mono text-slate-500">{{ winRate(row) }}%</span>
                  <div class="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-1000"
                      :class="i === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-orange-500 to-red-500'"
                      :style="{ width: `${winRate(row)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ TAB: SCHEDULE / CALENDAR ═══ -->
        <div v-if="activeTab === 'schedule'">

          <!-- Not enough players yet -->
          <div v-if="store.participants.length < 2" class="bg-slate-800/50 border border-white/10 rounded-3xl p-16 flex flex-col items-center text-center gap-5">
            <div class="text-5xl">🗓️</div>
            <div>
              <h3 class="text-white font-bold text-lg mb-2">Waiting for players</h3>
              <p class="text-slate-500 text-sm">Share the invite code — the schedule will appear once at least 2 players have joined.</p>
            </div>
          </div>

          <!-- Calendar timeline -->
          <div v-else class="flex flex-col gap-8">

            <!-- Preview notice (tournament not started yet) -->
            <div v-if="store.matches.length === 0" class="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-6 py-4 flex-wrap gap-3">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🔮</span>
                <div>
                  <p class="text-yellow-300 font-bold text-sm">Preview Schedule</p>
                  <p class="text-slate-500 text-xs">Dates are estimated. Start the tournament to lock in the official schedule.</p>
                </div>
              </div>
              <button
                v-if="isCreator && store.activeTournament?.status === 'upcoming'"
                @click="handleActivate"
                class="px-5 py-2 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl text-sm transition-colors flex-shrink-0"
              >
                ▶ Start Tournament
              </button>
            </div>

            <!-- Legend -->
            <div class="flex flex-wrap gap-3 text-xs">
              <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 font-semibold">🟠 Today</div>
              <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold">✅ Completed</div>
              <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-700 border border-slate-600 text-slate-400 font-semibold">⏳ Upcoming</div>
            </div>

            <!-- Date groups -->
            <div v-for="(group, gi) in scheduleByDate" :key="group.dateKey" class="flex gap-4 animate-fade-in-up" :style="{ animationDelay: `${gi * 60}ms` }">

              <!-- Date pill (left column) -->
              <div class="flex-shrink-0 flex flex-col items-center gap-2" style="width:100px">
                <div
                  class="w-full rounded-2xl p-3 text-center border transition-all"
                  :class="isToday(group.date)
                    ? 'bg-orange-500/20 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
                    : isPast(group.date)
                    ? 'bg-slate-800/40 border-white/5'
                    : 'bg-slate-800/70 border-white/10'"
                >
                  <p class="font-black text-2xl leading-none"
                    :class="isToday(group.date) ? 'text-orange-400' : isPast(group.date) ? 'text-slate-600' : 'text-white'"
                  >{{ group.date.getDate() }}</p>
                  <p class="text-[10px] font-bold uppercase tracking-wider mt-0.5"
                    :class="isToday(group.date) ? 'text-orange-400/70' : isPast(group.date) ? 'text-slate-600' : 'text-slate-400'"
                  >{{ group.date.toLocaleDateString('en-US', { month: 'short' }) }}</p>
                  <p class="text-[9px] mt-1"
                    :class="isToday(group.date) ? 'text-orange-500 font-bold' : 'text-slate-600'"
                  >{{ isToday(group.date) ? 'TODAY' : group.date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() }}</p>
                </div>
                <!-- Vertical connector line -->
                <div v-if="gi < scheduleByDate.length - 1" class="flex-1 w-px bg-white/10 min-h-8"></div>
              </div>

              <!-- Match cards (right column) -->
              <div class="flex-1 flex flex-col gap-3 pb-2">
                <div
                  v-for="match in group.matches"
                  :key="match.id"
                  class="relative overflow-hidden rounded-2xl border p-4 transition-all duration-300"
                  :class="match.result
                    ? 'bg-slate-800/40 border-white/[0.06]'
                    : isToday(group.date)
                    ? 'bg-orange-500/[0.06] border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.08)]'
                    : isPast(group.date)
                    ? 'bg-slate-800/30 border-white/5 opacity-70'
                    : 'bg-slate-800/60 border-white/10 hover:border-orange-500/30'"
                >
                  <!-- Round badge -->
                  <div class="absolute top-3 right-3">
                    <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Rnd {{ match.round }}</span>
                  </div>

                  <!-- Players row -->
                  <div class="flex items-center gap-3">
                    <!-- Player A -->
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        :class="match.result === 'a_wins' ? 'bg-emerald-500/30 text-emerald-300 ring-1 ring-emerald-500/40'
                          : match.result === 'b_wins' ? 'bg-red-500/20 text-red-400'
                          : 'bg-slate-700 text-slate-300'"
                      >
                        {{ match.player_a ? initials(match.player_a) : '?' }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-white font-semibold text-sm truncate"
                          :class="match.result === 'a_wins' ? 'text-emerald-300' : match.result === 'b_wins' ? 'text-slate-500 line-through' : ''"
                        >
                          {{ match.player_a?.first_name }} {{ match.player_a?.last_name }}
                          <span v-if="match.player_a?.user_id === currentUserId" class="text-orange-500/60 text-xs"> (you)</span>
                        </p>
                      </div>
                    </div>

                    <!-- Score center -->
                    <div class="flex-shrink-0 flex flex-col items-center gap-0.5">
                      <div v-if="match.result" class="flex items-center gap-2 font-black text-lg">
                        <span :class="match.result === 'a_wins' ? 'text-emerald-400' : match.result === 'draw' ? 'text-yellow-400' : 'text-slate-600'">
                          {{ match.result === 'a_wins' ? '1' : match.result === 'draw' ? '½' : '0' }}
                        </span>
                        <span class="text-slate-700 text-sm">–</span>
                        <span :class="match.result === 'b_wins' ? 'text-emerald-400' : match.result === 'draw' ? 'text-yellow-400' : 'text-slate-600'">
                          {{ match.result === 'b_wins' ? '1' : match.result === 'draw' ? '½' : '0' }}
                        </span>
                      </div>
                      <div v-else class="px-3 py-1.5 rounded-xl bg-slate-700/60 text-slate-500 text-xs font-bold">VS</div>
                      <span v-if="match.result" class="text-[10px] text-slate-500">
                        {{ match.result === 'draw' ? 'Draw' : match.result === 'a_wins' ? match.player_a?.first_name + ' wins' : match.player_b?.first_name + ' wins' }}
                      </span>
                    </div>

                    <!-- Player B -->
                    <div class="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <div class="min-w-0 text-right">
                        <p class="text-white font-semibold text-sm truncate"
                          :class="match.result === 'b_wins' ? 'text-emerald-300' : match.result === 'a_wins' ? 'text-slate-500 line-through' : ''"
                        >
                          {{ match.player_b?.first_name }} {{ match.player_b?.last_name }}
                          <span v-if="match.player_b?.user_id === currentUserId" class="text-orange-500/60 text-xs"> (you)</span>
                        </p>
                      </div>
                      <div
                        class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        :class="match.result === 'b_wins' ? 'bg-emerald-500/30 text-emerald-300 ring-1 ring-emerald-500/40'
                          : match.result === 'a_wins' ? 'bg-red-500/20 text-red-400'
                          : 'bg-slate-700 text-slate-300'"
                      >
                        {{ match.player_b ? initials(match.player_b) : '?' }}
                      </div>
                    </div>
                  </div>

                  <!-- Play Now / Submit result inline -->
                  <div v-if="!match.result && isPlayerInMatch(match) && !match.isPreview" class="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2">
                    <NuxtLink
                      v-if="store.activeTournament?.status === 'active'"
                      :to="`/tournaments/${route.params.id}/match/${match.id}`"
                      class="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 hover:from-orange-400 hover:to-red-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    >
                      ▶ Play Now
                    </NuxtLink>
                    <div class="flex gap-2">
                      <button @click="submitResult(match.id, 'a_wins')" class="flex-1 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                        {{ match.player_a?.first_name }} Wins
                      </button>
                      <button @click="submitResult(match.id, 'draw')" class="flex-1 py-1.5 text-xs font-bold rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-colors">
                        Draw
                      </button>
                      <button @click="submitResult(match.id, 'b_wins')" class="flex-1 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                        {{ match.player_b?.first_name }} Wins
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ═══ TAB: FIXTURES ═══ -->
        <div v-if="activeTab === 'fixtures'">
          <!-- No fixtures yet -->
          <div v-if="store.matches.length === 0" class="bg-slate-800/50 border border-white/10 rounded-3xl p-16 flex flex-col items-center text-center gap-5">
            <div class="text-5xl">📅</div>
            <div>
              <h3 class="text-white font-bold text-lg mb-2">No fixtures yet</h3>
              <p class="text-slate-500 text-sm">Fixtures are generated automatically when the tournament is started.</p>
            </div>
            <button
              v-if="isCreator && store.activeTournament.status === 'upcoming'"
              @click="handleActivate"
              class="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-colors"
            >
              ▶ Start & Generate Fixtures
            </button>
          </div>

          <!-- Grouped by round -->
          <div v-else class="flex flex-col gap-6">
            <div v-for="round in rounds" :key="round">
              <div class="flex items-center gap-3 mb-3">
                <div class="h-px flex-1 bg-white/10"></div>
                <span class="text-slate-500 text-xs font-bold uppercase tracking-widest px-3">Round {{ round }}</span>
                <div class="h-px flex-1 bg-white/10"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="match in matchesByRound(round)"
                  :key="match.id"
                  class="bg-slate-800/60 border rounded-2xl p-5 transition-all duration-300"
                  :class="match.result ? 'border-white/10' : 'border-orange-500/20'"
                >
                  <!-- Players row -->
                  <div class="flex items-center justify-between gap-3 mb-4">
                    <!-- Player A -->
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-300">
                        {{ match.player_a ? initials(match.player_a) : '?' }}
                      </div>
                      <p class="text-white font-semibold text-sm text-center leading-tight">
                        {{ match.player_a?.first_name }} {{ match.player_a?.last_name }}
                        <span v-if="match.player_a?.user_id === currentUserId" class="text-orange-500/70 text-xs block">(you)</span>
                      </p>
                    </div>

                    <!-- Score / VS -->
                    <div class="flex flex-col items-center gap-1 flex-shrink-0">
                      <div v-if="match.result" class="flex items-center gap-2 text-xl font-black">
                        <span :class="match.result === 'a_wins' ? 'text-emerald-400' : match.result === 'draw' ? 'text-yellow-400' : 'text-slate-600'">
                          {{ match.result === 'a_wins' ? '1' : match.result === 'draw' ? '½' : '0' }}
                        </span>
                        <span class="text-slate-600 text-sm">–</span>
                        <span :class="match.result === 'b_wins' ? 'text-emerald-400' : match.result === 'draw' ? 'text-yellow-400' : 'text-slate-600'">
                          {{ match.result === 'b_wins' ? '1' : match.result === 'draw' ? '½' : '0' }}
                        </span>
                      </div>
                      <div v-else class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-500 text-sm font-bold">VS</div>
                      <span v-if="match.result" class="text-[10px] text-slate-500">{{ match.result === 'draw' ? 'Draw' : match.result === 'a_wins' ? match.player_a?.first_name + ' wins' : match.player_b?.first_name + ' wins' }}</span>
                      <span v-else class="text-[10px] text-orange-500/60 font-bold uppercase tracking-wider">Pending</span>
                    </div>

                    <!-- Player B -->
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-300">
                        {{ match.player_b ? initials(match.player_b) : '?' }}
                      </div>
                      <p class="text-white font-semibold text-sm text-center leading-tight">
                        {{ match.player_b?.first_name }} {{ match.player_b?.last_name }}
                        <span v-if="match.player_b?.user_id === currentUserId" class="text-orange-500/70 text-xs block">(you)</span>
                      </p>
                    </div>
                  </div>

                  <!-- Play Now / Submit result (only if user is in this match and no result yet) -->
                  <div v-if="!match.result && isPlayerInMatch(match)" class="border-t border-white/5 pt-4 flex flex-col gap-2">
                    <NuxtLink
                      v-if="store.activeTournament?.status === 'active'"
                      :to="`/tournaments/${route.params.id}/match/${match.id}`"
                      class="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 hover:from-orange-400 hover:to-red-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    >
                      ▶ Play Now
                    </NuxtLink>
                    <p class="text-slate-600 text-[10px] text-center">or submit result manually</p>
                    <div class="flex gap-2 justify-center">
                      <button @click="submitResult(match.id, 'a_wins')" class="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                        {{ match.player_a?.first_name }} Wins
                      </button>
                      <button @click="submitResult(match.id, 'draw')" class="flex-1 py-2 text-xs font-bold rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-colors">
                        Draw
                      </button>
                      <button @click="submitResult(match.id, 'b_wins')" class="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                        {{ match.player_b?.first_name }} Wins
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ TAB: MY MATCHES ═══ -->
        <div v-if="activeTab === 'my-matches'">
          <div v-if="myMatchesList.length === 0"
            class="bg-slate-800/50 border border-white/10 rounded-3xl p-16 flex flex-col items-center text-center gap-4"
          >
            <div class="text-5xl">♟️</div>
            <p class="text-white font-bold">No matches found</p>
            <p class="text-slate-500 text-sm">
              {{ store.activeTournament?.status === 'upcoming' ? 'Your matches will appear once the tournament is started.' : 'You have no scheduled matches in this tournament.' }}
            </p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="match in myMatchesList"
              :key="match.id"
              class="bg-slate-800/60 border rounded-2xl p-5 transition-all"
              :class="match.result ? 'border-white/10' : 'border-orange-500/20'"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-slate-500 text-xs font-bold uppercase tracking-wider">Round {{ match.round }}</span>
                <span v-if="match.result" class="text-xs px-2 py-0.5 rounded-full font-bold"
                  :class="myMatchResult(match) === 'Win' ? 'bg-emerald-500/20 text-emerald-400' : myMatchResult(match) === 'Loss' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'"
                >
                  {{ myMatchResult(match) }}
                </span>
                <span v-else class="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold">Pending</span>
              </div>

              <div class="flex items-center gap-3">
                <div class="flex-1 flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {{ match.player_a ? initials(match.player_a) : '?' }}
                  </div>
                  <p class="text-white text-sm font-semibold">{{ match.player_a?.first_name }} {{ match.player_a?.last_name }}</p>
                </div>
                <span class="text-slate-600 font-bold">vs</span>
                <div class="flex-1 flex items-center gap-2 justify-end">
                  <p class="text-white text-sm font-semibold">{{ match.player_b?.first_name }} {{ match.player_b?.last_name }}</p>
                  <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {{ match.player_b ? initials(match.player_b) : '?' }}
                  </div>
                </div>
              </div>

              <!-- Play Now / Submit result -->
              <div v-if="!match.result" class="border-t border-white/5 pt-4 mt-4 flex flex-col gap-2">
                <NuxtLink
                  v-if="store.activeTournament?.status === 'active'"
                  :to="`/tournaments/${route.params.id}/match/${match.id}`"
                  class="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 hover:from-orange-400 hover:to-red-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  ▶ Play Now
                </NuxtLink>
                <p class="text-slate-600 text-[10px] text-center">or submit manually</p>
                <div class="flex gap-2">
                  <button @click="submitResult(match.id, 'a_wins')" class="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                    {{ match.player_a?.first_name }} Wins
                  </button>
                  <button @click="submitResult(match.id, 'draw')" class="flex-1 py-2 text-xs font-bold rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-colors">
                    Draw
                  </button>
                  <button @click="submitResult(match.id, 'b_wins')" class="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                    {{ match.player_b?.first_name }} Wins
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </template>

      <!-- Not found -->
      <div v-else-if="!store.loading" class="py-32 flex flex-col items-center gap-4 text-center">
        <div class="text-5xl">🚫</div>
        <p class="text-white font-bold text-xl">Tournament not found</p>
        <button @click="navigateTo('/tournaments')" class="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors">
          Back to Tournaments
        </button>
      </div>

    </main>

    <!-- Copy toast -->
    <Transition name="slide-up">
      <div v-if="copyToast" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-orange-500/40 text-orange-400 font-bold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2">
        ✓ Invite code copied!
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useTournamentStore, type TournamentParticipant } from '~/stores/tournament'

definePageMeta({ name: 'TournamentDetail', middleware: 'auth' })

const route = useRoute()
const store = useTournamentStore()
const user  = useSupabaseUser()

const currentUserId = computed(() => user.value?.id ?? null)
const isCreator     = computed(() => store.activeTournament?.created_by === currentUserId.value)

onMounted(() => store.fetchTournament(route.params.id as string))

// ── Tabs ──
const activeTab = ref('standings')
const tabs = [
  { id: 'standings',  label: 'Standings',  icon: '📊' },
  { id: 'schedule',   label: 'Schedule',   icon: '🗓️' },
  { id: 'fixtures',   label: 'Fixtures',   icon: '📅' },
  { id: 'my-matches', label: 'My Matches', icon: '♟️' },
]

// ── Rounds derived ──
const rounds = computed(() => [...new Set(store.matches.map(m => m.round))].sort((a, b) => a - b))
function matchesByRound(r: number) { return store.matches.filter(m => m.round === r) }

// ── My matches (local computed so Vue tracks both store.matches and currentUserId reactively) ──
const myMatchesList = computed(() => {
  const uid = currentUserId.value
  if (!uid) return []
  return store.matches.filter(m => m.player_a_id === uid || m.player_b_id === uid)
})

// ── Schedule: assign a date to each round spread across tournament duration ──
// Parse a DATE string safely at local noon to avoid UTC-shift issues
function parseLocalDate(s: string): Date {
  if (!s) return new Date()
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0)
}

const scheduleByDate = computed(() => {
  if (!store.activeTournament) return []

  const start      = parseLocalDate(store.activeTournament.start_date)
  const end        = parseLocalDate(store.activeTournament.end_date)
  const totalDays  = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000))

  // If no matches yet, generate a PREVIEW from participants (round-robin skeleton)
  const matchList = store.matches.length > 0
    ? store.matches
    : buildPreviewMatches()

  const totalRounds = matchList.length > 0
    ? Math.max(...matchList.map((m: any) => m.round))
    : 1

  function roundDate(round: number): Date {
    const offset = totalRounds === 1
      ? 0
      : Math.round(((round - 1) / (totalRounds - 1)) * totalDays)
    const d = new Date(start)
    d.setDate(d.getDate() + offset)
    return d
  }

  const map = new Map<string, { date: Date; dateKey: string; matches: any[] }>()
  for (const match of matchList) {
    const date = roundDate(match.round)
    // Use local date key: YYYY-MM-DD
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
    if (!map.has(key)) map.set(key, { date, dateKey: key, matches: [] })
    map.get(key)!.matches.push(match)
  }

  return [...map.values()].sort((a, b) => a.dateKey.localeCompare(b.dateKey))
})

// Build a preview skeleton of matches from participants (round-robin)
function buildPreviewMatches() {
  const ps = store.participants
  if (ps.length < 2) return []
  const ids = [...ps]
  if (ids.length % 2 !== 0) ids.push({ user_id: 'BYE', first_name: 'BYE', last_name: '', avatar_url: '' } as any)
  const n = ids.length
  const preview: any[] = []
  for (let r = 0; r < n - 1; r++) {
    for (let m = 0; m < n / 2; m++) {
      const a = ids[m], b = ids[n - 1 - m]
      if (a.user_id !== 'BYE' && b.user_id !== 'BYE') {
        preview.push({ id: `preview-${r}-${m}`, round: r + 1, result: null,
          player_a_id: a.user_id, player_b_id: b.user_id,
          player_a: a, player_b: b, isPreview: true })
      }
    }
    const last = ids.pop()!; ids.splice(1, 0, last)
  }
  return preview
}

function fmtScheduleDate(d: Date) {
  const today    = new Date()
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1)
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString()
  if (same(d, today))    return { label: 'Today',    sub: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) }
  if (same(d, tomorrow)) return { label: 'Tomorrow', sub: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) }
  return {
    label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    sub:   d.toLocaleDateString('en-US', { year: 'numeric' }),
  }
}

function isToday(d: Date) {
  const now = new Date()
  return d.getFullYear() === now.getFullYear() &&
         d.getMonth() === now.getMonth() &&
         d.getDate() === now.getDate()
}
function isPast(d: Date) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const cmp = new Date(d); cmp.setHours(0, 0, 0, 0)
  return cmp < now
}

// ── Helpers ──
function initials(p: { first_name: string; last_name: string }) {
  return ((p.first_name?.[0] || '') + (p.last_name?.[0] || '')).toUpperCase() || '?'
}
function winRate(row: { wins: number; played: number }) {
  if (!row.played) return 0
  return Math.round((row.wins / row.played) * 100)
}
function rankColor(i: number) {
  if (i === 0) return 'text-yellow-400'
  if (i === 1) return 'text-slate-300'
  if (i === 2) return 'text-amber-600'
  return 'text-slate-600'
}
function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function statusBadge(status: string) {
  if (status === 'active')   return { cls: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', label: '🟢 Active' }
  if (status === 'upcoming') return { cls: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',   label: '🟡 Upcoming' }
  return                            { cls: 'bg-slate-700 border-slate-600 text-slate-400',             label: '⚫ Finished' }
}
function isPlayerInMatch(match: any) {
  return match.player_a_id === currentUserId.value || match.player_b_id === currentUserId.value
}
function myMatchResult(match: any) {
  if (!match.result) return null
  const isA = match.player_a_id === currentUserId.value
  if (match.result === 'draw') return 'Draw'
  if ((isA && match.result === 'a_wins') || (!isA && match.result === 'b_wins')) return 'Win'
  return 'Loss'
}

// ── Actions ──
async function handleActivate() {
  await store.activateTournament(route.params.id as string)
}
async function submitResult(matchId: string, result: 'a_wins' | 'b_wins' | 'draw') {
  await store.submitResult(matchId, result)
}

// ── Copy invite code ──
const copyToast = ref(false)
function copyCode() {
  if (!store.activeTournament) return
  navigator.clipboard.writeText(store.activeTournament.invite_code).catch(() => {})
  copyToast.value = true
  setTimeout(() => { copyToast.value = false }, 2500)
}

// ── Chessboard background ──
const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}
</script>

<style scoped>
.standings-grid {
  display: grid;
  grid-template-columns: 2.5rem 1fr 2.5rem 2.5rem 2.5rem 2.5rem 3rem 6rem;
  gap: 0.5rem;
  align-items: center;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.4s ease-out both; }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>
