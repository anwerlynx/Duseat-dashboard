import type { Metadata } from 'next'
import { InvestorsManagement } from '@/components/platform/investors-management'

export const metadata: Metadata = {
  title: 'Investors Management | Duseat Admin',
  description: 'Manage investor profiles, requests, offers, deals and account health.',
}

export default function InvestorsPage() {
  return <InvestorsManagement />
}
