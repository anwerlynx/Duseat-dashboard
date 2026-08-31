import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db, pool } from './db'
import * as schema from './db/schema'

const baseURL = process.env.BETTER_AUTH_URL || 
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
  process.env.V0_RUNTIME_URL || 'http://localhost:3000'))

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET || 'duseat-admin-development-secret-key-32chars',
  baseURL,
  appName: 'Duseat Admin',
  trustedOrigins: [
    baseURL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.V0_RUNTIME_URL,
    'http://localhost:3000',
  ].filter(Boolean) as string[],
  plugins: [],
  advanced: {
    defaultCookieAttributes:
      process.env.NODE_ENV === 'development'
        ? { sameSite: 'none', secure: true }
        : { sameSite: 'lax', secure: process.env.NODE_ENV === 'production' },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
})
