import { defineStore } from 'pinia'

export type PieceSkin = 'classic' | 'neon' | 'royal' | 'pixel'
export type ArenaTheme = 'classic' | 'walnut' | 'ocean' | 'night' | 'ice'

export const ARENA_THEMES: Record<ArenaTheme, { name: string; light: string; dark: string }> = {
  classic: { name: 'Classic', light: '#EBECD0', dark: '#779556' },
  walnut:  { name: 'Walnut',  light: '#f0d9b5', dark: '#b58863' },
  ocean:   { name: 'Ocean',   light: '#bdd0e0', dark: '#3d6a9e' },
  night:   { name: 'Night',   light: '#cab8e8', dark: '#6b3a90' },
  ice:     { name: 'Ice',     light: '#daeeff', dark: '#6aaccf' },
}

export const useCustomizationStore = defineStore('customization', {
  state: () => ({
    skin: 'classic' as PieceSkin,
    theme: 'classic' as ArenaTheme,
  }),
  actions: {
    setSkin(s: PieceSkin) {
      this.skin = s
      if (import.meta.client) localStorage.setItem('chess_skin', s)
    },
    setTheme(t: ArenaTheme) {
      this.theme = t
      if (import.meta.client) localStorage.setItem('chess_theme', t)
    },
    load() {
      if (!import.meta.client) return
      const s = localStorage.getItem('chess_skin') as PieceSkin | null
      const t = localStorage.getItem('chess_theme') as ArenaTheme | null
      if (s) this.skin = s
      if (t) this.theme = t
    },
  },
})
