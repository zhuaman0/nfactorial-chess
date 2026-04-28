<template>
  <div class="p-4 pb-16">
    <main class="max-w-3xl mx-auto mt-6 flex flex-col gap-6">

      <!-- Back -->
      <button @click="navigateTo('/quests')" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm w-fit">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Back to Quests
      </button>

      <!-- Loading -->
      <div v-if="questsStore.loading" class="flex flex-col items-center gap-4 py-20">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 rounded-full border-4 border-orange-500/10 border-t-orange-500 animate-spin"></div>
          <div class="absolute inset-3 flex items-center justify-center text-2xl">⚔️</div>
        </div>
      </div>

      <!-- Not found -->
      <div v-else-if="!quest" class="py-20 text-center">
        <p class="text-6xl mb-4">😕</p>
        <p class="text-white font-bold text-lg">Quest not found</p>
        <UiButton variant="primary" class="!w-auto px-8 mt-6" @click="navigateTo('/quests')">Back to Quests</UiButton>
      </div>

      <!-- Quest loaded -->
      <template v-else>

        <!-- Quest header card -->
        <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border rounded-3xl p-8 shadow-2xl"
          :class="tier.borderClass">
          <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none" :class="tier.glowClass"></div>

          <div class="relative flex items-start gap-5">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border flex-shrink-0" :class="tier.badgeClass">
              {{ quest.icon }}
            </div>
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span class="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase" :class="tier.badgeClass">
                  {{ tier.piece }} <span :class="tier.nameClass">{{ tier.label }}</span>
                </span>
                <span :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border',
                  quest.type === 'quiz' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                ]">{{ quest.type === 'quiz' ? '📋 Quiz' : '♞ Trainer' }}</span>
                <span class="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] font-bold uppercase">+{{ quest.points }} XP</span>
                <span v-if="isCompleted" class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  Completed
                </span>
              </div>
              <h1 class="text-2xl font-extrabold text-white mb-1">{{ quest.title }}</h1>
              <p class="text-slate-400 text-sm">{{ quest.description }}</p>
            </div>
          </div>
        </div>

        <!-- ─── QUIZ UI ─── -->
        <template v-if="quest.type === 'quiz' && quest.content.questions">

          <!-- Finished screen -->
          <div v-if="quizState.finished" class="bg-slate-900/80 border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-6 text-center animate-fade-in-up">
            <div class="text-7xl">{{ scoreEmoji }}</div>
            <div>
              <p class="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Quest Complete!</p>
              <h2 class="text-4xl font-extrabold text-white">{{ quizState.score }} / {{ quest.content.questions.length }}</h2>
              <p class="text-slate-400 mt-1">questions correct</p>
            </div>
            <div class="w-full max-w-xs bg-slate-800 rounded-full h-3 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-1000"
                :style="{ width: `${(quizState.score / quest.content.questions.length) * 100}%` }"></div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-2xl">⭐</span>
              <span class="text-yellow-400 font-black text-2xl">+{{ xpEarned }} XP earned</span>
            </div>
            <div class="flex gap-3 flex-wrap justify-center">
              <UiButton variant="primary" class="!w-auto px-8" @click="navigateTo('/quests')">Back to Quests</UiButton>
              <UiButton variant="outline" class="!w-auto px-8" @click="restartQuiz">Try Again</UiButton>
            </div>
          </div>

          <!-- Active quiz -->
          <template v-else>
            <!-- Progress bar -->
            <div class="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <span class="text-slate-500 text-xs font-bold uppercase tracking-widest shrink-0">
                Question {{ quizState.currentIndex + 1 }} / {{ quest.content.questions.length }}
              </span>
              <div class="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                  :style="{ width: `${((quizState.currentIndex) / quest.content.questions.length) * 100}%` }">
                </div>
              </div>
              <span class="text-orange-400 font-bold text-sm shrink-0">{{ quizState.score }} ✓</span>
            </div>

            <!-- Question card -->
            <div v-if="currentQuestion" class="bg-slate-900/80 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 animate-fade-in-up">
              <h2 class="text-white font-bold text-xl leading-snug">{{ currentQuestion.question }}</h2>

              <!-- Options -->
              <div class="flex flex-col gap-3">
                <button
                  v-for="(option, idx) in currentQuestion.options"
                  :key="idx"
                  :disabled="quizState.answered"
                  @click="selectAnswer(idx)"
                  :class="[
                    'w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all duration-300',
                    optionClass(idx)
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black flex-shrink-0"
                      :class="optionLetterClass(idx)">
                      {{ ['A','B','C','D'][idx] }}
                    </span>
                    <span>{{ option }}</span>
                    <span v-if="quizState.answered && idx === currentQuestion.correct" class="ml-auto text-emerald-400 flex-shrink-0">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    </span>
                    <span v-else-if="quizState.answered && idx === quizState.selectedAnswer && idx !== currentQuestion.correct" class="ml-auto text-red-400 flex-shrink-0">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </span>
                  </div>
                </button>
              </div>

              <!-- Explanation -->
              <div v-if="quizState.answered" class="rounded-2xl p-4 border animate-fade-in-up"
                :class="quizState.selectedAnswer === currentQuestion.correct
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'">
                <p class="font-bold text-sm mb-1">{{ quizState.selectedAnswer === currentQuestion.correct ? '✓ Correct!' : '✗ Not quite.' }}</p>
                <p class="text-sm opacity-90">{{ currentQuestion.explanation }}</p>
              </div>

              <!-- Next button -->
              <UiButton v-if="quizState.answered" variant="primary" class="!w-auto self-end px-8" @click="nextQuestion">
                {{ quizState.currentIndex + 1 < (quest.content.questions?.length ?? 0) ? 'Next Question →' : 'See Results 🏆' }}
              </UiButton>
            </div>
          </template>
        </template>

        <!-- ─── PIECE TRAINING UI ─── -->
        <template v-if="quest.type === 'piece_training' && quest.content.steps">

          <!-- Completed screen -->
          <div v-if="trainerState.finished" class="bg-slate-900/80 border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-6 text-center animate-fade-in-up">
            <div class="text-7xl">{{ quest.content.piece_symbol ?? '♟' }}</div>
            <div>
              <p class="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Training Complete!</p>
              <h2 class="text-3xl font-extrabold text-white">You mastered the {{ quest.content.piece_symbol }}</h2>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-2xl">⭐</span>
              <span class="text-yellow-400 font-black text-2xl">+{{ quest.points }} XP earned</span>
            </div>
            <div class="flex gap-3 flex-wrap justify-center">
              <UiButton variant="primary" class="!w-auto px-8" @click="navigateTo('/quests')">Back to Quests</UiButton>
              <UiButton variant="outline" class="!w-auto px-8" @click="restartTrainer">Replay</UiButton>
            </div>
          </div>

          <!-- Active trainer -->
          <template v-else>
            <!-- Step progress -->
            <div class="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <span class="text-slate-500 text-xs font-bold uppercase tracking-widest shrink-0">
                Step {{ trainerState.currentStep + 1 }} / {{ quest.content.steps.length }}
              </span>
              <div class="flex-1 flex gap-1">
                <div
                  v-for="(_, i) in quest.content.steps"
                  :key="i"
                  class="flex-1 h-2 rounded-full transition-all duration-500"
                  :class="i <= trainerState.currentStep ? 'bg-orange-500' : 'bg-white/5'"
                ></div>
              </div>
            </div>

            <!-- Board + info card -->
            <div v-if="currentStep" class="bg-slate-900/80 border border-white/10 rounded-3xl p-8 flex flex-col lg:flex-row gap-8 animate-fade-in-up">

              <!-- Chess board -->
              <div class="flex-shrink-0 flex flex-col items-center gap-3">
                <div class="relative inline-block rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700">
                  <div class="grid grid-cols-8">
                    <div
                      v-for="(sq, idx) in boardSquares"
                      :key="idx"
                      class="w-10 h-10 flex items-center justify-center text-xl relative transition-all duration-300"
                      :class="squareClass(sq)"
                    >
                      <span v-if="sq.hasPiece" class="relative z-10 drop-shadow-lg select-none" style="text-shadow: 0 2px 8px rgba(0,0,0,0.8);">
                        {{ quest.content.piece_symbol }}
                      </span>
                      <!-- Move dot -->
                      <span v-else-if="sq.isValidMove" class="w-3 h-3 rounded-full bg-orange-400/80 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                    </div>
                  </div>
                </div>
                <!-- File labels -->
                <div class="flex gap-0 text-slate-600 text-xs font-mono" style="padding-left: 2px;">
                  <span v-for="f in files" :key="f" class="w-10 text-center">{{ f }}</span>
                </div>
              </div>

              <!-- Step info -->
              <div class="flex-1 flex flex-col justify-between gap-6">
                <div>
                  <h2 class="text-2xl font-extrabold text-white mb-3">{{ currentStep.title }}</h2>
                  <p class="text-slate-300 leading-relaxed">{{ currentStep.description }}</p>

                  <div class="mt-4 flex flex-wrap gap-3">
                    <div class="flex items-center gap-2 text-xs text-slate-400">
                      <span class="w-4 h-4 rounded-full bg-orange-400/80 inline-block shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                      Valid move squares
                    </div>
                    <div class="flex items-center gap-2 text-xs text-slate-400">
                      <span class="text-lg leading-none">{{ quest.content.piece_symbol }}</span>
                      Current piece position
                    </div>
                  </div>
                </div>

                <!-- Navigation -->
                <div class="flex items-center justify-between gap-3">
                  <UiButton
                    v-if="trainerState.currentStep > 0"
                    variant="outline"
                    class="!w-auto px-6"
                    @click="trainerState.currentStep--"
                  >← Prev</UiButton>
                  <div v-else></div>
                  <UiButton variant="primary" class="!w-auto px-8" @click="advanceTrainer">
                    {{ trainerState.currentStep + 1 < (quest.content.steps?.length ?? 0) ? 'Next Step →' : 'Complete ✓' }}
                  </UiButton>
                </div>
              </div>
            </div>
          </template>
        </template>

      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useQuestsStore } from '~/stores/quests'
import type { Quest } from '~/stores/quests'

definePageMeta({ name: 'QuestDetail' })

const route = useRoute()
const questsStore = useQuestsStore()

onMounted(async () => {
  if (!questsStore.quests.length) await questsStore.fetchQuests()
  await questsStore.startQuest(route.params.id as string)
})

const quest = computed((): Quest | undefined => questsStore.getQuestById(route.params.id as string))

const isCompleted = computed(() =>
  questsStore.userQuests.find(uq => uq.quest_id === quest.value?.id)?.status === 'completed'
)

// ── Level tier ──
const levelTiers = [
  { level: 'pawn',   piece: '♙', label: 'Pawn',   badgeClass: 'bg-slate-700/80 border-slate-600',        nameClass: 'text-slate-300',   borderClass: 'border-slate-700',        glowClass: 'bg-slate-500/10' },
  { level: 'knight', piece: '♘', label: 'Knight', badgeClass: 'bg-orange-500/20 border-orange-500/40',   nameClass: 'text-orange-400',  borderClass: 'border-orange-500/30',    glowClass: 'bg-orange-500/15' },
  { level: 'bishop', piece: '♗', label: 'Bishop', badgeClass: 'bg-emerald-500/20 border-emerald-500/40', nameClass: 'text-emerald-400', borderClass: 'border-emerald-500/30',   glowClass: 'bg-emerald-500/15' },
  { level: 'rook',   piece: '♖', label: 'Rook',   badgeClass: 'bg-blue-500/20 border-blue-500/40',       nameClass: 'text-blue-400',    borderClass: 'border-blue-500/30',      glowClass: 'bg-blue-500/15' },
  { level: 'queen',  piece: '♕', label: 'Queen',  badgeClass: 'bg-purple-500/20 border-purple-500/40',   nameClass: 'text-purple-400',  borderClass: 'border-purple-500/30',    glowClass: 'bg-purple-500/15' },
  { level: 'king',   piece: '♔', label: 'King',   badgeClass: 'bg-yellow-500/20 border-yellow-500/40',   nameClass: 'text-yellow-400',  borderClass: 'border-yellow-500/30',    glowClass: 'bg-yellow-500/20' },
]
const tier = computed(() => levelTiers.find(t => t.level === quest.value?.level) ?? levelTiers[0]!)

// ──────────────────────────────────────────────────────────────────────────────
// QUIZ LOGIC
// ──────────────────────────────────────────────────────────────────────────────
const quizState = reactive({
  currentIndex: 0,
  selectedAnswer: null as number | null,
  answered: false,
  score: 0,
  finished: false,
})

const currentQuestion = computed(() => quest.value?.content.questions?.[quizState.currentIndex])

function selectAnswer(idx: number) {
  if (quizState.answered) return
  quizState.selectedAnswer = idx
  quizState.answered = true
  if (idx === currentQuestion.value?.correct) quizState.score++
}

async function nextQuestion() {
  const questions = quest.value?.content.questions
  if (!questions) return
  if (quizState.currentIndex + 1 < questions.length) {
    quizState.currentIndex++
    quizState.selectedAnswer = null
    quizState.answered = false
  } else {
    quizState.finished = true
    const earned = Math.round((quizState.score / questions.length) * (quest.value?.points ?? 0))
    await questsStore.completeQuest(quest.value!.id, earned)
  }
}

function restartQuiz() {
  quizState.currentIndex = 0
  quizState.selectedAnswer = null
  quizState.answered = false
  quizState.score = 0
  quizState.finished = false
}

const xpEarned = computed(() => {
  const questions = quest.value?.content.questions
  if (!questions?.length) return 0
  return Math.round((quizState.score / questions.length) * (quest.value?.points ?? 0))
})

const scoreEmoji = computed(() => {
  const q = quest.value?.content.questions?.length ?? 1
  const pct = quizState.score / q
  if (pct === 1) return '🏆'
  if (pct >= 0.7) return '⭐'
  if (pct >= 0.4) return '💪'
  return '📚'
})

function optionClass(idx: number) {
  if (!quizState.answered) {
    return 'bg-slate-800/60 border-slate-700 text-slate-200 hover:border-orange-500/50 hover:bg-slate-700/60 cursor-pointer'
  }
  if (idx === currentQuestion.value?.correct) {
    return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 cursor-default'
  }
  if (idx === quizState.selectedAnswer) {
    return 'bg-red-500/20 border-red-500/50 text-red-200 cursor-default'
  }
  return 'bg-slate-800/30 border-slate-700/50 text-slate-500 cursor-default'
}

function optionLetterClass(idx: number) {
  if (!quizState.answered) return 'border-slate-600 text-slate-500'
  if (idx === currentQuestion.value?.correct) return 'border-emerald-400 text-emerald-400'
  if (idx === quizState.selectedAnswer) return 'border-red-400 text-red-400'
  return 'border-slate-700 text-slate-600'
}

// ──────────────────────────────────────────────────────────────────────────────
// PIECE TRAINER LOGIC
// ──────────────────────────────────────────────────────────────────────────────
const trainerState = reactive({
  currentStep: 0,
  finished: false,
})

const currentStep = computed(() => quest.value?.content.steps?.[trainerState.currentStep])

async function advanceTrainer() {
  const steps = quest.value?.content.steps
  if (!steps) return
  if (trainerState.currentStep + 1 < steps.length) {
    trainerState.currentStep++
  } else {
    trainerState.finished = true
    await questsStore.completeQuest(quest.value!.id, quest.value!.points)
  }
}

function restartTrainer() {
  trainerState.currentStep = 0
  trainerState.finished = false
}

// ── Board rendering ──
const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

function getValidMoves(pieceType: string, row: number, col: number): [number, number][] {
  const moves: [number, number][] = []
  const ok = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8

  switch (pieceType) {
    case 'pawn':
      if (ok(row - 1, col)) moves.push([row - 1, col])
      if (row >= 5 && ok(row - 2, col)) moves.push([row - 2, col])
      if (ok(row - 1, col - 1)) moves.push([row - 1, col - 1])
      if (ok(row - 1, col + 1)) moves.push([row - 1, col + 1])
      break
    case 'knight':
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]] as [number,number][]) {
        const r = row + dr, c = col + dc
        if (ok(r, c)) moves.push([r, c])
      }
      break
    case 'bishop':
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]] as [number,number][])
        for (let i = 1; i < 8; i++) {
          const r = row + dr * i, c = col + dc * i
          if (!ok(r, c)) break
          moves.push([r, c])
        }
      break
    case 'rook':
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]] as [number,number][])
        for (let i = 1; i < 8; i++) {
          const r = row + dr * i, c = col + dc * i
          if (!ok(r, c)) break
          moves.push([r, c])
        }
      break
    case 'queen':
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]] as [number,number][])
        for (let i = 1; i < 8; i++) {
          const r = row + dr * i, c = col + dc * i
          if (!ok(r, c)) break
          moves.push([r, c])
        }
      break
    case 'king':
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]] as [number,number][]) {
        const r = row + dr, c = col + dc
        if (ok(r, c)) moves.push([r, c])
      }
      break
  }
  return moves
}

interface BoardSquare { row: number; col: number; isLight: boolean; hasPiece: boolean; isValidMove: boolean }

const boardSquares = computed((): BoardSquare[] => {
  const step = currentStep.value
  const pieceType = quest.value?.content.piece_type ?? ''
  const pRow = step?.from_row ?? 4
  const pCol = step?.from_col ?? 4
  const validSet = new Set(
    getValidMoves(pieceType, pRow, pCol).map(([r, c]) => `${r},${c}`)
  )

  return Array.from({ length: 64 }, (_, idx) => {
    const row = Math.floor(idx / 8)
    const col = idx % 8
    return {
      row,
      col,
      isLight: (row + col) % 2 === 0,
      hasPiece: row === pRow && col === pCol,
      isValidMove: validSet.has(`${row},${col}`),
    }
  })
})

function squareClass(sq: BoardSquare) {
  if (sq.hasPiece) return 'bg-orange-500/40 shadow-inner'
  if (sq.isValidMove) return sq.isLight ? 'bg-orange-400/20' : 'bg-orange-500/25'
  return sq.isLight ? 'bg-slate-300/10' : 'bg-slate-800/60'
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.35s ease-out both; }
</style>
