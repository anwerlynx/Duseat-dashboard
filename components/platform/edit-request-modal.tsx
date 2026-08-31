'use client'

import * as React from 'react'
import {
  X,
  Building2,
  Home,
  Briefcase,
  DollarSign,
  MapPin,
  Flame,
  CheckCircle2,
  Sparkles,
  Layers,
  Save,
  Globe,
  FileText,
  AlertCircle,
  Clock,
  Send,
  HelpCircle,
  KeyRound,
  Construction,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  UserCheck,
  UserX,
  Users,
  Bed,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import type { PropertyRequest } from '@/lib/platform-users'
import { generateRequestTitle } from '@/lib/platform-users'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/dashboard/toast'

interface EditRequestModalProps {
  request?: PropertyRequest | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedRequest: PropertyRequest) => void
  mode?: 'create' | 'edit'
}

const DUBAI_AREAS = [
  'Downtown Dubai',
  'Dubai Marina',
  'Palm Jumeirah',
  'Dubai Hills Estate',
  'Business Bay',
  'DIFC',
  'Nad Al Sheba',
  'Jumeirah Village Circle (JVC)',
  'Arabian Ranches',
  'Meydan',
  'Dubai Creek Harbour',
  'Bluewaters Island',
  'Al Barsha',
  'The Valley',
  'Al Quoz Industrial',
]

const TOP_DEVELOPERS = [
  'Emaar',
  'Damac',
  'Sobha',
  'Meraas',
  'Nakheel',
  'Ellington',
  'Aldar',
  'Danube',
  'Binghatti',
  'Omniyat',
]

const LANGUAGE_OPTIONS = [
  { code: 'ar', label: 'Arabic', flag: '🇦🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
]

export function EditRequestModal({
  request: initialRequest,
  isOpen,
  onClose,
  onSave,
  mode = 'edit',
}: EditRequestModalProps) {
  const { toast } = useToast()

  const defaultRequest: PropertyRequest = {
    id: `REQ-${Date.now().toString().slice(-4)}`,
    investorId: 'IN-2048',
    investorName: 'Anwar Hosny',
    countryFlag: '🇦🇪',
    onlineStatus: 'Online (Avg 10m)',
    timeAgo: 'Just now',
    title: "I'm looking for a ready 2 BHK Apartment for living in Downtown Dubai.",
    purpose: 'Living',
    investmentType: 'Residential',
    propertyType: 'Apartment',
    bedrooms: '2 BHK',
    unitStatus: 'Ready',
    budget: '2.5M–3.5M AED',
    preferredAreas: ['Downtown Dubai', 'Dubai Marina'],
    paymentMethod: 'Cash',
    mortgageEligible: false,
    mortgageEligibility: 'No',
    paymentPlan: 'Not applicable',
    developerPreference: {
      hasPreference: false,
      selected: ['Open to all'],
    },
    communication: {
      autoMatchLanguages: true,
      preferredLanguages: ['Arabic', 'English'],
    },
    agentsPitchingCount: 0,
    agentsPitching: [],
    offersCount: 0,
    status: 'Open',
    created: 'Today',
    offers: [],
  }

  const [formData, setFormData] = React.useState<PropertyRequest>(initialRequest || defaultRequest)
  const [currentStep, setCurrentStep] = React.useState<number>(1)
  const [viewMode, setViewMode] = React.useState<'wizard' | 'all'>('wizard')
  const [customArea, setCustomArea] = React.useState('')
  const [currency, setCurrency] = React.useState<'AED' | 'USD'>('AED')
  const [minBudgetNum, setMinBudgetNum] = React.useState('2500000')
  const [maxBudgetNum, setMaxBudgetNum] = React.useState('3500000')

  React.useEffect(() => {
    if (initialRequest) {
      setFormData({ ...initialRequest })
    } else {
      setFormData(defaultRequest)
    }
    setCurrentStep(1)
  }, [initialRequest, isOpen])

  if (!isOpen) return null

  // Helpers
  const handleFieldChange = (field: keyof PropertyRequest, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (
        ['purpose', 'investmentType', 'commercialUnitType', 'propertyType', 'bedrooms', 'unitStatus', 'preferredAreas'].includes(
          field
        )
      ) {
        next.title = generateRequestTitle(next)
      }
      return next
    })
  }

  const toggleArea = (area: string) => {
    setFormData((prev) => {
      const exists = prev.preferredAreas.includes(area)
      const newAreas = exists
        ? prev.preferredAreas.filter((a) => a !== area)
        : [...prev.preferredAreas, area]
      const next = { ...prev, preferredAreas: newAreas }
      next.title = generateRequestTitle(next)
      return next
    })
  }

  const handleAddCustomArea = () => {
    if (!customArea.trim()) return
    toggleArea(customArea.trim())
    setCustomArea('')
  }

  const toggleDeveloper = (dev: string) => {
    setFormData((prev) => {
      const exists = prev.developerPreference.selected.includes(dev)
      const newSelected = exists
        ? prev.developerPreference.selected.filter((d) => d !== dev)
        : [...prev.developerPreference.selected, dev]
      return {
        ...prev,
        developerPreference: {
          hasPreference: newSelected.length > 0,
          selected: newSelected,
        },
      }
    })
  }

  const toggleLanguage = (langLabel: string) => {
    setFormData((prev) => {
      const current = prev.communication.preferredLanguages || []
      const exists = current.includes(langLabel)
      const nextLangs = exists ? current.filter((l) => l !== langLabel) : [...current, langLabel]
      return {
        ...prev,
        communication: {
          ...prev.communication,
          preferredLanguages: nextLangs.length > 0 ? nextLangs : ['English'],
        },
      }
    })
  }

  const applyBudgetPreset = (preset: string) => {
    handleFieldChange('budget', `${preset} ${currency}`)
  }

  const handleCustomBudgetChange = (minVal: string, maxVal: string) => {
    setMinBudgetNum(minVal)
    setMaxBudgetNum(maxVal)
    const minM = (Number(minVal) / 1000000).toFixed(1).replace('.0', '')
    const maxM = (Number(maxVal) / 1000000).toFixed(1).replace('.0', '')
    const formatted = `${minM}M–${maxM}M ${currency}`
    handleFieldChange('budget', formatted)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    onSave(formData)
    toast({
      variant: 'success',
      title: mode === 'create' ? 'Request Published Successfully' : 'Request Updated Successfully',
      description: `Request ${formData.id} is now active and broadcasting to matching agents.`,
    })
    onClose()
  }

  const isLiving = formData.purpose === 'Living'
  const isCommercial = formData.purpose === 'Investment' && formData.investmentType === 'Commercial'
  const isReady = formData.unitStatus === 'Ready'
  const isOffplan = formData.unitStatus === 'Offplan' || formData.unitStatus === 'Off-plan'
  const isMortgage = formData.paymentMethod === 'Mortgage'

  const totalSteps = 6

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/65 p-3 sm:p-5 backdrop-blur-xs font-sans animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex max-h-[94vh] w-full max-w-[840px] flex-col overflow-hidden rounded-[20px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] bg-[#fcfcfc] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[12px] bg-[#00c2cb]/10 text-[#00c2cb]">
              <Building2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] leading-[28px] font-bold text-[#1f2327]">
                  {mode === 'create' ? 'Add Investor Request' : 'Edit Request Specifications'}
                </h2>
                <span className="rounded-[6px] bg-[#f8f9fa] border border-[#d3d5d7] px-2 py-0.5 font-mono text-[12px] leading-[16px] font-semibold text-[#6f777f]">
                  {formData.id}
                </span>
              </div>
              <p className="text-[12px] leading-[16px] text-[#6f777f]">
                Investor Acquisition Flow matching Figma investor app specification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-[8px] bg-[#f0f2f5] p-0.5 border border-[#d3d5d7]">
              <button
                type="button"
                onClick={() => setViewMode('wizard')}
                className={cn(
                  'px-2.5 py-1 text-[12px] font-semibold rounded-[6px] transition-all cursor-pointer',
                  viewMode === 'wizard' ? 'bg-white text-[#00848b] shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                )}
              >
                Wizard Flow
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={cn(
                  'px-2.5 py-1 text-[12px] font-semibold rounded-[6px] transition-all cursor-pointer',
                  viewMode === 'all' ? 'bg-white text-[#00848b] shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
                )}
              >
                All Fields
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Segmented Progress Bar (Figma Style) */}
        {viewMode === 'wizard' && (
          <div className="bg-[#f8fafc] border-b border-[#e5e7eb] px-6 py-2.5">
            <div className="flex items-center justify-between text-[12px] font-semibold text-[#6f777f] mb-1.5">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-[#00848b]">
                {currentStep === 1 && 'Purpose & Intent'}
                {currentStep === 2 && 'Unit Type & Bedrooms'}
                {currentStep === 3 && 'Property Status'}
                {currentStep === 4 && 'Budget & Currency'}
                {currentStep === 5 && 'Preferred Locations'}
                {currentStep === 6 && 'Payment, Financing & Review'}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.5 h-1.5 w-full">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    idx + 1 <= currentStep ? 'bg-[#00c2cb]' : 'bg-[#e2e8f0]'
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Live Auto-Generated Summary Banner (Flow Output Preview) */}
        <div className="bg-[#e5f6f7] border-b border-[#c7ecee] px-6 py-2.5 flex items-start gap-2.5">
          <Sparkles className="size-4 text-[#00c2cb] shrink-0 mt-0.5" />
          <div className="text-[12px] leading-[18px] text-[#1f2327]">
            <span className="font-semibold text-[#00848b] uppercase tracking-wider text-[10px] block">
              Auto-Generated Request Title:
            </span>
            <p className="font-medium text-[#1f2327] mt-0.5">{formData.title}</p>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* =========================================================================
              SCREEN 1: What are you looking for? (Living vs Investment)
             ========================================================================= */}
          {(viewMode === 'all' || currentStep === 1) && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-[20px] leading-[28px] font-bold text-[#1f2327]">What are you looking for?</h3>
                <p className="text-[14px] leading-[20px] text-[#6f777f]">Are you buying for living or investment?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Living Option Card (Figma Style) */}
                <button
                  type="button"
                  onClick={() => {
                    handleFieldChange('purpose', 'Living')
                    handleFieldChange('investmentType', 'Residential')
                  }}
                  className={cn(
                    'flex items-center gap-4 rounded-[16px] border-2 p-4 text-left transition-all cursor-pointer ant-wave-btn',
                    isLiving
                      ? 'border-[#00c2cb] bg-[#f0fbfb] shadow-xs'
                      : 'border-[#e5e7eb] bg-white hover:border-[#d3d5d7] hover:bg-[#fafafa]'
                  )}
                >
                  <div className="flex size-[54px] shrink-0 items-center justify-center rounded-[12px] bg-[#e5f6f7] text-[#00c2cb]">
                    <Home className="size-7 text-[#00c2cb]" />
                  </div>
                  <div>
                    <p className={cn('text-[16px] leading-[24px] font-bold', isLiving ? 'text-[#00848b]' : 'text-[#1f2327]')}>
                      living
                    </p>
                    <p className="text-[12px] leading-[16px] text-[#6f777f] mt-0.5">
                      Find your dream home to live in comfortably
                    </p>
                  </div>
                </button>

                {/* Investment Option Card (Figma Style) */}
                <button
                  type="button"
                  onClick={() => {
                    handleFieldChange('purpose', 'Investment')
                    if (!formData.investmentType) handleFieldChange('investmentType', 'Residential')
                  }}
                  className={cn(
                    'flex items-center gap-4 rounded-[16px] border-2 p-4 text-left transition-all cursor-pointer ant-wave-btn',
                    !isLiving
                      ? 'border-[#00c2cb] bg-[#f0fbfb] shadow-xs'
                      : 'border-[#e5e7eb] bg-white hover:border-[#d3d5d7] hover:bg-[#fafafa]'
                  )}
                >
                  <div className="flex size-[54px] shrink-0 items-center justify-center rounded-[12px] bg-[#fff4e5] text-[#f79009]">
                    <TrendingUp className="size-7 text-[#f79009]" />
                  </div>
                  <div>
                    <p className={cn('text-[16px] leading-[24px] font-bold', !isLiving ? 'text-[#00848b]' : 'text-[#1f2327]')}>
                      Investment
                    </p>
                    <p className="text-[12px] leading-[16px] text-[#6f777f] mt-0.5">
                      Grow your wealth through smart real estate
                    </p>
                  </div>
                </button>
              </div>

              {/* If Investment Selected: Residential vs Commercial */}
              {!isLiving && (
                <div className="rounded-[14px] border border-[#c7ecee] bg-[#f8fcfd] p-4 space-y-2.5 animate-in fade-in duration-150">
                  <p className="text-[12px] font-semibold uppercase text-[#00848b]">Investment Sector</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleFieldChange('investmentType', 'Residential')}
                      className={cn(
                        'flex items-center gap-2.5 rounded-[10px] border p-3 text-left transition-all cursor-pointer',
                        formData.investmentType === 'Residential'
                          ? 'border-[#00c2cb] bg-white font-semibold shadow-2xs'
                          : 'border-[#d3d5d7] bg-white/70 hover:bg-white text-[#6f777f]'
                      )}
                    >
                      <Home className="size-4 text-[#00c2cb]" />
                      <span className="text-[14px] text-[#1f2327]">Residential Property</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleFieldChange('investmentType', 'Commercial')
                        if (!formData.commercialUnitType) handleFieldChange('commercialUnitType', 'Office')
                      }}
                      className={cn(
                        'flex items-center gap-2.5 rounded-[10px] border p-3 text-left transition-all cursor-pointer',
                        formData.investmentType === 'Commercial'
                          ? 'border-[#00c2cb] bg-white font-semibold shadow-2xs'
                          : 'border-[#d3d5d7] bg-white/70 hover:bg-white text-[#6f777f]'
                      )}
                    >
                      <Briefcase className="size-4 text-[#00c2cb]" />
                      <span className="text-[14px] text-[#1f2327]">Commercial (Office, Retail, etc.)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              SCREEN 2: Property Type & Bedrooms (Figma 2x2 Grid + Bedrooms Pills)
             ========================================================================= */}
          {(viewMode === 'all' || currentStep === 2) && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-[20px] leading-[28px] font-bold text-[#1f2327]">Property type</h3>
                <p className="text-[14px] leading-[20px] text-[#6f777f]">What kind of unit are you looking for?</p>
              </div>

              {/* 2x2 Property Type Grid (Figma Screen 2) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {isCommercial
                  ? (['Office', 'Retail Shop', 'Warehouse', 'Other'] as const).map((type) => {
                      const isSelected = formData.commercialUnitType === type || formData.propertyType === type
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            handleFieldChange('commercialUnitType', type)
                            handleFieldChange('propertyType', type)
                          }}
                          className={cn(
                            'flex flex-col items-start justify-between rounded-[14px] border-2 p-3.5 h-[84px] transition-all cursor-pointer ant-wave-btn',
                            isSelected
                              ? 'border-[#00c2cb] bg-[#f0fbfb] shadow-2xs'
                              : 'border-[#e5e7eb] bg-white hover:border-[#d3d5d7] hover:bg-[#fafafa]'
                          )}
                        >
                          <Briefcase className={cn('size-5', isSelected ? 'text-[#00c2cb]' : 'text-[#6f777f]')} />
                          <span className={cn('text-[14px] font-semibold', isSelected ? 'text-[#00848b]' : 'text-[#1f2327]')}>
                            {type}
                          </span>
                        </button>
                      )
                    })
                  : (
                      [
                        { id: 'Apartment', label: 'Apartment', icon: Building2 },
                        { id: 'Villa', label: 'Villa', icon: Home },
                        { id: 'Townhouse', label: 'Townhouse', icon: Layers },
                        { id: 'Penthouse', label: 'Mansion / Penthouse', icon: Flame },
                      ] as const
                    ).map((t) => {
                      const isSelected = formData.propertyType === t.id
                      const IconComp = t.icon
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleFieldChange('propertyType', t.id)}
                          className={cn(
                            'flex flex-col items-start justify-between rounded-[14px] border-2 p-3.5 h-[88px] transition-all cursor-pointer ant-wave-btn',
                            isSelected
                              ? 'border-[#00c2cb] bg-[#f0fbfb] shadow-2xs'
                              : 'border-[#e5e7eb] bg-white hover:border-[#d3d5d7] hover:bg-[#fafafa]'
                          )}
                        >
                          <IconComp className={cn('size-5', isSelected ? 'text-[#00c2cb]' : 'text-[#6f777f]')} />
                          <span className={cn('text-[14px] font-semibold', isSelected ? 'text-[#00848b]' : 'text-[#1f2327]')}>
                            {t.label}
                          </span>
                        </button>
                      )
                    })}
              </div>

              {/* How many bedrooms? (Figma Screen 2 Pills) */}
              {!isCommercial && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-[16px] leading-[24px] font-bold text-[#1f2327]">How many bedrooms?</h4>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'Studio',
                        '1 BHK',
                        '2 BHK',
                        '3 BHK',
                        '4 BHK',
                        '5 BHK',
                        '6 BHK',
                        '+7 BHK',
                        'Duplex',
                        'Penthouse',
                      ] as const
                    ).map((bhk) => {
                      const isSelected = formData.bedrooms === bhk || (formData.bedrooms.includes(bhk[0]) && bhk !== 'Studio')
                      return (
                        <button
                          key={bhk}
                          type="button"
                          onClick={() => handleFieldChange('bedrooms', bhk)}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-[13px] font-medium transition-all cursor-pointer ant-wave-btn',
                            isSelected
                              ? 'border-[#00c2cb] bg-[#00c2cb] text-white font-semibold shadow-2xs'
                              : 'border-[#e5e7eb] bg-[#f8f9fa] text-[#1f2327] hover:bg-[#eef0f2]'
                          )}
                        >
                          <Bed className={cn('size-3.5', isSelected ? 'text-white' : 'text-[#6f777f]')} />
                          <span>{bhk}</span>
                          {isSelected && <Check className="size-3 text-white ml-0.5" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              SCREEN 3: Ready or Off-plan? (Figma Screen 3 Status Cards)
             ========================================================================= */}
          {(viewMode === 'all' || currentStep === 3) && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-[20px] leading-[28px] font-bold text-[#1f2327]">Ready or Off-plan?</h3>
                <p className="text-[14px] leading-[20px] text-[#6f777f]">Choose the property status you prefer</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Ready to Move Card (Figma Style) */}
                <button
                  type="button"
                  onClick={() => handleFieldChange('unitStatus', 'Ready')}
                  className={cn(
                    'flex items-start gap-3.5 rounded-[16px] border-2 p-4 text-left transition-all cursor-pointer ant-wave-btn',
                    isReady
                      ? 'border-[#00c2cb] bg-[#f0fbfb] shadow-xs'
                      : 'border-[#e5e7eb] bg-white hover:border-[#d3d5d7] hover:bg-[#fafafa]'
                  )}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#e5f6f7] text-[#00c2cb] mt-0.5">
                    <KeyRound className="size-5 text-[#00c2cb]" />
                  </div>
                  <div>
                    <p className={cn('text-[16px] leading-[24px] font-bold', isReady ? 'text-[#00848b]' : 'text-[#1f2327]')}>
                      Ready to move
                    </p>
                    <p className="text-[13px] leading-[18px] text-[#6f777f] mt-1">
                      Completed unit — move in immediately or start earning rent
                    </p>
                  </div>
                </button>

                {/* Off-plan Card (Figma Style) */}
                <button
                  type="button"
                  onClick={() => handleFieldChange('unitStatus', 'Offplan')}
                  className={cn(
                    'flex items-start gap-3.5 rounded-[16px] border-2 p-4 text-left transition-all cursor-pointer ant-wave-btn',
                    isOffplan
                      ? 'border-[#00c2cb] bg-[#f0fbfb] shadow-xs'
                      : 'border-[#e5e7eb] bg-white hover:border-[#d3d5d7] hover:bg-[#fafafa]'
                  )}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#fff4e5] text-[#f79009] mt-0.5">
                    <Construction className="size-5 text-[#f79009]" />
                  </div>
                  <div>
                    <p className={cn('text-[16px] leading-[24px] font-bold', isOffplan ? 'text-[#00848b]' : 'text-[#1f2327]')}>
                      Off-plan
                    </p>
                    <p className="text-[13px] leading-[18px] text-[#6f777f] mt-1">
                      Buy before completion, often at a lower price with flexible payment plans
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              SCREEN 4: Budget Range & Currency (Figma Screen 4 Display & Range Pills)
             ========================================================================= */}
          {(viewMode === 'all' || currentStep === 4) && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="text-[20px] leading-[28px] font-bold text-[#1f2327]">Budget range</h3>
                <p className="text-[14px] leading-[20px] text-[#6f777f]">
                  Tell us your preferred budget range so we can match you with the most relevant properties and agents.
                </p>
              </div>

              {/* Currency Selector (Figma Dropdown) */}
              <div className="flex items-center gap-3">
                <div className="relative inline-flex items-center rounded-[12px] border border-[#d3d5d7] bg-white px-3 py-2 text-[14px] font-semibold text-[#1f2327]">
                  <span className="mr-2">{currency === 'AED' ? '🇦🇪' : '🇺🇸'}</span>
                  <select
                    value={currency}
                    onChange={(e) => {
                      const newCurr = e.target.value as 'AED' | 'USD'
                      setCurrency(newCurr)
                      handleFieldChange('budget', formData.budget.replace(/AED|USD/g, newCurr))
                    }}
                    className="bg-transparent outline-none cursor-pointer pr-4 font-semibold text-[#1f2327]"
                  >
                    <option value="AED">AED (Dirham)</option>
                    <option value="USD">USD (Dollar)</option>
                  </select>
                  <ChevronDown className="size-4 text-[#6f777f] pointer-events-none absolute right-2.5" />
                </div>
              </div>

              {/* Min & Max Inputs (Figma Style) */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-3">
                  <label className="block text-[11px] font-semibold uppercase text-[#6f777f]">Minimum budget</label>
                  <div className="flex items-center justify-between mt-1">
                    <input
                      type="number"
                      value={minBudgetNum}
                      onChange={(e) => handleCustomBudgetChange(e.target.value, maxBudgetNum)}
                      className="w-full text-[16px] font-bold text-[#1f2327] outline-none"
                    />
                    <span className="font-bold text-[#6f777f] ml-1">{currency === 'AED' ? 'AED' : '$'}</span>
                  </div>
                </div>

                <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-3">
                  <label className="block text-[11px] font-semibold uppercase text-[#6f777f]">Maximum budget</label>
                  <div className="flex items-center justify-between mt-1">
                    <input
                      type="number"
                      value={maxBudgetNum}
                      onChange={(e) => handleCustomBudgetChange(minBudgetNum, e.target.value)}
                      className="w-full text-[16px] font-bold text-[#1f2327] outline-none"
                    />
                    <span className="font-bold text-[#6f777f] ml-1">{currency === 'AED' ? 'AED' : '$'}</span>
                  </div>
                </div>
              </div>

              {/* Giant Display (Figma 40px Header) */}
              <div className="py-2 text-center">
                <p className="text-[32px] sm:text-[36px] font-extrabold text-[#00c2cb] tracking-tight">
                  {formData.budget}
                </p>
              </div>

              {/* Quick Range Suggestions (Figma Screen 4 Pills) */}
              <div className="space-y-2">
                <p className="text-[13px] font-semibold text-[#1f2327]">Quick range suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {(['1M–2M', '2M–3M', '3M–5M', '5M–10M', '10M+'] as const).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => applyBudgetPreset(preset)}
                      className="rounded-[10px] border border-[#d3d5d7] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] hover:border-[#00c2cb] transition-colors cursor-pointer ant-wave-btn"
                    >
                      {preset} {currency}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SCREEN 5: Location & Preferred Areas (Figma Screen 5)
             ========================================================================= */}
          {(viewMode === 'all' || currentStep === 5) && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[20px] leading-[28px] font-bold text-[#1f2327]">Preferred locations</h3>
                  <p className="text-[14px] leading-[20px] text-[#6f777f]">
                    Where in Dubai would they like to buy? ({formData.preferredAreas.length} selected)
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    placeholder="Add custom area..."
                    className="h-[34px] rounded-[8px] border border-[#d3d5d7] px-2.5 text-[12px] outline-none focus:border-[#00c2cb]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCustomArea()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomArea}
                    className="h-[34px] px-3 rounded-[8px] bg-[#00c2cb] text-white text-[12px] font-medium hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Area Tags Grid */}
              <div className="flex flex-wrap gap-2 p-3 bg-[#fcfcfc] rounded-[14px] border border-[#d3d5d7] max-h-[220px] overflow-y-auto">
                {DUBAI_AREAS.map((area) => {
                  const isSelected = formData.preferredAreas.includes(area)
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleArea(area)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-[#00c2cb] text-white font-semibold shadow-2xs'
                          : 'bg-white border border-[#d3d5d7] text-[#1f2327] hover:bg-[#eff1f3]'
                      )}
                    >
                      <MapPin className="size-3.5" />
                      <span>{area}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              SCREEN 6: Payment Method, Mortgage & Review (Figma Screen 6 & 7)
             ========================================================================= */}
          {(viewMode === 'all' || currentStep === 6) && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Payment Method (Figma Screen 6) */}
              {isReady && (
                <div className="space-y-3">
                  <div>
                    <h3 className="text-[20px] leading-[28px] font-bold text-[#1f2327]">Payment method</h3>
                    <p className="text-[14px] leading-[20px] text-[#6f777f]">How are you planning to pay?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleFieldChange('paymentMethod', 'Cash')
                        handleFieldChange('mortgageEligible', false)
                        handleFieldChange('mortgageEligibility', 'No')
                      }}
                      className={cn(
                        'flex items-start gap-3 rounded-[14px] border-2 p-4 text-left transition-all cursor-pointer ant-wave-btn',
                        !isMortgage
                          ? 'border-[#00c2cb] bg-[#f0fbfb] shadow-xs'
                          : 'border-[#e5e7eb] bg-white hover:bg-[#fafafa]'
                      )}
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#e5f6f7] text-[#00c2cb]">
                        <DollarSign className="size-5" />
                      </div>
                      <div>
                        <p className={cn('text-[15px] font-bold', !isMortgage ? 'text-[#00848b]' : 'text-[#1f2327]')}>
                          Cash
                        </p>
                        <p className="text-[12px] text-[#6f777f] mt-0.5">
                          Full payment upfront — faster deals, stronger negotiation power
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleFieldChange('paymentMethod', 'Mortgage')
                        handleFieldChange('mortgageEligible', true)
                        handleFieldChange('mortgageEligibility', 'Yes')
                      }}
                      className={cn(
                        'flex items-start gap-3 rounded-[14px] border-2 p-4 text-left transition-all cursor-pointer ant-wave-btn',
                        isMortgage
                          ? 'border-[#00c2cb] bg-[#f0fbfb] shadow-xs'
                          : 'border-[#e5e7eb] bg-white hover:bg-[#fafafa]'
                      )}
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#e5f6f7] text-[#00c2cb]">
                        <CreditCard className="size-5" />
                      </div>
                      <div>
                        <p className={cn('text-[15px] font-bold', isMortgage ? 'text-[#00848b]' : 'text-[#1f2327]')}>
                          Mortgage
                        </p>
                        <p className="text-[12px] text-[#6f777f] mt-0.5">
                          Finance through a bank — spread your cost over time
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Mortgage Eligibility (Figma Screen 6B) */}
                  {isMortgage && (
                    <div className="rounded-[14px] border border-[#c7ecee] bg-[#f8fcfd] p-4 space-y-2.5 animate-in fade-in duration-150">
                      <h4 className="text-[14px] font-bold text-[#00848b]">Mortgage eligibility: Have you been pre-approved?</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            handleFieldChange('mortgageEligibility', 'Yes')
                            handleFieldChange('mortgageEligible', true)
                          }}
                          className={cn(
                            'flex items-center gap-2.5 rounded-[10px] border p-3 text-left transition-all cursor-pointer',
                            formData.mortgageEligibility === 'Yes' || formData.mortgageEligible
                              ? 'border-[#17b26a] bg-[#ecfdf3] text-[#0e7242] font-semibold'
                              : 'border-[#d3d5d7] bg-white text-[#1f2327]'
                          )}
                        >
                          <UserCheck className="size-4 text-[#17b26a]" />
                          <div>
                            <p className="text-[13px] font-bold">Yes, eligible</p>
                            <p className="text-[11px] text-[#6f777f]">Bank pre-approved</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleFieldChange('mortgageEligibility', 'No')
                            handleFieldChange('mortgageEligible', false)
                          }}
                          className={cn(
                            'flex items-center gap-2.5 rounded-[10px] border p-3 text-left transition-all cursor-pointer',
                            formData.mortgageEligibility === 'No'
                              ? 'border-[#f04438] bg-[#fef3f2] text-[#b42318] font-semibold'
                              : 'border-[#d3d5d7] bg-white text-[#1f2327]'
                          )}
                        >
                          <UserX className="size-4 text-[#f04438]" />
                          <div>
                            <p className="text-[13px] font-bold">Not yet eligible</p>
                            <p className="text-[11px] text-[#6f777f]">Still working on it</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleFieldChange('mortgageEligibility', 'not sure')
                            handleFieldChange('mortgageEligible', false)
                          }}
                          className={cn(
                            'flex items-center gap-2.5 rounded-[10px] border p-3 text-left transition-all cursor-pointer',
                            formData.mortgageEligibility === 'not sure'
                              ? 'border-[#f79009] bg-[#fff4e5] text-[#b54708] font-semibold'
                              : 'border-[#d3d5d7] bg-white text-[#1f2327]'
                          )}
                        >
                          <Users className="size-4 text-[#f79009]" />
                          <div>
                            <p className="text-[13px] font-bold">Not sure</p>
                            <p className="text-[11px] text-[#6f777f]">Need bank assessment</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Offplan Details (Payment Plan & Developers) */}
              {isOffplan && (
                <div className="space-y-3.5 rounded-[14px] border border-[#c7ecee] bg-[#f8fcfd] p-4">
                  <h4 className="text-[15px] font-bold text-[#00848b]">Off-plan Payment Plan & Developer Selection</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleFieldChange('paymentPlan', 'Long-term payment plan')}
                      className={cn(
                        'rounded-[10px] border p-3 text-left transition-all cursor-pointer',
                        formData.paymentPlan?.includes('Long')
                          ? 'border-[#00c2cb] bg-white text-[#00848b] font-semibold shadow-2xs'
                          : 'border-[#d3d5d7] bg-white/70 text-[#1f2327]'
                      )}
                    >
                      <p className="text-[13px] font-bold">Long-term payment plan</p>
                      <p className="text-[11px] text-[#6f777f]">5+ years post-handover installment</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFieldChange('paymentPlan', 'Short-term payment plan')}
                      className={cn(
                        'rounded-[10px] border p-3 text-left transition-all cursor-pointer',
                        formData.paymentPlan?.includes('Short')
                          ? 'border-[#00c2cb] bg-white text-[#00848b] font-semibold shadow-2xs'
                          : 'border-[#d3d5d7] bg-white/70 text-[#1f2327]'
                      )}
                    >
                      <p className="text-[13px] font-bold">Short-term payment plan</p>
                      <p className="text-[11px] text-[#6f777f]">Standard construction milestone payments</p>
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#c7ecee]">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-semibold uppercase text-[#00848b]">Select Preferred Developers</p>
                      <button
                        type="button"
                        onClick={() => {
                          const nextPref = !formData.developerPreference.hasPreference
                          setFormData((prev) => ({
                            ...prev,
                            developerPreference: {
                              hasPreference: nextPref,
                              selected: nextPref ? ['Emaar'] : ['Open to all'],
                            },
                          }))
                        }}
                        className="text-[12px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
                      >
                        {formData.developerPreference.hasPreference ? 'Open to all developers' : 'Specific developers'}
                      </button>
                    </div>

                    {formData.developerPreference.hasPreference && (
                      <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-[8px] border border-[#c7ecee]">
                        {TOP_DEVELOPERS.map((dev) => {
                          const isSelected = formData.developerPreference.selected.includes(dev)
                          return (
                            <button
                              key={dev}
                              type="button"
                              onClick={() => toggleDeveloper(dev)}
                              className={cn(
                                'inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition-colors cursor-pointer',
                                isSelected
                                  ? 'bg-[#00c2cb] text-white font-semibold'
                                  : 'bg-[#f8f9fa] border border-[#d3d5d7] text-[#1f2327] hover:bg-[#eff1f3]'
                              )}
                            >
                              <Building2 className="size-3" />
                              <span>{dev}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Note & Communication Languages */}
              <div className="space-y-3 pt-2 border-t border-[#d3d5d7]">
                <label className="block text-[13px] font-bold text-[#1f2327]">
                  Final Note & Language Preferences
                </label>
                <textarea
                  rows={2}
                  value={formData.note || ''}
                  onChange={(e) => handleFieldChange('note', e.target.value)}
                  placeholder="e.g. Move-in immediately. Sea view and high floor preferred."
                  className="w-full rounded-[10px] border border-[#d3d5d7] p-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {LANGUAGE_OPTIONS.map((lang) => {
                      const isSelected = (formData.communication.preferredLanguages || []).includes(lang.label)
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => toggleLanguage(lang.label)}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-[6px] border px-2.5 py-1 text-[12px] font-medium transition-colors cursor-pointer',
                            isSelected
                              ? 'border-[#00c2cb] bg-[#e5f6f7] text-[#00848b] font-semibold'
                              : 'border-[#d3d5d7] bg-white text-[#1f2327]'
                          )}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[#6f777f]">Status:</span>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      className="rounded-[6px] border border-[#d3d5d7] bg-white px-2 py-1 text-[12px] font-semibold text-[#1f2327] outline-none cursor-pointer"
                    >
                      <option value="Open">Open</option>
                      <option value="Receiving offers">Receiving offers</option>
                      <option value="Matched">Matched</option>
                      <option value="Deal confirmed">Deal confirmed</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar (Figma Next / Back Style) */}
        <div className="flex items-center justify-between border-t border-[#e5e7eb] bg-white px-6 py-4">
          <div>
            {viewMode === 'wizard' && currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-1.5 text-[14px] leading-[20px] font-semibold text-[#6f777f] hover:text-[#1f2327] transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-[14px] leading-[20px] font-medium text-[#6f777f] hover:text-[#1f2327] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {viewMode === 'wizard' && currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
                className="h-[42px] px-6 rounded-[12px] bg-[#00c2cb] text-[14px] leading-[20px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer ant-wave-btn shadow-2xs flex items-center gap-1.5"
              >
                <span>Next</span>
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="h-[42px] px-6 rounded-[12px] bg-[#00c2cb] text-[14px] leading-[20px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer ant-wave-btn shadow-2xs flex items-center gap-1.5"
              >
                <Save className="size-4" />
                <span>{mode === 'create' ? 'Publish Request / نشر الطلب' : 'Save Changes / حفظ التعديلات'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
