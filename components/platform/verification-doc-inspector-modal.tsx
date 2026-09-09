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
  Sun,
  Moon,
  Sparkles,
  Award,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusTag } from '@/components/ui/badge-tag'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { Flag, getCountryCode } from '@/components/ui/flag'
import type { VerificationDocumentItem, VerificationUserRole } from '@/lib/verification-data'

interface VerificationDocInspectorModalProps {
  documents: VerificationDocumentItem[]
  initialDocId?: string
  applicantName: string
  applicantRole: VerificationUserRole
  applicantCountry?: string
  onClose: () => void
  onUpdateDocumentStatus?: (
    docId: string,
    status: VerificationDocumentItem['status'],
    notes?: string,
    rejectionReason?: string
  ) => void
}

export function VerificationDocInspectorModal({
  documents,
  initialDocId,
  applicantName,
  applicantRole,
  applicantCountry = 'United Arab Emirates',
  onClose,
  onUpdateDocumentStatus,
}: VerificationDocInspectorModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(() => {
    if (!initialDocId) return 0
    const idx = documents.findIndex((d) => d.id === initialDocId)
    return idx >= 0 ? idx : 0
  })

  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [invertColors, setInvertColors] = React.useState(false)
  const [activeSide, setActiveSide] = React.useState<'front' | 'back'>('front')
  const [copiedField, setCopiedField] = React.useState<string | null>(null)
  const [showRejectForm, setShowRejectForm] = React.useState(false)
  const [selectedRejectReason, setSelectedRejectReason] = React.useState('')
  const [customNote, setCustomNote] = React.useState('')

  const activeDoc = documents[currentIndex] || documents[0]

  React.useEffect(() => {
    setZoom(1)
    setRotation(0)
    setInvertColors(false)
    setActiveSide('front')
    setShowRejectForm(false)
    setSelectedRejectReason('')
    setCustomNote('')
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
    setInvertColors(false)
  }
  const handleRotate = () => setRotation((r) => (r + 90) % 360)

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleApprove = () => {
    if (onUpdateDocumentStatus) {
      onUpdateDocumentStatus(
        activeDoc.id,
        'Verified',
        'Document verified and certified by Compliance Officer',
        undefined
      )
    }
  }

  const handleRejectSubmit = () => {
    const reason = selectedRejectReason || 'Document rejected during compliance inspection.'
    const fullNote = customNote ? `${reason} (Note: ${customNote})` : reason
    if (onUpdateDocumentStatus) {
      onUpdateDocumentStatus(activeDoc.id, 'Rejected', fullNote, reason)
    }
    setShowRejectForm(false)
  }

  const handleRequestResubmission = () => {
    const reason = selectedRejectReason || 'Clarification or re-upload requested.'
    const fullNote = customNote ? `${reason} - ${customNote}` : reason
    if (onUpdateDocumentStatus) {
      onUpdateDocumentStatus(activeDoc.id, 'Resubmitted', fullNote, reason)
    }
    setShowRejectForm(false)
  }

  const handleDownload = () => {
    const blob = new Blob(
      [
        `=======================================================\n` +
          `DUSEAT COMPLIANCE & VERIFICATION AUDIT CERTIFICATE\n` +
          `=======================================================\n\n` +
          `Case Document: ${activeDoc.name}\n` +
          `Document Type: ${activeDoc.type}\n` +
          `Subject Legal Name: ${applicantName}\n` +
          `Role: ${applicantRole}\n` +
          `Country: ${applicantCountry}\n` +
          `Document Number: ${activeDoc.documentNumber || 'N/A'}\n` +
          `Issuing Authority: ${activeDoc.issuingAuthority || 'Official Authority'}\n` +
          `Expiry Date: ${activeDoc.expiryDate || 'N/A'}\n` +
          `OCR Confidence Score: ${activeDoc.ocrConfidence || 95}%\n` +
          `Verification Status: ${activeDoc.status}\n` +
          `Uploaded Timestamp: ${activeDoc.uploadedAt}\n` +
          `Reviewed Timestamp: ${activeDoc.reviewedAt || 'Today'}\n` +
          `Reviewer: ${activeDoc.reviewedBy || 'Compliance Officer'}\n` +
          `Audit Checksum: SHA-256: 9e4f2a1b8c7d6e5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1\n\n` +
          `[Official Audit Record for Duseat Platform Admin Console]`,
      ],
      { type: 'text/plain;charset=utf-8' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeDoc.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_compliance_audit.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const cannedRejectionReasons = [
    'Document image is blurry, illegible, or has strong flash glare',
    'Document is expired or expiry date is within 30 days',
    'Legal name on document does not match the registered user account profile',
    'Document has cut-off margins or missing corners',
    'Back side of National ID / Emirates ID is missing',
    'RERA Broker Registration Number (BRN) cannot be verified on DLD portal',
    'Commercial trade license activity does not cover Real Estate Brokerage',
    'Document has signs of digital tampering, alteration, or uncertified copy',
  ]

  const countryCode = getCountryCode(applicantCountry)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4 md:p-6 backdrop-blur-xs ant-fade-in font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-[12px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
        {/* TOP MODAL HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#d3d5d7] bg-[#fcfcfc] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#eff1f3] text-[#1f2327]">
              <FileCheck className="size-5 text-[#00c2cb]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-bold text-[#1f2327]">{activeDoc.name}</h2>
                <StatusTag value={activeDoc.status} size="xs" />
              </div>
              <p className="text-[12px] text-[#6f777f] flex items-center gap-2">
                <span>
                  Subject: <strong className="text-[#1f2327]">{applicantName}</strong> ({applicantRole})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Flag code={countryCode} className="size-3.5 rounded-xs" />
                  <span>{applicantCountry}</span>
                </span>
                <span>•</span>
                <span>Type: <strong className="text-[#1f2327]">{activeDoc.type}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Document navigation selector */}
            <div className="hidden sm:flex items-center gap-1 rounded-[8px] border border-[#d3d5d7] bg-white p-1 text-[12px]">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex size-7 items-center justify-center rounded hover:bg-[#eff1f3] disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="px-2 font-medium text-[#6f777f]">
                {currentIndex + 1} of {documents.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === documents.length - 1}
                className="flex size-7 items-center justify-center rounded hover:bg-[#eff1f3] disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="flex size-9 items-center justify-center rounded-[8px] border border-[#d3d5d7] text-[#6f777f] transition-colors hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
              title="Download Compliance Audit Certificate"
            >
              <Download className="size-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-[8px] border border-[#d3d5d7] text-[#6f777f] transition-colors hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
              title="Close Viewer"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: 2-COLUMN INSPECTOR */}
        <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
          {/* LEFT: INTERACTIVE HIGH-RES DOCUMENT CANVAS */}
          <div className="relative flex flex-1 flex-col overflow-hidden bg-[#1f2327] text-white">
            {/* CANVAS TOOLBAR */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-[8px] border border-white/10 bg-[#1f2327]/90 p-1.5 backdrop-blur-md shadow-lg">
              <button
                type="button"
                onClick={handleZoomIn}
                className="flex size-8 items-center justify-center rounded-[6px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="flex size-8 items-center justify-center rounded-[6px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="size-4" />
              </button>
              <span className="px-1.5 text-[12px] text-zinc-400 font-mono">
                {Math.round(zoom * 100)}%
              </span>
              <div className="h-4 w-px bg-white/20" />
              <button
                type="button"
                onClick={handleRotate}
                className="flex size-8 items-center justify-center rounded-[6px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                title="Rotate 90°"
              >
                <RotateCw className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setInvertColors(!invertColors)}
                className={cn(
                  'flex size-8 items-center justify-center rounded-[6px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer',
                  invertColors && 'bg-[#00c2cb] text-white'
                )}
                title="Invert Contrast Mode"
              >
                {invertColors ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="flex size-8 items-center justify-center rounded-[6px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white text-[12px] font-semibold cursor-pointer"
                title="Reset View"
              >
                1:1
              </button>
            </div>

            {/* FRONT / BACK SWITCHER (FOR ID CARDS) */}
            {(activeDoc.type === 'Emirates ID' || activeDoc.type === 'National ID') && (
              <div className="absolute top-3 right-3 z-10 flex items-center rounded-[8px] border border-white/10 bg-[#1f2327]/90 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setActiveSide('front')}
                  className={cn(
                    'px-2.5 py-1 text-[12px] font-semibold rounded-[6px] transition-colors cursor-pointer',
                    activeSide === 'front'
                      ? 'bg-[#00c2cb] text-white'
                      : 'text-zinc-400 hover:text-white'
                  )}
                >
                  Front Side
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSide('back')}
                  className={cn(
                    'px-2.5 py-1 text-[12px] font-semibold rounded-[6px] transition-colors cursor-pointer',
                    activeSide === 'back'
                      ? 'bg-[#00c2cb] text-white'
                      : 'text-zinc-400 hover:text-white'
                  )}
                >
                  Back Side
                </button>
              </div>
            )}

            {/* DOCUMENT VIEWER CANVAS */}
            <div className="flex flex-1 items-center justify-center overflow-auto p-6 select-none cursor-grab active:cursor-grabbing">
              <div
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  filter: invertColors ? 'invert(1) hue-rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative max-w-full max-h-full rounded-[12px] shadow-2xl overflow-hidden border border-white/10 bg-zinc-900"
              >
                {/* RENDER DIVERSE DOCUMENT STYLES */}
                {activeDoc.type === 'Passport' && (
                  <div className="w-[520px] h-[340px] bg-gradient-to-br from-[#1b263b] to-[#0d1b2a] p-6 text-amber-100 flex flex-col justify-between border-2 border-amber-400/30 rounded-[12px] relative overflow-hidden font-mono">
                    <div className="absolute -right-10 -bottom-10 size-48 rounded-full bg-amber-400/5 blur-xl pointer-events-none" />
                    <div className="flex items-start justify-between border-b border-amber-400/20 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full border border-amber-400/40 flex items-center justify-center text-amber-300">
                          <ShieldCheck className="size-6" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-amber-300/80">
                            {activeDoc.issuingCountry || applicantCountry}
                          </div>
                          <div className="text-[16px] font-bold tracking-wider text-white">PASSPORT</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-amber-300/70">TYPE / CODE</div>
                        <div className="text-[12px] font-bold text-white">P / {countryCode}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 my-2">
                      <div className="col-span-1 flex flex-col items-center justify-center bg-black/40 rounded-[8px] p-2 border border-amber-400/20">
                        <User className="size-16 text-amber-300/60" />
                        <span className="text-[10px] text-amber-300/80 mt-1">OFFICIAL PHOTO</span>
                      </div>
                      <div className="col-span-2 space-y-1.5 text-[12px]">
                        <div>
                          <span className="text-[9px] text-amber-300/70 uppercase">Surname / Given Names</span>
                          <p className="font-bold text-white tracking-wide">{applicantName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-amber-300/70 uppercase">Passport No.</span>
                            <p className="font-bold text-amber-200">{activeDoc.documentNumber || 'P92840192'}</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-amber-300/70 uppercase">Nationality</span>
                            <p className="font-bold text-white">{activeDoc.issuingCountry || applicantCountry}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-amber-300/70 uppercase">Date of Birth</span>
                            <p className="font-medium text-white">{activeDoc.ocrExtractedData?.dob || '14 May 1988'}</p>
                          </div>
                          <div>
                            <span className="text-[9px] text-amber-300/70 uppercase">Date of Expiry</span>
                            <p className="font-bold text-emerald-400">{activeDoc.expiryDate || '12 Jan 2030'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MRZ CHECKSUM AREA */}
                    <div className="bg-black/60 p-2 rounded border border-amber-400/20 text-[10px] leading-tight text-amber-300 font-mono tracking-widest overflow-hidden whitespace-nowrap">
                      P&lt;{countryCode}{applicantName.replace(/\s+/g, '&lt;&lt;').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                      {activeDoc.documentNumber || 'P92840192'}8{countryCode}8805142M3001127&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
                    </div>
                  </div>
                )}

                {(activeDoc.type === 'Emirates ID' || activeDoc.type === 'National ID') && (
                  <div className="w-[480px] h-[300px] bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-5 text-zinc-900 flex flex-col justify-between border-2 border-emerald-600/30 rounded-[12px] relative overflow-hidden font-sans shadow-lg">
                    {activeSide === 'front' ? (
                      <>
                        <div className="flex items-center justify-between border-b border-zinc-300 pb-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="size-6 text-emerald-600" />
                            <div>
                              <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-800">
                                {activeDoc.issuingAuthority || 'Federal Authority for Identity & Citizenship'}
                              </span>
                              <h3 className="text-[12px] font-extrabold text-zinc-900 tracking-wide">
                                RESIDENT IDENTITY CARD / بطاقة هوية مقيم
                              </h3>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-zinc-600">ID NUMBER</span>
                            <div className="text-[12px] font-mono font-bold text-emerald-700">
                              {activeDoc.documentNumber || '784-1988-1294819-1'}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 my-2 items-center">
                          <div className="col-span-1 flex flex-col items-center justify-center bg-zinc-200/80 rounded-[8px] p-2 border border-zinc-300">
                            <User className="size-16 text-zinc-600" />
                            <span className="text-[9px] font-bold text-zinc-700 mt-1">EMIRATES ID</span>
                          </div>
                          <div className="col-span-2 space-y-1.5 text-[12px]">
                            <div>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase">Name / الاسم</span>
                              <p className="font-bold text-zinc-900">{applicantName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase">Nationality / الجنسية</span>
                                <p className="font-semibold text-zinc-800">{activeDoc.issuingCountry || applicantCountry}</p>
                              </div>
                              <div>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase">Expiry / تاريخ الانتهاء</span>
                                <p className="font-bold text-emerald-700">{activeDoc.expiryDate || '18 Aug 2027'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-zinc-300 pt-2 text-[10px] text-zinc-500">
                          <span>Card No: 084920491840</span>
                          <span className="font-mono font-bold text-emerald-800">ICA CHIP VALIDATED</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between border-b border-zinc-300 pb-2">
                          <span className="text-[12px] font-bold text-zinc-700">CARD BACK DETAILS & SIGNATURE</span>
                          <QrCode className="size-7 text-zinc-800" />
                        </div>
                        <div className="bg-zinc-200 p-2 rounded text-[12px] space-y-1">
                          <p><strong>Issuing Center:</strong> Dubai Identity Center (Al Barsha)</p>
                          <p><strong>Occupation:</strong> Real Estate Specialist</p>
                          <p><strong>Sponsor / Company:</strong> Emirates Living Real Estate LLC</p>
                        </div>
                        <div className="bg-zinc-800 text-white p-2 rounded text-[10px] font-mono tracking-widest overflow-hidden">
                          IDARE784198812948191&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                          8805142M2708184ARE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;8
                        </div>
                      </>
                    )}
                  </div>
                )}

                {(activeDoc.type === 'Trade License' ||
                  activeDoc.type === 'RERA Certificate' ||
                  activeDoc.type === 'Company Documents') && (
                  <div className="w-[500px] h-[380px] bg-white p-6 text-zinc-900 flex flex-col justify-between border-4 border-double border-zinc-300 rounded-[12px] relative overflow-hidden font-sans shadow-xl">
                    <div className="border-b-2 border-zinc-800 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="size-8 text-[#00c2cb]" />
                        <div>
                          <h3 className="text-[12px] font-extrabold uppercase text-zinc-900 tracking-wider">
                            {activeDoc.issuingAuthority || 'GOVERNMENT OF DUBAI - ECONOMY & TOURISM'}
                          </h3>
                          <p className="text-[11px] font-bold text-[#00c2cb]">
                            {activeDoc.type === 'Trade License' ? 'COMMERCIAL LICENSE / رخصة تجارية' : 'RERA BROKER CERTIFICATE'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-zinc-500 font-bold block">LICENSE NO</span>
                        <span className="text-[12px] font-mono font-bold text-zinc-900">
                          {activeDoc.documentNumber || 'CN-2894102'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-[12px] my-2">
                      <div className="bg-zinc-50 p-2.5 rounded border border-zinc-200">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase block">Company / Trade Name</span>
                        <p className="font-bold text-[13px] text-zinc-900">
                          {activeDoc.ocrExtractedData?.tradeName || 'Emirates Living Real Estate LLC'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-zinc-50 p-2 rounded border border-zinc-200">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase block">Legal Status</span>
                          <span className="font-semibold text-zinc-800">
                            {activeDoc.ocrExtractedData?.legalType || 'Limited Liability Company (LLC)'}
                          </span>
                        </div>
                        <div className="bg-zinc-50 p-2 rounded border border-zinc-200">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase block">Expiry Date</span>
                          <span className="font-bold text-emerald-700">{activeDoc.expiryDate || '15 Dec 2026'}</span>
                        </div>
                      </div>

                      <div className="bg-zinc-50 p-2 rounded border border-zinc-200 text-[11px]">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase block">Licensed Activity</span>
                        <span className="text-zinc-700">Real Estate Buying & Selling Brokerage, Leasing Property Management</span>
                      </div>
                    </div>

                    <div className="border-t border-zinc-200 pt-2 flex items-center justify-between text-[10px] text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Award className="size-4 text-emerald-600" />
                        <span className="font-bold text-emerald-700">AUTHENTIC GOVERNMENT SEAL VERIFIED</span>
                      </div>
                      <span className="font-mono">QR: #DED-948102</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM CANVAS FOOTER */}
            <div className="flex items-center justify-between border-t border-white/10 bg-[#1f2327]/90 px-4 py-2 text-[12px] text-zinc-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Sparkles className="size-3.5" />
                  OCR Confidence: {activeDoc.ocrConfidence || 98}%
                </span>
                <span>•</span>
                <span>Uploaded: {activeDoc.uploadedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Hold mouse & drag or use tools to inspect details</span>
              </div>
            </div>
          </div>

          {/* RIGHT: METADATA, OCR EXTRACTIONS & DECISION CONTROLS */}
          <div className="flex w-full lg:w-[420px] shrink-0 flex-col overflow-y-auto border-l border-[#d3d5d7] bg-white p-4 sm:p-6 space-y-5">
            {/* DOCUMENT SUMMARY & OCR EXTRACTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-bold text-[#1f2327] flex items-center gap-2">
                  <FileText className="size-4 text-[#00c2cb]" />
                  <span>OCR Extracted Data</span>
                </h3>
                <span className="rounded-[4px] bg-[#dfefe8] px-2 py-0.5 text-[11px] font-bold text-[#17b26a]">
                  {activeDoc.ocrConfidence || 98}% Match Score
                </span>
              </div>

              <div className="space-y-2 rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 text-[13px]">
                <div className="flex items-center justify-between border-b border-[#d3d5d7]/60 pb-2">
                  <span className="text-[#6f777f] font-medium">Document ID:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-semibold text-[#1f2327]">
                      {activeDoc.documentNumber || 'CN-2894102'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeDoc.documentNumber || 'CN-2894102', 'docId')}
                      className="text-[#6f777f] hover:text-[#1f2327] cursor-pointer"
                    >
                      {copiedField === 'docId' ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-[#d3d5d7]/60 pb-2">
                  <span className="text-[#6f777f] font-medium">Full Name on Document:</span>
                  <span className="font-semibold text-[#1f2327]">{applicantName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#d3d5d7]/60 pb-2">
                  <span className="text-[#6f777f] font-medium">Issuing Authority:</span>
                  <span className="font-medium text-[#1f2327] text-right">
                    {activeDoc.issuingAuthority || 'Dubai Economy / DLD'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#d3d5d7]/60 pb-2">
                  <span className="text-[#6f777f] font-medium">Expiry Date:</span>
                  <span
                    className={cn(
                      'font-bold',
                      activeDoc.status === 'Expired' ? 'text-[#d92d20]' : 'text-[#17b26a]'
                    )}
                  >
                    {activeDoc.expiryDate || '15 Dec 2026'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#6f777f] font-medium">Issuing Country:</span>
                  <span className="font-medium text-[#1f2327] flex items-center gap-1">
                    <Flag code={countryCode} className="size-3 rounded-xs" />
                    <span>{activeDoc.issuingCountry || applicantCountry}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* COMPLIANCE CHECKLIST */}
            <div className="space-y-2">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#6f777f]">
                Compliance Verification Checklist
              </h4>
              <div className="space-y-1.5 rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 text-[13px]">
                <div className="flex items-center gap-2 text-[#1f2327]">
                  <CheckCircle2 className="size-4 text-[#17b26a] shrink-0" />
                  <span>Document borders and 4 corners are fully visible</span>
                </div>
                <div className="flex items-center gap-2 text-[#1f2327]">
                  <CheckCircle2 className="size-4 text-[#17b26a] shrink-0" />
                  <span>No visible digital alteration or photoshop tampering</span>
                </div>
                <div className="flex items-center gap-2 text-[#1f2327]">
                  <CheckCircle2 className="size-4 text-[#17b26a] shrink-0" />
                  <span>Validity date is active and greater than 30 days</span>
                </div>
                <div className="flex items-center gap-2 text-[#1f2327]">
                  <CheckCircle2 className="size-4 text-[#17b26a] shrink-0" />
                  <span>Verified against official government database registry</span>
                </div>
              </div>
            </div>

            {/* REJECTION / RESUBMISSION FORM ACCORDION */}
            {showRejectForm ? (
              <div className="rounded-[8px] border border-[#d92d20]/30 bg-[#f3e1e0]/40 p-4 space-y-3 ant-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-bold text-[#d92d20] flex items-center gap-1.5">
                    <AlertTriangle className="size-4" />
                    <span>Rejection / Resubmission Reason</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(false)}
                    className="text-[12px] text-[#6f777f] hover:text-[#1f2327] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#6f777f]">
                    Select standard reason:
                  </label>
                  <select
                    value={selectedRejectReason}
                    onChange={(e) => setSelectedRejectReason(e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-2 text-[13px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-none"
                  >
                    <option value="">-- Choose reason --</option>
                    {cannedRejectionReasons.map((reason, idx) => (
                      <option key={idx} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-[#6f777f]">
                    Custom reviewer notes (sent to user):
                  </label>
                  <textarea
                    rows={3}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Provide specific directions for what needs to be re-uploaded..."
                    className="w-full rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 text-[13px] text-[#1f2327] placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRejectSubmit}
                    className="flex-1 h-[34px] rounded-[8px] bg-[#d92d20] text-[13px] font-bold text-white hover:bg-[#b92518] shadow-2xs cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestResubmission}
                    className="flex-1 h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
                  >
                    Request Resubmit
                  </button>
                </div>
              </div>
            ) : (
              /* ACTION BUTTONS */
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleApprove}
                  className="w-full h-[40px] flex items-center justify-center gap-2 rounded-[8px] bg-[#17b26a] text-[14px] font-bold text-white shadow-2xs hover:bg-[#139757] transition-colors cursor-pointer ant-wave-btn"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Approve & Certify Document</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(true)}
                    className="h-[36px] flex items-center justify-center gap-1.5 rounded-[8px] border border-[#d92d20]/30 bg-[#f3e1e0] text-[13px] font-bold text-[#d92d20] hover:bg-[#f3e1e0]/80 transition-colors cursor-pointer"
                  >
                    <XCircle className="size-4" />
                    <span>Reject Document</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectForm(true)
                      setSelectedRejectReason('Clarification or clear re-upload requested.')
                    }}
                    className="h-[36px] flex items-center justify-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>Request Re-upload</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
