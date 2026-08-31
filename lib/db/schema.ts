import { pgTable, text, boolean, timestamp, numeric, jsonb, serial, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Better Auth tables (keep their camelCase exactly as generated)
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// Platform app tables
export const platformRecords = pgTable(
  'platform_records',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    module: text('module').notNull(),
    recordKey: text('recordKey').notNull(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    status: text('status').notNull().default('Active'),
    amount: numeric('amount', { precision: 14, scale: 2 }),
    rating: numeric('rating', { precision: 3, scale: 2 }),
    metadata: jsonb('metadata').notNull().default({}),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => [
    index('idx_platform_records_user').on(table.userId),
    index('idx_platform_records_module').on(table.module),
    uniqueIndex('idx_platform_records_unique').on(table.userId, table.module, table.recordKey),
  ]
)

export const notifications = pgTable(
  'notifications',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    kind: text('kind').notNull().default('info'), // 'info', 'success', 'warning', 'error'
    read: boolean('read').notNull().default(false),
    actionUrl: text('actionUrl'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => [
    index('idx_notifications_user').on(table.userId),
    index('idx_notifications_read').on(table.read),
  ]
)

export const messages = pgTable(
  'messages',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    threadKey: text('threadKey').notNull(),
    sender: text('sender').notNull(),
    recipient: text('recipient').notNull(),
    body: text('body').notNull(),
    read: boolean('read').notNull().default(false),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => [
    index('idx_messages_user').on(table.userId),
    index('idx_messages_thread').on(table.threadKey),
  ]
)

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    action: text('action').notNull(),
    module: text('module').notNull(),
    recordKey: text('recordKey'),
    details: jsonb('details').notNull().default({}),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => [
    index('idx_audit_logs_user').on(table.userId),
    index('idx_audit_logs_module').on(table.module),
  ]
)

export const platformSettings = pgTable(
  'platform_settings',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    settingKey: text('settingKey').notNull(),
    value: jsonb('value').notNull().default({}),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('idx_platform_settings_unique').on(table.userId, table.settingKey),
  ]
)

// Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  records: many(platformRecords),
  notifications: many(notifications),
  messages: many(messages),
  auditLogs: many(auditLogs),
  settings: many(platformSettings),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}))
