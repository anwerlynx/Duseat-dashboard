'use client'

import * as React from 'react'
import {
  Bell,
  UserCheck,
  Ban,
  UserPlus,
  Tag,
  Download,
  Send,
  X,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react'
import { MainButton } from '@/components/ui/main-button'
import { useToast } from './toast'
import { cn } from '@/lib/utils'

export function DashboardQuickActions() {
  const { toast } = useToast()
  const [activeModal, setActiveModal] = React.useState<string | null>(null)

  // Notification form state
  const [notifTitle, setNotifTitle] = React.useState('')
  const [notifMsg, setNotifMsg] = React.useState('')
  const [notifAudience, setNotifAudience] = React.useState('all')

  // Verify agent state
  const [agentId, setAgentId] = React.useState('')
  const [reraNum, setReraNum] = React.useState('')

  // Suspend user state
  const [suspendUserId, setSuspendUserId] = React.useState('')
  const [suspendReason, setSuspendReason] = React.useState('Terms Violation')

  // Add admin state
  const [adminName, setAdminName] = React.useState('')
  const [adminEmail, setAdminEmail] = React.useState('')
  const [adminRole, setAdminRole] = React.useState('Operations Manager')

  // Promo code state
  const [promoCode, setPromoCode] = React.useState('')
  const [discountVal, setDiscountVal] = React.useState('20%')

  const handleSendNotif = (e: React.FormEvent) => {
    e.preventDefault()
    if (!notifTitle.trim()) return
    toast({ variant: 'success', title: 'Notification Sent', description: `Broadcast sent to ${notifAudience} users.` })
    setNotifTitle('')
    setNotifMsg('')
    setActiveModal(null)
  }

  const handleVerifyAgent = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ variant: 'success', title: 'Agent Verified', description: `Agent #${agentId || 'AG-1048'} verified with RERA.` })
    setAgentId('')
    setActiveModal(null)
  }

  const handleSuspendUser = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ variant: 'error', title: 'User Suspended', description: `Account #${suspendUserId || 'USR-2041'} suspended: ${suspendReason}.` })
    setSuspendUserId('')
    setActiveModal(null)
  }

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ variant: 'success', title: 'Admin Added', description: `${adminName || 'Admin User'} assigned as ${adminRole}.` })
    setAdminName('')
    setAdminEmail('')
    setActiveModal(null)
  }

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ variant: 'success', title: 'Promo Code Created', description: `Promo code ${promoCode.toUpperCase() || 'DUSEAT20'} active.` })
    setPromoCode('')
    setActiveModal(null)
  }

  const handleExportReports = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Value,Date\nRevenue,AED 824K,Today\nDeals,365,Today\nUsers,12846,Today'
    const encoded = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encoded)
    link.setAttribute('download', `duseat_dashboard_report_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({ variant: 'success', title: 'Audit Report Exported', description: 'Platform metrics CSV downloaded.' })
  }

  const quickActions = [
    { id: 'notif', label: 'Create Notification', icon: Bell, action: () => setActiveModal('notif'), color: 'text-[#00c2cb] bg-[#e5f6f7]' },
    { id: 'verify', label: 'Verify Agent', icon: UserCheck, action: () => setActiveModal('verify'), color: 'text-[#17b26a] bg-[#dfefe8]' },
    { id: 'suspend', label: 'Suspend User', icon: Ban, action: () => setActiveModal('suspend'), color: 'text-[#d92d20] bg-[#f3e1e0]' },
    { id: 'admin', label: 'Add Admin', icon: UserPlus, action: () => setActiveModal('admin'), color: 'text-[#2f54eb] bg-[#eaf2ff]' },
    { id: 'promo', label: 'Create Promo Code', icon: Tag, action: () => setActiveModal('promo'), color: 'text-[#f79009] bg-[#fffaf0]' },
    { id: 'export', label: 'Export Reports', icon: Download, action: handleExportReports, color: 'text-[#1f2327] bg-[#eff1f3]' },
  ]

  return (
    <>
      <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-2xs font-sans">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#00c2cb]" />
            <h3 className="text-[15px] font-bold text-[#1f2327]">Quick Actions</h3>
          </div>
          <span className="text-[12px] text-[#6f777f]">1-Click operations</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {quickActions.map((qa) => {
            const Icon = qa.icon
            return (
              <button
                key={qa.id}
                type="button"
                onClick={qa.action}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] hover:bg-white hover:border-[#00c2cb] hover:shadow-2xs transition-all cursor-pointer group text-center"
              >
                <div className={cn('flex size-9 items-center justify-center rounded-[8px] transition-transform group-hover:scale-110 shadow-2xs', qa.color)}>
                  <Icon className="size-4" />
                </div>
                <span className="text-[12.5px] font-bold text-[#1f2327] group-hover:text-[#00c2cb] leading-tight">
                  {qa.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 1. Modal: Create Notification */}
      {activeModal === 'notif' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
              <h3 className="text-[18px] font-bold text-[#1f2327]">Create Broadcast Notification</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-[#6f777f] hover:text-[#1f2327]">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleSendNotif} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">Target Audience</label>
                <select value={notifAudience} onChange={(e) => setNotifAudience(e.target.value)} className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm">
                  <option value="all">All Users (Investors + Agents)</option>
                  <option value="investors">Investors Only</option>
                  <option value="agents">Verified Agents Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">Title</label>
                <input required value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} placeholder="e.g. New Palm Jumeirah Off-Plan Briefs" className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm outline-none focus:border-[#00c2cb]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">Message Body</label>
                <textarea required rows={3} value={notifMsg} onChange={(e) => setNotifMsg(e.target.value)} placeholder="Write announcement details..." className="w-full rounded-[6px] border border-[#d3d5d7] p-3 text-sm outline-none focus:border-[#00c2cb]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="h-9 px-4 rounded-[6px] border border-[#d3d5d7] text-sm font-semibold hover:bg-[#eff1f3]">Cancel</button>
                <button type="submit" className="h-9 px-4 rounded-[6px] bg-[#00c2cb] text-white text-sm font-semibold hover:bg-[#00a8b0]">Send Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Verify Agent */}
      {activeModal === 'verify' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
              <h3 className="text-[18px] font-bold text-[#1f2327]">Quick Verify Agent</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-[#6f777f] hover:text-[#1f2327]"><X className="size-5" /></button>
            </div>
            <form onSubmit={handleVerifyAgent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">Agent ID or Name</label>
                <input required value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="e.g. AG-1048 or Layla Haddad" className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm outline-none focus:border-[#00c2cb]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">RERA Number</label>
                <input value={reraNum} onChange={(e) => setReraNum(e.target.value)} placeholder="BRN-61284" className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm outline-none focus:border-[#00c2cb]" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="h-9 px-4 rounded-[6px] border border-[#d3d5d7] text-sm font-semibold hover:bg-[#eff1f3]">Cancel</button>
                <button type="submit" className="h-9 px-4 rounded-[6px] bg-[#17b26a] text-white text-sm font-semibold hover:bg-[#139757]">Approve & Verify</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Suspend User */}
      {activeModal === 'suspend' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
              <h3 className="text-[18px] font-bold text-[#d92d20]">Suspend User Account</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-[#6f777f] hover:text-[#1f2327]"><X className="size-5" /></button>
            </div>
            <form onSubmit={handleSuspendUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">User ID / Email</label>
                <input required value={suspendUserId} onChange={(e) => setSuspendUserId(e.target.value)} placeholder="e.g. IN-2048 or user@example.com" className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm outline-none focus:border-[#d92d20]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">Suspension Reason</label>
                <select value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm">
                  <option value="Duplicate property spam">Duplicate property spam</option>
                  <option value="Unverified license documents">Unverified license documents</option>
                  <option value="Fraudulent activity attempt">Fraudulent activity attempt</option>
                  <option value="Terms of service violation">Terms of service violation</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="h-9 px-4 rounded-[6px] border border-[#d3d5d7] text-sm font-semibold hover:bg-[#eff1f3]">Cancel</button>
                <button type="submit" className="h-9 px-4 rounded-[6px] bg-[#d92d20] text-white text-sm font-semibold hover:bg-[#b42318]">Confirm Suspend</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Add Admin */}
      {activeModal === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
              <h3 className="text-[18px] font-bold text-[#1f2327]">Add Admin / Moderator</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-[#6f777f] hover:text-[#1f2327]"><X className="size-5" /></button>
            </div>
            <form onSubmit={handleAddAdmin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">Full Name</label>
                <input required value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="e.g. Tariq Al Mansoor" className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm outline-none focus:border-[#00c2cb]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">Email</label>
                <input required type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="tariq@duseat.ae" className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm outline-none focus:border-[#00c2cb]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">Role & Permissions</label>
                <select value={adminRole} onChange={(e) => setAdminRole(e.target.value)} className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm">
                  <option value="Operations Manager">Operations Manager (Full Access)</option>
                  <option value="Compliance Moderator">Compliance Moderator (KYC + Reports)</option>
                  <option value="Support Agent">Support Agent (Tickets + Chat)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="h-9 px-4 rounded-[6px] border border-[#d3d5d7] text-sm font-semibold hover:bg-[#eff1f3]">Cancel</button>
                <button type="submit" className="h-9 px-4 rounded-[6px] bg-[#00c2cb] text-white text-sm font-semibold hover:bg-[#00a8b0]">Save Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Create Promo Code */}
      {activeModal === 'promo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
              <h3 className="text-[18px] font-bold text-[#1f2327]">Create Subscription Promo Code</h3>
              <button type="button" onClick={() => setActiveModal(null)} className="text-[#6f777f] hover:text-[#1f2327]"><X className="size-5" /></button>
            </div>
            <form onSubmit={handleCreatePromo} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">Promo Code Name</label>
                <input required value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="e.g. DUBAI2026" className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm font-mono uppercase outline-none focus:border-[#00c2cb]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1f2327] mb-1">Discount Amount</label>
                <select value={discountVal} onChange={(e) => setDiscountVal(e.target.value)} className="w-full h-9 rounded-[6px] border border-[#d3d5d7] px-3 text-sm">
                  <option value="10%">10% Off Annual Plans</option>
                  <option value="20%">20% Off Pro & Elite</option>
                  <option value="50%">50% Off First Month</option>
                  <option value="100%">100% Free Trial Month</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="h-9 px-4 rounded-[6px] border border-[#d3d5d7] text-sm font-semibold hover:bg-[#eff1f3]">Cancel</button>
                <button type="submit" className="h-9 px-4 rounded-[6px] bg-[#f79009] text-white text-sm font-semibold hover:bg-[#dc7704]">Activate Code</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
