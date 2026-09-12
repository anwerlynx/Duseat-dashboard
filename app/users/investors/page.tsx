import type { Metadata } from 'next'
import { InvestorsManagement } from '@/components/platform/investors-management'

export const metadata: Metadata = {
  title: 'Investors Management | Duseat Admin',
  description: 'Manage and monitor all investor accounts on the platform.',
}

export default function UsersInvestorsPage() {
  return <InvestorsManagement />
}
