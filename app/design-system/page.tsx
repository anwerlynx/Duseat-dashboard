import type { Metadata } from 'next'
import { DesignSystemPage } from '@/components/platform/design-system-page'

export const metadata: Metadata = {
  title: 'Design System & Component Reference | Duseat Admin',
  description: 'The single source of truth for Duseat color tokens, typography scales, buttons, badges, country flags, iconography, and UI components.',
}

export default function Page() {
  return <DesignSystemPage />
}
