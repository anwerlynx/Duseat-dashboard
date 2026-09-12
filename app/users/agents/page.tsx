import type { Metadata } from 'next'
import { AgentsManagement } from '@/components/platform/agents-management'

export const metadata: Metadata = {
  title: 'Agents & Brokers Management | Duseat Admin',
  description: 'Manage and monitor all licensed agents and agency directories.',
}

export default function UsersAgentsPage() {
  return <AgentsManagement />
}
