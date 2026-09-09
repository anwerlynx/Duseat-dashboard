import type { Metadata } from 'next'
import { SubscriptionsManagement } from '@/components/platform/subscriptions-management'

export const metadata: Metadata = {
  title: 'Subscriptions & Billing | Duseat Admin',
  description: 'Manage subscription plans, subscribers, payments, promo codes, invoices and billing lifecycle.',
}

export default function SubscriptionsPage() {
  return <SubscriptionsManagement />
}
