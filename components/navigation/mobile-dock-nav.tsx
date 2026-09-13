'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  Layers,
  Plus,
  MessageSquare,
  User,
  Settings,
  X,
  Send,
  UserCheck,
  Briefcase,
  Download,
  Calendar,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  LogOut,
  Sparkles,
  Activity,
  FileSpreadsheet,
} from 'lucide-react'
import { Dock, type DockItemData } from '@/components/ui/dock'
import { AllToolsModal } from '@/components/platform/all-tools-modal'
import { ScheduleExportModal } from '@/components/platform/schedule-export-modal'
import { exportToCsv, cn } from '@/lib/utils'

export function MobileDockNav() {
  const router = useRouter()
  const pathname = usePathname()

  // Modals / Sheets state
  const [allToolsOpen, setAllToolsOpen] = React.useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [scheduleExportOpen, setScheduleExportOpen] = React.useState(false)

  // Notification broadcast sub-modal state
  const [broadcastModalOpen, setBroadcastModalOpen] = React.useState(false)
  const [broadcastTitle, setBroadcastTitle] = React.useState('')
  const [broadcastMessage, setBroadcastMessage] = React.useState('')
  const [broadcastAudience, setBroadcastAudience] = React.useState<'all' | 'agents' | 'investors'>('all')

  // Don't display Dock on sign-in or sign-up pages
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return null
  }

  const handleHomeClick = () => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/')
    }
  }

  const handleExportQuickCSV = () => {
    const headers = ['Timestamp', 'Action', 'Operator', 'Status']
    const rows = [
      [new Date().toISOString(), 'Mobile CSV Export Triggered', 'Operations Admin', 'Success'],
      [new Date().toISOString(), 'Platform Data Snapshot', 'Automated Bot', 'Completed'],
    ]
    exportToCsv(`duseat_mobile_quick_export_${new Date().toISOString().slice(0, 10)}`, headers, rows)
    setQuickActionsOpen(false)
  }

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastTitle.trim()) return
    alert(`Broadcast sent to ${broadcastAudience} users: "${broadcastTitle}"`)
    setBroadcastTitle('')
    setBroadcastMessage('')
    setBroadcastModalOpen(false)
    setQuickActionsOpen(false)
  }

  const dockItems: DockItemData[] = [
    {
      icon: <Home className="size-5" />,
      label: 'Home',
      active: pathname === '/' && !allToolsOpen && !quickActionsOpen && !profileOpen,
      onClick: handleHomeClick,
    },
    {
      icon: <Layers className="size-5" />,
      label: 'Tools',
      active: allToolsOpen || (pathname !== '/' && !pathname.startsWith('/chats') && !pathname.startsWith('/admin') && !pathname.startsWith('/settings')),
      onClick: () => {
        setQuickActionsOpen(false)
        setProfileOpen(false)
        setAllToolsOpen(true)
      },
    },
    {
      icon: <Plus className="size-5 text-[#00c2cb]" />,
      label: 'Actions',
      active: quickActionsOpen,
      className: 'ring-2 ring-[#00c2cb]/30',
      onClick: () => {
        setAllToolsOpen(false)
        setProfileOpen(false)
        setQuickActionsOpen(true)
      },
    },
    {
      icon: <MessageSquare className="size-5" />,
      label: 'Chats',
      active: pathname.startsWith('/chats'),
      badge: '3',
      onClick: () => {
        setAllToolsOpen(false)
        setQuickActionsOpen(false)
        setProfileOpen(false)
        router.push('/chats')
      },
    },
    {
      icon: <User className="size-5" />,
      label: 'Profile',
      active: profileOpen || pathname.startsWith('/admin') || pathname.startsWith('/settings'),
      onClick: () => {
        setAllToolsOpen(false)
        setQuickActionsOpen(false)
        setProfileOpen(true)
      },
    },
  ]

  return (
    <>
      {/* 1. Mobile Bottom Dock (Visible only on < lg screens) */}
      <aside
        aria-label="Mobile Navigation Dock"
        className="fixed bottom-3 inset-x-0 z-40 flex justify-center pointer-events-none px-4 lg:hidden pb-[env(safe-area-inset-bottom)]"
      >
        <div className="pointer-events-auto">
          <Dock
            items={dockItems}
            panelHeight={64}
            baseItemSize={48}
            magnification={66}
            distance={130}
          />
        </div>
      </aside>

      {/* 2. Existing Platform All Tools Modal */}
      <AllToolsModal
        isOpen={allToolsOpen}
        onClose={() => setAllToolsOpen(false)}
        sidebarCollapsed={true}
      />

      {/* 3. Duseat Design System: Quick Actions Bottom Sheet */}
      {quickActionsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setQuickActionsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-[#E2E5E8] bg-white p-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto ant-modal-zoom">
            {/* Grab handle for mobile touch */}
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#E2E5E8] sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E8]">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#e5f6f7] text-[#00c2cb]">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#202428]">Quick Actions</h3>
                  <p className="text-[12px] text-[#68727D]">Fast operational tasks & management</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickActionsOpen(false)}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-lg border border-[#E2E5E8] text-[#68727D] hover:bg-[#F5F6F7] hover:text-[#202428] transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Action Items List */}
            <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  setBroadcastModalOpen(true)
                }}
                className="flex items-center justify-between rounded-xl border border-[#E2E5E8] p-3 hover:border-[#00c2cb] hover:bg-[#f0fafb] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#e5f6f7] text-[#00c2cb]">
                    <Send className="size-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#202428] group-hover:text-[#00c2cb] transition-colors">
                      Broadcast Notification
                    </div>
                    <div className="text-[12px] text-[#68727D]">Send push alert to platform users</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#8A939D] group-hover:text-[#00c2cb] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuickActionsOpen(false)
                  router.push('/verification')
                }}
                className="flex items-center justify-between rounded-xl border border-[#E2E5E8] p-3 hover:border-[#00c2cb] hover:bg-[#f0fafb] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#dfefe8] text-[#17b26a]">
                    <UserCheck className="size-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#202428] group-hover:text-[#00c2cb] transition-colors">
                      Verify Broker / Agent
                    </div>
                    <div className="text-[12px] text-[#68727D]">Review license & RERA compliance</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#8A939D] group-hover:text-[#00c2cb] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuickActionsOpen(false)
                  router.push('/deals')
                }}
                className="flex items-center justify-between rounded-xl border border-[#E2E5E8] p-3 hover:border-[#00c2cb] hover:bg-[#f0fafb] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#fff8eb] text-[#f79009]">
                    <Briefcase className="size-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#202428] group-hover:text-[#00c2cb] transition-colors">
                      Open Deals Pipeline
                    </div>
                    <div className="text-[12px] text-[#68727D]">Monitor Escrow & transaction progress</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#8A939D] group-hover:text-[#00c2cb] transition-colors" />
              </button>

              <button
                type="button"
                onClick={handleExportQuickCSV}
                className="flex items-center justify-between rounded-xl border border-[#E2E5E8] p-3 hover:border-[#00c2cb] hover:bg-[#f0fafb] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#eff1f3] text-[#202428]">
                    <FileSpreadsheet className="size-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#202428] group-hover:text-[#00c2cb] transition-colors">
                      Export CSV Snapshot
                    </div>
                    <div className="text-[12px] text-[#68727D]">Instant download of platform metrics</div>
                  </div>
                </div>
                <Download className="size-4 text-[#8A939D] group-hover:text-[#00c2cb] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuickActionsOpen(false)
                  setScheduleExportOpen(true)
                }}
                className="flex items-center justify-between rounded-xl border border-[#E2E5E8] p-3 hover:border-[#00c2cb] hover:bg-[#f0fafb] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#f4ebff] text-[#7f56d9]">
                    <Calendar className="size-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#202428] group-hover:text-[#00c2cb] transition-colors">
                      Schedule Periodic Export
                    </div>
                    <div className="text-[12px] text-[#68727D]">Automated weekly / monthly data delivery</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#8A939D] group-hover:text-[#00c2cb] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Duseat Design System: Profile & Settings Bottom Sheet */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setProfileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-[#E2E5E8] bg-white p-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto ant-modal-zoom">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#E2E5E8] sm:hidden" />

            {/* Profile Info Card */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E5E8]">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#00c2cb] text-base font-bold text-white shadow-xs">
                  AK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-bold text-[#202428]">Anwar (Admin)</h3>
                    <span className="rounded-md bg-[#e5f6f7] px-2 py-0.5 text-[11px] font-semibold text-[#00c2cb]">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-[12px] text-[#68727D]">anwar@duseat.com</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-lg border border-[#E2E5E8] text-[#68727D] hover:bg-[#F5F6F7] hover:text-[#202428] transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Navigation Options */}
            <div className="mt-4 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  router.push('/admin')
                }}
                className="flex w-full items-center justify-between rounded-xl p-3 hover:bg-[#F8F9FA] transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#eff1f3] text-[#202428]">
                    <User className="size-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#202428]">Admin Profile</div>
                    <div className="text-[12px] text-[#68727D]">View account & security details</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#8A939D] group-hover:text-[#202428]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  router.push('/settings')
                }}
                className="flex w-full items-center justify-between rounded-xl p-3 hover:bg-[#F8F9FA] transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#eff1f3] text-[#202428]">
                    <Settings className="size-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#202428]">Platform Settings</div>
                    <div className="text-[12px] text-[#68727D]">Escrow fee, policies & configurations</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#8A939D] group-hover:text-[#202428]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  router.push('/bi')
                }}
                className="flex w-full items-center justify-between rounded-xl p-3 hover:bg-[#F8F9FA] transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#eff1f3] text-[#202428]">
                    <TrendingUp className="size-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#202428]">Business Intelligence</div>
                    <div className="text-[12px] text-[#68727D]">Market analytics & revenue charts</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#8A939D] group-hover:text-[#202428]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  router.push('/activity')
                }}
                className="flex w-full items-center justify-between rounded-xl p-3 hover:bg-[#F8F9FA] transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#eff1f3] text-[#202428]">
                    <Activity className="size-4" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#202428]">Audit & Activity Logs</div>
                    <div className="text-[12px] text-[#68727D]">System events & moderation logbook</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-[#8A939D] group-hover:text-[#202428]" />
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false)
                    router.push('/sign-in')
                  }}
                  className="flex w-full items-center justify-between rounded-xl p-3 hover:bg-[#fee4e2]/60 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[#fee4e2] text-[#d92d20]">
                      <LogOut className="size-4" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#d92d20]">Sign Out</div>
                      <div className="text-[12px] text-[#f04438]">End current admin session</div>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-[#f04438]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Broadcast Notification Sub-Modal */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs font-sans p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E2E5E8] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E8]">
              <div className="flex items-center gap-2">
                <Send className="size-4 text-[#00c2cb]" />
                <h4 className="text-[16px] font-bold text-[#202428]">Broadcast Alert</h4>
              </div>
              <button
                type="button"
                onClick={() => setBroadcastModalOpen(false)}
                aria-label="Close"
                className="text-[#68727D] hover:text-[#202428] cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="mt-4 space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-[#434B53] mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled System Maintenance"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full rounded-lg border border-[#d3d5d7] px-3 py-2 text-[14px] outline-none focus:border-[#00c2cb]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#434B53] mb-1">Target Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'agents', 'investors'] as const).map((aud) => (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => setBroadcastAudience(aud)}
                      className={cn(
                        'py-1.5 rounded-lg border text-[12px] font-medium capitalize cursor-pointer transition-colors',
                        broadcastAudience === aud
                          ? 'border-[#00c2cb] bg-[#e5f6f7] text-[#00c2cb] font-semibold'
                          : 'border-[#E2E5E8] text-[#68727D] hover:bg-[#F8F9FA]'
                      )}
                    >
                      {aud}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#434B53] mb-1">Message Body</label>
                <textarea
                  rows={3}
                  placeholder="Details of the announcement..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full rounded-lg border border-[#d3d5d7] px-3 py-2 text-[14px] outline-none focus:border-[#00c2cb] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="rounded-lg border border-[#E2E5E8] px-3 py-1.5 text-[13px] font-medium text-[#434B53] hover:bg-[#F8F9FA] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#202428] px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-[#00c2cb] transition-colors cursor-pointer"
                >
                  Send Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Existing Platform Schedule Export Modal */}
      <ScheduleExportModal
        isOpen={scheduleExportOpen}
        onClose={() => setScheduleExportOpen(false)}
        onSchedule={(data) => {
          alert(`Scheduled ${data.frequency} export (${data.format.toUpperCase()}) to ${data.recipients.join(', ')}`)
        }}
        defaultName="Platform Mobile Audit Export"
      />
    </>
  )
}

export default MobileDockNav
