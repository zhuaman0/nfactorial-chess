<template>
  <div class="p-4 pb-20 mt-6">
    <div class="max-w-5xl mx-auto flex flex-col gap-8">

      <!-- Header -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-600 via-amber-500 to-orange-500 shadow-2xl">
        <div class="absolute inset-0 opacity-10 pointer-events-none" :style="patternBg" />
        <div class="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div class="relative flex items-center justify-between px-8 py-7">
          <div>
            <h1 class="text-4xl font-extrabold text-white drop-shadow-lg">🏪 Skin Shop</h1>
            <p class="text-yellow-100/80 mt-1">Spend your gold on legendary piece sets</p>
          </div>
          <div class="flex flex-col items-end gap-1">
            <span class="text-yellow-100/70 text-xs font-semibold uppercase tracking-wider">Your balance</span>
            <span class="text-3xl font-black text-white drop-shadow">🪙 {{ profileStore.profile?.gold_balance ?? 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Catalog -->
      <div class="grid grid-cols-1 gap-6">
        <div
          v-for="skin in SKIN_CATALOG"
          :key="skin.id"
          class="relative overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300"
          :class="customization.skin === skin.id
            ? 'border-amber-400/60 shadow-amber-500/20'
            : 'border-white/10'"
        >
          <!-- Card gradient bg -->
          <div class="absolute inset-0 bg-gradient-to-br" :class="skin.gradient" />
          <div class="absolute inset-0 bg-slate-900/60" />

          <div class="relative flex flex-col md:flex-row gap-0">

            <!-- Left: Hero showcase -->
            <div class="relative flex items-center justify-center p-6 min-w-[200px] overflow-hidden bg-black/30">
              <div class="absolute w-48 h-48 bg-orange-500/15 rounded-full blur-3xl" />
              <div class="relative flex flex-col gap-3 items-center w-full">
                <!-- Kings row — biggest -->
                <div class="flex gap-3 items-end justify-center">
                  <div class="flex flex-col items-center gap-1">
                    <div class="w-20 h-20 drop-shadow-2xl">
                      <img v-if="skin.images['k-w']" :src="skin.images['k-w']" class="w-full h-full object-contain" />
                    </div>
                    <span class="text-[9px] text-orange-300/70 font-bold uppercase tracking-wider">King</span>
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <div class="w-20 h-20 drop-shadow-2xl">
                      <img v-if="skin.images['k-b']" :src="skin.images['k-b']" class="w-full h-full object-contain" />
                    </div>
                    <span class="text-[9px] text-red-400/70 font-bold uppercase tracking-wider">King</span>
                  </div>
                </div>
                <!-- Supporting pieces row -->
                <div class="flex gap-2 items-end justify-center">
                  <template v-for="p in ['q','b','n']" :key="p">
                    <div v-if="skin.images[`${p}-w`]" class="w-12 h-12 drop-shadow-lg">
                      <img :src="skin.images[`${p}-w`]" class="w-full h-full object-contain" />
                    </div>
                  </template>
                  <template v-for="p in ['q','b','n']" :key="`b-${p}`">
                    <div v-if="skin.images[`${p}-b`]" class="w-12 h-12 drop-shadow-lg">
                      <img :src="skin.images[`${p}-b`]" class="w-full h-full object-contain" />
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Right: Info + actions -->
            <div class="relative flex flex-col justify-between p-7 flex-1 gap-5">

              <!-- Top: name + badges -->
              <div>
                <div class="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 class="text-2xl font-extrabold text-white">{{ skin.name }}</h2>
                  <span class="text-xs font-bold px-2.5 py-1 rounded-full border" :class="skin.tagColor">
                    {{ skin.tag }}
                  </span>
                  <span
                    v-if="customization.isSkinOwned(skin.id)"
                    class="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  >✓ Owned</span>
                </div>
                <p class="text-slate-400 text-sm">{{ skin.subtitle }}</p>
                <p class="text-slate-500 text-xs mt-1">
                  {{ Object.keys(skin.images).length }} / 12 pieces themed
                </p>
              </div>

              <!-- Piece preview strip -->
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-white/40 font-bold uppercase tracking-wider w-12">White</span>
                  <div
                    v-for="p in PIECE_TYPES"
                    :key="`w-${p}`"
                    class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden"
                    :class="skin.images[`${p}-w`] ? 'border-orange-500/30' : ''"
                  >
                    <img v-if="skin.images[`${p}-w`]" :src="skin.images[`${p}-w`]" class="w-full h-full object-contain" />
                    <span v-else class="text-base select-none opacity-30">{{ SVG_FALLBACK[p] }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-white/40 font-bold uppercase tracking-wider w-12">Black</span>
                  <div
                    v-for="p in PIECE_TYPES"
                    :key="`b-${p}`"
                    class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden"
                    :class="skin.images[`${p}-b`] ? 'border-red-500/30' : ''"
                  >
                    <img v-if="skin.images[`${p}-b`]" :src="skin.images[`${p}-b`]" class="w-full h-full object-contain" />
                    <span v-else class="text-base select-none opacity-30">{{ SVG_FALLBACK[p] }}</span>
                  </div>
                </div>
              </div>

              <!-- Price + action -->
              <div class="flex items-center gap-4 flex-wrap">
                <div class="flex items-center gap-2">
                  <span class="text-3xl font-black text-amber-400">🪙 {{ skin.price }}</span>
                  <span class="text-slate-500 text-sm">gold</span>
                </div>

                <!-- Not owned: Buy button -->
                <button
                  v-if="!customization.isSkinOwned(skin.id)"
                  class="flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                  :class="canAfford(skin.price)
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30'
                    : 'bg-slate-700 cursor-not-allowed'"
                  :disabled="buying === skin.id || !canAfford(skin.price)"
                  @click="buySkin(skin)"
                >
                  <span v-if="buying === skin.id">
                    <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  </span>
                  <span v-else-if="!canAfford(skin.price)">Not enough gold</span>
                  <span v-else>Buy for 🪙 {{ skin.price }}</span>
                </button>

                <!-- Owned but not equipped: Equip -->
                <button
                  v-else-if="customization.skin !== skin.id"
                  class="px-6 py-3 rounded-2xl font-extrabold text-sm text-white bg-violet-600 hover:bg-violet-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/20"
                  @click="customization.setSkin(skin.id)"
                >
                  ⚔️ Equip
                </button>

                <!-- Currently equipped -->
                <div
                  v-else
                  class="flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm text-emerald-300 bg-emerald-500/15 border border-emerald-500/30"
                >
                  ✓ Equipped
                </div>
              </div>

              <!-- Error / success flash -->
              <Transition name="fade">
                <p v-if="errorMsg" class="text-red-400 text-sm font-semibold">{{ errorMsg }}</p>
                <p v-else-if="successMsg" class="text-emerald-400 text-sm font-semibold">{{ successMsg }}</p>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Coming soon teaser -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="teaser in COMING_SOON"
          :key="teaser"
          class="flex items-center justify-center gap-3 p-5 rounded-2xl border border-dashed border-white/10 bg-white/2 text-slate-600 font-bold text-sm"
        >
          🔒 {{ teaser }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { SKIN_CATALOG } from '~/data/skins'
import { useCustomizationStore } from '~/stores/customization'
import { useProfileStore } from '~/stores/profile'

const customization = useCustomizationStore()
const profileStore  = useProfileStore()

const buying    = ref<string | null>(null)
const errorMsg  = ref('')
const successMsg = ref('')

const PIECE_TYPES = ['k', 'q', 'r', 'b', 'n', 'p'] as const
const SVG_FALLBACK: Record<string, string> = {
  k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙',
}

const COMING_SOON = ['Dragon Ball Z', 'Marvel', 'Star Wars', 'Harry Potter', 'One Piece', 'Attack on Titan']

const patternBg = {
  backgroundImage: `repeating-conic-gradient(rgba(255,255,255,0.05) 0% 25%, transparent 0% 50%)`,
  backgroundSize: '32px 32px',
}

const canAfford = (price: number) => (profileStore.profile?.gold_balance ?? 0) >= price

async function buySkin(skin: typeof SKIN_CATALOG[0]) {
  if (buying.value) return
  errorMsg.value = ''
  successMsg.value = ''

  const supabase = useSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { errorMsg.value = 'Please log in first'; return }

  buying.value = skin.id
  try {
    const res = await window.fetch('/api/shop/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, skinId: skin.id, price: skin.price }),
    })

    if (!res.ok) {
      const text = await res.text()
      errorMsg.value = text.includes('gold') ? 'Not enough gold!' : 'Purchase failed. Try again.'
      return
    }

    const { newBalance } = await res.json()
    customization.unlockSkin(skin.id)
    customization.setSkin(skin.id)
    if (profileStore.profile) profileStore.profile.gold_balance = newBalance
    successMsg.value = `🎉 ${skin.name} skin unlocked and equipped!`
    setTimeout(() => { successMsg.value = '' }, 4000)
  } catch {
    errorMsg.value = 'Purchase failed. Try again.'
  } finally {
    buying.value = null
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
