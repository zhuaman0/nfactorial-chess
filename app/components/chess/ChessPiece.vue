<template>
  <div
    class="chess-piece select-none w-full h-full flex items-center justify-center p-1"
    :class="filterClass"
  >
    <!-- Pixel skin: Unicode chess symbols -->
    <span v-if="customization.skin === 'pixel'" :class="pixelClass">{{ pixelChar }}</span>

    <!-- SVG skins (classic / neon / royal share same SVGs, CSS filter does the work) -->
    <template v-else>
      <!-- White King -->
      <svg v-if="type === 'k' && color === 'w'" viewBox="0 0 45 45" class="w-full h-full">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <path d="M22.5 11.63V6M20 8h5" stroke="#000" stroke-linejoin="miter" />
          <path d="M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-6 0-1.5 2.5 3 10 3 10" fill="#fff" stroke-linecap="butt" />
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-1-4-6-4h-2.5l-6-6-6 6H16c-5 0-2 3-6 4-3 6 6 10.5 6 10.5v7z" fill="#fff" />
          <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
        </g>
      </svg>
      <!-- White Queen -->
      <svg v-else-if="type === 'q' && color === 'w'" viewBox="0 0 45 45" class="w-full h-full">
        <g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm11-4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm11 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm11 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-11 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25L7 14l2 12z" stroke-linecap="butt" />
          <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 3 1 5.5 1 2.5 0 4.5 1.5 5.5-1 1-2 2.5-2 2.5-4 8.5-1.5 21-1.5 27 0 0-2-1.5-2-2.5-4-1-2.5-3-1-5.5-1-2.5 0-4.5-1.5-5.5 1-1 2-2.5 2-2.5 4-8.5 1.5-21 1.5-27 0z" />
          <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" />
          <path d="M9 37c10-2 17-2 27 0v-3s-7-1-13.5-1S9 34 9 34v3z" />
        </g>
      </svg>
      <!-- White Rook -->
      <svg v-else-if="type === 'r' && color === 'w'" viewBox="0 0 45 45" class="w-full h-full">
        <g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt" />
          <path d="M34 14l-3 3H14l-3-3" />
          <path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter" />
          <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
          <path d="M11 14h23" fill="none" stroke-linejoin="miter" />
        </g>
      </svg>
      <!-- White Bishop -->
      <svg v-else-if="type === 'b' && color === 'w'" viewBox="0 0 45 45" class="w-full h-full">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <g fill="#fff" stroke-linecap="butt">
            <path d="M9 36c3.39-.97 10.11.03 13.5-2 3.39 2.03 10.11 1.03 13.5 2 0 0 0 2 .5 3H8.5c.5-1 .5-3 .5-3z" />
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
            <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
          </g>
          <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter" />
        </g>
      </svg>
      <!-- White Knight -->
      <svg v-else-if="type === 'n' && color === 'w'" viewBox="0 0 45 45" class="w-full h-full">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff" />
          <path d="M24 18c.38 2.43-4.65 1.15-5 0 0-3.35 4-7.82 4-10.5 1.35 1.25 2.35 4.15 1 10.5z" fill="#fff" />
          <path d="M9.5 25.5A.5.5 0 1 1 15 29c-5 4.5-9.5 4.5-9.5 4.5" fill="#fff" />
          <path d="M15 15.5s.5-4.5-2-11c-2.5 6.5-2 11-2 11" fill="#fff" />
          <path d="M24 12c1.33 1.33 1.33 3.33 0 4.67M27 11.5c1.33 1.33 1.33 3.33 0 4.67" />
        </g>
      </svg>
      <!-- White Pawn -->
      <svg v-else-if="type === 'p' && color === 'w'" viewBox="0 0 45 45" class="w-full h-full">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <!-- Black King -->
      <svg v-else-if="type === 'k' && color === 'b'" viewBox="0 0 45 45" class="w-full h-full">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <path d="M22.5 11.63V6M20 8h5" stroke="#000" stroke-linejoin="miter" />
          <path d="M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-6 0-1.5 2.5 3 10 3 10" fill="#000" stroke-linecap="butt" />
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-1-4-6-4h-2.5l-6-6-6 6H16c-5 0-2 3-6 4-3 6 6 10.5 6 10.5v7z" fill="#000" />
          <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff" />
        </g>
      </svg>
      <!-- Black Queen -->
      <svg v-else-if="type === 'q' && color === 'b'" viewBox="0 0 45 45" class="w-full h-full">
        <g fill="#000" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm11-4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm11 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm11 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-11 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25L7 14l2 12z" stroke-linecap="butt" />
          <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 3 1 5.5 1 2.5 0 4.5 1.5 5.5-1 1-2 2.5-2 2.5-4 8.5-1.5 21-1.5 27 0 0-2-1.5-2-2.5-4-1-2.5-3-1-5.5-1-2.5 0-4.5-1.5-5.5 1-1 2-2.5 2-2.5 4-8.5 1.5-21 1.5-27 0z" />
          <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#fff" />
          <path d="M9 37c10-2 17-2 27 0v-3s-7-1-13.5-1S9 34 9 34v3z" />
        </g>
      </svg>
      <!-- Black Rook -->
      <svg v-else-if="type === 'r' && color === 'b'" viewBox="0 0 45 45" class="w-full h-full">
        <g fill="#000" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt" />
          <path d="M34 14l-3 3H14l-3-3" />
          <path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter" />
          <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
          <path d="M11 14h23" fill="none" stroke-linejoin="miter" />
        </g>
      </svg>
      <!-- Black Bishop -->
      <svg v-else-if="type === 'b' && color === 'b'" viewBox="0 0 45 45" class="w-full h-full">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <g fill="#000" stroke-linecap="butt">
            <path d="M9 36c3.39-.97 10.11.03 13.5-2 3.39 2.03 10.11 1.03 13.5 2 0 0 0 2 .5 3H8.5c.5-1 .5-3 .5-3z" />
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
            <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
          </g>
          <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" stroke-linejoin="miter" />
        </g>
      </svg>
      <!-- Black Knight -->
      <svg v-else-if="type === 'n' && color === 'b'" viewBox="0 0 45 45" class="w-full h-full">
        <g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000" />
          <path d="M24 18c.38 2.43-4.65 1.15-5 0 0-3.35 4-7.82 4-10.5 1.35 1.25 2.35 4.15 1 10.5z" fill="#000" />
          <path d="M9.5 25.5A.5.5 0 1 1 15 29c-5 4.5-9.5 4.5-9.5 4.5" fill="#000" />
          <path d="M15 15.5s.5-4.5-2-11c-2.5 6.5-2 11-2 11" fill="#000" />
          <path d="M24 12c1.33 1.33 1.33 3.33 0 4.67M27 11.5c1.33 1.33 1.33 3.33 0 4.67" stroke="#fff" />
        </g>
      </svg>
      <!-- Black Pawn -->
      <svg v-else-if="type === 'p' && color === 'b'" viewBox="0 0 45 45" class="w-full h-full">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" stroke-width="1.5" stroke-linecap="round" />
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCustomizationStore } from '~/stores/customization'

const props = defineProps({
  type: { type: String as PropType<'p' | 'n' | 'b' | 'r' | 'q' | 'k'>, required: true },
  color: { type: String as PropType<'w' | 'b'>, required: true },
})

const customization = useCustomizationStore()

const PIXEL_MAP: Record<string, string> = {
  'k-w': '♔', 'q-w': '♕', 'r-w': '♖', 'b-w': '♗', 'n-w': '♘', 'p-w': '♙',
  'k-b': '♚', 'q-b': '♛', 'r-b': '♜', 'b-b': '♝', 'n-b': '♞', 'p-b': '♟',
}

const pixelChar = computed(() => PIXEL_MAP[`${props.type}-${props.color}`] ?? '?')

const pixelClass = computed(() => [
  'select-none leading-none font-bold',
  'text-[clamp(24px,5.5cqw,46px)]',
  props.color === 'w'
    ? 'text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.9),0_0_0_1px_rgba(0,0,0,0.6)]'
    : 'text-gray-900 [text-shadow:0_1px_3px_rgba(255,255,255,0.2)]',
])

const filterClass = computed(() => {
  const skin = customization.skin
  const c = props.color
  if (skin === 'neon'  && c === 'w') return 'skin-neon-w'
  if (skin === 'neon'  && c === 'b') return 'skin-neon-b'
  if (skin === 'royal' && c === 'w') return 'skin-royal-w'
  if (skin === 'royal' && c === 'b') return 'skin-royal-b'
  return ''
})
</script>

<style scoped>
.skin-neon-w {
  filter: sepia(1) saturate(8) hue-rotate(155deg) brightness(2.5)
          drop-shadow(0 0 6px #00e5ff) drop-shadow(0 0 14px #0080ff);
}
.skin-neon-b {
  filter: sepia(1) saturate(8) hue-rotate(260deg) brightness(1.2)
          drop-shadow(0 0 6px #cc44ff) drop-shadow(0 0 14px #8800cc);
}
.skin-royal-w {
  filter: sepia(1) saturate(5) hue-rotate(20deg) brightness(1.45);
}
.skin-royal-b {
  filter: sepia(1) saturate(4) hue-rotate(15deg) brightness(0.58);
}
</style>
