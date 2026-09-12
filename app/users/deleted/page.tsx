import type { Metadata } from 'next'
import { DeletedUsersManagement } from '@/components/platform/deleted-users-management'

export const metadata: Metadata = {
  title: 'Deleted Users Archive & Recovery | Duseat Admin',
  description: 'Manage deleted account archives, compliance retention windows, and data recovery.',
}

export default function DeletedUsersPage() {
  return <DeletedUsersManagement />
}
