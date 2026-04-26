<template>
  <div class="bg-slate-800/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 overflow-hidden flex flex-col h-full">
    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      Recent Games
    </h3>

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="games.length === 0" class="flex-1 flex flex-col items-center justify-center text-slate-500 italic py-12">
      <p>No games played yet.</p>
    </div>

    <div v-else class="flex-1 overflow-y-auto pr-2 space-y-3">
      <div 
        v-for="game in games" 
        :key="game.id"
        class="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all group"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs text-slate-500">
            {{ formatDate(game.created_at) }}
          </span>
          <span 
            :class="[
              'text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider',
              game.winner === 'White' ? 'bg-white text-black' : (game.winner === 'Black' ? 'bg-black text-white border border-white/20' : 'bg-slate-600 text-white')
            ]"
          >
            {{ game.result }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-white">{{ game.white_name }}</span>
            <span class="text-[10px] text-slate-400">White</span>
          </div>
          <div class="text-slate-600 font-bold">vs</div>
          <div class="flex flex-col items-end">
            <span class="text-sm font-semibold text-white">{{ game.black_name }}</span>
            <span class="text-[10px] text-slate-400">Black</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const games = ref<any[]>([])
const loading = ref(true)

const fetchGames = async () => {
  if (!user.value?.id) return
  
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    games.value = data || []
  } catch (e) {
    console.error('Error fetching games:', e)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(fetchGames)

// Re-fetch when a new game is saved
defineExpose({ fetchGames })
</script>
