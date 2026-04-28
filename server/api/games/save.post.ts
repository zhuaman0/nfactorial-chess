import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = await readRawBody(event, 'utf8') || ''
  let body: { userId?: string; whiteName?: string; blackName?: string; winner?: string; result?: string; moves?: string[]; fen?: string } = {}
  try { body = JSON.parse(raw) } catch { body = {} }

  const { userId, whiteName, blackName, winner, result, moves, fen } = body
  if (!userId || !moves?.length) {
    throw createError({ statusCode: 400, statusMessage: 'userId and moves required' })
  }

  const supabase = createClient(
    (config.public.supabase.url as string).replace(/\/$/, ''),
    config.supabaseServiceKey as string
  )

  const { error } = await supabase.from('games').insert({
    user_id: userId,
    white_name: whiteName,
    black_name: blackName,
    winner,
    result,
    moves,
    fen,
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true }
})
