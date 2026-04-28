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

  if (error || !profile) throw createError({ statusCode: 404, statusMessage: 'Profile not found' })

  const now = new Date()
  const last = profile.last_active_at ? new Date(profile.last_active_at) : null
  const hoursSinceLast = last ? (now.getTime() - last.getTime()) / 3_600_000 : Infinity

  let newStreak = profile.current_streak

  if (hoursSinceLast < 24) {
    // Already checked in within the last 24 h — no change
    return {
      current_streak: profile.current_streak,
      longest_streak: profile.longest_streak,
      already_checked_in: true,
    }
  } else if (hoursSinceLast < 48) {
    // Consecutive day — increment
    newStreak = profile.current_streak + 1
  } else {
    // Missed a day (or first ever visit) — reset to 1
    newStreak = 1
  }

  const newLongest = Math.max(newStreak, profile.longest_streak)

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
