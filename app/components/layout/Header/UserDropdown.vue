<template>
  <!-- Avatar trigger button -->
  <button
    type="button"
    class="id-card-trigger"
    @click="open = true"
    aria-label="Open profile card"
  >
    <UiAvatar :src="avatarSrc" :fallback="profileStore.initials" size="sm" />
  </button>

  <!-- Slide-in panel via Teleport -->
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div
        v-if="open"
        class="id-backdrop"
        @click="open = false"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="panel">
      <div v-if="open" class="id-panel" role="dialog" aria-modal="true">

        <!-- Close button -->
        <button class="id-close" @click="open = false" aria-label="Close">
          <span>✕</span>
        </button>

        <!-- ── Avatar + Name ── -->
        <div class="id-hero">
          <div class="id-avatar-ring">
            <UiAvatar :src="avatarSrc" :fallback="profileStore.initials" size="lg" class="id-avatar" />
          </div>
          <h2 class="id-name">{{ profileStore.fullName || 'Player' }}</h2>
          <p class="id-email">{{ user?.email }}</p>
          <div class="id-level-badge">
            <span>⭐</span> Level {{ userLevel }} · {{ levelTitle }}
          </div>
        </div>

        <!-- ── XP Bar ── -->
        <div class="id-xp-section">
          <div class="id-xp-labels">
            <span>XP Progress</span>
            <span>{{ xpCurrent }} / {{ xpNext }} XP</span>
          </div>
          <div class="id-xp-track">
            <div class="id-xp-fill" :style="{ width: xpPercent + '%' }">
              <div class="id-xp-glow" />
            </div>
          </div>
          <p class="id-xp-hint">{{ xpNext - xpCurrent }} XP until Level {{ userLevel + 1 }}</p>
        </div>

        <!-- ── Streak ── -->
        <div class="id-streak">
          <span class="id-streak-icon">🔥</span>
          <div>
            <p class="id-streak-num">{{ streakDays }} days</p>
            <p class="id-streak-label">Win streak</p>
          </div>
          <div class="id-streak-dots">
            <span
              v-for="i in 7"
              :key="i"
              class="id-streak-dot"
              :class="{ active: i <= streakDays }"
            />
          </div>
        </div>

        <!-- ── Action buttons ── -->
        <div class="id-actions">
          <NuxtLink to="/play" class="id-action-btn arena" @click="open = false">
            <span class="id-action-icon">⚔️</span>
            <span class="id-action-label">Arena</span>
            <span class="id-action-sub">Play now</span>
          </NuxtLink>

          <NuxtLink to="/profile" class="id-action-btn inventory" @click="open = false">
            <span class="id-action-icon">🎒</span>
            <span class="id-action-label">Inventory</span>
            <span class="id-action-sub">Skins & themes</span>
          </NuxtLink>

          <NuxtLink to="/leaderboard" class="id-action-btn glory" @click="open = false">
            <span class="id-action-icon">🏆</span>
            <span class="id-action-label">Hall of Fame</span>
            <span class="id-action-sub">Leaderboard</span>
          </NuxtLink>
        </div>

        <!-- ── Sign out ── -->
        <button class="id-signout" @click="handleLogout">
          <span>🚪</span> Sign Out
        </button>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import { useAuthStore } from '~/stores/auth'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const user = useSupabaseUser()
const open = ref(false)

const avatarSrc = computed(() => {
  const meta = user.value?.user_metadata || {}
  return profileStore.avatarUrl || meta.picture || meta.avatar_url || ''
})

// Mock XP / level data (swap with real store values when ready)
const userLevel = ref(5)
const levelTitle = ref('Brave Pawn')
const xpCurrent = ref(3200)
const xpNext = ref(5000)
const streakDays = ref(4)

const xpPercent = computed(() =>
  Math.min(100, Math.round((xpCurrent.value / xpNext.value) * 100))
)

const handleLogout = async () => {
  open.value = false
  await authStore.logout()
  navigateTo('/login')
}

// Close on Escape
onMounted(() => {
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') open.value = false }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})
</script>

<style scoped>
/* ── Trigger ─────────────────────────────────────────── */
.id-card-trigger {
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
}
.id-card-trigger:hover { background: rgba(0,0,0,0.07); }

/* ── Backdrop ────────────────────────────────────────── */
.id-backdrop {
  position: fixed;
  inset: 0;
  z-index: 998;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
}
.backdrop-enter-active, .backdrop-leave-active { transition: opacity 0.3s ease; }
.backdrop-enter-from, .backdrop-leave-to { opacity: 0; }

/* ── Panel ───────────────────────────────────────────── */
.id-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  width: 340px;
  max-width: 95vw;
  background: #ffffff;
  box-shadow: -8px 0 40px rgba(0,0,0,0.18);
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 28px 24px 24px;
  overflow-y: auto;
  gap: 20px;
}
.panel-enter-active, .panel-leave-active { transition: transform 0.35s cubic-bezier(.4,0,.2,1); }
.panel-enter-from, .panel-leave-to { transform: translateX(100%); }
.panel-enter-to, .panel-leave-from { transform: translateX(0); }

/* ── Close ───────────────────────────────────────────── */
.id-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.id-close:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

/* ── Hero ────────────────────────────────────────────── */
.id-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 8px;
  gap: 6px;
}
.id-avatar-ring {
  padding: 4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981);
  margin-bottom: 4px;
}
.id-avatar { display: block; }
.id-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.id-email {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}
.id-level-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #eff6ff, #f0fdf4);
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #1d4ed8;
  margin-top: 2px;
}

/* ── XP Bar ──────────────────────────────────────────── */
.id-xp-section { display: flex; flex-direction: column; gap: 6px; }
.id-xp-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
}
.id-xp-track {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}
.id-xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 999px;
  position: relative;
  transition: width 0.8s cubic-bezier(.4,0,.2,1);
}
.id-xp-glow {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  background: rgba(255,255,255,0.5);
  filter: blur(4px);
  border-radius: 50%;
}
.id-xp-hint {
  font-size: 0.68rem;
  color: #94a3b8;
  margin: 0;
  text-align: right;
}

/* ── Streak ──────────────────────────────────────────── */
.id-streak {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #fff7ed, #fef3c7);
  border: 1px solid #fed7aa;
  border-radius: 16px;
  padding: 12px 16px;
}
.id-streak-icon { font-size: 1.8rem; line-height: 1; }
.id-streak-num { font-size: 1.1rem; font-weight: 700; color: #ea580c; margin: 0; }
.id-streak-label { font-size: 0.7rem; color: #9a3412; margin: 0; font-weight: 500; }
.id-streak-dots {
  display: flex;
  gap: 5px;
  margin-left: auto;
  align-items: center;
}
.id-streak-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fed7aa;
  transition: background 0.2s;
}
.id-streak-dot.active { background: #f97316; box-shadow: 0 0 6px #f97316; }

/* ── Actions ─────────────────────────────────────────── */
.id-actions { display: flex; flex-direction: column; gap: 10px; }

.id-action-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 16px;
  text-decoration: none;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.id-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}
.id-action-btn:active { transform: translateY(0); }

.id-action-btn.arena {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #bfdbfe;
}
.id-action-btn.arena:hover { border-color: #3b82f6; }

.id-action-btn.inventory {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #bbf7d0;
}
.id-action-btn.inventory:hover { border-color: #10b981; }

.id-action-btn.glory {
  background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
  border-color: #fde68a;
}
.id-action-btn.glory:hover { border-color: #f59e0b; }

.id-action-icon { font-size: 1.8rem; line-height: 1; }
.id-action-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  display: block;
  line-height: 1.2;
}
.id-action-sub {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
  display: block;
}

/* ── Sign Out ────────────────────────────────────────── */
.id-signout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 11px;
  border-radius: 12px;
  border: 1.5px solid #fecaca;
  background: #fff5f5;
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  margin-top: auto;
}
.id-signout:hover { background: #fee2e2; border-color: #dc2626; }
</style>
