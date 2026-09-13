'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Eye,
  MessageSquare,
  History,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { StatusTag } from '@/components/ui/badge-tag'
import { Flag, getCountryCode } from '@/components/ui/flag'
import {
  investors,
  agents,
  type PlatformInvestor,
  type PlatformAgent,
} from '@/lib/platform-users'
import {
  getStoredVerificationCases,
  getStoredVerificationHistory,
  type VerificationCase,
  type VerificationHistoryEvent,
} from '@/lib/verification-data'
import { cn } from '@/lib/utils'

interface UserProfileUnifiedProps {
  id: string
}

export function UserProfileUnifiedInner({ id }: UserProfileUnifiedProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'verification' | 'documents' | 'requests' | 'history'
  >('overview')

  // Find user data
  const investor = investors.find(
    (i) => i.id.toLowerCase() === id.toLowerCase() || i.name.toLowerCase().includes(id.toLowerCase())
  )
  const agent = agents.find(
    (a) => a.id.toLowerCase() === id.toLowerCase() || a.name.toLowerCase().includes(id.toLowerCase())
  )

  const isAgent = Boolean(agent)
  const userRole = isAgent ? 'Agent' : 'Investor'
  const userName = agent?.name || investor?.name || 'Ahmed Khaled'
  const userEmail = agent?.email || investor?.email || 'ahmed.khaled@eliterealty.ae'
  const userPhone = agent?.phone || investor?.phone || '+971 50 123 4567'
  const userCountry = agent?.country || investor?.country || 'United Arab Emirates'
  const countryCode = getCountryCode(userCountry)
  const userStatus = agent?.status || investor?.status || 'Active'
  const userAvatar =
    (agent as any)?.avatar ||
    (investor as any)?.avatar ||
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'

  // Verification case mapping
  const verificationCases = getStoredVerificationCases()
  const matchedCase = verificationCases.find(
    (c) =>
      c.userId.toLowerCase() === id.toLowerCase() ||
      c.applicantName.toLowerCase() === userName.toLowerCase()
  ) || verificationCases[0]

  const verificationHistory = getStoredVerificationHistory().filter(
    (h) =>
      h.caseId === matchedCase?.id ||
      h.targetName.toLowerCase() === userName.toLowerCase()
  )

  const handleBackToVerification = () => {
    const params = searchParams.toString()
    if (params) {
      router.push(`/verification?${params}`)
    } else {
      router.push('/verification')
    }
  }

  return (
    <PlatformShell title={userName} eyebrow="User Profile">
      <div className="flex w-full min-w-0 flex-col gap-4 px-3 sm:px-6 lg:px-8 py-4 sm:py-5 font-sans">
        {/* Breadcrumbs & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[13px]">
          <div className="flex flex-wrap items-center gap-1.5 text-[#6f777f]">
            <button
              type="button"
              onClick={handleBackToVerification}
              className="flex items-center gap-1.5 font-semibold text-[#1f2327] hover:text-[#00c2cb] transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="size-4 shrink-0" />
              <span className="sm:hidden">Back</span>
              <span className="hidden sm:inline">Back to Verification</span>
            </button>
            <span>/</span>
            <Link href="/directory" className="hover:text-[#1f2327] transition-colors shrink-0">
              User Directory
            </Link>
            <span>/</span>
            <span className="font-bold text-[#1f2327] truncate max-w-[160px] sm:max-w-none">{userName}</span>
          </div>

          {matchedCase && (
            <Link
              href={`/verification/${matchedCase.id}`}
              className="flex items-center justify-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-3.5 py-2 sm:py-1.5 text-[13px] font-bold text-white shadow-2xs hover:bg-[#00a8b0] transition-colors cursor-pointer ant-wave-btn w-full sm:w-auto shrink-0"
            >
              <ShieldCheck className="size-4 shrink-0" />
              <span>Review Verification ({matchedCase.id})</span>
            </Link>
          )}
        </div>

        {/* Top Profile Header */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 sm:p-5 shadow-[0px_1px_3px_rgba(16,24,40,0.05)] flex flex-col gap-4 w-full min-w-0 max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="relative shrink-0">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="size-14 sm:size-16 rounded-[12px] object-cover border border-[#d3d5d7]"
                />
                <span className="absolute -bottom-1 -right-1 flex size-5 sm:size-6 items-center justify-center rounded-full bg-white border border-[#d3d5d7] shadow-2xs">
                  <Flag code={countryCode} className="size-3.5 sm:size-4 rounded-xs" />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 min-w-0">
                  <h1 className="text-[20px] sm:text-[26px] font-bold text-[#1f2327] truncate leading-tight">{userName}</h1>
                  <span
                    className={cn(
                      'rounded-[6px] px-2.5 py-0.5 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider shrink-0',
                      isAgent ? 'bg-[#eaf2ff] text-[#3366ff]' : 'bg-[#e5f6f7] text-[#00c2cb]'
                    )}
                  >
                    {userRole}
                  </span>
                  <FigmaStatusBadge status={matchedCase?.status || 'Approved'} />
                </div>
                <p className="text-[12.5px] sm:text-[13px] text-[#6f777f] flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 min-w-0">
                  <span>User ID: <strong className="font-mono text-[#1f2327]">{id}</strong></span>
                  <span className="text-[#d3d5d7] hidden sm:inline">•</span>
                  <span className="truncate max-w-[180px] sm:max-w-none">{userEmail}</span>
                  <span className="text-[#d3d5d7] hidden sm:inline">•</span>
                  <span>{userPhone}</span>
                  <span className="text-[#d3d5d7] hidden sm:inline">•</span>
                  <span>{userCountry}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center rounded-[6px] bg-[#dfefe8] px-3 py-1 text-[12px] font-bold text-[#17b26a] gap-1.5 whitespace-nowrap">
                <Award className="size-4 shrink-0" />
                {isAgent ? 'RERA Pro Agent' : 'KYC Tier 2 Verified'}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3 border-t border-[#d3d5d7]/70 text-[13px] w-full min-w-0">
            <div className="bg-[#fcfcfc] p-2.5 rounded-[8px] border border-[#d3d5d7]/60 min-w-0">
              <span className="text-[#6f777f] text-[11px] font-semibold uppercase block break-words">KYC Status</span>
              <span className="font-bold text-[#17b26a] break-words block">{matchedCase?.status || 'Approved'}</span>
            </div>
            <div className="bg-[#fcfcfc] p-2.5 rounded-[8px] border border-[#d3d5d7]/60 min-w-0">
              <span className="text-[#6f777f] text-[11px] font-semibold uppercase block break-words">Verified Docs</span>
              <span className="font-bold text-[#1f2327] break-words block">{matchedCase?.documents.length || 4} Uploaded</span>
            </div>
            <div className="bg-[#fcfcfc] p-2.5 rounded-[8px] border border-[#d3d5d7]/60 min-w-0">
              <span className="text-[#6f777f] text-[11px] font-semibold uppercase block break-words">Risk Score</span>
              <span className="font-bold text-[#17b26a] break-words block">{matchedCase?.riskScore || 96}% (Low)</span>
            </div>
            <div className="bg-[#fcfcfc] p-2.5 rounded-[8px] border border-[#d3d5d7]/60 min-w-0">
              <span className="text-[#6f777f] text-[11px] font-semibold uppercase block break-words">Reviewer</span>
              <span className="font-bold text-[#1f2327] break-words block">{matchedCase?.assignedReviewer?.name || 'Compliance Team'}</span>
            </div>
          </div>
        </header>

        {/* Master User Tabs */}
        <section className="rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)] w-full min-w-0 max-w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#d3d5d7] p-2.5 sm:p-4 overflow-x-auto no-scrollbar flex-nowrap w-full min-w-0">
            {[
              { id: 'overview', label: 'Personal & Contact Info', icon: User },
              { id: 'verification', label: 'Verification & KYC', icon: ShieldCheck },
              { id: 'documents', label: 'Submitted Documents', icon: FileText },
              { id: 'history', label: 'Verification History', icon: History },
            ].map((tab) => {
              const Icon = tab.icon
              const isCur = activeTab === tab.id
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex h-[36px] items-center gap-1.5 sm:gap-2 rounded-[8px] px-3 sm:px-3.5 text-[13px] sm:text-[14px] font-medium transition-colors cursor-pointer ant-wave-btn shrink-0 whitespace-nowrap',
                    isCur
                      ? 'bg-[#1f2327] text-white shadow-2xs'
                      : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal details */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-5 space-y-4">
                  <h3 className="text-[16px] font-bold text-[#1f2327] border-b border-[#d3d5d7] pb-2">
                    Personal Information
                  </h3>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between">
                      <span className="text-[#6f777f]">Full Legal Name:</span>
                      <span className="font-bold text-[#1f2327]">{userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6f777f]">Nationality:</span>
                      <span className="font-semibold text-[#1f2327]">{userCountry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6f777f]">Account Type:</span>
                      <span className="font-semibold text-[#00c2cb]">{userRole} Profile</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6f777f]">Status:</span>
                      <span className="font-bold text-[#17b26a]">{userStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Contact details */}
                <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-5 space-y-4">
                  <h3 className="text-[16px] font-bold text-[#1f2327] border-b border-[#d3d5d7] pb-2">
                    Contact & Authentication
                  </h3>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between">
                      <span className="text-[#6f777f]">Email Address:</span>
                      <span className="font-mono text-[#1f2327] font-semibold">{userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6f777f]">Phone Number:</span>
                      <span className="font-mono text-[#1f2327] font-semibold">{userPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6f777f]">2FA Verification:</span>
                      <span className="font-bold text-[#17b26a]">Enabled & SMS Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6f777f]">Security Check:</span>
                      <span className="font-bold text-[#17b26a]">Zero Fraud Signals</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFICATION & KYC */}
          {activeTab === 'verification' && (
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">KYC & Compliance Status</h3>
                  <p className="text-[13px] text-[#6f777f]">
                    Active compliance status tied to verification case {matchedCase?.id}
                  </p>
                </div>
                {matchedCase && (
                  <Link
                    href={`/verification/${matchedCase.id}`}
                    className="flex items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>Open Review Desk</span>
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matchedCase?.documents.map((doc) => (
                  <div key={doc.id} className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[14px] text-[#1f2327]">{doc.type}</span>
                      <StatusTag value={doc.status} size="xs" />
                    </div>
                    <div className="text-[12px] space-y-1 text-[#6f777f]">
                      <p>Number: <strong className="text-[#1f2327] font-mono">{doc.documentNumber || 'N/A'}</strong></p>
                      <p>Expiry: <strong className="text-[#1f2327]">{doc.expiryDate || 'N/A'}</strong></p>
                      <p>Uploaded: {doc.uploadedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUBMITTED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="p-5 sm:p-6 space-y-4">
              <div className="space-y-3">
                {matchedCase?.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[10px] border border-[#d3d5d7] bg-white p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#eff1f3] text-[#00c2cb]">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[14px] text-[#1f2327]">{doc.name}</span>
                          <StatusTag value={doc.status} size="xs" />
                        </div>
                        <p className="text-[12px] text-[#6f777f]">
                          {doc.type} • Uploaded on {doc.uploadedAt} • OCR Match: {doc.ocrConfidence || 98}%
                        </p>
                      </div>
                    </div>

                    {matchedCase && (
                      <Link
                        href={`/verification/${matchedCase.id}`}
                        className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
                      >
                        <Eye className="size-3.5 text-[#00c2cb]" />
                        <span>Inspect in Review Desk</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VERIFICATION HISTORY */}
          {activeTab === 'history' && (
            <div className="p-5 sm:p-6 space-y-4">
              <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d3d5d7]">
                {verificationHistory.map((evt) => (
                  <div key={evt.id} className="relative">
                    <span className="absolute -left-6 top-1.5 flex size-3 rounded-full bg-[#00c2cb] border-2 border-white ring-2 ring-[#00c2cb]/20" />
                    <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-1 shadow-xs">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-bold text-[#1f2327]">{evt.action}</span>
                        <span className="text-[12px] text-[#6f777f]">{evt.timestamp}</span>
                      </div>
                      <p className="text-[13px] text-[#6f777f]">{evt.details}</p>
                      <div className="text-[12px] text-[#6f777f] pt-1">
                        Reviewer: <strong className="text-[#1f2327]">{evt.reviewer}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </PlatformShell>
  )
}

export function UserProfileUnified({ id }: UserProfileUnifiedProps) {
  return (
    <ToastProvider>
      <UserProfileUnifiedInner id={id} />
    </ToastProvider>
  )
}
