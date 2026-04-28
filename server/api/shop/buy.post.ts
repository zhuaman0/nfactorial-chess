import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = await readRawBody(event, 'utf8') || ''
  let body: { userId?: string; skinId?: string; price?: number } = {}
  try { body = JSON.parse(raw) } catch { body = {} }

  const { userId, skinId, price } = body
  if (!userId || !skinId || price === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'userId, skinId and price required' })
  }

  const supabase = createClient(
    (config.public.supabase.url as string).replace(/\/$/, ''),
    config.supabaseServiceKey as string
  )

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('gold_balance')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  }

  if (profile.gold_balance < price) {
    throw createError({ statusCode: 402, statusMessage: 'Not enough gold' })
  }

  const newBalance = profile.gold_balance - price
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ gold_balance: newBalance })
    .eq('id', userId)

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: updateError.message })
  }

  return { ok: true, newBalance }
})
