import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';


export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Nuxt App',  // Заголовок сайта
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap',
        }
      ]
    }
  },
  

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@primevue/nuxt-module',
    '@nuxt/ui',
    'nuxt-echarts',
  ],


  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          cssLayer: false,
        }
      },
    },
    autoImport: true,
    composables: {
      exclude: ['useToast'], // Prevent PrimeVue useToast from auto-importing
    },
  },

  css: ['~/assets/main.css', 'normalize.css/normalize.css'],


  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
    },
    routeRules: {
      '/login': { middleware: [] },
      '/register': { middleware: [] },
      '/**': { middleware: ['auth'] }
    },
    ssr: false // Отключаем SSR для всех страниц
  },
})