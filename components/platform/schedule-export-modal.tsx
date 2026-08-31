'use client'

import * as React from 'react'
import {
  X,
  ChevronDown,
  ChevronRight,
  Clock,
  Mail,
  Calendar,
  FileSpreadsheet,
  Check,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type ExportFormat = 'excel' | 'csv' | 'pdf'
export type FrequencyType = 'daily' | 'weekly' | 'monthly'
export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'

interface ScheduleExportModalProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (data: ScheduleExportData) => void
  defaultName?: string
}

export interface ScheduleExportData {
  exportName: string
  format: ExportFormat
  frequency: FrequencyType
  dayOfWeek?: DayOfWeek
  deliveryTime: string
  recipients: string[]
  includeFilters: boolean
  includeVisibleColumns: boolean
  includeSummary: boolean
  passwordProtect: boolean
  password?: string
}

const daysOfWeek: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export function ScheduleExportModal({
  isOpen,
  onClose,
  onSchedule,
  defaultName = 'Agents Overview - Weekly Export',
}: ScheduleExportModalProps) {
  const [exportName, setExportName] = React.useState(defaultName)
  const [format, setFormat] = React.useState<ExportFormat>('excel')
  const [frequency, setFrequency] = React.useState<FrequencyType>('weekly')
  const [dayOfWeek, setDayOfWeek] = React.useState<DayOfWeek>('Sunday')
  const [deliveryTime, setDeliveryTime] = React.useState('09:00 AM')
  const [recipients, setRecipients] = React.useState<string[]>(['admin@duseat.ae'])
  const [newEmail, setNewEmail] = React.useState('')
  const [includeFilters, setIncludeFilters] = React.useState(true)
  const [includeVisibleColumns, setIncludeVisibleColumns] = React.useState(true)
  const [includeSummary, setIncludeSummary] = React.useState(true)
  const [passwordProtect, setPasswordProtect] = React.useState(false)
  const [password, setPassword] = React.useState('')

  const [formatDropdownOpen, setFormatDropdownOpen] = React.useState(false)
  const [freqDropdownOpen, setFreqDropdownOpen] = React.useState(false)
  const [weeklySubmenuOpen, setWeeklySubmenuOpen] = React.useState(false)

  if (!isOpen) return null

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && newEmail.trim()) {
      e.preventDefault()
      const email = newEmail.trim().replace(',', '')
      if (email && !recipients.includes(email)) {
        setRecipients([...recipients, email])
      }
      setNewEmail('')
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setRecipients(recipients.filter((email) => email !== emailToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSchedule({
      exportName,
      format,
      frequency,
      dayOfWeek: frequency === 'weekly' ? dayOfWeek : undefined,
      deliveryTime,
      recipients,
      includeFilters,
      includeVisibleColumns,
      includeSummary,
      passwordProtect,
      password: passwordProtect ? password : undefined,
    })
    onClose()
  }

  const getFormatLabel = (fmt: ExportFormat) => {
    switch (fmt) {
      case 'excel':
        return 'Excel (.xlsx)'
      case 'csv':
        return 'CSV (.csv)'
      case 'pdf':
        return 'PDF (.pdf)'
    }
  }

  const getFreqLabel = () => {
    if (frequency === 'daily') return 'Daily'
    if (frequency === 'weekly') return `Weekly (${dayOfWeek})`
    return 'Monthly (1st)'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-[420px] rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-medium text-[#1f2327]">Schedule export</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
          <p className="text-[14px] text-[#6f777f] leading-snug">
            Automatically export the current table and send it to the selected email addresses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Export Name */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[#1f2327]">Export Name</label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
                placeholder="e.g. Agents Overview"
                className="w-full h-[44px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 pr-9 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb] focus:ring-1 focus:ring-[#00c2cb]"
              />
              {exportName && (
                <button
                  type="button"
                  onClick={() => setExportName('')}
                  className="absolute right-3 text-[#9da4ae] hover:text-[#1f2327]"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* Export Format & Frequency (2 Columns) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Format Dropdown */}
            <div className="space-y-1.5 relative">
              <label className="text-[14px] font-medium text-[#1f2327]">Export Format</label>
              <button
                type="button"
                onClick={() => {
                  setFormatDropdownOpen(!formatDropdownOpen)
                  setFreqDropdownOpen(false)
                }}
                className="w-full h-[44px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] text-[#1f2327] flex items-center justify-between hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                <span className="truncate">{getFormatLabel(format)}</span>
                <ChevronDown className="size-4 text-[#6f777f] shrink-0" />
              </button>

              {formatDropdownOpen && (
                <div className="absolute left-0 top-[72px] z-30 w-full rounded-[8px] border border-[#d3d5d7] bg-white p-1 shadow-lg space-y-0.5">
                  {(['excel', 'csv', 'pdf'] as ExportFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => {
                        setFormat(fmt)
                        setFormatDropdownOpen(false)
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-[6px] text-[13px] transition-colors',
                        format === fmt
                          ? 'bg-[#e5f6f7] font-semibold text-[#00a4ac]'
                          : 'text-[#1f2327] hover:bg-[#eff1f3]'
                      )}
                    >
                      {getFormatLabel(fmt)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Frequency Dropdown */}
            <div className="space-y-1.5 relative">
              <label className="text-[14px] font-medium text-[#1f2327]">Frequency</label>
              <button
                type="button"
                onClick={() => {
                  setFreqDropdownOpen(!freqDropdownOpen)
                  setFormatDropdownOpen(false)
                }}
                className="w-full h-[44px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] text-[#1f2327] flex items-center justify-between hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                <span className="truncate">{getFreqLabel()}</span>
                <ChevronDown className="size-4 text-[#6f777f] shrink-0" />
              </button>

              {freqDropdownOpen && (
                <div className="absolute left-0 top-[72px] z-30 w-[180px] rounded-[8px] border border-[#d3d5d7] bg-white p-1 shadow-xl space-y-0.5 animate-in fade-in duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setFrequency('daily')
                      setFreqDropdownOpen(false)
                      setWeeklySubmenuOpen(false)
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-[6px] text-[13px] transition-colors',
                      frequency === 'daily'
                        ? 'bg-[#e5f6f7] font-semibold text-[#00a4ac]'
                        : 'text-[#1f2327] hover:bg-[#eff1f3]'
                    )}
                  >
                    Daily
                  </button>

                  {/* Weekly with nested flyout submenu */}
                  <div
                    className="relative"
                    onMouseEnter={() => setWeeklySubmenuOpen(true)}
                    onMouseLeave={() => setWeeklySubmenuOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setWeeklySubmenuOpen(!weeklySubmenuOpen)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-[6px] text-[13px] flex items-center justify-between transition-colors',
                        frequency === 'weekly'
                          ? 'bg-[#e5f6f7] font-semibold text-[#00a4ac]'
                          : 'text-[#1f2327] hover:bg-[#eff1f3]'
                      )}
                    >
                      <span>Weekly</span>
                      <ChevronRight className="size-3.5 text-[#6f777f]" />
                    </button>

                    {weeklySubmenuOpen && (
                      <div className="absolute left-[175px] -top-2 z-40 w-[140px] rounded-[8px] border border-[#d3d5d7] bg-white p-1 shadow-2xl space-y-0.5 animate-in fade-in duration-100">
                        {daysOfWeek.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setFrequency('weekly')
                              setDayOfWeek(day)
                              setFreqDropdownOpen(false)
                              setWeeklySubmenuOpen(false)
                            }}
                            className={cn(
                              'w-full text-left px-3 py-1.5 rounded-[6px] text-[13px] transition-colors',
                              frequency === 'weekly' && dayOfWeek === day
                                ? 'bg-[#00c2cb] text-white font-semibold'
                                : 'text-[#1f2327] hover:bg-[#eff1f3]'
                            )}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFrequency('monthly')
                      setFreqDropdownOpen(false)
                      setWeeklySubmenuOpen(false)
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-[6px] text-[13px] transition-colors',
                      frequency === 'monthly'
                        ? 'bg-[#e5f6f7] font-semibold text-[#00a4ac]'
                        : 'text-[#1f2327] hover:bg-[#eff1f3]'
                    )}
                  >
                    Monthly (1st)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Time */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[#1f2327]">Delivery Time</label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full h-[44px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb] focus:ring-1 focus:ring-[#00c2cb]"
              />
              <Clock className="absolute right-3.5 size-4 text-[#9da4ae] pointer-events-none" />
            </div>
          </div>

          {/* Email Recipients */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[#1f2327]">Email Recipients</label>
            <div className="min-h-[44px] p-1.5 rounded-[8px] border border-[#d3d5d7] bg-white flex flex-wrap items-center gap-1.5 focus-within:border-[#00c2cb] focus-within:ring-1 focus-within:ring-[#00c2cb]">
              {recipients.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 bg-[#eff1f3] text-[#1f2327] px-2.5 py-1 rounded-[6px] text-[13px]"
                >
                  <Mail className="size-3 text-[#6f777f]" />
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-[#9da4ae] hover:text-[#f04438] transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={handleAddEmail}
                placeholder={recipients.length === 0 ? 'Enter email and press Enter...' : 'Add email...'}
                className="flex-1 min-w-[120px] px-2 py-1 text-[13px] outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Include Checkboxes */}
          <div className="space-y-2.5 pt-1">
            <label className="text-[14px] font-medium text-[#1f2327]">Include</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#1f2327] select-none">
                <input
                  type="checkbox"
                  checked={includeFilters}
                  onChange={(e) => setIncludeFilters(e.target.checked)}
                  className="size-4 rounded text-[#00c2cb] focus:ring-[#00c2cb] accent-[#00c2cb]"
                />
                <span>Export current filters</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#1f2327] select-none">
                <input
                  type="checkbox"
                  checked={includeVisibleColumns}
                  onChange={(e) => setIncludeVisibleColumns(e.target.checked)}
                  className="size-4 rounded text-[#00c2cb] focus:ring-[#00c2cb] accent-[#00c2cb]"
                />
                <span>Export visible columns</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#1f2327] select-none">
                <input
                  type="checkbox"
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                  className="size-4 rounded text-[#00c2cb] focus:ring-[#00c2cb] accent-[#00c2cb]"
                />
                <span>Include table summary</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-[14px] text-[#1f2327] select-none">
                <input
                  type="checkbox"
                  checked={passwordProtect}
                  onChange={(e) => setPasswordProtect(e.target.checked)}
                  className="size-4 rounded text-[#00c2cb] focus:ring-[#00c2cb] accent-[#00c2cb]"
                />
                <span>Password protect file</span>
              </label>

              {passwordProtect && (
                <div className="pt-1 pl-6 animate-in fade-in duration-150">
                  <div className="relative flex items-center">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Set file password..."
                      className="w-full h-[36px] rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                    />
                    <Lock className="absolute right-3 size-3.5 text-[#9da4ae]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#d3d5d7]">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] px-4 rounded-[8px] border border-[#d3d5d7] bg-white text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[38px] px-4 rounded-[8px] bg-[#00c2cb] text-[14px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer ant-wave-btn shadow-2xs"
            >
              Schedule Export
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
