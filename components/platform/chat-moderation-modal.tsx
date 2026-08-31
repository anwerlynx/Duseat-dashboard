'use client'

import * as React from 'react'
import { ChatModerator } from './chat-moderator'

export function ChatModerationModal({
  isOpen,
  onClose,
  threadId = 'CHAT-917212',
}: {
  isOpen: boolean
  onClose: () => void
  threadId?: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 font-sans backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-5xl overflow-hidden rounded-[20px] shadow-2xl animate-in zoom-in-95">
        <ChatModerator initialThreadId={threadId} onClose={onClose} isModal />
      </div>
    </div>
  )
}
