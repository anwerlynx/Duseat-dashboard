'use client'

import * as React from 'react'
import { X, UserCheck, Shield, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AssignDealManagerModalProps {
  dealId: string
  currentManager: string
  isOpen: boolean
  onClose: () => void
  onAssign: (dealId: string, managerName: string) => void
}

const MANAGERS = [
  { name: 'Ahmad Khaled', role: 'Super Admin & Conveyance Lead', email: 'ahmad@duseat.ae', activeDeals: 8, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { name: 'Sara Al Mansoor', role: 'Senior Escrow & Settlement Officer', email: 'sara@duseat.ae', activeDeals: 12, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { name: 'Tariq Mahmoud', role: 'Compliance & Legal Director', email: 'tariq@duseat.ae', activeDeals: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { name: 'Layla Rashid', role: 'Deal Facilitator & Trustee Specialist', email: 'layla.r@duseat.ae', activeDeals: 9, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
]

export function AssignDealManagerModal({
  dealId,
  currentManager,
  isOpen,
  onClose,
  onAssign,
}: AssignDealManagerModalProps) {
  const [selected, setSelected] = React.useState(currentManager || 'Ahmad Khaled')
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    if (isOpen) {
      setSelected(currentManager || 'Ahmad Khaled')
      setSearch('')
    }
  }, [isOpen, currentManager])

  if (!isOpen) return null

  const filteredManagers = MANAGERS.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-xs ant-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-[16px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] bg-[#fcfcfc] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-[8px] bg-[#e5f6f7] text-[#00c2cb]">
              <UserCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1f2327]">Assign Deal Manager</h3>
              <p className="text-[12px] text-[#6f777f]">Deal Ref: {dealId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-[8px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-[13px] text-[#6f777f]">
            Select an authorized conveyance and escrow officer to manage trustee appointments and commission disbursement:
          </p>

          {/* Search Box */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6f777f]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by manager name, role, email..."
              className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[13px] text-[#1f2327] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
            />
          </div>

          {/* Managers List */}
          <div className="space-y-2 pt-1">
            {filteredManagers.map((m) => {
              const isSelected = selected === m.name
              const isCurrent = currentManager === m.name

              return (
                <label
                  key={m.name}
                  className={cn(
                    'flex items-center justify-between p-3.5 rounded-[10px] border cursor-pointer transition-all',
                    isSelected
                      ? 'border-[#00c2cb] bg-[#e5f6f7]/40 ring-1 ring-[#00c2cb]'
                      : 'border-[#d3d5d7] hover:bg-[#fcfcfc]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="manager"
                      value={m.name}
                      checked={isSelected}
                      onChange={() => setSelected(m.name)}
                      className="size-4 text-[#00c2cb] focus:ring-[#00c2cb]"
                    />
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="size-10 rounded-full object-cover border border-[#d3d5d7]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[14px] text-[#1f2327]">{m.name}</p>
                        {isCurrent && (
                          <span className="rounded bg-[#eff1f3] px-1.5 py-0.2 text-[10px] font-semibold text-[#6f777f]">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#6f777f]">{m.role}</p>
                      <p className="text-[11px] font-mono text-[#9da4ae]">{m.email} • {m.activeDeals} active cases</p>
                    </div>
                  </div>
                  <Shield className={cn('size-4', isSelected ? 'text-[#00c2cb]' : 'text-[#9da4ae]')} />
                </label>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-[#d3d5d7] bg-[#fcfcfc] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onAssign(dealId, selected)
              onClose()
            }}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-4 text-[13px] font-semibold text-[#1f2327] hover:bg-[#00adb5] transition-colors cursor-pointer shadow-2xs ant-wave-btn"
          >
            <UserCheck className="size-4" />
            <span>Confirm Assignment</span>
          </button>
        </div>
      </div>
    </div>
  )
}
