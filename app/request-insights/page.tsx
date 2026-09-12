import type { Metadata } from 'next'
import { Suspense } from 'react'
import { RequestInsightsWorkspace } from '@/components/platform/request-insights-workspace'

export const metadata: Metadata = {
  title: 'Request Insights | Duseat Admin',
  description: 'Deep marketplace analytics workspace for property requests, reach funnel, and AI scoring.',
}

export default function RequestInsightsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#68727D]">Loading request insights...</div>}>
      <RequestInsightsWorkspace />
    </Suspense>
  )
}
