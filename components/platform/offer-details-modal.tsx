'use client'

import * as React from 'react'
import {
  X,
  Edit2,
  Trash2,
  Check,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Download,
  MapPin,
  Play,
  Share2,
  Star,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface OfferDetail {
  id: string
  requestId?: string
  agentName: string
  agentId: string
  agentAvatar?: string
  agentDeals: number
  agentRating: number
  agentSubscription: string
  agentVerified: boolean
  proposalText: string
  photos: string[]
  videos?: string[]
  documents?: { name: string; size: string; url?: string }[]
  location?: {
    name: string
    area: string
    lat?: number
    lng?: number
  }
  price?: string
}

interface OfferDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  offer?: OfferDetail | null
  onEdit?: (offer: OfferDetail) => void
  onDelete?: (offer: OfferDetail) => void
  onAccept?: (offer: OfferDetail) => void
}

const defaultOffer: OfferDetail = {
  id: 'OFF-9281',
  requestId: 'REQ-4091',
  agentName: 'Liam Johnson',
  agentId: 'AG-1057',
  agentDeals: 64,
  agentRating: 4.9,
  agentSubscription: 'Pro agent',
  agentVerified: true,
  proposalText:
    'Rare chance to own a luxury golf-view villa with premium finishes, spacious interiors, and prime location in Al Barsha. Ideal for upscale family living or investment. Ready to move in with flexible payment terms.',
  photos: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
  ],
  videos: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80',
  ],
  documents: [
    { name: 'Floor.zip', size: '32.5 MB' },
    { name: 'Brochure.pdf', size: '14.2 MB' },
    { name: 'DLD_NOC.pdf', size: '4.8 MB' },
    { name: 'TitleDeed.pdf', size: '8.1 MB' },
  ],
  location: {
    name: 'Al Barsha First Villa',
    area: 'Mall of the Emirates / Al Barsha, Dubai',
  },
  price: 'AED 8,500,000',
}

export function OfferDetailsModal({
  isOpen = true,
  onClose,
  offer: initialOffer = defaultOffer,
  onEdit,
  onDelete,
  onAccept,
}: OfferDetailsModalProps) {
  const [offer, setOffer] = React.useState<OfferDetail>(initialOffer || defaultOffer)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editPrice, setEditPrice] = React.useState(offer.price || 'AED 8,500,000')
  const [editProposal, setEditProposal] = React.useState(offer.proposalText || '')
  const [editLocationName, setEditLocationName] = React.useState(offer.location?.name || 'Al Barsha First Villa')
  const [editLocationArea, setEditLocationArea] = React.useState(offer.location?.area || 'Mall of the Emirates / Al Barsha, Dubai')
  const [activePhotoIdx, setActivePhotoIdx] = React.useState(0)
  const [isPlayingVideo, setIsPlayingVideo] = React.useState(false)

  React.useEffect(() => {
    if (initialOffer) {
      setOffer(initialOffer)
      setEditPrice(initialOffer.price || 'AED 8,500,000')
      setEditProposal(initialOffer.proposalText || '')
      setEditLocationName(initialOffer.location?.name || 'Al Barsha First Villa')
      setEditLocationArea(initialOffer.location?.area || 'Mall of the Emirates / Al Barsha, Dubai')
    }
  }, [initialOffer])

  if (isOpen === false || !offer) return null

  const photosList = (offer.photos?.length ? offer.photos : defaultOffer.photos) || []
  const videosList = (offer.videos?.length ? offer.videos : defaultOffer.videos) || []
  const docsList = (offer.documents?.length ? offer.documents : defaultOffer.documents) || []

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    const updated: OfferDetail = {
      ...offer,
      price: editPrice,
      proposalText: editProposal,
      location: {
        ...offer.location,
        name: editLocationName,
        area: editLocationArea,
      },
    }
    setOffer(updated)
    setIsEditing(false)
    onEdit?.(updated)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-[780px] rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header & Quick Action Buttons */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <h2 className="text-[24px] font-bold text-[#1f2327]">
              {isEditing ? 'Edit Offer Details' : 'Offer details'}
            </h2>
            {!isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 py-1.5 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Edit Offer
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(offer)}
                  className="rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 py-1.5 text-[14px] font-medium text-[#d92d20] hover:bg-rose-50 transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Delete offer
                </button>
                <button
                  type="button"
                  onClick={() => onAccept?.(offer)}
                  className="rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 py-1.5 text-[14px] font-medium text-[#17b26a] hover:bg-emerald-50 transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Accept offer
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-[8px] bg-[#1f2327] px-3.5 py-1.5 text-[14px] font-medium text-white hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 py-1.5 text-[14px] font-medium text-[#6f777f] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-[8px] border border-[#d3d5d7] bg-white text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Editable fields section if editing */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-4 rounded-[12px] border border-[#00c2cb]/30 bg-[#f4fcfc] p-4 ant-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Offer Price / Amount</label>
                <input
                  type="text"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full h-[36px] rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] text-[#1f2327] font-bold outline-none focus:border-[#00c2cb]"
                  placeholder="e.g. AED 8,500,000"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Property Title / Name</label>
                <input
                  type="text"
                  value={editLocationName}
                  onChange={(e) => setEditLocationName(e.target.value)}
                  className="w-full h-[36px] rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  placeholder="e.g. Al Barsha First Villa"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Location / Area</label>
                <input
                  type="text"
                  value={editLocationArea}
                  onChange={(e) => setEditLocationArea(e.target.value)}
                  className="w-full h-[36px] rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                  placeholder="e.g. Mall of the Emirates / Al Barsha, Dubai"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[12px] font-bold text-[#1f2327] mb-1">Proposal & Terms Text</label>
                <textarea
                  rows={4}
                  value={editProposal}
                  onChange={(e) => setEditProposal(e.target.value)}
                  className="w-full rounded-[6px] border border-[#d3d5d7] bg-white p-3 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb] resize-none"
                  placeholder="Describe offer proposal and terms..."
                />
              </div>
            </div>
          </form>
        ) : null}

        {/* Agent Profile Header */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="size-[64px] rounded-full overflow-hidden bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow-sm shrink-0">
            {offer.agentName
              .split(' ')
              .map((p) => p[0])
              .join('')}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[20px] sm:text-[24px] font-bold leading-[28px] sm:leading-[32px] text-[#1f2327]">{offer.agentName}</h3>

              {/* Badges */}
              <span className="inline-flex items-center gap-1 bg-[#e5f6f7] text-[#00c2cb] px-2.5 py-0.5 rounded-[12px] text-[12px] leading-[16px] font-semibold">
                <span>{offer.agentSubscription || 'Pro agent'}</span>
                <svg className="size-3 text-[#00c2cb]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 16l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                </svg>
              </span>

              {offer.agentVerified && (
                <span className="inline-flex items-center gap-1 bg-[#dfefe8] text-[#17b26a] px-2.5 py-0.5 rounded-[12px] text-[12px] leading-[16px] font-semibold">
                  <span>Verified</span>
                  <CheckCircle2 className="size-3 text-[#17b26a]" />
                </span>
              )}

              <span className="inline-flex items-center gap-1 bg-[#f6efe0] text-[#666] px-2 py-0.5 rounded-[12px] text-[12px] leading-[16px] font-semibold">
                <Star className="size-3 fill-amber-500 text-amber-500" />
                <span>{offer.agentRating.toFixed(1)}</span>
              </span>
            </div>

            <p className="text-[14px] leading-[20px] text-[#6f777f]">
              <span>{offer.agentId}</span>
              <span className="mx-2 text-[#d3d5d7]">•</span>
              <span>{offer.agentDeals} Deals</span>
              {offer.price && (
                <>
                  <span className="mx-2 text-[#d3d5d7]">•</span>
                  <span className="font-bold text-[#1f2327]">{offer.price}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Proposal Box */}
        <div className="rounded-[12px] border border-[#d3d5d7] p-3.5 space-y-2 bg-white">
          <div className="flex items-center gap-2 text-[#1f2327]">
            <div className="rounded-[4px] border border-[#00c2cb] p-1 text-[#00c2cb]">
              <FileText className="size-4" />
            </div>
            <strong className="text-[16px] font-medium">Proposal</strong>
          </div>
          <p className="text-[16px] text-[#1f2327] leading-relaxed">{offer.proposalText}</p>
        </div>

        {/* 2-Column: Photos & Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Photos Box */}
          <div className="rounded-[12px] border border-[#d3d5d7] p-3.5 space-y-2.5 bg-white">
            <div className="flex items-center gap-2 text-[#1f2327]">
              <div className="rounded-[4px] border border-[#00c2cb] p-1 text-[#00c2cb]">
                <ImageIcon className="size-4" />
              </div>
              <strong className="text-[16px] font-medium">Photos ({photosList.length})</strong>
            </div>

            {/* Main Photo */}
            <div className="relative h-[130px] rounded-[10px] overflow-hidden bg-muted">
              <img
                src={photosList[activePhotoIdx]}
                alt="Property main view"
                className="size-full object-cover"
              />
              <span className="absolute bottom-2 right-2 rounded-[4px] bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                {activePhotoIdx + 1}/{photosList.length}
              </span>
            </div>

            {/* Photos Strip */}
            <div className="grid grid-cols-4 gap-2">
              {photosList.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActivePhotoIdx(i)}
                  className={cn(
                    'h-[54px] rounded-[8px] overflow-hidden border transition-all cursor-pointer',
                    activePhotoIdx === i
                      ? 'border-[#00c2cb] ring-2 ring-[#00c2cb]/30'
                      : 'border-transparent hover:opacity-80'
                  )}
                >
                  <img src={img} alt={`Thumb ${i + 1}`} className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Videos Box */}
          <div className="rounded-[12px] border border-[#d3d5d7] p-3.5 space-y-2.5 bg-white">
            <div className="flex items-center gap-2 text-[#1f2327]">
              <div className="rounded-[4px] border border-[#00c2cb] p-1 text-[#00c2cb]">
                <VideoIcon className="size-4" />
              </div>
              <strong className="text-[16px] font-medium">Videos</strong>
            </div>

            {/* Main Video Box */}
            <div className="relative h-[130px] rounded-[10px] overflow-hidden bg-black/80 flex items-center justify-center group cursor-pointer">
              <img
                src={videosList[0]}
                alt="Video preview"
                className="size-full object-cover opacity-70"
              />
              <div className="absolute size-10 rounded-full bg-[#00c2cb] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Play className="size-5 fill-white ml-0.5" />
              </div>
            </div>

            {/* Video Thumbnails Strip */}
            <div className="grid grid-cols-4 gap-2">
              {videosList.slice(0, 4).map((vid, i) => (
                <div
                  key={i}
                  className="relative h-[54px] rounded-[8px] overflow-hidden bg-black/60 flex items-center justify-center cursor-pointer group"
                >
                  <img src={vid} alt={`Clip ${i + 1}`} className="size-full object-cover opacity-60" />
                  <div className="absolute size-6 rounded-full bg-[#00c2cb]/90 flex items-center justify-center text-white">
                    <Play className="size-3 fill-white ml-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column: Docs & Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Docs Box */}
          <div className="rounded-[12px] border border-[#d3d5d7] p-3.5 space-y-2.5 bg-white">
            <div className="flex items-center gap-2 text-[#1f2327]">
              <div className="rounded-[4px] border border-[#00c2cb] p-1 text-[#00c2cb]">
                <FileText className="size-4" />
              </div>
              <strong className="text-[16px] font-medium">Docs</strong>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {docsList.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#f8f9fa] border border-[#d3d5d7]/50 hover:bg-[#eff1f3] transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-7 rounded bg-[#00c2cb] flex items-center justify-center text-white shrink-0">
                      <FileText className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#1f2327] truncate">{doc.name}</p>
                      <p className="text-[11px] text-[#6f777f]">{doc.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="p-1 text-[#6f777f] hover:text-[#00c2cb] transition-colors"
                    title={`Download ${doc.name}`}
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Map Box */}
          <div className="rounded-[12px] border border-[#d3d5d7] p-3.5 space-y-2.5 bg-white">
            <div className="flex items-center gap-2 text-[#1f2327]">
              <div className="rounded-[4px] border border-[#00c2cb] p-1 text-[#00c2cb]">
                <MapPin className="size-4" />
              </div>
              <strong className="text-[16px] font-medium">Map</strong>
            </div>

            {/* Visual Dubai Map Graphic with Location Pin */}
            <div className="relative h-[115px] rounded-[10px] overflow-hidden border border-[#d3d5d7] bg-[#eef2f6] flex items-center justify-center">
              {/* Map Canvas Background with roads & metro badges */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#dce7f3] via-[#eef4f8] to-[#e1edf7] opacity-80" />

              {/* Road lines simulation */}
              <div className="absolute h-1.5 w-full bg-amber-200/90 top-[40%] -rotate-6" />
              <div className="absolute h-1 w-full bg-white top-[45%] -rotate-6" />
              <div className="absolute w-1.5 h-full bg-amber-200/80 left-[30%] rotate-12" />

              {/* Labels */}
              <div className="absolute top-2 left-3 text-[11px] font-bold text-[#1f2327] tracking-tight">
                AL SUFOUH 1 <span className="font-normal text-xs text-[#6f777f]">الصفوح 1</span>
              </div>
              <div className="absolute bottom-2 right-3 text-[11px] font-bold text-[#1f2327] tracking-tight">
                AL BARSHA
              </div>
              <div className="absolute top-6 right-10 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded shadow-xs text-[10px] font-semibold text-[#00a4ac]">
                <span>Mall of the Emirates</span>
                <span className="text-[9px] text-[#6f777f]">مول الإمارات</span>
              </div>

              {/* Interactive Location Pin */}
              <div className="relative z-10 flex flex-col items-center animate-bounce">
                <div className="size-6 rounded-full bg-[#00c2cb] border-2 border-white shadow-md flex items-center justify-center text-white">
                  <MapPin className="size-3.5 fill-white" />
                </div>
                <div className="size-1.5 rounded-full bg-black/30 mt-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
