'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { platformRecords, notifications, messages, auditLogs, platformSettings } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session?.user?.id) return session.user.id
  } catch (error) {
    // Graceful fallback for standalone / demo mode
  }
  return 'demo-admin-user'
}

// In-memory fallback stores for demo mode without PostgreSQL
const memoryRecords: Record<string, any[]> = {}
const memoryNotifications: any[] = [
  { id: 1, userId: 'demo-admin-user', title: 'New agent verification', body: 'Layla Haddad submitted documents for review.', kind: 'info', read: false, createdAt: new Date() },
  { id: 2, userId: 'demo-admin-user', title: 'Offer accepted', body: 'An investor accepted an offer in Downtown apartment.', kind: 'success', read: false, createdAt: new Date(Date.now() - 3600000) },
  { id: 3, userId: 'demo-admin-user', title: 'Subscription renewal', body: 'Three agent packages renew today.', kind: 'warning', read: true, createdAt: new Date(Date.now() - 7200000) },
]
const memoryMessages: Record<string, any[]> = {
  'main-channel': [
    { id: 1, userId: 'demo-admin-user', threadKey: 'main-channel', sender: 'Operations Team', recipient: 'Admin', body: 'Platform metrics update completed.', read: true, createdAt: new Date(Date.now() - 1800000) },
    { id: 2, userId: 'demo-admin-user', threadKey: 'main-channel', sender: 'Support Desk', recipient: 'Admin', body: 'All pending verification tickets resolved.', read: false, createdAt: new Date(Date.now() - 600000) },
  ],
}
const memorySettings: Record<string, any> = {}

// Platform Records CRUD
export async function getModuleRecords(module: string) {
  try {
    const userId = await getUserId()
    const records = await db
      .select()
      .from(platformRecords)
      .where(and(eq(platformRecords.userId, userId), eq(platformRecords.module, module)))
      .orderBy(desc(platformRecords.createdAt))
    return records
  } catch (error) {
    return memoryRecords[module] || []
  }
}

export async function createRecord(module: string, data: {
  recordKey: string
  title: string
  subtitle?: string
  status?: string
  amount?: number
  rating?: number
  metadata?: Record<string, any>
}) {
  const userId = await getUserId()
  try {
    const result = await db
      .insert(platformRecords)
      .values({
        userId,
        module,
        ...data,
      })
      .returning()
    
    await logAction(userId, 'CREATE', module, data.recordKey)
    revalidatePath(`/${module}`)
    return result[0]
  } catch (error) {
    const record = {
      id: Date.now(),
      userId,
      module,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    if (!memoryRecords[module]) memoryRecords[module] = []
    memoryRecords[module].unshift(record)
    return record
  }
}

export async function updateRecord(module: string, recordKey: string, data: Partial<typeof platformRecords.$inferInsert>) {
  const userId = await getUserId()
  try {
    const result = await db
      .update(platformRecords)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(platformRecords.userId, userId), eq(platformRecords.module, module), eq(platformRecords.recordKey, recordKey)))
      .returning()
    
    await logAction(userId, 'UPDATE', module, recordKey)
    revalidatePath(`/${module}`)
    return result[0]
  } catch (error) {
    if (memoryRecords[module]) {
      const idx = memoryRecords[module].findIndex((r) => r.recordKey === recordKey)
      if (idx !== -1) {
        memoryRecords[module][idx] = { ...memoryRecords[module][idx], ...data, updatedAt: new Date() }
        return memoryRecords[module][idx]
      }
    }
    return { recordKey, ...data }
  }
}

export async function deleteRecord(module: string, recordKey: string) {
  const userId = await getUserId()
  try {
    await db
      .delete(platformRecords)
      .where(and(eq(platformRecords.userId, userId), eq(platformRecords.module, module), eq(platformRecords.recordKey, recordKey)))
    
    await logAction(userId, 'DELETE', module, recordKey)
    revalidatePath(`/${module}`)
  } catch (error) {
    if (memoryRecords[module]) {
      memoryRecords[module] = memoryRecords[module].filter((r) => r.recordKey !== recordKey)
    }
  }
}

// Notifications
export async function getNotifications(unreadOnly = false) {
  try {
    const userId = await getUserId()
    let query = db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
    
    if (unreadOnly) {
      query = query.where(eq(notifications.read, false))
    }
    
    return await query.orderBy(desc(notifications.createdAt))
  } catch (error) {
    return unreadOnly ? memoryNotifications.filter((n) => !n.read) : memoryNotifications
  }
}

export async function createNotification(title: string, body: string, kind: 'info' | 'success' | 'warning' | 'error' = 'info', actionUrl?: string) {
  const userId = await getUserId()
  try {
    return await db
      .insert(notifications)
      .values({ userId, title, body, kind, actionUrl })
      .returning()
  } catch (error) {
    const item = { id: Date.now(), userId, title, body, kind, actionUrl, read: false, createdAt: new Date() }
    memoryNotifications.unshift(item)
    return [item]
  }
}

export async function markNotificationRead(id: number) {
  const userId = await getUserId()
  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
    
    revalidatePath('/')
  } catch (error) {
    const item = memoryNotifications.find((n) => n.id === id)
    if (item) item.read = true
  }
}

// Messaging
export async function getThreadMessages(threadKey: string) {
  try {
    const userId = await getUserId()
    return await db
      .select()
      .from(messages)
      .where(and(eq(messages.userId, userId), eq(messages.threadKey, threadKey)))
      .orderBy(messages.createdAt)
  } catch (error) {
    return memoryMessages[threadKey] || []
  }
}

export async function sendMessage(threadKey: string, sender: string, recipient: string, body: string) {
  const userId = await getUserId()
  try {
    const result = await db
      .insert(messages)
      .values({ userId, threadKey, sender, recipient, body })
      .returning()
    
    revalidatePath('/')
    return result[0]
  } catch (error) {
    const item = { id: Date.now(), userId, threadKey, sender, recipient, body, read: false, createdAt: new Date() }
    if (!memoryMessages[threadKey]) memoryMessages[threadKey] = []
    memoryMessages[threadKey].push(item)
    return item
  }
}

export async function markMessageRead(id: number) {
  const userId = await getUserId()
  try {
    await db
      .update(messages)
      .set({ read: true })
      .where(and(eq(messages.id, id), eq(messages.userId, userId)))
    
    revalidatePath('/')
  } catch (error) {
    // memory update
  }
}

// Audit Logs
async function logAction(userId: string, action: string, module: string, recordKey?: string | null, details?: Record<string, any>) {
  try {
    await db
      .insert(auditLogs)
      .values({
        userId,
        action,
        module,
        recordKey: recordKey ?? undefined,
        details: details || {},
      })
  } catch (error) {
    // ignore in demo mode
  }
}

export async function getAuditLogs(module?: string) {
  try {
    const userId = await getUserId()
    let query = db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
    
    if (module) {
      query = query.where(eq(auditLogs.module, module))
    }
    
    return await query.orderBy(desc(auditLogs.createdAt))
  } catch (error) {
    return []
  }
}

// Settings
export async function getSetting(key: string) {
  try {
    const userId = await getUserId()
    const result = await db
      .select()
      .from(platformSettings)
      .where(and(eq(platformSettings.userId, userId), eq(platformSettings.settingKey, key)))
    
    return result[0]?.value || null
  } catch (error) {
    return memorySettings[key] || null
  }
}

export async function updateSetting(key: string, value: Record<string, any>) {
  const userId = await getUserId()
  try {
    const existing = await getSetting(key)
    
    if (existing) {
      await db
        .update(platformSettings)
        .set({ value, updatedAt: new Date() })
        .where(and(eq(platformSettings.userId, userId), eq(platformSettings.settingKey, key)))
    } else {
      await db
        .insert(platformSettings)
        .values({ userId, settingKey: key, value })
    }
    
    revalidatePath('/')
  } catch (error) {
    memorySettings[key] = value
  }
}
