'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  Download,
  Eye,
  Plus,
  Pin,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
  UserCheck,
  Award,
  Maximize2,
  History,
  MessageSquare,
  Lock,
  Layers,
  Info,
} from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { ToastProvider, useToast } from '@/components/dashboard/toast'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { StatusTag } from '@/components/ui/badge-tag'
import { Flag, getCountryCode } from '@/components/ui/flag'
import {
  type VerificationCase,
  type VerificationDocumentItem,
  type VerificationHistoryEvent,
  type VerificationNote,
  type ReviewerUser,
  type ItemVerificationStatus,
  getStoredVerificationCases,
  saveStoredVerificationCases,
  getStoredVerificationHistory,
  saveStoredVerificationHistory,
  getStoredVerificationNotes,
  saveStoredVerificationNotes,
  findVerificationCase,
  initialVerificationCases,
} from '@/lib/verification-data'
import { VerificationDocInspectorModal } from './verification-doc-inspector-modal'
import { AssignReviewerModal } from './assign-reviewer-modal'
import { ApproveVerificationModal } from './approve-verification-modal'
import { RejectVerificationModal } from './reject-verification-modal'
import { RequestResubmissionModal } from './request-resubmission-modal'
import { AddVerificationNoteModal } from './add-verification-note-modal'
import { ConfirmDialog, type ConfirmRequest } from './confirm-dialog'
import { cn } from '@/lib/utils'

interface VerificationDetailPageProps {
  id: string
}

export function VerificationDetailInner({ id }: VerificationDetailPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Master States
  const [cases, setCases] = React.useState<VerificationCase[]>([])
  const [history, setHistory] = React.useState<VerificationHistoryEvent[]>([])
  const [notes, setNotes] = React.useState<VerificationNote[]>([])
  const [currentCase, setCurrentCase] = React.useState<VerificationCase | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Sub-tabs & view state
  const [activeTab, setActiveTab] = React.useState<'requirements' | 'history' | 'notes'>('requirements')
  const [copiedId, setCopiedId] = React.useState(false)
  const [adminRole, setAdminRole] = React.useState<'Super Admin' | 'Senior Admin' | 'Reviewer'>('Senior Admin')
  const [simulatedUpdateAlert, setSimulatedUpdateAlert] = React.useState(false)

  // Modals state
  const [inspectDocId, setInspectDocId] = React.useState<string | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)
  const [isApproveModalOpen, setIsApproveModalOpen] = React.useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false)
  const [isResubmitModalOpen, setIsResubmitModalOpen] = React.useState(false)
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = React.useState(false)
  const [editingNote, setEditingNote] = React.useState<VerificationNote | null>(null)
  const [confirmDialog, setConfirmDialog] = React.useState<ConfirmRequest | null>(null)

  // Load case data
  React.useEffect(() => {
    setIsLoading(true)
    const allCases = getStoredVerificationCases()
    const allHistory = getStoredVerificationHistory()
    const allNotes = getStoredVerificationNotes()

    setCases(allCases)
    setHistory(allHistory)
    setNotes(allNotes)

    const found =
      allCases.find(
        (c) =>
          c.id.toLowerCase() === id.toLowerCase() ||
          c.userId.toLowerCase() === id.toLowerCase() ||
          c.id.replace(/-/g, '').toLowerCase() === id.replace(/-/g, '').toLowerCase()
      ) || allCases[0]

    setCurrentCase(found || null)
    setIsLoading(false)
  }, [id])

  // Helper to persist updates
  const updateCaseAndHistory = (
    updatedCase: VerificationCase,
    historyEvent?: VerificationHistoryEvent
  ) => {
    const updatedCases = cases.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    setCases(updatedCases)
    setCurrentCase(updatedCase)
    saveStoredVerificationCases(updatedCases)

    if (historyEvent) {
      const updatedHistory = [historyEvent, ...history]
      setHistory(updatedHistory)
      saveStoredVerificationHistory(updatedHistory)
    }
  }

  // Copy Verification ID
  const handleCopyId = () => {
    if (!currentCase) return
    navigator.clipboard.writeText(currentCase.id)
    setCopiedId(true)
    toast({
      variant: 'success',
      title: 'Verification ID copied',
      description: `${currentCase.id} copied to clipboard.`,
    })
    setTimeout(() => setCopiedId(false), 2000)
  }

  // Back Navigation preserving query parameters
  const handleBackToQueue = () => {
    const params = searchParams.toString()
    if (params) {
      router.push(`/verification?${params}`)
    } else {
      router.push('/verification')
    }
  }

  // Handle Document Approval / Rejection from Detail
  const handleUpdateDocStatus = (
    docId: string,
    status: ItemVerificationStatus,
    reviewNotes?: string,
    rejectionReason?: string
  ) => {
    if (!currentCase) return
    const targetDoc = currentCase.documents.find((d) => d.id === docId)
    if (!targetDoc) return

    const newDocs = currentCase.documents.map((d) =>
      d.id === docId
        ? {
            ...d,
            status,
            reviewedBy: 'Senior Compliance Officer',
            reviewedAt: 'Today, Just now',
            reviewNotes,
            rejectionReason,
          }
        : d
    )

    const allVerified = newDocs.every((d) => d.status === 'Verified')
    const hasRejected = newDocs.some((d) => d.status === 'Rejected')
    const hasResubmit = newDocs.some((d) => d.status === 'Resubmission Required' || d.status === 'Resubmitted')

    let newCaseStatus = currentCase.status
    if (allVerified) newCaseStatus = 'Approved'
    else if (hasRejected) newCaseStatus = 'Rejected'
    else if (hasResubmit) newCaseStatus = 'Resubmitted'
    else newCaseStatus = 'Under Review'

    const updatedCase: VerificationCase = {
      ...currentCase,
      status: newCaseStatus,
      documents: newDocs,
      lastUpdatedAt: 'Just now',
    }

    const newHistoryEvt: VerificationHistoryEvent = {
      id: `VH-${Date.now()}`,
      caseId: currentCase.id,
      targetName: currentCase.applicantName,
      targetRole: currentCase.role,
      action: status === 'Verified' ? 'Document Approved' : status === 'Rejected' ? 'Document Rejected' : 'Resubmission Requested',
      documentType: targetDoc.type,
      reviewer: 'Senior Compliance Officer',
      timestamp: 'Just now',
      details: reviewNotes || `${targetDoc.type} status updated to ${status}.`,
      statusFrom: targetDoc.status,
      statusTo: status,
      reason: rejectionReason,
    }

    updateCaseAndHistory(updatedCase, newHistoryEvt)

    toast({
      variant: status === 'Verified' ? 'success' : 'info',
      title: `Document ${status}`,
      description: `${targetDoc.type} (${targetDoc.name}) status updated to ${status}.`,
      actionLabel: 'View Details',
      actionRoute: `/verification/${currentCase.id}`,
    })
  }

  // Handle Full Verification Approval
  const handleApproveCase = () => {
    if (!currentCase) return
    const updatedCase: VerificationCase = {
      ...currentCase,
      status: 'Approved',
      lastUpdatedAt: 'Just now',
      documents: currentCase.documents.map((d) => ({
        ...d,
        status: 'Verified',
        reviewedBy: 'Senior Compliance Officer',
        reviewedAt: 'Just now',
      })),
    }

    const newHistoryEvt: VerificationHistoryEvent = {
      id: `VH-${Date.now()}`,
      caseId: currentCase.id,
      targetName: currentCase.applicantName,
      targetRole: currentCase.role,
      action: 'Case Approved',
      reviewer: 'Senior Compliance Officer',
      timestamp: 'Just now',
      details: `Full verification completed. Platform ${currentCase.role === 'Agent' ? 'RERA Pro Badge' : 'KYC Tier 2 Verified Badge'} granted.`,
      statusFrom: currentCase.status,
      statusTo: 'Approved',
    }

    updateCaseAndHistory(updatedCase, newHistoryEvt)

    toast({
      variant: 'success',
      title: 'Verification approved successfully',
      description: `Case ${currentCase.id} approved for ${currentCase.applicantName}.`,
      actionLabel: 'View User',
      actionRoute: `/users/${currentCase.userId}`,
    })
  }

  // Handle Full Verification Rejection
  const handleRejectCase = (reason: string, notes: string) => {
    if (!currentCase) return
    const updatedCase: VerificationCase = {
      ...currentCase,
      status: 'Rejected',
      lastUpdatedAt: 'Just now',
      rejectionReason: reason,
      rejectionNotes: notes,
    }

    const newHistoryEvt: VerificationHistoryEvent = {
      id: `VH-${Date.now()}`,
      caseId: currentCase.id,
      targetName: currentCase.applicantName,
      targetRole: currentCase.role,
      action: 'Case Rejected',
      reviewer: 'Senior Compliance Officer',
      timestamp: 'Just now',
      details: `Verification rejected: ${reason}. Notes: ${notes}`,
      statusFrom: currentCase.status,
      statusTo: 'Rejected',
      reason,
      notes,
    }

    updateCaseAndHistory(updatedCase, newHistoryEvt)

    toast({
      variant: 'error',
      title: 'Verification rejected',
      description: `Case ${currentCase.id} marked as Rejected (${reason}).`,
      actionLabel: 'View Details',
      actionRoute: `/verification/${currentCase.id}`,
    })
  }

  // Handle Resubmission Request
  const handleRequestResubmission = (
    requirements: string[],
    reason: string,
    message: string
  ) => {
    if (!currentCase) return
    const updatedDocs = currentCase.documents.map((d) =>
      requirements.includes(d.type)
        ? {
            ...d,
            status: 'Resubmission Required' as ItemVerificationStatus,
            rejectionReason: reason,
            reviewNotes: message,
          }
        : d
    )

    const updatedCase: VerificationCase = {
      ...currentCase,
      status: 'Resubmitted',
      lastUpdatedAt: 'Just now',
      resubmissionItems: requirements,
      documents: updatedDocs,
    }

    const newHistoryEvt: VerificationHistoryEvent = {
      id: `VH-${Date.now()}`,
      caseId: currentCase.id,
      targetName: currentCase.applicantName,
      targetRole: currentCase.role,
      action: 'Resubmission Requested',
      reviewer: 'Senior Compliance Officer',
      timestamp: 'Just now',
      details: `Requested re-upload of [${requirements.join(', ')}]. Reason: ${reason}`,
      statusFrom: currentCase.status,
      statusTo: 'Resubmitted',
      reason,
      notes: message,
    }

    updateCaseAndHistory(updatedCase, newHistoryEvt)

    toast({
      variant: 'info',
      title: 'Resubmission request sent successfully',
      description: `Applicant notified to re-upload: ${requirements.join(', ')}.`,
      actionLabel: 'View Details',
      actionRoute: `/verification/${currentCase.id}`,
    })
  }

  // Handle Reviewer Assignment
  const handleAssignReviewer = (reviewer: ReviewerUser | null) => {
    if (!currentCase) return
    const updatedCase: VerificationCase = {
      ...currentCase,
      assignedReviewer: reviewer
        ? {
            name: reviewer.name,
            avatar: reviewer.avatar,
            role: reviewer.role,
            email: reviewer.email,
          }
        : undefined,
      lastUpdatedAt: 'Just now',
    }

    const newHistoryEvt: VerificationHistoryEvent = {
      id: `VH-${Date.now()}`,
      caseId: currentCase.id,
      targetName: currentCase.applicantName,
      targetRole: currentCase.role,
      action: reviewer ? 'Reviewer Assigned' : 'Reviewer Unassigned',
      reviewer: 'Admin Dispatcher',
      timestamp: 'Just now',
      details: reviewer
        ? `Case assigned to ${reviewer.name} (${reviewer.role}).`
        : `Case unassigned from previous reviewer.`,
    }

    updateCaseAndHistory(updatedCase, newHistoryEvt)

    toast({
      variant: 'success',
      title: reviewer ? `Verification assigned to ${reviewer.name}` : 'Reviewer unassigned',
      description: `Assignment updated for case ${currentCase.id}.`,
      actionLabel: 'View Queue',
      actionRoute: '/verification',
    })
  }

  // Handle Internal Notes CRUD
  const handleSaveNote = (noteData: Omit<VerificationNote, 'id' | 'createdAt'>) => {
    if (!currentCase) return
    if (editingNote) {
      // Edit
      const updatedNotes = notes.map((n) =>
        n.id === editingNote.id ? { ...n, ...noteData } : n
      )
      setNotes(updatedNotes)
      saveStoredVerificationNotes(updatedNotes)
      setEditingNote(null)
      toast({
        variant: 'success',
        title: 'Note updated successfully',
        description: 'Internal compliance note saved.',
      })
    } else {
      // Add
      const newNote: VerificationNote = {
        ...noteData,
        id: `VN-${Date.now()}`,
        createdAt: 'Today, Just now',
      }
      const updatedNotes = [newNote, ...notes]
      setNotes(updatedNotes)
      saveStoredVerificationNotes(updatedNotes)

      const updatedCase: VerificationCase = {
        ...currentCase,
        notesCount: currentCase.notesCount + 1,
      }
      updateCaseAndHistory(updatedCase)

      toast({
        variant: 'success',
        title: 'Note added successfully',
        description: 'Internal compliance note recorded.',
      })
    }
    setIsAddNoteModalOpen(false)
  }

  const handleDeleteNote = (noteId: string) => {
    setConfirmDialog({
      title: 'Delete Compliance Note?',
      description: 'Are you sure you want to permanently delete this internal note? This action cannot be undone.',
      confirmLabel: 'Delete Note',
      tone: 'danger',
      icon: 'delete',
      onConfirm: () => {
        const updatedNotes = notes.filter((n) => n.id !== noteId)
        setNotes(updatedNotes)
        saveStoredVerificationNotes(updatedNotes)
        if (currentCase) {
          const updatedCase: VerificationCase = {
            ...currentCase,
            notesCount: Math.max(0, currentCase.notesCount - 1),
          }
          updateCaseAndHistory(updatedCase)
        }
        toast({
          variant: 'info',
          title: 'Note deleted',
          description: 'The internal note was removed.',
        })
      },
    })
  }

  if (isLoading || !currentCase) {
    return (
      <PlatformShell title="Verification Review" eyebrow="Trust & Safety">
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="size-6 animate-spin text-[#00c2cb]" />
            <p className="text-[14px] text-[#6f777f]">Loading verification case details...</p>
          </div>
        </div>
      </PlatformShell>
    )
  }

  const countryCode = getCountryCode(currentCase.country)
  const verifiedDocsCount = currentCase.documents.filter((d) => d.status === 'Verified').length
  const totalDocsCount = currentCase.documents.length
  const isAllDocsVerified = verifiedDocsCount === totalDocsCount
  const pendingDocsCount = currentCase.documents.filter(
    (d) => d.status === 'Pending' || d.status === 'In review'
  ).length
  const rejectedDocsCount = currentCase.documents.filter((d) => d.status === 'Rejected').length
  const expiredDocsCount = currentCase.documents.filter((d) => d.status === 'Expired').length

  const caseNotes = notes.filter(
    (n) => n.caseId === currentCase.id || n.targetName === currentCase.applicantName
  )
  const caseHistory = history.filter(
    (h) => h.caseId === currentCase.id || h.targetName === currentCase.applicantName
  )

  // Permissions gate
  const canApprove = adminRole === 'Super Admin' || adminRole === 'Senior Admin'
  const canReject = adminRole === 'Super Admin' || adminRole === 'Senior Admin'
  const canReassign = adminRole === 'Super Admin' || adminRole === 'Senior Admin'

  return (
    <PlatformShell
      title={`Verification / ${currentCase.id}`}
      eyebrow="Trust & Safety Review Desk"
    >
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
          <div className="flex items-center gap-2 text-[#6f777f]">
            <button
              type="button"
              onClick={handleBackToQueue}
              className="flex items-center gap-1.5 font-semibold text-[#1f2327] hover:text-[#00c2cb] transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Verification Queue</span>
            </button>
            <span>/</span>
            <span>Verification</span>
            <span>/</span>
            <span className="font-mono font-bold text-[#1f2327]">{currentCase.id}</span>
          </div>

          {/* Admin Role Permission Switcher */}
          <div className="flex items-center gap-2 bg-white border border-[#d3d5d7] rounded-[8px] px-2.5 py-1 text-[12px]">
            <span className="text-[#6f777f] font-semibold">Active Role:</span>
            {(['Reviewer', 'Senior Admin', 'Super Admin'] as const).map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => setAdminRole(role)}
                className={cn(
                  'px-2 py-0.5 rounded-[6px] font-semibold transition-colors cursor-pointer',
                  adminRole === role
                    ? 'bg-[#1f2327] text-white'
                    : 'text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time simulation alert banner if another admin updated */}
        {simulatedUpdateAlert && (
          <div className="flex items-center justify-between rounded-[8px] border border-[#00c2cb] bg-[#e5f6f7] p-3 text-[13px] text-[#1f2327] animate-in fade-in">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-[#00c2cb]" />
              <span>This verification was updated by another reviewer (Sarah Jenkins).</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSimulatedUpdateAlert(false)
                toast({ variant: 'info', title: 'Data Refreshed', description: 'Loaded latest state.' })
              }}
              className="font-bold text-[#00c2cb] hover:underline cursor-pointer"
            >
              Refresh View
            </button>
          </div>
        )}

        {/* SECTION 13: REVIEW HEADER CARD */}
        <header className="rounded-[12px] border border-[#d3d5d7] bg-white p-5 shadow-[0px_1px_3px_rgba(16,24,40,0.05)] flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative">
                <Link href={`/users/${currentCase.userId}`} className="cursor-pointer group">
                  {currentCase.applicantAvatar ? (
                    <img
                      src={currentCase.applicantAvatar}
                      alt={currentCase.applicantName}
                      className="size-14 rounded-[10px] object-cover border border-[#d3d5d7] group-hover:ring-2 group-hover:ring-[#00c2cb] transition-all"
                    />
                  ) : (
                    <div className="flex size-14 items-center justify-center rounded-[10px] bg-[#e5f6f7] text-[#00c2cb] font-bold text-[18px] group-hover:ring-2 group-hover:ring-[#00c2cb] transition-all">
                      {currentCase.applicantName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </Link>
                <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-white border border-[#d3d5d7] shadow-2xs">
                  <Flag code={countryCode} className="size-3.5 rounded-xs" />
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/users/${currentCase.userId}`}
                    className="text-[20px] sm:text-[24px] font-bold text-[#1f2327] hover:text-[#00c2cb] hover:underline transition-colors"
                  >
                    {currentCase.applicantName}
                  </Link>
                  <span
                    className={cn(
                      'rounded-[6px] px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-wider',
                      currentCase.role === 'Agent' ? 'bg-[#eaf2ff] text-[#3366ff]' : 'bg-[#e5f6f7] text-[#00c2cb]'
                    )}
                  >
                    {currentCase.role} Verification
                  </span>
                  <FigmaStatusBadge status={currentCase.status} />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#6f777f] mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#1f2327]">{currentCase.id}</span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="text-[#9da4ae] hover:text-[#1f2327] cursor-pointer"
                      title="Copy Verification ID"
                    >
                      {copiedId ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                  <span>•</span>
                  <span>User ID: <strong className="font-mono text-[#1f2327]">{currentCase.userId}</strong></span>
                  <span>•</span>
                  <span>Submitted: {currentCase.submittedDateExact}</span>
                  <span>•</span>
                  <span>Last Updated: {currentCase.lastUpdatedAt}</span>
                </div>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(true)}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                <UserCheck className="size-4 text-[#6f777f]" />
                <span>
                  {currentCase.assignedReviewer ? `Assigned: ${currentCase.assignedReviewer.name.split(' ')[0]}` : 'Assign Reviewer'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsResubmitModalOpen(true)}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                <RefreshCw className="size-3.5 text-[#6f777f]" />
                <span>Request Resubmission</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRejectModalOpen(true)}
                disabled={!canReject}
                title={!canReject ? 'Requires Senior Admin or Super Admin permissions' : ''}
                className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d92d20]/30 bg-[#f3e1e0] px-3 text-[13px] font-bold text-[#d92d20] hover:bg-[#f3e1e0]/80 disabled:opacity-40 transition-colors cursor-pointer ant-wave-btn"
              >
                <XCircle className="size-4" />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={() => setIsApproveModalOpen(true)}
                disabled={!isAllDocsVerified || !canApprove}
                title={
                  !canApprove
                    ? 'Requires Senior Admin or Super Admin permissions'
                    : !isAllDocsVerified
                    ? `Cannot approve: ${pendingDocsCount} requirement(s) still pending`
                    : ''
                }
                className={cn(
                  'flex h-[36px] items-center gap-1.5 rounded-[8px] px-4 text-[13px] font-bold text-white shadow-2xs transition-colors ant-wave-btn',
                  isAllDocsVerified && canApprove
                    ? 'bg-[#17b26a] hover:bg-[#139757] cursor-pointer'
                    : 'bg-[#17b26a]/50 opacity-60 cursor-not-allowed'
                )}
              >
                <ShieldCheck className="size-4" />
                <span>Approve Verification</span>
              </button>
            </div>
          </div>

          {/* SECTION 14: USER SUMMARY BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-[#d3d5d7]/70 text-[13px]">
            <div>
              <span className="text-[11px] uppercase font-semibold text-[#6f777f] block">Email</span>
              <span className="font-medium text-[#1f2327] truncate block">{currentCase.applicantEmail}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase font-semibold text-[#6f777f] block">Phone</span>
              <span className="font-mono text-[#1f2327] block">{currentCase.applicantPhone}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase font-semibold text-[#6f777f] block">Country / City</span>
              <span className="font-medium text-[#1f2327] block">
                {currentCase.country} {currentCase.city ? `(${currentCase.city})` : ''}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase font-semibold text-[#6f777f] block">Account Status</span>
              <span className="font-bold text-[#17b26a]">{currentCase.accountStatus}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase font-semibold text-[#68727D] block">Trust & Risk Signal</span>
              <span
                className={cn(
                  'font-semibold text-[13px]',
                  currentCase.riskScore > 75 ? 'text-[#16A86B]' : currentCase.riskScore > 40 ? 'text-[#E99A18]' : 'text-[#E5484D]'
                )}
              >
                Trust Score: {currentCase.riskScore}/100 — {currentCase.riskScore > 75 ? 'High' : currentCase.riskScore > 40 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase font-semibold text-[#6f777f] block">Reviewer</span>
              <span className="font-semibold text-[#1f2327]">
                {currentCase.assignedReviewer?.name || 'Unassigned'}
              </span>
            </div>
          </div>
        </header>

        {/* SECTION 15: VERIFICATION PROGRESS TIMELINE STEPPER */}
        <section className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-[#1f2327]">Lifecycle Status:</span>
              {currentCase.status === 'Approved' ? (
                <div className="flex items-center gap-2 text-[13px] text-[#17b26a] font-semibold">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#dfefe8] text-[#17b26a]">✓</span>
                  <span>Submitted</span>
                  <span className="text-[#9da4ae]">→</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#dfefe8] text-[#17b26a]">✓</span>
                  <span>Under Review</span>
                  <span className="text-[#9da4ae]">→</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#17b26a] text-white">✓</span>
                  <span className="font-bold">Approved</span>
                </div>
              ) : currentCase.status === 'Rejected' ? (
                <div className="flex items-center gap-2 text-[13px] text-[#d92d20] font-semibold">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#dfefe8] text-[#17b26a]">✓</span>
                  <span>Submitted</span>
                  <span className="text-[#9da4ae]">→</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#dfefe8] text-[#17b26a]">✓</span>
                  <span>Under Review</span>
                  <span className="text-[#9da4ae]">→</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#d92d20] text-white">✕</span>
                  <span className="font-bold">Rejected</span>
                </div>
              ) : currentCase.status === 'Resubmitted' ? (
                <div className="flex items-center gap-2 text-[13px] text-[#00c2cb] font-semibold">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#dfefe8] text-[#17b26a]">✓</span>
                  <span>Submitted</span>
                  <span className="text-[#9da4ae]">→</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#f3e1e0] text-[#d92d20]">✕</span>
                  <span>Rejected</span>
                  <span className="text-[#9da4ae]">→</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#00c2cb] text-white">↻</span>
                  <span>Resubmitted</span>
                  <span className="text-[#9da4ae]">→</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#eff1f3] text-[#1f2327]">⏳</span>
                  <span className="font-bold">Under Review</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[13px] text-[#1f2327] font-semibold">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#dfefe8] text-[#17b26a]">✓</span>
                  <span>Submitted</span>
                  <span className="text-[#9da4ae]">→</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#00c2cb] text-white">⏳</span>
                  <span className="text-[#00c2cb] font-bold">Under Review</span>
                  <span className="text-[#9da4ae]">→</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#eff1f3] text-[#6f777f]">○</span>
                  <span className="text-[#6f777f]">Decision Pending</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-[#6f777f]">
                Requirements Progress: <strong className="text-[#1f2327]">{verifiedDocsCount} of {totalDocsCount}</strong>
              </span>
              <div className="h-2 w-28 rounded-full bg-[#eff1f3] overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    isAllDocsVerified ? 'bg-[#17b26a]' : 'bg-[#00c2cb]'
                  )}
                  style={{ width: `${(verifiedDocsCount / totalDocsCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 23: APPROVAL BANNER WARNING (IF REQUIREMENTS INCOMPLETE) */}
        {!isAllDocsVerified && (
          <div className="rounded-[8px] border border-[#f79009]/30 bg-[#fffaf0] p-3 text-[13px] text-[#b54708] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>
                <strong>Approval Disabled:</strong> Cannot approve verification because{' '}
                {pendingDocsCount > 0 ? `${pendingDocsCount} requirement is still pending review` : ''}
                {rejectedDocsCount > 0 ? `${rejectedDocsCount} requirement is rejected` : ''}
                {expiredDocsCount > 0 ? `${expiredDocsCount} requirement is expired` : ''}.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (currentCase.documents.length > 0) setInspectDocId(currentCase.documents[0].id)
              }}
              className="text-[13px] font-bold text-[#b54708] hover:underline cursor-pointer shrink-0"
            >
              Start Reviewing Documents →
            </button>
          </div>
        )}

        {/* MASTER TABS: REQUIREMENTS & DOCUMENTS / HISTORY / INTERNAL NOTES */}
        <section className="rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05)]">
          <div className="flex items-center justify-between border-b border-[#d3d5d7] p-3.5 sm:p-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('requirements')}
                className={cn(
                  'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] font-medium transition-colors cursor-pointer ant-wave-btn',
                  activeTab === 'requirements'
                    ? 'bg-[#1f2327] text-white shadow-2xs'
                    : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                )}
              >
                <FileText className="size-4" />
                <span>Verification Requirements</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[11px] font-semibold',
                    activeTab === 'requirements' ? 'bg-white/20 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                  )}
                >
                  {totalDocsCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={cn(
                  'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] font-medium transition-colors cursor-pointer ant-wave-btn',
                  activeTab === 'history'
                    ? 'bg-[#1f2327] text-white shadow-2xs'
                    : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                )}
              >
                <History className="size-4" />
                <span>Verification History</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[11px] font-semibold',
                    activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                  )}
                >
                  {caseHistory.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={cn(
                  'flex h-[36px] items-center gap-2 rounded-[8px] px-3.5 text-[14px] font-medium transition-colors cursor-pointer ant-wave-btn',
                  activeTab === 'notes'
                    ? 'bg-[#1f2327] text-white shadow-2xs'
                    : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                )}
              >
                <MessageSquare className="size-4" />
                <span>Internal Notes</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[11px] font-semibold',
                    activeTab === 'notes' ? 'bg-white/20 text-white' : 'bg-[#eff1f3] text-[#1f2327]'
                  )}
                >
                  {caseNotes.length}
                </span>
              </button>
            </div>
          </div>

          {/* TAB 1: REQUIREMENTS & DOCUMENTS (SECTIONS 16 & 17) */}
          {activeTab === 'requirements' && (
            <div className="p-4 sm:p-6 space-y-6">
              {currentCase.role === 'Investor' ? (
                /* INVESTOR VERIFICATION REQUIREMENTS (IDENTITY & CONTACT) */
                <div className="space-y-6">
                  {/* Identity Group */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2">
                      <h3 className="text-[16px] font-bold text-[#1f2327] flex items-center gap-2">
                        <User className="size-4 text-[#00c2cb]" />
                        <span>Identity Verification Requirements</span>
                      </h3>
                      <span className="text-[12px] text-[#6f777f]">Passport & National ID proofing</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentCase.documents
                        .filter((d) => d.type === 'Passport' || d.type === 'National ID' || d.type === 'Emirates ID')
                        .map((doc) => (
                          <div
                            key={doc.id}
                            className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 shadow-xs hover:border-[#00c2cb] transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#eff1f3] text-[#00c2cb]">
                                  <FileText className="size-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-[14px] text-[#1f2327]">{doc.name}</h4>
                                  <p className="text-[12px] text-[#6f777f]">Type: {doc.type}</p>
                                </div>
                              </div>
                              <StatusTag value={doc.status} size="xs" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[12px] bg-[#fcfcfc] p-2.5 rounded-[6px] border border-[#d3d5d7]/60">
                              <div>
                                <span className="text-[#6f777f] block">Document Number:</span>
                                <span className="font-mono font-bold text-[#1f2327]">{doc.documentNumber || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[#6f777f] block">Expiry Date:</span>
                                <span className="font-bold text-[#1f2327]">{doc.expiryDate || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[#6f777f] block">Uploaded At:</span>
                                <span className="text-[#1f2327]">{doc.uploadedAt}</span>
                              </div>
                              <div>
                                <span className="text-[#6f777f] block">OCR Match:</span>
                                <span className="text-[#17b26a] font-bold">{doc.ocrConfidence || 98}% Verified</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={() => setInspectDocId(doc.id)}
                                className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                              >
                                <Eye className="size-3.5 text-[#00c2cb]" />
                                <span>Inspect Document</span>
                              </button>

                              {doc.status !== 'Verified' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDocStatus(doc.id, 'Verified', 'Approved by Senior Compliance Officer')}
                                  className="flex h-[32px] items-center gap-1 rounded-[6px] bg-[#17b26a] px-3 text-[13px] font-bold text-white hover:bg-[#139757] transition-colors shadow-2xs cursor-pointer"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                  <span>Approve Document</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Contact Group */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2">
                      <h3 className="text-[16px] font-bold text-[#1f2327] flex items-center gap-2">
                        <Phone className="size-4 text-[#00c2cb]" />
                        <span>Contact Verification Requirements</span>
                      </h3>
                      <span className="text-[12px] text-[#6f777f]">Direct 2FA and OTP proofing</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[14px] text-[#1f2327] flex items-center gap-2">
                            <Phone className="size-4 text-[#00c2cb]" />
                            Phone Verification (SMS OTP)
                          </span>
                          <span className="rounded-[4px] bg-[#dfefe8] px-2 py-0.5 text-[11px] font-bold text-[#17b26a]">
                            Verified
                          </span>
                        </div>
                        <p className="text-[14px] font-mono font-bold text-[#1f2327]">
                          {currentCase.applicantPhone}
                        </p>
                        <p className="text-[12px] text-[#6f777f]">
                          Verified via SMS OTP on {currentCase.submittedDateExact}. Zero telecommunication fraud score.
                        </p>
                      </div>

                      {/* Email */}
                      <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[14px] text-[#1f2327] flex items-center gap-2">
                            <Mail className="size-4 text-[#00c2cb]" />
                            Email Verification (Magic Link)
                          </span>
                          <span className="rounded-[4px] bg-[#dfefe8] px-2 py-0.5 text-[11px] font-bold text-[#17b26a]">
                            Verified
                          </span>
                        </div>
                        <p className="text-[14px] font-mono font-bold text-[#1f2327]">
                          {currentCase.applicantEmail}
                        </p>
                        <p className="text-[12px] text-[#6f777f]">
                          Domain confirmed deliverable. Magic link token authenticated.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* AGENT VERIFICATION REQUIREMENTS (IDENTITY & BUSINESS GROUPS) */
                <div className="space-y-6">
                  {/* Identity Group */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2">
                      <h3 className="text-[16px] font-bold text-[#1f2327] flex items-center gap-2">
                        <User className="size-4 text-[#00c2cb]" />
                        <span>Identity Verification Group</span>
                      </h3>
                      <span className="text-[12px] text-[#6f777f]">Emirates ID & Passport</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentCase.documents
                        .filter((d) => d.type === 'Emirates ID' || d.type === 'Passport' || d.type === 'National ID')
                        .map((doc) => (
                          <div
                            key={doc.id}
                            className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 shadow-xs hover:border-[#00c2cb] transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#eff1f3] text-[#00c2cb]">
                                  <FileText className="size-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-[14px] text-[#1f2327]">{doc.name}</h4>
                                  <p className="text-[12px] text-[#6f777f]">Type: {doc.type}</p>
                                </div>
                              </div>
                              <StatusTag value={doc.status} size="xs" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[12px] bg-[#fcfcfc] p-2.5 rounded-[6px] border border-[#d3d5d7]/60">
                              <div>
                                <span className="text-[#6f777f] block">Document Number:</span>
                                <span className="font-mono font-bold text-[#1f2327]">{doc.documentNumber || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[#6f777f] block">Expiry Date:</span>
                                <span className="font-bold text-[#1f2327]">{doc.expiryDate || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-[#6f777f] block">Uploaded At:</span>
                                <span className="text-[#1f2327]">{doc.uploadedAt}</span>
                              </div>
                              <div>
                                <span className="text-[#6f777f] block">OCR Match:</span>
                                <span className="text-[#17b26a] font-bold">{doc.ocrConfidence || 98}% Verified</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={() => setInspectDocId(doc.id)}
                                className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                              >
                                <Eye className="size-3.5 text-[#00c2cb]" />
                                <span>Inspect Document</span>
                              </button>

                              {doc.status !== 'Verified' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDocStatus(doc.id, 'Verified', 'Approved by Senior Compliance Officer')}
                                  className="flex h-[32px] items-center gap-1 rounded-[6px] bg-[#17b26a] px-3 text-[13px] font-bold text-white hover:bg-[#139757] transition-colors shadow-2xs cursor-pointer"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                  <span>Approve Document</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Business & Licensing Group */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-2">
                      <h3 className="text-[16px] font-bold text-[#1f2327] flex items-center gap-2">
                        <Building className="size-4 text-[#00c2cb]" />
                        <span>Business & Licensing Verification Group</span>
                      </h3>
                      <span className="text-[12px] text-[#6f777f]">Trade License, RERA Broker Card & Company MOA</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentCase.documents
                        .filter((d) => d.type === 'Trade License' || d.type === 'RERA Certificate' || d.type === 'Company Documents')
                        .map((doc) => (
                          <div
                            key={doc.id}
                            className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 shadow-xs hover:border-[#00c2cb] transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="flex size-9 items-center justify-center rounded-[8px] bg-[#eaf2ff] text-[#3366ff]">
                                  <Building className="size-4" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-[13px] text-[#1f2327] truncate max-w-[150px]">
                                    {doc.name}
                                  </h4>
                                  <p className="text-[11px] text-[#6f777f]">{doc.type}</p>
                                </div>
                              </div>
                              <StatusTag value={doc.status} size="xs" />
                            </div>

                            <div className="space-y-1 text-[12px] bg-[#fcfcfc] p-2.5 rounded-[6px] border border-[#d3d5d7]/60">
                              <div className="flex justify-between">
                                <span className="text-[#6f777f]">Number:</span>
                                <span className="font-mono font-semibold text-[#1f2327]">{doc.documentNumber || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#6f777f]">Expires:</span>
                                <span
                                  className={cn(
                                    'font-bold',
                                    doc.status === 'Expired' ? 'text-[#d92d20]' : 'text-[#1f2327]'
                                  )}
                                >
                                  {doc.expiryDate || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#6f777f]">OCR:</span>
                                <span className="text-[#17b26a] font-bold">{doc.ocrConfidence || 96}%</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={() => setInspectDocId(doc.id)}
                                className="flex h-[30px] items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
                              >
                                <Eye className="size-3 text-[#00c2cb]" />
                                <span>Inspect</span>
                              </button>

                              {doc.status !== 'Verified' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDocStatus(doc.id, 'Verified', 'Approved by Senior Compliance Officer')}
                                  className="flex h-[30px] items-center gap-1 rounded-[6px] bg-[#17b26a] px-2.5 text-[12px] font-bold text-white hover:bg-[#139757] shadow-2xs cursor-pointer"
                                >
                                  <CheckCircle2 className="size-3" />
                                  <span>Approve</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VERIFICATION HISTORY (SECTION 27) */}
          {activeTab === 'history' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Case Audit History Timeline</h3>
                  <p className="text-[13px] text-[#6f777f]">
                    Chronological immutable log of all reviews, status transitions, and decision remarks
                  </p>
                </div>
              </div>

              {caseHistory.length === 0 ? (
                <div className="p-8 text-center text-[14px] text-[#6f777f]">
                  No verification history events recorded yet.
                </div>
              ) : (
                <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d3d5d7]">
                  {caseHistory.map((evt) => (
                    <div key={evt.id} className="relative group">
                      <span className="absolute -left-6 top-1.5 flex size-3 rounded-full bg-[#00c2cb] border-2 border-white ring-2 ring-[#00c2cb]/20" />
                      <div className="rounded-[10px] border border-[#d3d5d7] bg-white p-4 space-y-1.5 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[13px]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1f2327]">{evt.action}</span>
                            {evt.documentType && (
                              <span className="rounded-[4px] bg-[#e5f6f7] text-[#00c2cb] px-2 py-0.5 text-[11px] font-bold">
                                {evt.documentType}
                              </span>
                            )}
                          </div>
                          <span className="text-[12px] text-[#6f777f] flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {evt.timestamp}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#6f777f]">{evt.details}</p>
                        {evt.reason && (
                          <p className="text-[12px] text-[#d92d20] font-medium bg-[#f3e1e0]/40 p-2 rounded">
                            Reason: {evt.reason}
                          </p>
                        )}
                        <div className="flex items-center gap-3 pt-1 text-[12px] text-[#6f777f] border-t border-[#d3d5d7]/50 mt-1">
                          <span>Reviewer: <strong className="text-[#1f2327]">{evt.reviewer}</strong></span>
                          {evt.statusTo && (
                            <>
                              <span>•</span>
                              <span>Outcome: <strong className="text-[#17b26a]">{evt.statusTo}</strong></span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INTERNAL NOTES (SECTION 28) */}
          {activeTab === 'notes' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1f2327]">Internal Compliance Notes</h3>
                  <p className="text-[13px] text-[#6f777f]">
                    Private notes visible exclusively to admin and compliance officers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingNote(null)
                    setIsAddNoteModalOpen(true)
                  }}
                  className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#1f2327] px-3.5 text-[13px] font-semibold text-white shadow-2xs hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn"
                >
                  <Plus className="size-4" />
                  <span>Add Note</span>
                </button>
              </div>

              {caseNotes.length === 0 ? (
                <div className="p-8 text-center text-[14px] text-[#6f777f]">
                  No internal compliance notes recorded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {caseNotes.map((note) => (
                    <div
                      key={note.id}
                      className={cn(
                        'rounded-[10px] border p-4 space-y-2 shadow-xs transition-all',
                        note.isPinned ? 'border-[#f79009]/40 bg-[#fffaf0]' : 'border-[#d3d5d7] bg-white'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {note.isPinned && <Pin className="size-3.5 text-[#f79009]" />}
                          <span className="font-bold text-[14px] text-[#1f2327]">{note.author}</span>
                          <span className="text-[12px] text-[#6f777f]">({note.authorRole})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-[#6f777f]">{note.createdAt}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNote(note)
                              setIsAddNoteModalOpen(true)
                            }}
                            className="text-[#6f777f] hover:text-[#1f2327] cursor-pointer"
                            title="Edit Note"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-[#d92d20] hover:text-[#b92518] cursor-pointer"
                            title="Delete Note"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <span className="inline-block rounded-[4px] bg-[#eff1f3] px-2 py-0.5 text-[11px] font-bold text-[#6f777f]">
                        {note.tag}
                      </span>

                      <p className="text-[13px] text-[#1f2327] leading-relaxed bg-[#fcfcfc] p-3 rounded-[6px] border border-[#d3d5d7]/60">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* DOCUMENT INSPECTOR MODAL */}
      {inspectDocId && (
        <VerificationDocInspectorModal
          documents={currentCase.documents}
          initialDocId={inspectDocId}
          applicantName={currentCase.applicantName}
          applicantRole={currentCase.role}
          applicantCountry={currentCase.country}
          onClose={() => setInspectDocId(null)}
          onUpdateDocumentStatus={(docId, status, notes, reason) => {
            handleUpdateDocStatus(docId, status, notes, reason)
            setInspectDocId(null)
          }}
        />
      )}

      {/* ASSIGN REVIEWER MODAL */}
      {isAssignModalOpen && (
        <AssignReviewerModal
          caseItem={currentCase}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={handleAssignReviewer}
        />
      )}

      {/* APPROVE VERIFICATION MODAL */}
      {isApproveModalOpen && (
        <ApproveVerificationModal
          caseItem={currentCase}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={handleApproveCase}
        />
      )}

      {/* REJECT VERIFICATION MODAL */}
      {isRejectModalOpen && (
        <RejectVerificationModal
          caseItem={currentCase}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={handleRejectCase}
        />
      )}

      {/* REQUEST RESUBMISSION MODAL */}
      {isResubmitModalOpen && (
        <RequestResubmissionModal
          caseItem={currentCase}
          onClose={() => setIsResubmitModalOpen(false)}
          onConfirm={handleRequestResubmission}
        />
      )}

      {/* ADD / EDIT COMPLIANCE NOTE MODAL */}
      {isAddNoteModalOpen && (
        <AddVerificationNoteModal
          caseItem={currentCase}
          initialNote={editingNote}
          onClose={() => {
            setIsAddNoteModalOpen(false)
            setEditingNote(null)
          }}
          onSaveNote={handleSaveNote}
        />
      )}

      {/* CONFIRM DIALOG */}
      <ConfirmDialog request={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </PlatformShell>
  )
}

export function VerificationDetailPage({ id }: VerificationDetailPageProps) {
  return (
    <ToastProvider>
      <VerificationDetailInner id={id} />
    </ToastProvider>
  )
}
