'use client'

import * as React from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DateRange {
  from?: string
  to?: string
  presetName?: string
}

interface DateRangePickerProps {
  value?: string
  onChange?: (val: string) => void
}

const presets = [
  'Recently used',
  'Yesterday',
  'Today and yesterday',
  'Last 7 days',
  'Last 14 days',
  'Last 28 days',
  'This week',
  'This month',
  'Last month',
  'Maximum',
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const years = ['2023', '2024', '2025', '2026', '2027']

export function DateRangePicker({ value = 'All Time', onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] = React.useState(value)
  const [selectedMonth1, setSelectedMonth1] = React.useState('Jul')
  const [selectedYear1, setSelectedYear1] = React.useState('2026')
  const [selectedMonth2, setSelectedMonth2] = React.useState('Aug')
  const [selectedYear2, setSelectedYear2] = React.useState('2026')
  
  const [month1DropdownOpen, setMonth1DropdownOpen] = React.useState(false)
  const [year1DropdownOpen, setYear1DropdownOpen] = React.useState(false)

  const [selectedRangeStart, setSelectedRangeStart] = React.useState<number | null>(14)
  const [selectedRangeEnd, setSelectedRangeEnd] = React.useState<number | null>(28)

  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setMonth1DropdownOpen(false)
        setYear1DropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleApply = () => {
    const finalVal = selectedPreset || `${selectedMonth1} ${selectedRangeStart || 1} – ${selectedMonth2} ${selectedRangeEnd || 28}, ${selectedYear1}`
    onChange?.(finalVal)
    setIsOpen(false)
  }

  const daysMonth1 = [
    null, null, null, null, null, 1, 2,
    3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 28, 29, 30,
    31, null, null, null, null, null, null
  ]

  const daysMonth2 = [
    null, null, null, null, null, null, 1,
    2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29,
    30, 31, null, null, null, null, null
  ]

  return (
    <div className="relative inline-block font-sans" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-[38px] items-center gap-2 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn shadow-2xs"
      >
        <CalendarIcon className="size-4 text-[#6f777f]" />
        <span>{selectedPreset || value}</span>
        <ChevronDown className="size-3.5 text-[#9da4ae]" />
      </button>

      {/* Dual Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 top-[46px] z-50 flex w-[760px] rounded-[12px] border border-[#d3d5d7] bg-white shadow-2xl overflow-visible animate-in fade-in duration-150">
          {/* Left: Presets Column */}
          <div className="w-[180px] border-r border-[#d3d5d7] p-3 space-y-1 bg-[#fcfcfc] shrink-0">
            {presets.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSelectedPreset(item)
                }}
                className={cn(
                  'w-full text-left px-3 py-1.5 rounded-[6px] text-[13px] transition-colors',
                  selectedPreset === item
                    ? 'bg-[#e5f6f7] text-[#00a4ac] font-bold'
                    : 'text-[#1f2327] hover:bg-[#eff1f3]'
                )}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right: Dual Month Calendar View */}
          <div className="flex-1 p-5 space-y-4 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-6">
              {/* Month 1 */}
              <div className="space-y-3">
                {/* Month 1 Controls */}
                <div className="flex items-center justify-between">
                  <button type="button" className="p-1 text-[#6f777f] hover:bg-[#eff1f3] rounded">
                    <ChevronLeft className="size-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Month Picker */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setMonth1DropdownOpen(!month1DropdownOpen)
                          setYear1DropdownOpen(false)
                        }}
                        className="flex items-center gap-1 text-[14px] font-bold text-[#1f2327] hover:text-[#00c2cb]"
                      >
                        <span>{selectedMonth1}</span>
                        <ChevronDown className="size-3 text-[#9da4ae]" />
                      </button>

                      {month1DropdownOpen && (
                        <div className="absolute left-0 top-[26px] z-50 w-[80px] max-h-[160px] overflow-y-auto rounded-[6px] border border-[#d3d5d7] bg-white p-1 shadow-lg space-y-0.5">
                          {months.map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => {
                                setSelectedMonth1(m)
                                setMonth1DropdownOpen(false)
                              }}
                              className={cn(
                                'w-full text-left px-2 py-1 text-xs rounded',
                                selectedMonth1 === m ? 'bg-[#e5f6f7] text-[#00c2cb] font-bold' : 'hover:bg-[#eff1f3]'
                              )}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Year Picker */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setYear1DropdownOpen(!year1DropdownOpen)
                          setMonth1DropdownOpen(false)
                        }}
                        className="flex items-center gap-1 text-[14px] font-bold text-[#1f2327] hover:text-[#00c2cb]"
                      >
                        <span>{selectedYear1}</span>
                        <ChevronDown className="size-3 text-[#9da4ae]" />
                      </button>

                      {year1DropdownOpen && (
                        <div className="absolute left-0 top-[26px] z-50 w-[70px] max-h-[160px] overflow-y-auto rounded-[6px] border border-[#d3d5d7] bg-white p-1 shadow-lg space-y-0.5">
                          {years.map((y) => (
                            <button
                              key={y}
                              type="button"
                              onClick={() => {
                                setSelectedYear1(y)
                                setYear1DropdownOpen(false)
                              }}
                              className={cn(
                                'w-full text-left px-2 py-1 text-xs rounded',
                                selectedYear1 === y ? 'bg-[#e5f6f7] text-[#00c2cb] font-bold' : 'hover:bg-[#eff1f3]'
                              )}
                            >
                              {y}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="size-4" />
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#9da4ae]">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 text-center text-xs gap-y-1">
                  {daysMonth1.map((day, idx) => {
                    if (!day) return <div key={idx} className="size-8" />
                    const isInRange = day >= 14 && day <= 28
                    const isStart = day === 14
                    const isEnd = day === 28

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedRangeStart(day)
                        }}
                        className={cn(
                          'size-8 rounded-full flex items-center justify-center font-medium transition-colors cursor-pointer',
                          isStart || isEnd
                            ? 'bg-[#00c2cb] text-white font-bold'
                            : isInRange
                            ? 'bg-[#e5f6f7] text-[#00a4ac] rounded-none'
                            : 'text-[#1f2327] hover:bg-[#eff1f3]'
                        )}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Month 2 */}
              <div className="space-y-3">
                {/* Month 2 Controls */}
                <div className="flex items-center justify-between">
                  <div className="size-4" />
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#1f2327]">{selectedMonth2}</span>
                    <span className="text-[14px] font-bold text-[#1f2327]">{selectedYear2}</span>
                  </div>
                  <button type="button" className="p-1 text-[#6f777f] hover:bg-[#eff1f3] rounded">
                    <ChevronRight className="size-4" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#9da4ae]">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 text-center text-xs gap-y-1">
                  {daysMonth2.map((day, idx) => {
                    if (!day) return <div key={idx} className="size-8" />
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedRangeEnd(day)
                        }}
                        className="size-8 rounded-full flex items-center justify-center font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#d3d5d7]">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-[36px] px-4 rounded-[8px] border border-[#d3d5d7] bg-white text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="h-[36px] px-5 rounded-[8px] bg-[#00c2cb] text-[14px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
