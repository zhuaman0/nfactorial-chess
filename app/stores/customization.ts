import { defineStore } from 'pinia'
import type { PremiumSkinId } from '~/data/skins'

export type PieceSkin = 'classic' | 'neon' | 'royal' | 'pixel' | PremiumSkinId
export type ArenaTheme = 'classic' | 'walnut' | 'ocean' | 'night' | 'ice'

const FREE_SKINS: PieceSkin[] = ['classic', 'neon', 'royal', 'pixel']

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
    ownedSkins: [] as PremiumSkinId[],
  }),

  getters: {
    isSkinOwned: (state) => (s: PieceSkin): boolean =>
      FREE_SKINS.includes(s) || state.ownedSkins.includes(s as PremiumSkinId),
  },

  actions: {
    setSkin(s: PieceSkin) {
      this.skin = s
      if (import.meta.client) localStorage.setItem('chess_skin', s)
    },
    setTheme(t: ArenaTheme) {
      this.theme = t
      if (import.meta.client) localStorage.setItem('chess_theme', t)
    },
    unlockSkin(s: PremiumSkinId) {
      if (!this.ownedSkins.includes(s)) {
        this.ownedSkins.push(s)
        if (import.meta.client) localStorage.setItem('chess_owned_skins', JSON.stringify(this.ownedSkins))
      }
    },
    load() {
      if (!import.meta.client) return
      const s = localStorage.getItem('chess_skin') as PieceSkin | null
      const t = localStorage.getItem('chess_theme') as ArenaTheme | null
      const owned = localStorage.getItem('chess_owned_skins')
      if (s) this.skin = s
      if (t) this.theme = t
      if (owned) { try { this.ownedSkins = JSON.parse(owned) } catch {} }
    },
  },
})
