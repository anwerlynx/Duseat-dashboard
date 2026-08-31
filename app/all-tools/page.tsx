import type { Metadata } from 'next'
import { AllTools } from '@/components/platform/all-tools'

export const metadata: Metadata = {
  title: 'All Tools | Duseat Admin',
  description: 'Access every Duseat marketplace administration module.',
}

export default function AllToolsPage() {
  return <AllTools />
}
