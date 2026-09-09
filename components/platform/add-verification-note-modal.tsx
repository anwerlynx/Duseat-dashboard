'use client'

import * as React from 'react'
import { X, ShieldAlert, Pin, CheckCircle2, User, MessageSquare } from 'lucide-react'
import type { VerificationCase, VerificationNote } from '@/lib/verification-data'

interface AddVerificationNoteModalProps {
  caseItem: VerificationCase
  initialNote?: VerificationNote | null
  onClose: () => void
  onSaveNote: (note: Omit<VerificationNote, 'id' | 'createdAt'>) => void
}

export function AddVerificationNoteModal({
  caseItem,
  initialNote,
  onClose,
  onSaveNote,
}: AddVerificationNoteModalProps) {
  const [content, setContent] = React.useState(initialNote?.content || '')
  const [tag, setTag] = React.useState<VerificationNote['tag']>(initialNote?.tag || 'General')
  const [isPinned, setIsPinned] = React.useState(initialNote?.isPinned || false)
  const [authorRole, setAuthorRole] = React.useState(initialNote?.authorRole || 'Senior Compliance Officer')

  React.useEffect(() => {
    if (initialNote) {
      setContent(initialNote.content)
      setTag(initialNote.tag)
      setIsPinned(Boolean(initialNote.isPinned))
      setAuthorRole(initialNote.authorRole)
    }
  }, [initialNote])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    onSaveNote({
      caseId: caseItem.id,
      targetName: caseItem.applicantName,
      targetRole: caseItem.role,
      author: initialNote?.author || 'Nadia Al-Hashimi',
      authorRole,
      authorAvatar:
        initialNote?.authorAvatar ||
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      content: content.trim(),
      tag,
      isPinned,
    })
    onClose()
  }

  const tags: VerificationNote['tag'][] = [
    'General',
    'Compliance Approved',
    'High Risk',
    'PEP Check',
    'Document Mismatch',
    'License Expiry',
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-[12px] border border-[#d3d5d7] bg-white shadow-2xl overflow-hidden ant-modal-zoom">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] px-5 py-4 bg-[#fcfcfc]">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-[8px] bg-[#eff1f3] text-[#1f2327]">
              <MessageSquare className="size-4.5 text-[#00c2cb]" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#1f2327]">
                {initialNote ? 'Edit Compliance Note' : 'Add Verification Note'}
              </h3>
              <p className="text-[12px] text-[#6f777f]">
                Case {caseItem.id} • {caseItem.applicantName} ({caseItem.role})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-[#1f2327] mb-1.5 block">Compliance Tag</label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTag(t)}
                  className={`rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition-all cursor-pointer ${
                    tag === t
                      ? 'bg-[#1f2327] text-white font-semibold shadow-2xs'
                      : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:text-[#1f2327] hover:bg-[#eff1f3]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#1f2327] mb-1.5 block">
              Internal Compliance Note
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record audit observations, registry check references, or reviewer feedback..."
              className="w-full rounded-[8px] border border-[#d3d5d7] bg-white p-3 text-[13px] text-[#1f2327] placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:outline-none focus:ring-2 focus:ring-[#00c2cb]/20"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-[#1f2327] select-none">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="size-4 rounded border-[#d3d5d7] text-[#00c2cb] focus:ring-[#00c2cb]"
              />
              <span className="flex items-center gap-1">
                <Pin className="size-3.5 text-[#f79009]" />
                Pin note to top of case
              </span>
            </label>

            <span className="text-[12px] text-[#6f777f]">Internal only (hidden from user)</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d3d5d7]">
            <button
              type="button"
              onClick={onClose}
              className="h-[36px] rounded-[8px] border border-[#d3d5d7] px-4 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="h-[36px] flex items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-4 text-[13px] font-semibold text-white hover:bg-[#00a8b0] disabled:opacity-50 shadow-2xs cursor-pointer ant-wave-btn"
            >
              <CheckCircle2 className="size-4" />
              <span>{initialNote ? 'Update Note' : 'Save Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
