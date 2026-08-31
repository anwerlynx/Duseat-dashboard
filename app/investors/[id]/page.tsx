import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InvestorProfile } from '@/components/platform/investor-profile'
import { investorById, investors } from '@/lib/platform-users'

export function generateStaticParams() { return investors.map(({ id }) => ({ id })) }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const investor = investorById(id); return { title: investor ? `${investor.name} | Investor Profile` : 'Investor Profile', description: 'Full investor activity profile.' } }
export default async function InvestorProfilePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const investor = investorById(id); if (!investor) notFound(); return <InvestorProfile investor={investor} /> }
