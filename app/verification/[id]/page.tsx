import type { Metadata } from 'next'
import { Suspense } from 'react'
import { VerificationDetailPage } from '@/components/platform/verification-detail-page'

export const metadata: Metadata = {
  title: 'Verification Case Review | Duseat Admin',
  description: 'Adjudicate investor and agent verification documents, review OCR extracts, and manage KYC compliance.',
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#6f777f]">Loading Verification Details...</div>}>
      <VerificationDetailPage id={id} />
    </Suspense>
  )
}
