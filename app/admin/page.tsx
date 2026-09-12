import type { Metadata } from 'next'
import { AdminManagement } from '@/components/platform/admin-management'

export const metadata: Metadata = {
  title: 'Admin Management & RBAC Permissions | Duseat Admin',
  description: 'Manage administrative operators, enforce two-factor authentication, assign granular module permissions, and inspect staff security audit trails.',
}

export default function AdminPage() {
  return <AdminManagement />
}
