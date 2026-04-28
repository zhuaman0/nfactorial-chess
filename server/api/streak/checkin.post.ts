import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('current_streak, longest_streak, last_active_at')
    .eq('id', user.id)
    .single()

  // Profile missing or streak columns not yet migrated — return zeros silently
  if (error || !profile) {
    return { current_streak: 0, longest_streak: 0, already_checked_in: true }
  }

  const now = new Date()
  const last = profile.last_active_at ? new Date(profile.last_active_at) : null
  const hoursSinceLast = last ? (now.getTime() - last.getTime()) / 3_600_000 : Infinity

  let newStreak = profile.current_streak ?? 0

  if (hoursSinceLast < 24) {
    return {
      current_streak: newStreak,
      longest_streak: profile.longest_streak ?? 0,
      already_checked_in: true,
    }
  } else if (hoursSinceLast < 48) {
    newStreak = newStreak + 1
  } else {
    newStreak = 1
  }

  const newLongest = Math.max(newStreak, profile.longest_streak ?? 0)

  await supabase
    .from('profiles')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_active_at: now.toISOString(),
    } as never)
    .eq('id', user.id)

  return { current_streak: newStreak, longest_streak: newLongest, already_checked_in: false }
})
