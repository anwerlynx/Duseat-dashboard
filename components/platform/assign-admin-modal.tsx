'use client'

import * as React from 'react'
import { X, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react'
import type { PropertyRequest } from '@/lib/platform-users'

interface AssignAdminModalProps {
  requests: PropertyRequest[]
  onClose: () => void
  onAssign: (adminName: string, notes?: string) => void
}

const adminTeam = [
  { name: 'Nadia Al-Hashimi', role: 'Head of Compliance & Quality', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', activeCases: 14 },
  { name: 'Tariq Al-Mansoor', role: 'Senior Verification Officer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', activeCases: 9 },
  { name: 'Zayd Ibrahim', role: 'Broker Relationship Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', activeCases: 18 },
  { name: 'Layla Haddad', role: 'VIP Investor Concierge', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80', activeCases: 7 },
]

export function AssignAdminModal({ requests, onClose, onAssign }: AssignAdminModalProps) {
  const [selectedAdmin, setSelectedAdmin] = React.useState(adminTeam[0].name)
  const [notes, setNotes] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAssign(selectedAdmin, notes)
  }

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
              <UserCheck className="size-4.5 text-[#00c2cb]" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#1f2327]">Assign Request Manager</h3>
              <p className="text-[12px] text-[#6f777f]">
                Assign {requests.length === 1 ? `Request #${requests[0].id}` : `${requests.length} selected requests`} to team member
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

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-[#1f2327] mb-2 block">
              Select Responsible Administrator
            </label>
            <div className="space-y-2">
              {adminTeam.map((admin) => (
                <label
                  key={admin.name}
                  onClick={() => setSelectedAdmin(admin.name)}
                  className={`flex items-center justify-between p-3 rounded-[8px] border transition-all cursor-pointer ${
                    selectedAdmin === admin.name
                      ? 'border-[#00c2cb] bg-[#e5f6f7]/40 ring-1 ring-[#00c2cb]'
                      : 'border-[#d3d5d7] bg-white hover:bg-[#fcfcfc]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={admin.avatar}
                      alt={admin.name}
                      className="size-9 rounded-full object-cover border border-[#d3d5d7]"
                    />
                    <div>
                      <p className="text-[13px] font-bold text-[#1f2327]">{admin.name}</p>
                      <p className="text-[11px] text-[#6f777f]">{admin.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#6f777f]">{admin.activeCases} active</span>
                    <input
                      type="radio"
                      name="adminSelect"
                      checked={selectedAdmin === admin.name}
                      onChange={() => setSelectedAdmin(admin.name)}
                      className="size-4 text-[#00c2cb] focus:ring-[#00c2cb]"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#1f2327] mb-1.5 block">
              Assignment Note (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add instructions, handover notes, or key priorities for this case..."
              className="w-full rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 text-[13px] text-[#1f2327] placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:outline-none"
            />
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
              className="h-[36px] flex items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-4 text-[13px] font-semibold text-white hover:bg-[#00a8b0] shadow-2xs cursor-pointer ant-wave-btn"
            >
              <CheckCircle2 className="size-4" />
              <span>Confirm Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
