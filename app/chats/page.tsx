import type { Metadata } from 'next'
import { PlatformShell } from '@/components/platform/platform-shell'
import { ChatModerator } from '@/components/platform/chat-moderator'
import { ToastProvider } from '@/components/dashboard/toast'

export const metadata: Metadata = {
  title: 'Live Negotiation Chats | Duseat Admin',
  description: 'Monitor live marketplace conversations, audits, and negotiation rooms.',
}

export default function ChatsIndexPage() {
  return (
    <ToastProvider>
      <PlatformShell title="Live Negotiation Room" eyebrow="Marketplace Chat">
        <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
          <ChatModerator initialThreadId="CHAT-917212" isModal={false} />
        </div>
      </PlatformShell>
    </ToastProvider>
  )
}
