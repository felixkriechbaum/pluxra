import { migrate } from 'drizzle-orm/mysql2/migrator'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { join } from 'path'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  const connection = await mysql.createConnection(config.dbUrl as string)
  const db = drizzle(connection)

  const migrationsFolder = join(process.cwd(), 'server/db/migrations')

  try {
    await migrate(db, { migrationsFolder })
    console.log('[db] migrations applied')
  }
  catch (err) {
    console.error('[db] migration failed:', err)
    throw err
  }
  finally {
    await connection.end()
  }
})
