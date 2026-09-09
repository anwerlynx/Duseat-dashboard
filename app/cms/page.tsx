import type { Metadata } from 'next'
import { CmsManagement } from '@/components/platform/cms-management'

export const metadata: Metadata = {
  title: 'Content Management System (CMS) | Duseat Admin',
  description: 'Manage public website pages, mobile app touchpoints, marketing banners, SEO, and centralized media library across Duseat.',
}

export default function CmsPage() {
  return <CmsManagement />
}
