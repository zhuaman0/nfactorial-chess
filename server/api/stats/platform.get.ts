import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const [{ count: players }, { count: games }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('games').select('*', { count: 'exact', head: true }),
  ])

  return { players: players ?? 0, games: games ?? 0 }
})
