import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '#widgets': fileURLToPath(new URL('./plugins/widgets', import.meta.url)),
      },
    },
  },
  components: {
    dirs: [
      {
        path: '~/components/ui',
        pattern: '**/*.vue',
        pathPrefix: false,
      },
      '~/components',
    ],
  },
  router: {
    middleware: ['auth'],
  },
  runtimeConfig: {
    dbUrl: '',
    firebaseProjectId: '',
    firebaseClientEmail: '',
    firebasePrivateKey: '',
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || 'dev',
    },
  },
})
