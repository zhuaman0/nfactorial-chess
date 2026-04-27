/**
 * Mutation hook for signing out.
 *
 * Usage in a component:
 *   const { mutate: logout, isPending, error } = useLogoutMutation()
 *   await logout()
 */
export function useLogoutMutation() {
  const supabase = useSupabaseClient()
  const router   = useRouter()

  const isPending = ref(false)
  const error     = ref<string | null>(null)

  async function mutate(): Promise<boolean> {
    isPending.value = true
    error.value     = null

    try {
      const { error: sbError } = await supabase.auth.signOut()
      if (sbError) throw sbError

      await router.push('/auth/login')
      return true
    } catch (err: any) {
      error.value = err?.message ?? 'Logout failed.'
      return false
    } finally {
      isPending.value = false
    }
  }

  return { mutate, isPending, error }
}
