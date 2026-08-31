import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ModuleDashboard } from '@/components/platform/module-dashboard-with-data'
import { RequestsManagement } from '@/components/platform/requests-management'
import { moduleBySlug, platformModules } from '@/lib/platform-modules'

export function generateStaticParams() {
  return platformModules.map((module) => ({ module: module.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module: slug } = await params
  const module = moduleBySlug[slug]
  return module ? { title: `${module.title} | Duseat Admin`, description: module.description } : {}
}

export default async function PlatformModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params
  if (slug === 'requests') {
    return <RequestsManagement />
  }
  const module = moduleBySlug[slug]
  if (!module) notFound()
  return <ModuleDashboard module={module} />
}
