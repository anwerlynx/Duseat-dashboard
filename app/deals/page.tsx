import { DealsManagement } from '@/components/platform/deals-management'

export const metadata = {
  title: 'Deals & Transactions | Duseat Admin',
  description: 'Manage active escrow, property conveyance, completed transactions, and commission payouts.',
}

export default function DealsPage() {
  return <DealsManagement />
}
