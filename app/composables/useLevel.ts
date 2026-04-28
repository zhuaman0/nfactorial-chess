const LEVELS = [
  { min: 0,     max: 99,    title: 'Newcomer'    },
  { min: 100,   max: 249,   title: 'Pawn'        },
  { min: 250,   max: 499,   title: 'Brave Pawn'  },
  { min: 500,   max: 999,   title: 'Knight'      },
  { min: 1000,  max: 1999,  title: 'Bishop'      },
  { min: 2000,  max: 3999,  title: 'Rook'        },
  { min: 4000,  max: 6999,  title: 'Queen'       },
  { min: 7000,  max: 10999, title: 'Elite'       },
  { min: 11000, max: 15999, title: 'Master'      },
  { min: 16000, max: Infinity, title: 'Grandmaster' },
]

export function useLevel(points: MaybeRef<number>) {
  const xp = computed(() => unref(points))

  const level = computed(() => {
    const idx = LEVELS.findIndex(l => xp.value >= l.min && xp.value <= l.max)
    return idx === -1 ? LEVELS.length : idx + 1
  })

  const levelData = computed(() => LEVELS[level.value - 1] ?? LEVELS[LEVELS.length - 1]!)

  const xpNext = computed(() => {
    const next = LEVELS[level.value]
    return next ? next.min : levelData.value.max
  })

  const xpPercent = computed(() =>
    Math.min(100, Math.round(((xp.value - levelData.value.min) / (xpNext.value - levelData.value.min)) * 100))
  )

  return {
    level,
    title: computed(() => levelData.value.title),
    xpCurrent: xp,
    xpNext,
    xpPercent,
  }
}
