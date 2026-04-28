import { cpSync } from 'node:fs'
import { resolve } from 'node:path'

function copyStockfish() {
  try {
    const bin = resolve('node_modules/stockfish/bin')
    cpSync(`${bin}/stockfish-18-lite-single.js`,   resolve('public/stockfish.js'))
    cpSync(`${bin}/stockfish-18-lite-single.wasm`, resolve('public/stockfish.wasm'))
  } catch {}
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY ?? '',
    public: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? '',
    },
  },
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'ru', file: 'ru.json' },
      { code: 'kz', file: 'kz.json' }
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    }
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: ['/register', '/'],
      cookieRedirect: false,
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },
  vite: {
    plugins: [
      {
        name: 'copy-stockfish',
        buildStart: copyStockfish,
        configureServer: copyStockfish,
      },
    ],
  },
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/LKog.png',
        },
      ],
    },
  },
})
