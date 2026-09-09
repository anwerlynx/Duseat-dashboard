import type { Metadata } from 'next'
import { CustomReportsManagement } from '@/components/platform/custom-reports-management'

export const metadata: Metadata = {
  title: 'Reports & Data Composition | Duseat Admin',
  description: 'Create, configure, preview, save, generate, schedule, and export custom business reports from Duseat data.',
}

export default function ReportsIndexPage() {
  return <CustomReportsManagement />
}
