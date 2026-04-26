import { defineStore } from 'pinia'
import { useProfileStore } from '~/stores/profile'

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface PieceTrainingStep {
  title: string
  description: string
  from_row: number
  from_col: number
}

export interface QuestContent {
  questions?: QuizQuestion[]
  piece_type?: string
  piece_symbol?: string
  steps?: PieceTrainingStep[]
}

export interface Quest {
  id: string
  title: string
  description: string
  type: 'quiz' | 'piece_training'
  level: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king'
  level_order: number
  points: number
  icon: string
  category: string
  content: QuestContent
  created_at: string
}

export interface UserQuest {
  id: string
  user_id: string
  quest_id: string
  status: 'in_progress' | 'completed'
  score: number
  completed_at: string | null
  created_at: string
}

export const useQuestsStore = defineStore('quests', {
  state: () => ({
    quests: [] as Quest[],
    userQuests: [] as UserQuest[],
    loading: false,
  }),

  getters: {
    questsWithProgress(state) {
      return state.quests.map(q => ({
        ...q,
        userQuest: state.userQuests.find(uq => uq.quest_id === q.id) ?? null,
      }))
    },
    totalPointsEarned(state) {
      return state.userQuests
        .filter(uq => uq.status === 'completed')
        .reduce((sum, uq) => sum + uq.score, 0)
    },
    completedCount(state) {
      return state.userQuests.filter(uq => uq.status === 'completed').length
    },
  },

  actions: {
    async fetchQuests() {
      const supabase = useSupabaseClient()
      this.loading = true
      try {
        // user_quests RLS policy (auth.uid() = user_id) handles filtering automatically.
        // Never pass user_id as a query param — it may be undefined during hydration.
        const [questsRes, userQuestsRes] = await Promise.all([
          supabase.from('quests').select('*').order('level_order').order('points'),
          supabase.from('user_quests').select('*'),
        ])
        this.quests = (questsRes.data ?? []) as Quest[]
        this.userQuests = (userQuestsRes.data ?? []) as UserQuest[]
      } finally {
        this.loading = false
      }
    },

    async startQuest(questId: string) {
      const supabase = useSupabaseClient()
      // auth.uid() inside fn_start_quest uses the JWT from the request header —
      // no need to read user.value.id client-side (avoids undefined timing issue).
      const { data, error } = await supabase.rpc('fn_start_quest', { p_quest_id: questId })
      if (error) console.error('startQuest error:', error.message)
      if (data) {
        const row = data as UserQuest
        const idx = this.userQuests.findIndex(uq => uq.quest_id === questId)
        if (idx >= 0) this.userQuests[idx] = row
        else this.userQuests.push(row)
      }
    },

    async completeQuest(questId: string, score: number) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.rpc('fn_complete_quest', {
        p_quest_id: questId,
        p_score: score,
      })
      if (error) console.error('completeQuest error:', error.message)
      if (data) {
        const row = data as UserQuest
        const idx = this.userQuests.findIndex(uq => uq.quest_id === questId)
        if (idx >= 0) this.userQuests[idx] = row
        else this.userQuests.push(row)

        // Trigger profile re-fetch so updated points from DB trigger appear immediately
        await useProfileStore().fetchProfile()
      }
    },

    getQuestById(id: string): Quest | undefined {
      return this.quests.find(q => q.id === id)
    },
  },
})
