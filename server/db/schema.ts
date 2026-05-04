import { mysqlTable, varchar, int, json, datetime } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: varchar('id', { length: 128 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
})

export const pages = mysqlTable('pages', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 128 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  position: int('position').notNull().default(0),
})

export const tabs = mysqlTable('tabs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  pageId: varchar('page_id', { length: 36 }).notNull().references(() => pages.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  position: int('position').notNull().default(0),
})

export const widgets = mysqlTable('widgets', {
  id: varchar('id', { length: 36 }).primaryKey(),
  tabId: varchar('tab_id', { length: 36 }).notNull().references(() => tabs.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 128 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  pluginId: varchar('plugin_id', { length: 100 }).notNull(),
  colStart: int('col_start').notNull().default(1),
  colSpan: int('col_span').notNull().default(3),
  rowStart: int('row_start').notNull().default(1),
  rowSpan: int('row_span').notNull().default(3),
  config: json('config').notNull().default({}),
})

export const ingestTokens = mysqlTable('ingest_tokens', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 128 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  widgetId: varchar('widget_id', { length: 36 }).notNull().references(() => widgets.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  expiresAt: datetime('expires_at').notNull(),
  lastUsedAt: datetime('last_used_at'),
})

export const ingestData = mysqlTable('ingest_data', {
  id: varchar('id', { length: 36 }).primaryKey(),
  widgetId: varchar('widget_id', { length: 36 }).notNull().references(() => widgets.id, { onDelete: 'cascade' }),
  tokenId: varchar('token_id', { length: 36 }).notNull().references(() => ingestTokens.id, { onDelete: 'cascade' }),
  payload: json('payload').notNull(),
  createdAt: datetime('created_at').notNull(),
})
