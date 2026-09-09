import type { Metadata } from 'next'
import { InvestorsManagement } from '@/components/platform/investors-management'

export const metadata: Metadata = {
  title: 'Users Management | Duseat Admin',
  description: 'Review, verify and manage users across the Duseat marketplace.',
}

export default function UsersPage() {
  return <InvestorsManagement />
}
