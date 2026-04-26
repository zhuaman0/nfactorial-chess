<template>
  <div class="p-4 pb-16">
    <main class="max-w-7xl mx-auto mt-6 flex flex-col gap-8">

      <!-- ───── HERO HEADER ───── -->
      <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-10 shadow-2xl">
        <!-- Chessboard overlay -->
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" :style="chessBoardBg"></div>
        <!-- Glow orbs -->
        <div class="absolute -top-20 -right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-20 -left-16 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div class="flex items-center gap-4 mb-4">
              <div class="relative">
                <div class="absolute inset-0 rounded-2xl bg-orange-500/40 animate-ping-slow"></div>
                <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(249,115,22,0.5)]">
                  🏆
                </div>
              </div>
              <div>
                <h1 class="text-4xl font-extrabold text-white tracking-tight">Tournaments</h1>
                <p class="text-slate-400 mt-1">Create a league. Invite your rivals. Dominate the board.</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 mt-6">
              <div class="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-orange-500/20 rounded-xl">
                <span class="text-lg">⚔️</span>
                <span class="text-slate-300 text-sm font-medium">Round-robin format</span>
              </div>
              <div class="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-orange-500/20 rounded-xl">
                <span class="text-lg">👥</span>
                <span class="text-slate-300 text-sm font-medium">Up to 10 players</span>
              </div>
              <div class="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-orange-500/20 rounded-xl">
                <span class="text-lg">📅</span>
                <span class="text-slate-300 text-sm font-medium">Custom duration</span>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              id="btn-create-tournament"
              @click="showCreate = true"
              class="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center gap-2"
            >
              <span class="text-xl">+</span> Create Tournament
            </button>
            <button
              id="btn-join-tournament"
              @click="showJoin = true"
              class="px-8 py-3.5 bg-slate-700 hover:bg-slate-600 border border-orange-500/30 hover:border-orange-500/60 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span class="text-xl">🔗</span> Join by Code
            </button>
          </div>
        </div>
      </div>

      <!-- ───── TOAST MESSAGES ───── -->
      <Transition name="slide-down">
        <div v-if="store.successMsg || store.error"
          :class="store.error ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'"
          class="border rounded-2xl px-6 py-4 flex items-center justify-between"
        >
          <span class="font-semibold">{{ store.error || store.successMsg }}</span>
          <button @click="store.clearMessages()" class="text-slate-400 hover:text-white ml-4">✕</button>
        </div>
      </Transition>

      <!-- ───── LOADING ───── -->
      <div v-if="store.loading" class="py-20 flex flex-col items-center gap-4">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin"></div>
          <div class="absolute inset-3 flex items-center justify-center text-2xl">♞</div>
        </div>
        <span class="text-slate-500 text-sm">Loading your tournaments...</span>
      </div>

      <!-- ───── MY TOURNAMENTS LIST ───── -->
      <div v-else>
        <!-- Empty state -->
        <div v-if="store.myTournaments.length === 0" class="bg-slate-800/50 border border-white/10 rounded-3xl p-16 flex flex-col items-center text-center gap-5">
          <div class="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-4xl">🏆</div>
          <div>
            <h2 class="text-white font-bold text-xl mb-2">No tournaments yet</h2>
            <p class="text-slate-500 text-sm max-w-sm">Create your own league or join one with an invite code. Compete in a football-style round-robin and prove who's the best!</p>
          </div>
          <div class="flex gap-3 mt-2">
            <button @click="showCreate = true" class="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-colors">
              Create First Tournament
            </button>
            <button @click="showJoin = true" class="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 border border-white/10 text-white font-bold rounded-xl transition-colors">
              Join by Code
            </button>
          </div>
        </div>

        <!-- Cards grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="t in store.myTournaments"
            :key="t.id"
            @click="navigateTo(`/tournaments/${t.id}`)"
            class="group relative overflow-hidden bg-slate-800/70 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:-translate-y-1"
          >
            <!-- Status glow -->
            <div v-if="t.status === 'active'" class="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-lg flex-shrink-0">
                  🏆
                </div>
                <div>
                  <h3 class="text-white font-bold text-base group-hover:text-orange-400 transition-colors">{{ t.name }}</h3>
                  <p class="text-slate-500 text-xs mt-0.5">{{ t.participant_count }}/{{ t.max_players }} players</p>
                </div>
              </div>
              <span :class="statusBadge(t.status).cls" class="text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 flex-shrink-0">
                {{ statusBadge(t.status).label }}
              </span>
            </div>

            <!-- Dates -->
            <div class="flex gap-3 mb-4">
              <div class="flex-1 bg-slate-900/50 rounded-xl p-3 text-center">
                <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Start</p>
                <p class="text-slate-200 text-sm font-semibold">{{ formatDate(t.start_date) }}</p>
              </div>
              <div class="flex-1 bg-slate-900/50 rounded-xl p-3 text-center">
                <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">End</p>
                <p class="text-slate-200 text-sm font-semibold">{{ formatDate(t.end_date) }}</p>
              </div>
            </div>

            <!-- Invite code -->
            <div class="flex items-center justify-between bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2.5">
              <div>
                <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Invite Code</p>
                <p class="text-orange-400 font-mono font-black text-lg tracking-widest">{{ t.invite_code }}</p>
              </div>
              <button
                @click.stop="copyCode(t.invite_code)"
                class="text-slate-400 hover:text-orange-400 transition-colors p-1.5 hover:bg-orange-500/10 rounded-lg"
                title="Copy code"
              >
                📋
              </button>
            </div>

            <!-- Players progress bar -->
            <div class="mt-3">
              <div class="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-700"
                  :style="{ width: `${((t.participant_count || 0) / t.max_players) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- ═══════════════════ CREATE MODAL ═══════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreate" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="showCreate = false"></div>
          <div class="relative bg-slate-900 border border-orange-500/30 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-orange-500/10">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <h2 class="text-white font-extrabold text-2xl mb-1 flex items-center gap-2">🏆 Create Tournament</h2>
            <p class="text-slate-500 text-sm mb-7">Set up your league. Share the invite code with friends.</p>

            <div class="flex flex-col gap-5">
              <div>
                <label class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Tournament Name</label>
                <input
                  v-model="form.name"
                  id="input-tournament-name"
                  type="text"
                  placeholder="e.g. Spring Cup 2026"
                  class="w-full bg-slate-800 border border-white/10 focus:border-orange-500/60 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-colors"
                />
              </div>
              <div>
                <label class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Max Players (2–10)</label>
                <input
                  v-model.number="form.maxPlayers"
                  id="input-max-players"
                  type="number"
                  min="2"
                  max="10"
                  class="w-full bg-slate-800 border border-white/10 focus:border-orange-500/60 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Start Date</label>
                  <input
                    v-model="form.startDate"
                    id="input-start-date"
                    type="date"
                    class="w-full bg-slate-800 border border-white/10 focus:border-orange-500/60 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                  />
                </div>
                <div>
                  <label class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">End Date</label>
                  <input
                    v-model="form.endDate"
                    id="input-end-date"
                    type="date"
                    class="w-full bg-slate-800 border border-white/10 focus:border-orange-500/60 rounded-xl px-4 py-3 text-white outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div class="flex gap-3 mt-8">
              <button
                @click="showCreate = false"
                class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-create"
                @click="handleCreate"
                :disabled="store.actionLoading || !form.name || !form.startDate || !form.endDate"
                class="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              >
                {{ store.actionLoading ? 'Creating…' : 'Create 🏆' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════ JOIN MODAL ═══════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showJoin" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="showJoin = false"></div>
          <div class="relative bg-slate-900 border border-orange-500/30 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h2 class="text-white font-extrabold text-2xl mb-1 flex items-center gap-2">🔗 Join Tournament</h2>
            <p class="text-slate-500 text-sm mb-7">Enter the 6-character invite code you received.</p>

            <input
              v-model="joinCode"
              id="input-join-code"
              type="text"
              placeholder="e.g. AB3XY7"
              maxlength="6"
              class="w-full bg-slate-800 border border-white/10 focus:border-orange-500/60 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-colors text-center text-2xl font-mono tracking-widest uppercase"
              @input="joinCode = joinCode.toUpperCase()"
            />

            <div class="flex gap-3 mt-7">
              <button
                @click="showJoin = false"
                class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-join"
                @click="handleJoin"
                :disabled="store.actionLoading || joinCode.length < 4"
                class="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                {{ store.actionLoading ? 'Joining…' : 'Join 🔗' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ───── COPY TOAST ───── -->
    <Transition name="slide-up">
      <div v-if="copyToast" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-orange-500/40 text-orange-400 font-bold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2">
        ✓ Invite code copied!
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { useTournamentStore } from '~/stores/tournament'

definePageMeta({ middleware: 'auth' })

const store = useTournamentStore()

onMounted(() => store.fetchMyTournaments())

// ── Modals ──
const showCreate = ref(false)
const showJoin   = ref(false)
const joinCode   = ref('')

// ── Create form ──
const form = reactive({
  name: '',
  maxPlayers: 10,
  startDate: '',
  endDate: '',
})

async function handleCreate() {
  const result = await store.createTournament({
    name: form.name,
    maxPlayers: form.maxPlayers,
    startDate: form.startDate,
    endDate: form.endDate,
  })
  if (result) {
    showCreate.value = false
    form.name = ''
    form.startDate = ''
    form.endDate = ''
    navigateTo(`/tournaments/${result.id}`)
  }
}

async function handleJoin() {
  const result = await store.joinByCode(joinCode.value)
  if (result) {
    showJoin.value = false
    joinCode.value = ''
    navigateTo(`/tournaments/${result.id}`)
  }
}

// ── Copy invite code ──
const copyToast = ref(false)
function copyCode(code: string) {
  navigator.clipboard.writeText(code).catch(() => {})
  copyToast.value = true
  setTimeout(() => { copyToast.value = false }, 2500)
}

// ── Helpers ──
function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusBadge(status: string) {
  if (status === 'active')   return { cls: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400', label: '🟢 Active' }
  if (status === 'upcoming') return { cls: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',   label: '🟡 Upcoming' }
  return                            { cls: 'bg-slate-700 border-slate-600 text-slate-400',             label: '⚫ Finished' }
}

// ── Chessboard background ──
const chessBoardBg = {
  backgroundImage: `repeating-conic-gradient(#ffffff 0% 25%, transparent 0% 50%)`,
  backgroundSize: '40px 40px',
}
</script>

<style scoped>
@keyframes ping-slow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50%       { transform: scale(1.25); opacity: 0; }
}
.animate-ping-slow { animation: ping-slow 2.5s ease-in-out infinite; }

/* Modal transition */
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s, transform 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }

/* Slide transitions */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>
