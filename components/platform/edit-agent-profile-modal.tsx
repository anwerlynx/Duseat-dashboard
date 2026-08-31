'use client'

import * as React from 'react'
import {
  X,
  User,
  Building2,
  ShieldCheck,
  Award,
  Star,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Globe,
  FileText,
  Save,
} from 'lucide-react'
import { type PlatformAgent } from '@/lib/platform-users'
import { AgentPlanBadge } from '@/components/ui/figma-badges'
import { ProfilePhotoEditor } from './profile-photo-editor'
import { cn } from '@/lib/utils'

interface EditAgentProfileModalProps {
  agent: PlatformAgent
  isOpen: boolean
  onClose: () => void
  onSave: (updatedAgent: PlatformAgent) => void
}

export function EditAgentProfileModal({
  agent,
  isOpen,
  onClose,
  onSave,
}: EditAgentProfileModalProps) {
  const [formData, setFormData] = React.useState<PlatformAgent>({ ...agent })
  const [activeTab, setActiveTab] = React.useState<'general' | 'company' | 'license' | 'metrics'>('general')

  React.useEffect(() => {
    setFormData({ ...agent })
  }, [agent, isOpen])

  if (!isOpen) return null

  const handleChange = (field: keyof PlatformAgent, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCompanyChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      company: {
        ...(prev.company || {
          tradeName: '',
          legalName: '',
          address: '',
          emirate: 'Dubai',
          teamSize: '',
          website: '',
        }),
        [field]: value,
      },
    }))
  }

  const handleReraChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      reraVerification: {
        ...(prev.reraVerification || {
          number: '',
          category: 'Broker',
          expiry: '',
          status: 'Valid',
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
      <div className="relative flex max-h-[90vh] w-full max-w-[720px] flex-col rounded-[16px] border border-[#d3d5d7] bg-white shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] px-6 py-4 bg-[#fcfcfc]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#00c2cb]/10 text-[#00c2cb]">
              <User className="size-5" />
            </div>
            <div>
              <h2 className="text-[20px] leading-[28px] font-bold text-[#1f2327]">Edit Agent Profile</h2>
              <p className="text-[12px] leading-[16px] text-[#6f777f]">
                Modify credentials, license details, status, and performance metrics for <strong className="font-semibold text-[#1f2327]">{agent.name}</strong> ({agent.id})
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
              { id: 'general', label: 'General & Contact' },
              { id: 'company', label: 'Agency & Office' },
              { id: 'license', label: 'RERA & Compliance' },
              { id: 'metrics', label: 'Plan & Performance' },
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
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Under review">Under review</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Country & Location</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={formData.countryFlag || '🇦🇪'}
                    onChange={(e) => handleChange('countryFlag', e.target.value)}
                    className="w-16 rounded-[8px] border border-[#d3d5d7] px-2 py-2 text-center text-[16px] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Agency / Brokerage Name</label>
                  <input
                    type="text"
                    value={formData.agency}
                    onChange={(e) => {
                      handleChange('agency', e.target.value)
                      handleCompanyChange('tradeName', e.target.value)
                    }}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Legal Entity Name</label>
                  <input
                    type="text"
                    value={formData.company?.legalName || ''}
                    onChange={(e) => handleCompanyChange('legalName', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Office Address</label>
                  <input
                    type="text"
                    value={formData.company?.address || ''}
                    onChange={(e) => handleCompanyChange('address', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Emirate / Region</label>
                  <select
                    value={formData.company?.emirate || 'Dubai'}
                    onChange={(e) => handleCompanyChange('emirate', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Ajman">Ajman</option>
                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Team Size</label>
                  <input
                    type="text"
                    value={formData.company?.teamSize || '10+ agents'}
                    onChange={(e) => handleCompanyChange('teamSize', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Website</label>
                  <input
                    type="text"
                    value={formData.company?.website || ''}
                    onChange={(e) => handleCompanyChange('website', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'license' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">RERA Broker Number (BRN)</label>
                  <input
                    type="text"
                    value={formData.reraNumber || ''}
                    onChange={(e) => {
                      handleChange('reraNumber', e.target.value)
                      handleReraChange('number', e.target.value)
                    }}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 font-mono text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Trade License Number</label>
                  <input
                    type="text"
                    value={formData.license}
                    onChange={(e) => handleChange('license', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 font-mono text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">License Expiry Date</label>
                  <input
                    type="text"
                    value={formData.tradeLicense?.expiry || '12 Jan 2027'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tradeLicense: {
                          ...(prev.tradeLicense || { number: prev.license, expiry: '', issuer: 'Dubai DED', status: 'Valid' }),
                          expiry: e.target.value,
                        },
                      }))
                    }
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Verification Badge</label>
                  <select
                    value={formData.verification}
                    onChange={(e) => handleChange('verification', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden cursor-pointer"
                  >
                    <option value="RERA + Trade">RERA + Trade</option>
                    <option value="RERA + KYC">RERA + KYC</option>
                    <option value="Trade only">Trade only</option>
                    <option value="KYC Pending">KYC Pending</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Subscription Plan</label>
                  <select
                    value={formData.subscription}
                    onChange={(e) => handleChange('subscription', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Pro agent">Pro agent</option>
                    <option value="Elite agent">Elite agent</option>
                    <option value="Power agent">Power agent</option>
                    <option value="Standard agent">Standard agent</option>
                  </select>
                  <div className="mt-2">
                    <AgentPlanBadge plan={formData.subscription} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Rating (0.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.rating}
                    onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 5.0)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Total Offers Submitted</label>
                  <input
                    type="number"
                    value={formData.offers}
                    onChange={(e) => handleChange('offers', parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Accepted Deals</label>
                  <input
                    type="number"
                    value={formData.accepted}
                    onChange={(e) => handleChange('accepted', parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-[#6f777f] mb-1.5">Platform Revenue Generated</label>
                  <input
                    type="text"
                    value={formData.revenue}
                    onChange={(e) => handleChange('revenue', e.target.value)}
                    className="w-full rounded-[8px] border border-[#d3d5d7] px-3.5 py-2 font-bold text-[14px] text-[#1f2327] focus:border-[#00c2cb] focus:outline-hidden"
                  />
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
