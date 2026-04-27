import { isValidEmail, isValidPassword } from '~/utils/validation'

/**
 * Mutation hook for email + password login.
 *
 * Usage in a component:
 *   const { mutate: login, isPending, error, reset } = useLoginMutation()
 *   await login({ email, password })
 */
export function useLoginMutation() {
  const supabase = useSupabaseClient()
  const router   = useRouter()

  const isPending = ref(false)
  const error     = ref<string | null>(null)
  const isSuccess = ref(false)

  function reset() {
    isPending.value = false
    error.value     = null
    isSuccess.value = false
  }

  async function mutate(payload: { email: string; password: string }): Promise<boolean> {
    const { email, password } = payload

    reset()
    isPending.value = true

    try {
      if (!isValidEmail(email)) {
        error.value = 'Please enter a valid email address'
        return false
      }

      if (!isValidPassword(password)) {
        error.value = 'Password must be at least 6 characters'
        return false
      }

      const { error: sbError } = await supabase.auth.signInWithPassword({ email, password })
      if (sbError) throw sbError

      isSuccess.value = true
      await router.push('/')
      return true
    } catch (err: any) {
      error.value = err?.message ?? 'Login failed. Please try again.'
      return false
    } finally {
      isPending.value = false
    }
  }

  return { mutate, isPending, error, isSuccess, reset }
}
