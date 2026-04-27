export type AdvisorEmotion = 'neutral' | 'panic' | 'praise'

// Module-level so the timer is shared across every component that calls useAdvisor()
let autoHideTimer: ReturnType<typeof setTimeout> | null = null

export const useAdvisor = () => {
  const visible = useState<boolean>('advisor:visible', () => false)
  const message = useState<string>('advisor:message', () => '')
  const emotion = useState<AdvisorEmotion>('advisor:emotion', () => 'neutral')

  const show = (msg: string, emo: AdvisorEmotion = 'neutral', duration = 5000) => {
    if (autoHideTimer) clearTimeout(autoHideTimer)
    message.value = msg
    emotion.value = emo
    visible.value = true
    if (duration > 0) {
      autoHideTimer = setTimeout(() => { visible.value = false }, duration)
    }
  }

  const hide = () => {
    if (autoHideTimer) clearTimeout(autoHideTimer)
    visible.value = false
  }

  return { visible, message, emotion, show, hide }
}
