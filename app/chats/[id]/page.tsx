import type { Metadata } from 'next'
import { PlatformShell } from '@/components/platform/platform-shell'
import { ChatModerator } from '@/components/platform/chat-moderator'
import { initialChatThreads } from '@/lib/platform-chats'
import { ToastProvider } from '@/components/dashboard/toast'

export function generateStaticParams() {
  return initialChatThreads.map((thread) => ({
    id: thread.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Live Negotiation ${id} | Duseat Admin`,
    description: `Real-time chat moderation, transcript export, and audit for negotiation ${id}.`,
  }
}

export default async function DedicatedChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <ToastProvider>
      <PlatformShell title={`Negotiation Room: ${id}`} eyebrow="Live Chat">
        <div className="flex w-full min-w-0 flex-1 flex-col p-2 sm:p-3 lg:p-3.5 font-sans">
          <ChatModerator initialThreadId={id} isModal={false} />
        </div>
      </PlatformShell>
    </ToastProvider>
  )
}
