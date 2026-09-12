'use client'

import * as React from 'react'
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  QrCode,
  Building,
  User,
  Calendar,
  Lock,
  ExternalLink,
  Eye,
  FileCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusTag } from '@/components/ui/badge-tag'
import { Flag, getCountryCode } from '@/components/ui/flag'
import type { VerificationDocument } from '@/lib/platform-users'

interface DocumentViewerModalProps {
  documents: VerificationDocument[]
  initialDocId?: string
  userName: string
  userCountry?: string
  userRole?: 'Investor' | 'Agent'
  onClose: () => void
  onUpdateStatus?: (docId: string, status: VerificationDocument['status'], note?: string) => void
}

export function DocumentViewerModal({
  documents,
  initialDocId,
  userName,
  userCountry = 'United Arab Emirates',
  userRole = 'Investor',
  onClose,
  onUpdateStatus,
}: DocumentViewerModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(() => {
    if (!initialDocId) return 0
    const idx = documents.findIndex((d) => d.id === initialDocId)
    return idx >= 0 ? idx : 0
  })

  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [activeSide, setActiveSide] = React.useState<'front' | 'back'>('front')
  const [copiedField, setCopiedField] = React.useState<string | null>(null)
  const [rejectReason, setRejectReason] = React.useState('')
  const [showRejectForm, setShowRejectForm] = React.useState(false)
  const [customNote, setCustomNote] = React.useState('')
  const [isCopiedId, setIsCopiedId] = React.useState(false)

  const activeDoc = documents[currentIndex] || documents[0]

  // Reset zoom & rotation when doc changes
  React.useEffect(() => {
    setZoom(1)
    setRotation(0)
    setActiveSide('front')
    setShowRejectForm(false)
    setRejectReason('')
  }, [currentIndex])

  if (!activeDoc) return null

  const handleNext = () => {
    if (currentIndex < documents.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.6))
  const handleResetZoom = () => {
    setZoom(1)
    setRotation(0)
  }
  const handleRotate = () => setRotation((r) => (r + 90) % 360)

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleApprove = () => {
    if (onUpdateStatus) {
      onUpdateStatus(activeDoc.id, 'Verified', 'Verified & approved by Compliance Officer')
    }
  }

  const handleReject = () => {
    if (!rejectReason && !customNote) {
      setShowRejectForm(true)
      return
    }
    const fullNote = rejectReason + (customNote ? ` - Note: ${customNote}` : '')
    if (onUpdateStatus) {
      onUpdateStatus(activeDoc.id, 'Rejected', fullNote || 'Document rejected during compliance audit.')
    }
    setShowRejectForm(false)
  }

  const handleDownload = () => {
    // Generate a downloadable text/mock representation
    const blob = new Blob(
      [
        `=======================================================\n` +
          `DUSEAT COMPLIANCE & KYC VERIFICATION ARCHIVE\n` +
          `=======================================================\n\n` +
          `Document Name: ${activeDoc.name}\n` +
          `Document Type: ${activeDoc.type}\n` +
          `Holder Legal Name: ${userName}\n` +
          `Holder Role: ${userRole}\n` +
          `Country: ${userCountry}\n` +
          `Verification Status: ${activeDoc.status}\n` +
          `Uploaded Timestamp: ${activeDoc.uploadedAt}\n` +
          `Reviewed By: ${activeDoc.reviewedBy || 'Compliance Audit Team'}\n` +
          `Review Notes: ${activeDoc.reviewNotes || 'Verified against national database.'}\n` +
          `SHA-256 Checksum: 8f4a9b2c1d0e5f7a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0\n\n` +
          `[Certified Copy Generated for Duseat Platform Admin Console]`,
      ],
      { type: 'text/plain;charset=utf-8' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeDoc.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_verified.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const countryCode = getCountryCode(userCountry)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 md:p-6 backdrop-blur-md ant-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl font-sans ant-modal-zoom">
        {/* TOP MODAL HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-foreground">{activeDoc.name}</h2>
                <StatusTag value={activeDoc.status} />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span>Subject: <strong className="text-foreground">{userName}</strong> ({userRole})</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Flag code={countryCode} size="s" />
                  {userCountry}
                </span>
                <span>•</span>
                <span>Doc {currentIndex + 1} of {documents.length}</span>
              </p>
            </div>
          </div>

          {/* Controls & Close */}
          <div className="flex items-center gap-2">
            {/* Download button */}
            <button
              type="button"
              onClick={handleDownload}
              title="Download Document"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close viewer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: 2 COLUMNS (CANVAS + VERIFICATION SIDEBAR) */}
        <div className="flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden bg-muted/20">
          {/* LEFT: DOCUMENT VIEWER CANVAS */}
          <div className="flex flex-1 flex-col min-w-0 min-h-0 border-b lg:border-b-0 lg:border-r border-border bg-slate-950/5 dark:bg-black/40">
            {/* CANVAS TOOLBAR */}
            <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/80 px-4 py-2 backdrop-blur-sm">
              {/* Pagination between documents */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                  title="Previous Document"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="px-2 text-xs font-semibold text-foreground">
                  {currentIndex + 1} / {documents.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === documents.length - 1}
                  className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                  title="Next Document"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Side switcher for ID cards */}
              {(activeDoc.type.toLowerCase().includes('emirates id') ||
                activeDoc.name.toLowerCase().includes('emirates id') ||
                activeDoc.type.toLowerCase().includes('id')) && (
                <div className="flex rounded-lg border border-border bg-secondary/50 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveSide('front')}
                    className={cn(
                      'rounded-md px-2.5 py-1 font-medium transition-all',
                      activeSide === 'front'
                        ? 'bg-card text-foreground shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Front Side
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSide('back')}
                    className={cn(
                      'rounded-md px-2.5 py-1 font-medium transition-all',
                      activeSide === 'back'
                        ? 'bg-card text-foreground shadow-xs font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Back Side
                  </button>
                </div>
              )}

              {/* Zoom & Rotation Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                  title="Zoom Out"
                >
                  <ZoomOut className="size-3.5" />
                </button>
                <span className="w-12 text-center text-xs font-mono text-muted-foreground">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                  title="Zoom In"
                >
                  <ZoomIn className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                  title="Rotate 90°"
                >
                  <RotateCw className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                  title="Reset Zoom & Orientation"
                >
                  <RefreshCw className="size-3.5" />
                </button>
              </div>
            </div>

            {/* DOCUMENT RENDERING CANVAS */}
            <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center min-h-[360px]">
              <div
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out',
                }}
                className="w-full max-w-2xl"
              >
                {/* RENDER DOCUMENT BASED ON TYPE */}
                <DocumentContentRenderer
                  doc={activeDoc}
                  userName={userName}
                  userCountry={userCountry}
                  activeSide={activeSide}
                />
              </div>
            </div>

            {/* BOTTOM THUMBNAIL STRIP */}
            <div className="shrink-0 border-t border-border bg-card/60 px-4 py-2.5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                All Verification Files ({documents.length})
              </p>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {documents.map((doc, idx) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-xl border p-2 text-left transition-all shrink-0',
                      currentIndex === idx
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs'
                        : 'border-border bg-card hover:bg-secondary/60'
                    )}
                  >
                    <div className={cn(
                      'flex size-8 items-center justify-center rounded-lg',
                      doc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      doc.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    )}>
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-[120px]">
                      <p className="text-xs font-semibold text-foreground line-clamp-1">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground">{doc.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: COMPLIANCE & AUDIT SIDEBAR */}
          <div className="w-full lg:w-[380px] shrink-0 flex flex-col bg-card overflow-y-auto p-5 space-y-5">
            {/* Quick Status Header */}
            <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Verification Status
                </span>
                <StatusTag value={activeDoc.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Document ID:</span>
                  <p className="font-mono font-semibold text-foreground">{activeDoc.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Uploaded:</span>
                  <p className="font-semibold text-foreground">{activeDoc.uploadedAt}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">File Format:</span>
                  <p className="font-semibold text-foreground">PDF / Secured Image</p>
                </div>
                <div>
                  <span className="text-muted-foreground">File Size:</span>
                  <p className="font-semibold text-foreground">2.4 MB (Encrypted)</p>
                </div>
              </div>
            </div>

            {/* Extracted / Verified Fields */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                Extracted Identity Data (OCR)
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Legal Name</span>
                  <span className="font-semibold text-foreground">{userName}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Nationality</span>
                  <span className="font-semibold text-foreground">{userCountry}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Identifier / ID</span>
                  <span className="font-mono font-semibold text-foreground">784-1988-5928192-3</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">14 Dec 2028 (Valid)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Security Checksum</span>
                  <span className="font-mono text-[10px] text-muted-foreground">SHA-256: 8f4a...29c1</span>
                </div>
              </div>
            </div>

            {/* Review Log / History */}
            <div className="rounded-xl border border-border p-4 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-4 text-primary" />
                Compliance Audit Notes
              </h4>
              <div className="text-xs space-y-1.5 bg-secondary/40 p-3 rounded-lg border border-border/50">
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span>Auditor: <strong className="text-foreground">{activeDoc.reviewedBy || 'Compliance Officer (Layla S.)'}</strong></span>
                </div>
                <p className="text-foreground font-medium">
                  {activeDoc.reviewNotes || 'Document matches official database. Biometrics verified.'}
                </p>
              </div>
            </div>

            {/* DECISION ACTION CONTROLS */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Compliance Decision
              </p>

              {!showRejectForm ? (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold shadow-sm transition-all"
                  >
                    <CheckCircle2 className="size-4" />
                    Approve Document
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRejectForm(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 py-2.5 text-xs font-semibold transition-all"
                  >
                    <XCircle className="size-4" />
                    Reject Document / Request Re-upload
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 p-3.5 space-y-3 ant-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                      Reason for Rejection:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>

                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-2 text-xs text-foreground outline-none"
                  >
                    <option value="">Select reason...</option>
                    <option value="Blurry or low resolution image">Blurry or low resolution image</option>
                    <option value="Document expired">Document expired</option>
                    <option value="Name does not match investor record">Name does not match investor record</option>
                    <option value="Incomplete document / edges cropped">Incomplete document / edges cropped</option>
                    <option value="Missing official stamp or signature">Missing official stamp or signature</option>
                  </select>

                  <textarea
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Optional message to the user..."
                    rows={2}
                    className="w-full rounded-lg border border-border bg-card p-2 text-xs text-foreground outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleReject}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white py-2 text-xs font-bold transition-all"
                  >
                    Confirm Rejection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   HIGH FIDELITY DOCUMENT VISUAL RENDERERS
   ========================================================================= */

function DocumentContentRenderer({
  doc,
  userName,
  userCountry,
  activeSide,
}: {
  doc: VerificationDocument
  userName: string
  userCountry: string
  activeSide: 'front' | 'back'
}) {
  const typeLower = doc.type.toLowerCase()
  const nameLower = doc.name.toLowerCase()

  if (typeLower.includes('emirates id') || nameLower.includes('emirates id') || typeLower.includes('id')) {
    return <EmiratesIdCard userName={userName} side={activeSide} />
  }

  if (typeLower.includes('passport') || nameLower.includes('passport')) {
    return <BiometricPassportCard userName={userName} userCountry={userCountry} />
  }

  if (typeLower.includes('funds') || nameLower.includes('bank') || typeLower.includes('bank')) {
    return <ProofOfFundsLetter userName={userName} />
  }

  if (typeLower.includes('trade') || typeLower.includes('rera') || nameLower.includes('license') || nameLower.includes('rera')) {
    return <TradeLicenseCertificate userName={userName} />
  }

  // Default / Generic Document
  return <GenericDocumentView doc={doc} userName={userName} />
}

/* 1. EMIRATES ID CARD MOCK */
function EmiratesIdCard({ userName, side }: { userName: string; side: 'front' | 'back' }) {
  if (side === 'back') {
    return (
      <div className="relative aspect-[1.586/1] w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-gradient-to-br from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8] dark:from-[#1E293B] dark:via-[#0F172A] dark:to-[#020617] p-5 shadow-2xl overflow-hidden font-sans text-slate-800 dark:text-slate-100">
        {/* Background watermark pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative h-full flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-400/30 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Card Serial No. / الرقم التسلسلي للبطاقة
              </span>
              <span className="font-mono text-xs font-bold">SN-99418290-AE</span>
            </div>

            {/* Smart card metallic microstrip & signature */}
            <div className="flex items-center gap-4 pt-1">
              <div className="h-9 w-40 rounded bg-slate-300 dark:bg-slate-800 border border-slate-400/50 flex items-center px-3 italic text-xs font-serif text-slate-600 dark:text-slate-300">
                {userName}
              </div>
              <span className="text-[9px] uppercase tracking-wider text-slate-500">Authorized Signature / التوقيع</span>
            </div>
          </div>

          {/* Barcode & MRZ machine readable strip */}
          <div className="space-y-1.5 pt-4">
            {/* Barcode representation */}
            <div className="h-6 w-full bg-slate-800 dark:bg-slate-300 rounded-xs flex items-center justify-around px-2 opacity-80">
              <div className="h-full w-0.5 bg-slate-200 dark:bg-slate-900" />
              <div className="h-full w-1 bg-slate-200 dark:bg-slate-900" />
              <div className="h-full w-0.5 bg-slate-200 dark:bg-slate-900" />
              <div className="h-full w-2 bg-slate-200 dark:bg-slate-900" />
              <div className="h-full w-0.5 bg-slate-200 dark:bg-slate-900" />
              <div className="h-full w-1.5 bg-slate-200 dark:bg-slate-900" />
              <div className="h-full w-0.5 bg-slate-200 dark:bg-slate-900" />
            </div>

            {/* MRZ 3-line code */}
            <div className="bg-slate-900 dark:bg-black text-emerald-400 font-mono text-[10px] sm:text-xs p-2 rounded-lg tracking-widest leading-relaxed shadow-inner">
              <p>I&lt;ARE784198859281923&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
              <p>8805128M2812142ARE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;8</p>
              <p>{userName.toUpperCase().replace(/\s+/g, '&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-[1.586/1] w-full rounded-2xl border border-amber-200/40 dark:border-amber-900/40 bg-gradient-to-br from-[#FEFDFB] via-[#F8FAFC] to-[#EFF6FF] dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0B0F19] p-5 shadow-2xl overflow-hidden font-sans text-slate-800 dark:text-slate-100">
      {/* UAE Hologram eagle background */}
      <div className="absolute right-4 top-4 size-32 rounded-full opacity-15 pointer-events-none border-4 border-amber-500/50 flex items-center justify-center overflow-hidden">
        <Flag code="AE" size="xl" className="scale-150 shadow-none border-none" />
      </div>

      <div className="relative h-full flex flex-col justify-between">
        {/* Header with UAE Identity Branding */}
        <div className="flex items-start justify-between border-b border-slate-300/60 dark:border-slate-700 pb-2.5">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-amber-700 dark:text-amber-400 uppercase">
              United Arab Emirates
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-foreground">
              Federal Authority for Identity & Citizenship
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">الإمارات العربية المتحدة</p>
            <p className="text-xs font-bold text-foreground">بطاقة الهوية / IDENTITY CARD</p>
          </div>
        </div>

        {/* Identity Number Banner */}
        <div className="flex items-center justify-between bg-primary/10 dark:bg-primary/20 rounded-lg px-3 py-1.5 border border-primary/20">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">ID Number / رقم الهوية:</span>
          <span className="font-mono text-sm sm:text-base font-bold tracking-wider text-primary">
            784-1988-5928192-3
          </span>
        </div>

        {/* Center: Photo + Smart Chip + Data */}
        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Photo */}
          <div className="col-span-3">
            <div className="aspect-[3/4] w-full rounded-xl border-2 border-primary/30 bg-gradient-to-b from-primary/15 to-primary/5 flex flex-col items-center justify-center p-2 shadow-sm text-center relative overflow-hidden">
              <User className="size-10 text-primary/70 mb-1" />
              <span className="text-[9px] font-bold uppercase line-clamp-1">{userName.split(' ')[0]}</span>
              {/* Holographic Security Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Chip + Details */}
          <div className="col-span-9 space-y-1.5 text-xs">
            {/* Gold metallic chip */}
            <div className="flex items-center justify-between">
              <div className="h-6 w-8 rounded-sm bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-600 shadow-xs flex items-center justify-center">
                <div className="size-3 border border-amber-800/40 rounded-xs" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Card No: C7841029</span>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground block">Name / الاسم:</span>
              <p className="font-bold text-foreground text-xs sm:text-sm">{userName}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div>
                <span className="text-[10px] text-muted-foreground block">Nationality / الجنسية:</span>
                <p className="font-semibold text-foreground">United Arab Emirates</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Expiry Date / تاريخ الانتهاء:</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">14/12/2028</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-300/40 dark:border-slate-800 pt-1.5 text-[9px] text-muted-foreground">
          <span>ICA Verified Biometric Token</span>
          <span className="font-mono">ICP-UAE-784-VERIFIED</span>
        </div>
      </div>
    </div>
  )
}

/* 2. BIOMETRIC PASSPORT MOCK */
function BiometricPassportCard({ userName, userCountry }: { userName: string; userCountry: string }) {
  const isUae = userCountry.toLowerCase().includes('emirates') || userCountry.toLowerCase().includes('uae')
  const countryCode = isUae ? 'ARE' : 'EGY'

  return (
    <div className="relative aspect-[1.42/1] w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-[#FDFBF7] dark:bg-[#12161F] p-6 shadow-2xl overflow-hidden font-sans text-slate-800 dark:text-slate-100">
      {/* Guilloche security pattern backdrop */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-700 via-amber-600 to-rose-700" />

      <div className="relative h-full flex flex-col justify-between">
        {/* Passport Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 dark:border-slate-300 pb-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              {userCountry.toUpperCase()}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase font-serif tracking-wider">
              Passport / جواز سفر
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
              Type: P · Code: {countryCode}
            </span>
            <div className="size-5 rounded border border-slate-600 flex items-center justify-center text-[10px] font-bold">
              [O]
            </div>
          </div>
        </div>

        {/* Data Grid with Photo & Specs */}
        <div className="grid grid-cols-12 gap-4 items-start py-2">
          {/* Photo */}
          <div className="col-span-4">
            <div className="aspect-[3.5/4.5] w-full rounded-xl border border-slate-400 bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center p-2 shadow-inner text-center relative overflow-hidden">
              <User className="size-14 text-slate-500 mb-2" />
              <span className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">{userName}</span>
              <div className="absolute bottom-1 right-1">
                <ShieldCheck className="size-4 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Key Fields */}
          <div className="col-span-8 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Passport No / رقم الجواز</span>
              <p className="font-mono font-bold text-sm text-foreground">N82910484</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Nationality / الجنسية</span>
              <p className="font-semibold text-foreground">{userCountry}</p>
            </div>
            <div className="col-span-2">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Full Name / الاسم الكامل</span>
              <p className="font-bold text-foreground text-sm">{userName}</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Date of Birth / تاريخ الميلاد</span>
              <p className="font-medium text-foreground">12 MAY 1988</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Sex / الجنس</span>
              <p className="font-medium text-foreground">M</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Date of Issue / تاريخ الإصدار</span>
              <p className="font-medium text-foreground">20 AUG 2024</p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Date of Expiry / تاريخ الانتهاء</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">19 AUG 2034</p>
            </div>
          </div>
        </div>

        {/* Machine Readable Zone (MRZ) */}
        <div className="bg-slate-900 text-amber-300 font-mono text-[10px] sm:text-xs p-2 rounded-md tracking-wider leading-tight shadow-inner select-all">
          <p>P&lt;{countryCode}{userName.toUpperCase().replace(/\s+/g, '&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
          <p>N829104842{countryCode}8805128M3408194&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06</p>
        </div>
      </div>
    </div>
  )
}

/* 3. PROOF OF FUNDS / BANK LETTER MOCK */
function ProofOfFundsLetter({ userName }: { userName: string }) {
  return (
    <div className="relative aspect-[1/1.25] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 shadow-2xl font-serif text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      {/* Official Bank Letterhead */}
      <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building className="size-6 text-primary" />
            <span className="font-sans font-extrabold text-base sm:text-lg tracking-tight text-foreground">
              FIRST ABU DHABI BANK (FAB)
            </span>
          </div>
          <p className="font-sans text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
            Private Wealth & Escrow Management Division · Abu Dhabi, UAE
          </p>
        </div>
        <div className="text-right font-sans">
          <p className="text-[11px] font-mono text-muted-foreground">REF: FAB-DXB-99201</p>
          <p className="text-[11px] font-semibold text-foreground">Date: 28 May 2026</p>
        </div>
      </div>

      {/* Letter Body */}
      <div className="space-y-3.5 my-4 font-sans text-xs leading-relaxed">
        <div>
          <p className="font-bold text-foreground">TO: DUSEAT REAL ESTATE & ESCROW VERIFICATION TEAM</p>
          <p className="text-muted-foreground text-[11px]">Dubai International Financial Centre (DIFC), Dubai, UAE</p>
        </div>

        <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
          <p className="font-bold text-sm text-foreground">
            SUBJECT: OFFICIAL FINANCIAL SOLVENCY & PROOF OF FUNDS CONFIRMATION
          </p>
        </div>

        <p className="text-foreground">
          This is to officially certify that our high-net-worth client, <strong className="underline">{userName}</strong>,
          maintains active and verified investment accounts with our institution in good standing.
        </p>

        {/* Balance Table */}
        <div className="rounded-lg border border-border bg-secondary/30 p-3 font-mono space-y-1.5">
          <div className="flex justify-between border-b border-border pb-1 text-muted-foreground text-[11px]">
            <span>Account Designation</span>
            <span>Available Liquid Balance</span>
          </div>
          <div className="flex justify-between font-bold text-foreground">
            <span>Private Wealth High-Yield Escrow</span>
            <span className="text-emerald-600 dark:text-emerald-400">AED 8,500,000.00</span>
          </div>
          <div className="flex justify-between text-muted-foreground text-[11px]">
            <span>Unencumbered Solvency Rating</span>
            <span>AAA (Verified Liquid)</span>
          </div>
        </div>

        <p className="text-muted-foreground text-[11px]">
          These funds are fully unencumbered, readily transferrable, and eligible for real estate acquisitions in the UAE.
        </p>
      </div>

      {/* Signatures & Seal */}
      <div className="border-t border-border pt-4 flex items-end justify-between font-sans">
        <div className="space-y-1">
          <div className="h-6 w-32 border-b border-slate-400 italic font-serif text-xs text-slate-700 dark:text-slate-300">
            Tariq Al Hashemi
          </div>
          <p className="text-[10px] font-bold text-foreground">Senior Director, Wealth Management</p>
          <p className="text-[9px] text-muted-foreground">First Abu Dhabi Bank PJSC</p>
        </div>

        {/* Circular Official Bank Stamp */}
        <div className="flex items-center gap-3">
          <div className="size-16 rounded-full border-2 border-dashed border-emerald-600/70 dark:border-emerald-400/70 p-1 flex flex-col items-center justify-center text-center text-[8px] font-bold text-emerald-700 dark:text-emerald-300 rotate-[-12deg]">
            <CheckCircle2 className="size-4 mb-0.5 text-emerald-600" />
            <span>FAB CERTIFIED</span>
            <span>OFFICIAL SEAL</span>
          </div>
          <QrCode className="size-12 text-slate-700 dark:text-slate-300" />
        </div>
      </div>
    </div>
  )
}

/* 4. TRADE LICENSE / RERA CERTIFICATE MOCK */
function TradeLicenseCertificate({ userName }: { userName: string }) {
  return (
    <div className="relative aspect-[1/1.3] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-[#FAFAFA] dark:bg-[#0B0F19] p-6 shadow-2xl font-sans text-slate-800 dark:text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <div className="border-b-2 border-primary pb-3 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            GOVERNMENT OF DUBAI
          </p>
          <h3 className="font-extrabold text-base text-foreground">
            Department of Economy and Tourism (DET)
          </h3>
          <p className="text-xs text-muted-foreground">Commercial License / رخصة تجارية</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs font-bold text-foreground">TL-DXB-882194</p>
          <span className="inline-block mt-1 rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
            ACTIVE & VERIFIED
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 my-3 text-xs">
        <div className="rounded-lg border border-border p-2.5 bg-card">
          <span className="text-[10px] uppercase text-muted-foreground block">Commercial Name</span>
          <p className="font-bold text-foreground">Emirates Living Real Estate LLC</p>
        </div>
        <div className="rounded-lg border border-border p-2.5 bg-card">
          <span className="text-[10px] uppercase text-muted-foreground block">Legal Type</span>
          <p className="font-bold text-foreground">Limited Liability Company (LLC)</p>
        </div>
        <div className="rounded-lg border border-border p-2.5 bg-card">
          <span className="text-[10px] uppercase text-muted-foreground block">Managing Broker</span>
          <p className="font-bold text-foreground">{userName}</p>
        </div>
        <div className="rounded-lg border border-border p-2.5 bg-card">
          <span className="text-[10px] uppercase text-muted-foreground block">RERA License Number</span>
          <p className="font-mono font-bold text-foreground">RERA-61284</p>
        </div>
        <div className="rounded-lg border border-border p-2.5 bg-card">
          <span className="text-[10px] uppercase text-muted-foreground block">Issue Date</span>
          <p className="font-medium text-foreground">15 Feb 2024</p>
        </div>
        <div className="rounded-lg border border-border p-2.5 bg-card">
          <span className="text-[10px] uppercase text-muted-foreground block">Expiry Date</span>
          <p className="font-bold text-emerald-600 dark:text-emerald-400">14 Feb 2027</p>
        </div>
      </div>

      {/* Permitted Activities */}
      <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1 text-xs">
        <p className="font-bold text-foreground text-[11px] uppercase">Permitted Activities:</p>
        <ul className="list-disc list-inside text-muted-foreground text-[11px] space-y-0.5">
          <li>Real Estate Buying & Selling Brokerage (نشاط وساطة بيع وشراء العقارات)</li>
          <li>Real Estate Leasing Property Brokerage (نشاط تأجير العقارات)</li>
        </ul>
      </div>

      {/* Footer Seal */}
      <div className="border-t border-border pt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <QrCode className="size-10 text-foreground" />
          <span className="text-[10px] text-muted-foreground">Scan to verify against Dubai DED register</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-muted-foreground">Security Hash: DET-882194-OK</span>
        </div>
      </div>
    </div>
  )
}

/* 5. GENERIC DOCUMENT VIEW */
function GenericDocumentView({ doc, userName }: { doc: VerificationDocument; userName: string }) {
  return (
    <div className="relative aspect-[1/1.2] w-full rounded-2xl border border-border bg-card p-6 shadow-xl flex flex-col justify-between">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="size-6 text-primary" />
          <div>
            <h3 className="font-bold text-base text-foreground">{doc.name}</h3>
            <p className="text-xs text-muted-foreground">Verification File for {userName}</p>
          </div>
        </div>
        <StatusTag value={doc.status} />
      </div>

      <div className="space-y-4 my-auto p-4 rounded-xl border border-dashed border-border bg-secondary/20 text-center">
        <FileCheck className="size-12 text-primary/60 mx-auto" />
        <div>
          <p className="text-sm font-bold text-foreground">Secure PDF Preview</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            Official document encrypted and stored on Duseat compliance storage.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-mono text-muted-foreground">
          <span>Uploaded: {doc.uploadedAt}</span>
        </div>
      </div>

      <div className="border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Verified by Duseat Compliance Engine</span>
        <span>SHA-256 Validated</span>
      </div>
    </div>
  )
}
