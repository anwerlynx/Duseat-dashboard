import type { Metadata } from 'next'
import { Suspense } from 'react'
 import { UserProfileUnified } from '@/components/platform/user-profile-unified'

export const metadata: Metadata = {
  title: 'User Profile & Verification | Duseat Admin',
  description: 'View user profile, contact details, submitted KYC documents, and compliance history.',
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#6f777f]">Loading User Profile...</div>}>
      <UserProfileUnified id={id} />
    </Suspense>
  )
}
