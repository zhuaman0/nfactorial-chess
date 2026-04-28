import { defineStore } from 'pinia'
import { isValidEmail, isValidPassword } from '~/utils/validation'

interface AuthState {
  loading: boolean
  errorMsg: string
  successMsg: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    loading: false,
    errorMsg: '',
    successMsg: '',
  }),

  getters: {
    user() {
      return useSupabaseUser()
    },
    isAuthenticated(): boolean {
      return !!this.user.value
    },
  },

  actions: {
    clearMessages() {
      this.errorMsg = ''
      this.successMsg = ''
    },

    async login(email: string, password: string): Promise<boolean> {
      const supabase = useSupabaseClient()

      try {
        this.loading = true
        this.clearMessages()

        if (!isValidEmail(email)) {
          this.errorMsg = 'Please enter a valid email address'
          return false
        }

        if (!isValidPassword(password)) {
          this.errorMsg = 'Password must be at least 6 characters'
          return false
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        return true
      } catch (error: any) {
        this.errorMsg = error.message || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },

    async register(
      email: string,
      password: string,
      firstName: string,
      lastName: string,
    ): Promise<boolean> {
      const supabase = useSupabaseClient()

      try {
        this.loading = true
        this.clearMessages()

        if (!isValidEmail(email)) {
          this.errorMsg = 'Please enter a valid email address'
          return false
        }

        if (!isValidPassword(password)) {
          this.errorMsg = 'Password must be at least 6 characters'
          return false
        }

        if (!firstName.trim()) {
          this.errorMsg = 'Please enter your first name'
          return false
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        })
        if (error) throw error

        // If user was created, update their profile with name and starter gold
        if (data.user) {
          const profileUpdate = {
            first_name: firstName,
            last_name: lastName,
            gold_balance: 500,
            updated_at: new Date().toISOString(),
          }
          await supabase
            .from('profiles')
            .update(profileUpdate as never)
            .eq('id', data.user.id)
        }

        this.successMsg = 'Registration successful! Check your email to verify your account.'
        return true
      } catch (error: any) {
        this.errorMsg = error.message || 'Registration failed'
        return false
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle(): Promise<void> {
      const supabase = useSupabaseClient()

      try {
        this.loading = true
        this.clearMessages()

        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/confirm`,
          },
        })

        if (error) throw error
      } catch (error: any) {
        this.errorMsg = error.message || 'Google sign-in failed'
        this.loading = false
      }
    },

    async logout(): Promise<boolean> {
      const supabase = useSupabaseClient()

      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return true
      } catch (error: any) {
        console.error('Logout error:', error.message)
        return false
      }
    },
  },
})
