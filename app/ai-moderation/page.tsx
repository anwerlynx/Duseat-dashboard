import type { Metadata } from 'next'
import { AiModerationManagement } from '@/components/platform/ai-moderation-management'

export const metadata: Metadata = {
  title: 'AI Moderation & Anomaly Engine | Duseat Admin',
  description: 'Automated real-time neural detection for spam requests, falsified broker licenses, duplicate listings, and off-platform fraudulent transaction circumvention.',
}

export default function AiModerationPage() {
  return <AiModerationManagement />
}
