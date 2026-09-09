import type { Metadata } from 'next'
import { Suspense } from 'react'
import { VerificationCenter } from '@/components/platform/verification-center'

export const metadata: Metadata = {
  title: 'Verification Center | Duseat Admin',
  description: 'Manage investor and agent identity verification, KYC queues, document audits, and compliance notes.',
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#6f777f]">Loading Verification Center...</div>}>
      <VerificationCenter />
    </Suspense>
  )
}
