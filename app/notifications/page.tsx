import type { Metadata } from 'next'
import { NotificationsManagement } from '@/components/platform/notifications-management'
import { ToastProvider } from '@/components/dashboard/toast'

export const metadata: Metadata = {
  title: 'Notifications & Campaigns | Duseat Admin',
  description: 'Create, schedule, manage and monitor notifications across Duseat.',
}

export default function NotificationsIndexPage() {
  return (
    <ToastProvider>
      <NotificationsManagement />
    </ToastProvider>
  )
}
