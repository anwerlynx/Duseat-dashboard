import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ModuleDashboard } from '@/components/platform/module-dashboard'
import { moduleBySlug, platformModules } from '@/lib/platform-modules'

const DEDICATED_ROUTES = new Set([
  'requests',
  'verification',
  'offers',
  'deals',
  'conversations',
  'chats',
  'reports',
  'notifications',
  'subscriptions',
  'finance',
  'analytics',
  'cms',
  'marketing',
  'settings',
  'agents',
  'investors',
  'users',
  'all-tools',
  'apple-design',
  'design-system',
])

export function generateStaticParams() {
  return platformModules
    .filter((m) => !DEDICATED_ROUTES.has(m.slug))
    .map((module) => ({ module: module.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module: slug } = await params
  if (DEDICATED_ROUTES.has(slug)) return {}
  const module = moduleBySlug[slug]
  return module ? { title: `${module.title} | Duseat Admin`, description: module.description } : {}
}

export default async function PlatformModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params
  if (DEDICATED_ROUTES.has(slug)) {
    notFound()
  }
  const module = moduleBySlug[slug]
  if (!module) notFound()
  return <ModuleDashboard module={module} />
}

