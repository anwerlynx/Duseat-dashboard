import type { Metadata } from 'next'
import { SuspendedUsersManagement } from '@/components/platform/suspended-users-management'

export const metadata: Metadata = {
  title: 'Suspended Users & Enforcement | Duseat Admin',
  description: 'Manage suspended accounts, enforcement penalties, and account restrictions.',
}

export default function SuspendedUsersPage() {
  return <SuspendedUsersManagement />
}
