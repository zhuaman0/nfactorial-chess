import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  if (!userId) throw createError({ statusCode: 400, statusMessage: 'userId required' })

  const config = useRuntimeConfig()
  const supabaseUrl = (config.public.supabase.url as string).replace(/\/$/, '')
  const supabaseKey = config.supabaseServiceKey as string

  if (!supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase env not configured' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Fetch last 20 games this player played
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('moves, result')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (gamesError) {
      console.error('[shadow] games fetch error:', gamesError)
    }

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
    const topOpening = sortedOpenings[0]?.[0]?.split(',').filter(Boolean) ?? []

    // Rough ELO estimate based on win rate
    const winRate = wins / games.length
    const estimated_elo = Math.round(600 + winRate * 1200) // 600–1800 range

    // Cache the shadow profile (ignore upsert errors — non-critical)
    const { error: upsertError } = await supabase
      .from('shadow_profiles')
      .upsert(
        {
          user_id: userId,
          opening_moves: topOpening,
          estimated_elo,
          games_analyzed: games.length,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (upsertError) {
      console.error('[shadow] upsert error:', upsertError)
    }

    return { opening_moves: topOpening, estimated_elo, games_analyzed: games.length }
  } catch (err) {
    console.error('[shadow] unexpected error:', err)
    // Fall back to a default profile so the game can still start
    return { opening_moves: [], estimated_elo: 800, games_analyzed: 0 }
  }
})
