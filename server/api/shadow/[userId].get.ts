// Returns a defender's opening fingerprint + estimated ELO built from their game history.
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  if (!userId) throw createError({ statusCode: 400, statusMessage: 'userId required' })

  const config = useRuntimeConfig()
  const supabase = createClient(process.env.SUPABASE_URL!, config.supabaseServiceKey)

  // Fetch last 20 games this player played as white
  const { data: games } = await supabase
    .from('games')
    .select('moves, result')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (!games || games.length === 0) {
    return { opening_moves: [], estimated_elo: 800, games_analyzed: 0 }
  }

  // Build opening book: collect first 10 moves from each game
  const openingMap: Record<string, number> = {}
  let wins = 0

  for (const game of games) {
    if (!Array.isArray(game.moves)) continue
    const key = (game.moves as string[]).slice(0, 10).join(',')
    openingMap[key] = (openingMap[key] ?? 0) + 1
    if (game.result === '1-0') wins++
  }

  // Pick the most-played opening sequence
  const sortedOpenings = Object.entries(openingMap).sort((a, b) => b[1] - a[1])
  const topOpening = sortedOpenings[0]?.[0]?.split(',') ?? []

  // Rough ELO estimate based on win rate
  const winRate = wins / games.length
  const estimated_elo = Math.round(600 + winRate * 1200) // 600–1800 range

  // Upsert shadow profile so it's cached
  await supabase.from('shadow_profiles').upsert({
    user_id: userId,
    opening_moves: topOpening,
    estimated_elo,
    games_analyzed: games.length,
    updated_at: new Date().toISOString(),
  })

  return { opening_moves: topOpening, estimated_elo, games_analyzed: games.length }
})
