'use client'

import * as React from 'react'
import {
  X,
  User,
  ShieldCheck,
  Award,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  TrendingUp,
  FileText,
  Save,
} from 'lucide-react'
import { type PlatformInvestor } from '@/lib/platform-users'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { ProfilePhotoEditor } from './profile-photo-editor'
import { cn } from '@/lib/utils'

interface EditInvestorProfileModalProps {
  investor: PlatformInvestor
  isOpen: boolean
  onClose: () => void
  onSave: (updatedInvestor: PlatformInvestor) => void
}

export function EditInvestorProfileModal({
  investor,
  isOpen,
  onClose,
  onSave,
}: EditInvestorProfileModalProps) {
  const [formData, setFormData] = React.useState<PlatformInvestor>({ ...investor })
  const [activeTab, setActiveTab] = React.useState<'general' | 'financial' | 'verification'>('general')

  React.useEffect(() => {
    setFormData({ ...investor })
  }, [investor, isOpen])

  if (!isOpen) return null

  const handleChange = (field: keyof PlatformInvestor, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePersonalInfoChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo || {
          fullName: prev.name,
          email: prev.email,
          phone: prev.phone,
          nationality: prev.country,
          occupation: 'Private Investor',
          sourceOfWealth: 'Real Estate & Private Equity',
          preferredLanguage: 'English',
        }),
        [field]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-[680px] flex-col rounded-[16px] border border-[#d3d5d7] bg-white shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] px-6 py-4 bg-[#fcfcfc]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#00c2cb]/10 text-[#00c2cb]">
              <User className="size-5" />
            </div>
            <div>
              <h2 className="text-[20px] leading-[28px] font-bold text-[#1f2327]">Edit Investor Profile</h2>
              <p className="text-[12px] leading-[16px] text-[#6f777f]">
                Update KYC status, contact info, capital capacity & deal metrics for <strong className="font-semibold text-[#1f2327]">{investor.name}</strong> ({investor.id})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#d3d5d7] px-6 bg-white gap-2 pt-2">
          {(
            [
              { id: 'general', label: 'Personal & Contact' },
              { id: 'financial', label: 'Financial & Deal Flow' },
              { id: 'verification', label: 'KYC & Compliance' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'border-b-2 px-3 py-2.5 text-[14px] leading-[20px] font-semibold transition-colors cursor-pointer',
                activeTab === tab.id
                  ? 'border-[#00c2cb] text-[#00c2cb]'
                  : 'border-transparent text-[#6f777f] hover:text-[#1f2327]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <ProfilePhotoEditor
                currentPhoto={formData.avatar}
                name={formData.name}
                country={formData.country}
                onChange={(newPhoto) => handleChange('avatar', newPhoto)}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      handleChange('name', e.target.value)
                      handlePersonalInfoChange('fullName', e.target.value)
                    }}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      handleChange('email', e.target.value)
                      handlePersonalInfoChange('email', e.target.value)
                    }}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => {
                      handleChange('phone', e.target.value)
                      handlePersonalInfoChange('phone', e.target.value)
                    }}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Country / Residency</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => {
                      handleChange('country', e.target.value)
                      handlePersonalInfoChange('nationality', e.target.value)
                    }}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Occupation / Entity</label>
                  <input
                    type="text"
                    value={formData.personalInfo?.occupation || 'Private Investor'}
                    onChange={(e) => handlePersonalInfoChange('occupation', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                    <option value="Under review">Under review</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Total Active Requests</label>
                  <input
                    type="number"
                    value={formData.requests}
                    onChange={(e) => handleChange('requests', parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Closed Deals</label>
                  <input
                    type="number"
                    value={formData.deals}
                    onChange={(e) => handleChange('deals', parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Investor Reliability Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={(e) => handleChange('score', parseInt(e.target.value, 10) || 100)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 font-bold text-[#00c2cb] text-[14px] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Source of Wealth</label>
                  <input
                    type="text"
                    value={formData.personalInfo?.sourceOfWealth || 'Real Estate & Private Equity'}
                    onChange={(e) => handlePersonalInfoChange('sourceOfWealth', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">KYC Verification Tier</label>
                  <select
                    value={formData.verification}
                    onChange={(e) => handleChange('verification', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Verified">Verified (Full KYC + Proof of Funds)</option>
                    <option value="Under review">Under review</option>
                    <option value="Pending">Pending Documents</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                  <div className="mt-2">
                    <FigmaStatusBadge status={formData.verification} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Preferred Language</label>
                  <select
                    value={formData.personalInfo?.preferredLanguage || 'English'}
                    onChange={(e) => handlePersonalInfoChange('preferredLanguage', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Russian">Russian</option>
                    <option value="French">French</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#d3d5d7]">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[14px] font-semibold text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex h-[38px] items-center gap-2 rounded-[8px] bg-[#00c2cb] px-5 text-[14px] font-semibold text-white hover:bg-[#00a8b0] transition-colors cursor-pointer shadow-2xs"
            >
              <Save className="size-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
