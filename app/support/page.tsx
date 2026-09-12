import type { Metadata } from 'next'
import { SupportManagement } from '@/components/platform/support-management'

export const metadata: Metadata = {
  title: 'Support Center & Helpdesk | Duseat Admin',
  description: 'Manage customer service inquiries, technical bug reports, verification appeals, and user feedback.',
}

export default function SupportPage() {
  return <SupportManagement />
}
