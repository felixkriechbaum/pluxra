import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.NUXT_DB_URL!,
  },
})
