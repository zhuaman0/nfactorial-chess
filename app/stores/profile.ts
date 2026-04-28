import { defineStore } from 'pinia'

export interface Profile {
  id: string
  first_name: string
  last_name: string
  avatar_url: string
  points: number
  is_pro: boolean
  gold_balance: number
  defense_wins: number
  raid_wins: number
  created_at: string
  updated_at: string
}

interface ProfileState {
  profile: Profile | null
  loading: boolean
  uploading: boolean
  errorMsg: string
  successMsg: string
}

async function getUserId(): Promise<string | null> {
  const supabase = useSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: null,
    loading: false,
    uploading: false,
    errorMsg: '',
    successMsg: '',
  }),

  getters: {
    fullName(): string {
      if (!this.profile) return ''
      return `${this.profile.first_name} ${this.profile.last_name}`.trim()
    },

    avatarUrl(): string {
      return this.profile?.avatar_url || ''
    },

    initials(): string {
      if (!this.profile) return '?'
      const f = this.profile.first_name?.[0] || ''
      const l = this.profile.last_name?.[0] || ''
      return (f + l).toUpperCase() || '?'
    },

    isPro(): boolean {
      return this.profile?.is_pro ?? false
    },
  },

  actions: {
    clearMessages() {
      this.errorMsg = ''
      this.successMsg = ''
    },

    async syncFromOAuth(_user: any): Promise<void> {
      await this.fetchProfile()
    },

    async fetchProfile(): Promise<void> {
      const supabase = useSupabaseClient()
      const uid = await getUserId()
      if (!uid) return

      try {
        this.loading = true
        this.clearMessages()

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .single()

        if (error) throw error
        this.profile = data as unknown as Profile
      } catch (error: any) {
        this.errorMsg = error.message || 'Failed to load profile'
      } finally {
        this.loading = false
      }
    },

    async updateProfile(firstName: string, lastName: string): Promise<boolean> {
      const supabase = useSupabaseClient()
      const uid = await getUserId()
      if (!uid) return false

      try {
        this.loading = true
        this.clearMessages()

        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString(),
          } as never)
          .eq('id', uid)

        if (error) throw error

        if (this.profile) {
          this.profile.first_name = firstName
          this.profile.last_name = lastName
        }

        this.successMsg = 'Profile updated successfully!'
        return true
      } catch (error: any) {
        this.errorMsg = error.message || 'Failed to update profile'
        return false
      } finally {
        this.loading = false
      }
    },

    async uploadAvatar(file: File): Promise<boolean> {
      const supabase = useSupabaseClient()
      const uid = await getUserId()
      if (!uid) return false

      try {
        this.uploading = true
        this.clearMessages()

        const fileExt = file.name.split('.').pop()
        const filePath = `${uid}/avatar.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)

        const avatarUrl = urlData.publicUrl

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          } as never)
          .eq('id', uid)

        if (updateError) throw updateError

        if (this.profile) {
          this.profile.avatar_url = avatarUrl
        }

        this.successMsg = 'Avatar uploaded successfully!'
        return true
      } catch (error: any) {
        this.errorMsg = error.message || 'Failed to upload avatar'
        return false
      } finally {
        this.uploading = false
      }
    },
  },
})
