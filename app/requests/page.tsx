import type { Metadata } from 'next'
import { RequestsManagement } from '@/components/platform/requests-management'

export const metadata: Metadata = {
  title: 'Property Requests | Duseat Admin',
  description: 'Manage investor requests, browse timeline feeds, table views, and pipeline boards.',
}

export default function RequestsPage() {
  return <RequestsManagement />
}
