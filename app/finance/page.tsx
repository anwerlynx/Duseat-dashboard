import type { Metadata } from 'next'
import { FinanceManagement } from '@/components/platform/finance-management'

export const metadata: Metadata = {
  title: 'Finance & Revenue | Duseat Admin',
  description: 'Financial operations command center, revenue analytics, transactions, refunds, taxes, payment gateways and reconciliation.',
}

export default function FinancePage() {
  return <FinanceManagement />
}
