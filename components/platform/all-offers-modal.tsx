'use client'

import * as React from 'react'
import {
  X,
  Search,
  Filter,
  ArrowUpDown,
  Building2,
  ShieldCheck,
  Star,
  FileText,
  MessageSquare,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'
import type { PropertyOffer, PropertyRequest } from '@/lib/platform-users'
import { cn } from '@/lib/utils'
import { StatusTag } from '@/components/ui/badge-tag'
import { Dropdown } from '@/components/dashboard/menu'
import { OfferDetailsModal, type OfferDetail } from './offer-details-modal'

interface AllOffersModalProps {
  isOpen: boolean
  onClose: () => void
  request: PropertyRequest
  onAcceptOffer: (offer: PropertyOffer) => void
  onOpenChatWithAgent?: (agentName: string, requestRef: string) => void
}

export function AllOffersModal({
  isOpen = true,
  onClose,
  request,
  onAcceptOffer,
  onOpenChatWithAgent,
}: AllOffersModalProps) {
  const [query, setQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('All')
  const [sortBy, setSortBy] = React.useState('Highest Rated')
  const [selectedOfferForModal, setSelectedOfferForModal] = React.useState<OfferDetail | null>(null)

  if (!isOpen) return null

  const filteredOffers = request.offers.filter((offer) => {
    const text = `${offer.agentName} ${offer.agency} ${offer.propertyTitle} ${offer.location}`.toLowerCase()
    const matchesQuery = !query || text.includes(query.toLowerCase())
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Accepted' && offer.status === 'Accepted') ||
      (statusFilter === 'Pending' && offer.status === 'Pending') ||
      (statusFilter === 'RERA Only' && offer.verifiedRera)
    return matchesQuery && matchesStatus
  })

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 p-3 sm:p-5 backdrop-blur-xs font-sans animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-[1280px] flex-col overflow-hidden rounded-[16px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#d3d5d7] bg-white px-6 py-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] leading-[28px] font-bold text-[#1f2327]">All Submitted Offers</h2>
              <span className="rounded-full bg-[#e5f6f7] text-[#00c2cb] px-2.5 py-0.5 text-[12px] leading-[16px] font-medium">
                {request.offers.length} Total Offers
              </span>
              <span className="font-mono text-[12px] leading-[16px] text-[#6f777f]">
                Request #{request.id}
              </span>
            </div>
            <p className="text-[12px] leading-[16px] text-[#6f777f]">
              Property acquisition proposals submitted by verified brokers for {request.investorName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-[8px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Toolbar: Search, Filters & Sorting */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#d3d5d7] bg-[#fcfcfc] px-6 py-3 gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search broker, agency, property title…"
                className="h-[36px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] leading-[20px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb]"
              />
            </div>

            <div className="flex items-center gap-1">
              {(['All', 'Pending', 'Accepted', 'RERA Only'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    'h-[36px] rounded-[8px] px-3 text-[14px] leading-[20px] font-semibold transition-colors cursor-pointer ant-wave-btn',
                    statusFilter === st
                      ? 'bg-[#1f2327] text-white shadow-2xs'
                      : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3]'
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] leading-[16px] text-[#6f777f] font-medium">Sort by:</span>
            <Dropdown
              align="end"
              options={[
                { label: 'Highest Rated Broker', value: 'Highest Rated' },
                { label: 'Lowest Price First', value: 'Lowest Price' },
                { label: 'Highest Price First', value: 'Highest Price' },
                { label: 'Highest ROI %', value: 'Highest ROI' },
              ]}
              value={sortBy}
              onSelect={setSortBy}
              trigger={
                <span className="inline-flex h-[36px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] leading-[20px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                  <ArrowUpDown className="size-3.5 text-[#6f777f]" />
                  <span>{sortBy}</span>
                  <ChevronDown className="size-3 text-[#9da4ae]" />
                </span>
              }
            />
          </div>
        </div>

        {/* Scrollable Offers Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fa] space-y-4">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((offer, idx) => (
              <div
                key={offer.id}
                className="flex flex-col justify-between rounded-[12px] border border-[#d3d5d7] bg-white p-5 space-y-4 shadow-2xs hover:border-[#00c2cb] transition-all font-sans"
              >
                <div className="space-y-3">
                  {/* Top Row: Broker info, Price, Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="size-10 rounded-full bg-gradient-to-br from-[#00c2cb] to-[#0a8288] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {offer.agentName.split(' ').map((p) => p[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[14px] text-[#1f2327]">{offer.agentName}</span>
                          <span className="inline-flex items-center gap-0.5 bg-[#e5f6f7] text-[#00c2cb] px-1.5 py-0.2 rounded text-[11px] font-bold">
                            Pro
                          </span>
                        </div>
                        <p className="text-[12px] text-[#6f777f]">{offer.agency} • ★ {offer.rating}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block font-bold text-[15px] text-[#1f2327]">{offer.price}</span>
                      <span className="inline-flex items-center rounded-full bg-[#dfefe8] px-2 py-0.5 text-[11px] font-semibold text-[#17b26a]">
                        {offer.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[14px] text-[#1f2327]">{offer.propertyTitle}</p>
                      {offer.roi && (
                        <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {offer.roi}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#6f777f] line-clamp-2 mt-1 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  {/* Photo Preview Strip */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&auto=format&fit=crop&q=80',
                    ].map((img, i) => (
                      <div key={i} className="h-12 rounded-[6px] overflow-hidden bg-muted">
                        <img src={img} alt="Preview" className="size-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {/* Attachments Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="inline-flex items-center gap-1 rounded bg-[#f8f9fa] border border-[#d3d5d7] px-2 py-0.5 text-[11px] font-medium text-[#6f777f]">
                      <FileText className="size-3 text-[#00c2cb]" />
                      Floor.zip (32.5MB)
                    </span>
                    <span className="inline-flex items-center gap-1 rounded bg-[#f8f9fa] border border-[#d3d5d7] px-2 py-0.5 text-[11px] font-medium text-[#6f777f]">
                      <FileText className="size-3 text-[#00c2cb]" />
                      Brochure.pdf
                    </span>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="space-y-2 pt-2 border-t border-[#d3d5d7]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedOfferForModal({
                          id: offer.id,
                          agentName: offer.agentName,
                          agentId: `AG-${1040 + idx}`,
                          agentDeals: 64,
                          agentRating: offer.rating || 4.9,
                          agentSubscription: 'Pro agent',
                          agentVerified: true,
                          proposalText: offer.description,
                          photos: [
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
                            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
                          ],
                          price: offer.price,
                        })
                      }
                      className="flex-1 rounded-[8px] border border-[#d3d5d7] bg-white py-2 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
                    >
                      View Details
                    </button>

                    {onOpenChatWithAgent && (
                      <button
                        type="button"
                        onClick={() => onOpenChatWithAgent(offer.agentName, request.id)}
                        className="rounded-[8px] border border-[#d3d5d7] bg-white p-2 text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                        title="Chat with broker"
                      >
                        <MessageSquare className="size-4" />
                      </button>
                    )}
                  </div>

                  {!request.dealConfirmed && (
                    <button
                      type="button"
                      onClick={() => {
                        onAcceptOffer(offer)
                        onClose()
                      }}
                      className="w-full rounded-[8px] bg-[#00c2cb] py-2 text-[13px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-2xs ant-wave-btn"
                    >
                      Accept Deal & Award Broker
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <div className="p-12 text-center bg-white rounded-[12px] border border-[#d3d5d7]">
              <p className="text-[16px] font-bold text-[#1f2327]">No matching offers</p>
              <p className="text-[13px] text-[#6f777f] mt-1">Try clearing your search query or adjusting the filters.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#d3d5d7] bg-white px-6 py-3.5 font-sans">
          <span className="text-[13px] text-[#6f777f]">
            Showing {filteredOffers.length} of {request.offers.length} offers
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] bg-[#1f2327] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#2e3338] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>

      {/* Offer Details Modal */}
      {selectedOfferForModal && (
        <OfferDetailsModal
          isOpen={true}
          offer={selectedOfferForModal}
          onClose={() => setSelectedOfferForModal(null)}
          onAccept={() => {
            const offer = request.offers.find((o) => o.id === selectedOfferForModal.id)
            if (offer) onAcceptOffer(offer)
            setSelectedOfferForModal(null)
          }}
        />
      )}
    </div>
  )
}
