import narutoKingW from '~/assets/skins/naruto/naruto_king_white.png'
import narutoQueenW from '~/assets/skins/naruto/sakura.png'
import narutoKnightW from '~/assets/skins/naruto/rock_lee.png'
import narutoBishopW from '~/assets/skins/naruto/kakashi.png'
import narutoKingB from '~/assets/skins/naruto/naruto_king_black.png'
import narutoBishopB from '~/assets/skins/naruto/itachi.png'

export type PremiumSkinId = 'naruto'

export interface SkinEntry {
  id: PremiumSkinId
  name: string
  subtitle: string
  tag: string
  tagColor: string
  price: number
  gradient: string
  images: Partial<Record<string, string>>
}

export const SKIN_CATALOG: SkinEntry[] = [
  {
    id: 'naruto',
    name: 'Naruto',
    subtitle: 'Hidden Leaf vs Akatsuki',
    tag: '🍃 Anime',
    tagColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    price: 500,
    gradient: 'from-orange-900 via-red-900 to-slate-900',
    images: {
      // White side — Konoha
      'k-w': narutoKingW,    // Naruto (Hokage)
      'q-w': narutoQueenW,   // Sakura
      'b-w': narutoBishopW,  // Kakashi
      'n-w': narutoKnightW,  // Rock Lee
      // Black side — Akatsuki
      'k-b': narutoKingB,    // Madara
      'b-b': narutoBishopB,  // Itachi
    },
  },
]

// Used by ChessPiece.vue: skinId → pieceKey → imageUrl
export const SKIN_IMAGE_MAP: Record<string, Partial<Record<string, string>>> =
  Object.fromEntries(SKIN_CATALOG.map(s => [s.id, s.images]))
