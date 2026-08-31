import type { Metadata } from 'next'
import { AgentsManagement } from '@/components/platform/agents-management'

export const metadata: Metadata = {
  title: 'Agents Management | Duseat Admin',
  description: 'Review, verify and manage agent accounts across the Duseat marketplace.',
}

export default function AgentsPage() {
  return <AgentsManagement />
}
