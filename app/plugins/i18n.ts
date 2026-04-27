import en from '../../public/locales/en/common.json'
import ru from '../../public/locales/ru/common.json'
import kz from '../../public/locales/kz/common.json'

const allTranslations: Record<string, Record<string, any>> = { en, ru, kz }

export default defineNuxtPlugin((nuxtApp) => {
  const currentLocale = ref('en')
  const translations = ref<Record<string, any>>({})

  const setLocale = (locale: string) => {
    // Fallback to English if locale doesn't exist
    if (!allTranslations[locale]) locale = 'en'
    
    currentLocale.value = locale
    translations.value = (allTranslations[locale] || allTranslations['en'])!
    
    if (import.meta.client) {
      localStorage.setItem('locale', locale)
      const localeCookie = useCookie('locale')
      localeCookie.value = locale
    }
  }

  // Determine initial locale
  let initialLocale = 'en'
  if (import.meta.client) {
    initialLocale = localStorage.getItem('locale') || 'en'
  } else {
    // SSR: read from cookie
    const localeCookie = useCookie('locale')
    if (localeCookie.value && ['en', 'ru', 'kz'].includes(localeCookie.value)) {
      initialLocale = localeCookie.value
    }
  }

  // Apply translations immediately without async fetching
  setLocale(initialLocale)
  
  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.')
    let result: any = translations.value
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k]
      } else {
        return key // Fallback to key if translation is missing
      }
    }
    return String(result)
  }

  // Provide to the app
  return {
    provide: {
      t,
      setLocale,
      locale: currentLocale
    }
  }
})
