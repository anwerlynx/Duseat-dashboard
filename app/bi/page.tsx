import type { Metadata } from 'next'
import { BusinessIntelligenceManagement } from '@/components/platform/bi-management'

export const metadata: Metadata = {
  title: 'Business Intelligence | Duseat Admin',
  description: 'Real-time visibility into marketplace conversion drop-offs, unit economics (LTV/CAC), cohort retention curves, and revenue forecasting.',
}

export default function BiPage() {
  return <BusinessIntelligenceManagement />
}
