import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.npm_lifecycle_event === 'build'

const connectionString =
  process.env.DATABASE_URL ||
  (process.env.NODE_ENV === 'production' && !isBuildPhase
    ? (() => {
        throw new Error('[Security/Config] DATABASE_URL is required in production environment.')
      })()
    : 'postgresql://postgres:postgres@localhost:5432/duseat')

declare global {
  // eslint-disable-next-line no-var
  var __duseat_pg_pool__: Pool | undefined
}

export const pool = globalThis.__duseat_pg_pool__ || new Pool({ connectionString })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__duseat_pg_pool__ = pool
}

export const db = drizzle(pool, { schema })
