import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
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
    },
  },
})
