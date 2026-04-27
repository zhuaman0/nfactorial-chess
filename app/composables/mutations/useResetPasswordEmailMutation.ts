import { isValidEmail } from '~/utils/validation'

/**
 * Mutation hook for sending a password-reset email.
 *
 * Usage in a component:
 *   const { mutate: sendResetEmail, isPending, error, isSuccess } = useResetPasswordEmailMutation()
 *   await sendResetEmail({ email })
 */
export function useResetPasswordEmailMutation() {
  const supabase = useSupabaseClient()

  const isPending = ref(false)
  const error     = ref<string | null>(null)
  const isSuccess = ref(false)

  function reset() {
    isPending.value = false
    error.value     = null
    isSuccess.value = false
  }

  async function mutate(payload: { email: string }): Promise<boolean> {
    const { email } = payload

    reset()
    isPending.value = true

    try {
      if (!isValidEmail(email)) {
        error.value = 'Please enter a valid email address'
        return false
      }

      const { error: sbError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (sbError) throw sbError

      isSuccess.value = true
      return true
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to send reset email. Please try again.'
      return false
    } finally {
      isPending.value = false
    }
  }

  return { mutate, isPending, error, isSuccess, reset }
}
