// Resolves a raid: transfers gold between attacker and defender.
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event) as {
    attackerId: string
    defenderId: string
    won: boolean
    goldStake: number
  }

  const { attackerId, defenderId, won, goldStake } = body
  if (!attackerId || !defenderId) {
    throw createError({ statusCode: 400, statusMessage: 'attackerId and defenderId required' })
  }

  const supabase = createClient(process.env.SUPABASE_URL!, config.supabaseServiceKey)

  if (won) {
    // Attacker wins: take gold from defender, add to attacker
    await supabase.rpc('transfer_gold', {
      p_from: defenderId,
      p_to: attackerId,
      p_amount: goldStake,
    })
    await supabase.from('profiles').update({ raid_wins: supabase.rpc('increment' as any) } as any).eq('id', attackerId)
    await supabase.from('profiles').update({ defense_wins: supabase.rpc('increment' as any) } as any)
    // Simple increment via raw update
    await supabase.rpc('increment_raid_wins', { p_user_id: attackerId })
    await supabase.rpc('increment_defense_losses', { p_user_id: defenderId })
  } else {
    // Attacker loses: lose gold to defender
    await supabase.rpc('transfer_gold', {
      p_from: attackerId,
      p_to: defenderId,
      p_amount: goldStake,
    })
    await supabase.rpc('increment_defense_wins', { p_user_id: defenderId })
  }

  // Record raid in history
  await supabase.from('raids').insert({
    attacker_id: attackerId,
    defender_id: defenderId,
    status: won ? 'won' : 'lost',
    gold_stake: goldStake,
    completed_at: new Date().toISOString(),
  })

  // Return updated gold balances
  const { data: attacker } = await supabase.from('profiles').select('gold_balance').eq('id', attackerId).single()
  const { data: defender } = await supabase.from('profiles').select('gold_balance').eq('id', defenderId).single()

  return { attackerGold: attacker?.gold_balance ?? 0, defenderGold: defender?.gold_balance ?? 0 }
})
