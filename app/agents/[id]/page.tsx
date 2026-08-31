import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AgentProfile } from '@/components/platform/agent-profile'
import { agentById, agents } from '@/lib/platform-users'

export function generateStaticParams() { return agents.map(({ id }) => ({ id })) }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const agent = agentById(id); return { title: agent ? `${agent.name} | Agent Profile` : 'Agent Profile', description: 'Full agent activity profile.' } }
export default async function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const agent = agentById(id); if (!agent) notFound(); return <AgentProfile agent={agent} /> }
