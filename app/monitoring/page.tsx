import type { Metadata } from 'next'
import { MonitoringManagement } from '@/components/platform/monitoring-management'

export const metadata: Metadata = {
  title: 'System Health & Infrastructure Monitoring | Duseat Admin',
  description: 'Real-time telemetry across cluster nodes, database read/write replicas, redis queues, push notification dispatchers, and application error logs.',
}

export default function MonitoringPage() {
  return <MonitoringManagement />
}
