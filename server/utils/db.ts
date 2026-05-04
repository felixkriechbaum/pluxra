import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from '../db/schema'

let _db: ReturnType<typeof drizzle> | null = null

export function useDb() {
  if (!_db) {
    const config = useRuntimeConfig()
    const connection = mysql.createPool(config.dbUrl as string)
    _db = drizzle(connection, { schema, mode: 'default' })
  }
  return _db
}
