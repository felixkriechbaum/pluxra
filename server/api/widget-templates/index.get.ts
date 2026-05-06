import { useDb } from '../../utils/db'
import { widgetTemplates } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const uid = event.context.uid as string
  const db = useDb()
  return db.select().from(widgetTemplates).where(eq(widgetTemplates.userId, uid))
})
