import { isValidEmail, isValidPassword } from '~/utils/validation'

/**
 * Mutation hook for registering a new user.
 *
 * Usage in a component:
 *   const { mutate: register, isPending, error, isSuccess } = useRegisterMutation()
 *   await register({ email, password, firstName, lastName })
 */
export function useRegisterMutation() {
  const supabase = useSupabaseClient()

  const isPending = ref(false)
  const error     = ref<string | null>(null)
  const isSuccess = ref(false)

  function reset() {
    isPending.value = false
    error.value     = null
    isSuccess.value = false
  }

  async function mutate(payload: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<boolean> {
    const { email, password, firstName, lastName } = payload

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
      if (!firstName.trim()) {
        error.value = 'Please enter your first name'
        return false
      }

      const { data, error: sbError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName } },
      })
      if (sbError) throw sbError

      if (data.user) {
        await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString(),
          } as never)
          .eq('id', data.user.id)
      }

      isSuccess.value = true
      return true
    } catch (err: any) {
      error.value = err?.message ?? 'Registration failed. Please try again.'
      return false
    } finally {
      isPending.value = false
    }
  }

  return { mutate, isPending, error, isSuccess, reset }
}
