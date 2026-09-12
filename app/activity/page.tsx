import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ActivityLogsManagement } from '@/components/platform/activity-logs-management'

export const metadata: Metadata = {
  title: 'Activity & Audit Logs | Duseat Admin',
  description: 'Immutable chronological trail of administrative interventions, authentication security events, API operations, and financial transactions.',
}

export default function ActivityLogsPage() {
  return (
    <Suspense fallback={null}>
      <ActivityLogsManagement />
    </Suspense>
  )
}
