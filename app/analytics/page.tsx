import type { Metadata } from 'next'
import { AnalyticsManagement } from '@/components/platform/analytics-management'

export const metadata: Metadata = {
  title: 'Analytics & Business Intelligence | Duseat Admin',
  description: 'Complete analytics and business intelligence layer for Duseat Admin, tracking platform growth, engagement, cohorts, supply & demand, and executive insights.',
}

export default function AnalyticsPage() {
  return <AnalyticsManagement />
}
