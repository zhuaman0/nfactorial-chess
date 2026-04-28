import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const raw = await readRawBody(event, 'utf8') || ''
  let body: { attackerId?: string; defenderId?: string; won?: boolean; goldStake?: number } = {}
  try { body = JSON.parse(raw) } catch { body = {} }

  const { attackerId, defenderId, won, goldStake = 0 } = body
  if (!attackerId || !defenderId) {
    throw createError({ statusCode: 400, statusMessage: 'attackerId and defenderId required' })
  }

  const supabase = createClient(
    (config.public.supabase.url as string).replace(/\/$/, ''),
    config.supabaseServiceKey as string
  )

  if (won) {
    // Attacker wins: gold flows defender → attacker
    await supabase.rpc('transfer_gold', {
      p_from:   defenderId,
      p_to:     attackerId,
      p_amount: goldStake,
    })
    await supabase.rpc('increment_raid_wins', { p_user_id: attackerId })
  } else {
    // Attacker loses: gold flows attacker → defender
    await supabase.rpc('transfer_gold', {
      p_from:   attackerId,
      p_to:     defenderId,
      p_amount: goldStake,
    })
    await supabase.rpc('increment_defense_wins', { p_user_id: defenderId })
  }

  // Record raid in history
  await supabase.from('raids').insert({
    attacker_id:  attackerId,
    defender_id:  defenderId,
    status:       won ? 'won' : 'lost',
    gold_stake:   goldStake,
    completed_at: new Date().toISOString(),
  })

  // Return fresh gold balances
  const [{ data: atk }, { data: def }] = await Promise.all([
    supabase.from('profiles').select('gold_balance').eq('id', attackerId).single(),
    supabase.from('profiles').select('gold_balance').eq('id', defenderId).single(),
  ])

  return {
    attackerGold: atk?.gold_balance ?? 0,
    defenderGold: def?.gold_balance ?? 0,
  }
})
