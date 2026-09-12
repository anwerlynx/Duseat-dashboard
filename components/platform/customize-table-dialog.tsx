'use client'

import * as React from 'react'
import {
  Search,
  ChevronDown,
  ChevronUp,
  X,
  GripVertical,
  Check,
  Minimize2,
  Maximize2,
  RotateCcw,
  Bookmark,
  Plus,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ColumnCategory {
  id: string
  name: string
  items: { id: string; label: string }[]
}

export interface TableViewPreset {
  id: string
  name: string
  columns: string[]
  isBuiltIn?: boolean
}

export const defaultTablePresets: TableViewPreset[] = [
  {
    id: 'default',
    name: 'Default Overview',
    columns: [
      'Name',
      'Agency',
      'RERA Number',
      'License',
      'Subscription',
      'Rating',
      'Offers',
      'Accepted Offers',
      'Revenue',
      'Last Login',
    ],
    isBuiltIn: true,
  },
  {
    id: 'compliance',
    name: 'Compliance & RERA',
    columns: [
      'Name',
      'Agency',
      'RERA Number',
      'Verification Status',
      'Verification Type',
      'License',
      'License Expiry',
      'Join Date',
    ],
    isBuiltIn: true,
  },
  {
    id: 'deals-performance',
    name: 'Deals & Performance',
    columns: [
      'Name',
      'Agency',
      'Total Deals',
      'Active Deals',
      'Offers',
      'Accepted Offers',
      'Success Rate',
      'Rating',
      'Revenue',
    ],
    isBuiltIn: true,
  },
  {
    id: 'contact-location',
    name: 'Contact & Location',
    columns: [
      'Name',
      'Email',
      'Phone',
      'Agency',
      'Country',
      'City',
      'Role',
      'Status',
      'Last Active',
    ],
    isBuiltIn: true,
  },
  {
    id: 'financials-engagement',
    name: 'Financials & Engagement',
    columns: [
      'Name',
      'Agency',
      'Subscription',
      'Revenue',
      'Total Deals',
      'Total Requests',
      'Active Conversations',
      'Response Rate',
      'Average Response Time',
    ],
    isBuiltIn: true,
  },
]

export const defaultColumnCategories: ColumnCategory[] = [
  {
    id: 'general',
    name: 'General',
    items: [
      { id: 'ID', label: 'ID' },
      { id: 'Name', label: 'Name' },
      { id: 'Email', label: 'Email' },
      { id: 'Phone', label: 'Phone' },
      { id: 'Agency', label: 'Agency' },
      { id: 'Country', label: 'Country' },
      { id: 'City', label: 'City' },
      { id: 'Role', label: 'Role' },
      { id: 'Status', label: 'Account Status' },
    ],
  },
  {
    id: 'performance',
    name: 'Performance',
    items: [
      { id: 'Rating', label: 'Rating' },
      { id: 'Offers', label: 'Offers' },
      { id: 'Accepted Offers', label: 'Accepted Offers' },
      { id: 'Active Deals', label: 'Active Deals' },
      { id: 'Total Deals', label: 'Total Deals' },
      { id: 'Success Rate', label: 'Success Rate' },
    ],
  },
  {
    id: 'activity',
    name: 'Activity',
    items: [
      { id: 'Join Date', label: 'Join Date' },
      { id: 'Last Login', label: 'Last Login' },
      { id: 'Last Active', label: 'Last Active' },
    ],
  },
  {
    id: 'verification',
    name: 'Verification',
    items: [
      { id: 'Verification Status', label: 'Verification Status' },
      { id: 'Verification Type', label: 'Verification Type' },
      { id: 'License', label: 'License Status' },
      { id: 'RERA Number', label: 'RERA ID' },
      { id: 'License Expiry', label: 'License Expiry' },
      { id: 'Verified Date', label: 'Verified Date' },
    ],
  },
  {
    id: 'engagement',
    name: 'Engagement',
    items: [
      { id: 'Revenue', label: 'Revenue' },
      { id: 'Subscription', label: 'Subscription' },
      { id: 'Total Requests', label: 'Total Requests' },
      { id: 'Active Conversations', label: 'Active Conversations' },
      { id: 'Response Rate', label: 'Response Rate' },
      { id: 'Average Response Time', label: 'Average Response Time' },
      { id: 'Completed Deals', label: 'Completed Deals' },
    ],
  },
]

interface CustomizeTableDialogProps {
  isOpen: boolean
  visibleColumns: string[]
  onApply: (columns: string[], activePresetId?: string) => void
  onClose: () => void
  categories?: ColumnCategory[]
  storageKeyPrefix?: string
  activePresetId?: string
  presets?: TableViewPreset[]
  onPresetsChange?: (presets: TableViewPreset[]) => void
}

export function CustomizeTableDialog({
  isOpen,
  visibleColumns: initialVisible,
  onApply,
  onClose,
  categories = defaultColumnCategories,
  storageKeyPrefix = 'agents',
  activePresetId: initialActivePresetId,
  presets: externalPresets,
  onPresetsChange,
}: CustomizeTableDialogProps) {
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(initialVisible)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [collapsedCategories, setCollapsedCategories] = React.useState<Record<string, boolean>>({})
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null)

  // Templates Management State
  const storageKey = `duseat_table_presets_${storageKeyPrefix}`
  const [presets, setPresets] = React.useState<TableViewPreset[]>(() => {
    if (externalPresets && externalPresets.length > 0) return externalPresets
    return defaultTablePresets
  })
  const [currentPresetId, setCurrentPresetId] = React.useState<string>(
    initialActivePresetId || 'default'
  )
  const [isCreating, setIsCreating] = React.useState(false)
  const [newTemplateName, setNewTemplateName] = React.useState('')

  // Load custom saved presets from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const base = externalPresets && externalPresets.length > 0 ? externalPresets : defaultTablePresets
          const merged = [...base, ...parsed.filter((p: TableViewPreset) => !base.some((b) => b.id === p.id))]
          setPresets(merged)
        }
      }
    } catch {}
  }, [storageKey, externalPresets])

  React.useEffect(() => {
    setSelectedColumns(initialVisible)
  }, [initialVisible, isOpen])

  React.useEffect(() => {
    if (initialActivePresetId) {
      setCurrentPresetId(initialActivePresetId)
    }
  }, [initialActivePresetId])

  if (!isOpen) return null

  const allCollapsed = categories.every((cat) => collapsedCategories[cat.id])

  const toggleCollapseAll = () => {
    if (allCollapsed) {
      setCollapsedCategories({})
    } else {
      const next: Record<string, boolean> = {}
      categories.forEach((cat) => {
        next[cat.id] = true
      })
      setCollapsedCategories(next)
    }
  }

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }))
  }

  const handleToggleColumn = (colName: string) => {
    setSelectedColumns((prev) => {
      const next = prev.includes(colName) ? prev.filter((c) => c !== colName) : [...prev, colName]
      setCurrentPresetId('custom')
      return next
    })
  }

  const handleRemoveColumn = (colName: string) => {
    setSelectedColumns((prev) => {
      const next = prev.filter((c) => c !== colName)
      setCurrentPresetId('custom')
      return next
    })
  }

  const handleReset = () => {
    const defaultPreset = presets.find((p) => p.id === 'default') || presets[0]
    setSelectedColumns(defaultPreset.columns)
    setCurrentPresetId(defaultPreset.id)
    setFeedbackMsg('Columns reset to Default Overview')
    setTimeout(() => setFeedbackMsg(null), 2500)
  }

  const handleSelectPreset = (preset: TableViewPreset) => {
    setCurrentPresetId(preset.id)
    setSelectedColumns(preset.columns)
    setFeedbackMsg(`Loaded "${preset.name}" layout (${preset.columns.length} columns)`)
    setTimeout(() => setFeedbackMsg(null), 2500)
  }

  const handleSaveNewPreset = () => {
    const trimmed = newTemplateName.trim()
    if (!trimmed) return

    const newPreset: TableViewPreset = {
      id: `custom-${Date.now()}`,
      name: trimmed,
      columns: [...selectedColumns],
      isBuiltIn: false,
    }

    const nextPresets = [...presets, newPreset]
    setPresets(nextPresets)
    setCurrentPresetId(newPreset.id)
    setIsCreating(false)
    setNewTemplateName('')

    try {
      const customOnly = nextPresets.filter((p) => !p.isBuiltIn)
      localStorage.setItem(storageKey, JSON.stringify(customOnly))
    } catch {}

    onPresetsChange?.(nextPresets)
    setFeedbackMsg(`Template "${trimmed}" saved successfully`)
    setTimeout(() => setFeedbackMsg(null), 2500)
  }

  const handleDeletePreset = (presetId: string) => {
    const target = presets.find((p) => p.id === presetId)
    if (!target || target.isBuiltIn) return

    const nextPresets = presets.filter((p) => p.id !== presetId)
    setPresets(nextPresets)

    if (currentPresetId === presetId) {
      const fallback = nextPresets[0]
      setCurrentPresetId(fallback.id)
      setSelectedColumns(fallback.columns)
    }

    try {
      const customOnly = nextPresets.filter((p) => !p.isBuiltIn)
      localStorage.setItem(storageKey, JSON.stringify(customOnly))
    } catch {}

    onPresetsChange?.(nextPresets)
    setFeedbackMsg(`Template "${target.name}" deleted`)
    setTimeout(() => setFeedbackMsg(null), 2500)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) return

    const reordered = [...selectedColumns]
    const [movedItem] = reordered.splice(draggedIndex, 1)
    reordered.splice(targetIndex, 0, movedItem)
    setDraggedIndex(targetIndex)
    setSelectedColumns(reordered)
    setCurrentPresetId('custom')
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-table-title"
    >
      <div className="relative w-full max-w-[960px] h-[86vh] max-h-[720px] min-h-[520px] rounded-[12px] border border-[#d3d5d7] bg-white p-6 shadow-2xl flex flex-col gap-3.5 font-sans">
        {/* Modal Header */}
        <div className="shrink-0 flex items-start justify-between">
          <div className="space-y-0.5">
            <h2 id="customize-table-title" className="text-[20px] font-semibold text-[#1f2327]">
              Customize Table
            </h2>
            <p className="text-[14px] text-[#6f777f]">
              Choose which columns appear in the table, switch between saved templates, or save your custom view.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] p-1.5 text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Templates Bar */}
        <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1 modal-scrollbar select-none">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6f777f] shrink-0 mr-1">
            <Bookmark className="size-3.5 text-[#00c2cb]" />
            <span>Templates:</span>
          </div>

          {presets.map((preset) => {
            const isActive = currentPresetId === preset.id
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={cn(
                  'group flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium transition-all shrink-0 cursor-pointer',
                  isActive
                    ? 'bg-[#1f2327] border-[#1f2327] text-white shadow-2xs'
                    : 'border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                )}
              >
                <span>{preset.name}</span>
                {!preset.isBuiltIn && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeletePreset(preset.id)
                    }}
                    className={cn(
                      'rounded-full p-0.5 transition-colors cursor-pointer ml-0.5',
                      isActive ? 'hover:bg-white/20 text-white/70 hover:text-white' : 'hover:bg-rose-100 text-rose-500'
                    )}
                    title="Delete template"
                    aria-label={`Delete ${preset.name}`}
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>
            )
          })}

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 rounded-full border border-dashed border-[#00c2cb] px-2.5 py-1 text-[12px] font-medium text-[#00c2cb] hover:bg-[#00c2cb]/10 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="size-3" />
            <span>New Template</span>
          </button>
        </div>

        {feedbackMsg && (
          <div className="shrink-0 rounded-[6px] bg-[#dfefe8] border border-[#9cdabd] px-3 py-1.5 text-xs font-medium text-[#17b26a] flex items-center gap-2">
            <Check className="size-3.5" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Content Body: Two Columns (Left Categories, Right Order) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-hidden">
          {/* Left Panel: 7 Cols */}
          <div className="md:col-span-7 flex flex-col min-h-0 h-full">
            {/* Search Bar & Collapse Button */}
            <div className="shrink-0 flex items-center gap-2.5 pb-3">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3 size-4 text-[#9da4ae] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search columns..."
                  className="w-full h-[38px] rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] text-[#1f2327] placeholder:text-[#9da4ae] outline-none focus:border-[#00c2cb] focus:ring-1 focus:ring-[#00c2cb]"
                />
              </div>
              <button
                type="button"
                onClick={toggleCollapseAll}
                className="h-[38px] px-3 rounded-[6px] border border-[#d3d5d7] bg-white text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ant-wave-btn"
              >
                {allCollapsed ? <Maximize2 className="size-3.5 text-[#6f777f]" /> : <Minimize2 className="size-3.5 text-[#6f777f]" />}
                <span>{allCollapsed ? 'Expand All' : 'Collapse All'}</span>
              </button>
            </div>

            {/* Accordion Categories */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-6 space-y-3 modal-scrollbar">
              {filteredCategories.map((category) => {
                const isCollapsed = !!collapsedCategories[category.id]
                const selectedInCat = category.items.filter((i) => selectedColumns.includes(i.id)).length
                const totalInCat = category.items.length

                return (
                  <div
                    key={category.id}
                    className="rounded-[9px] bg-[#e5f6f7] p-3 space-y-2.5 border border-[#c7ecee]"
                  >
                    {/* Category Header */}
                    <div
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center justify-between cursor-pointer select-none"
                    >
                      <div>
                        <p className="text-[16px] leading-[24px] font-semibold text-[#1f2327]">{category.name}</p>
                        <p className="text-[12px] leading-[16px] text-[#6f777f]">
                          {selectedInCat} / {totalInCat} Selected
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded p-1 text-[#1f2327] hover:bg-[#c7ecee]/50 transition-colors"
                        aria-label={`Toggle ${category.name}`}
                      >
                        {isCollapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
                      </button>
                    </div>

                    {/* Category Checkboxes Grid (White card) */}
                    {!isCollapsed && (
                      <div className="rounded-[8px] bg-white p-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border border-[#d3d5d7]/50 animate-in fade-in duration-150">
                        {category.items.map((item) => {
                          const isChecked = selectedColumns.includes(item.id)
                          return (
                            <label
                              key={item.id}
                              className="flex items-center gap-2.5 cursor-pointer select-none text-[14px] text-[#1f2327] hover:text-[#00c2cb] transition-colors"
                            >
                              <div
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleToggleColumn(item.id)
                                }}
                                className={cn(
                                  'flex size-5 items-center justify-center rounded-[4px] border transition-colors shrink-0',
                                  isChecked
                                    ? 'bg-[#00c2cb] border-[#00c2cb] text-white'
                                    : 'border-[#90969c] bg-white hover:border-[#00c2cb]'
                                )}
                              >
                                {isChecked && <Check className="size-3.5 stroke-[3]" />}
                              </div>
                              <span className="truncate">{item.label}</span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}

              {filteredCategories.length === 0 && (
                <div className="p-8 text-center bg-[#f8f9fa] rounded-[8px] border border-dashed border-[#d3d5d7]">
                  <p className="text-sm font-medium text-[#1f2327]">No columns match "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: 5 Cols (Column Order) */}
          <div className="md:col-span-5 flex flex-col min-h-0 h-full border-t md:border-t-0 md:border-l border-[#d3d5d7] pt-4 md:pt-0 md:pl-5">
            <div className="shrink-0 space-y-1 pb-3">
              <h3 className="text-[18px] font-semibold text-[#1f2327]">Column Order</h3>
              <p className="text-[14px] font-medium text-[#1f2327]">{selectedColumns.length} columns selected</p>
              <p className="text-[12px] text-[#6f777f] leading-snug">
                Drag and drop to arrange columns as they'll appear in the table.
              </p>
            </div>

            <div className="flex-1 min-h-0 flex flex-col rounded-[8px] border border-[#d3d5d7] bg-white overflow-hidden shadow-2xs">
              <div className="shrink-0 bg-[#f8f9fa] border-b border-[#d3d5d7] px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#1f2327]">Visible Columns</span>
                <span className="text-[12px] font-medium text-[#6f777f]">{selectedColumns.length} items</span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#d3d5d7] modal-scrollbar pr-1 pb-2">
                {selectedColumns.map((col, index) => (
                  <div
                    key={col}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 bg-white transition-colors select-none text-[14px]',
                      draggedIndex === index ? 'opacity-40 bg-[#eff1f3]' : 'hover:bg-[#f8f9fa]'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <GripVertical className="size-4 text-[#9da4ae] cursor-grab active:cursor-grabbing shrink-0" />
                      <span className="truncate font-medium text-[#1f2327]">{col}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveColumn(col)}
                      className="p-1 text-[#9da4ae] hover:text-[#f04438] hover:bg-[#fee4e2] rounded transition-colors cursor-pointer shrink-0"
                      aria-label={`Remove ${col}`}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}

                {selectedColumns.length === 0 && (
                  <div className="p-6 text-center text-xs text-[#6f777f]">
                    No columns selected. Check items on the left to add.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {isCreating ? (
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#d3d5d7] bg-white animate-in fade-in duration-150">
            <div className="flex items-center gap-2 flex-1 max-w-lg">
              <span className="text-[13px] font-semibold text-[#1f2327] shrink-0">Template Name:</span>
              <input
                type="text"
                autoFocus
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="e.g. Compliance & Audits..."
                className="h-[36px] flex-1 rounded-[8px] border border-[#d3d5d7] px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb] focus:ring-1 focus:ring-[#00c2cb]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveNewPreset()
                  if (e.key === 'Escape') {
                    setIsCreating(false)
                    setNewTemplateName('')
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSaveNewPreset}
                disabled={!newTemplateName.trim()}
                className="h-[36px] px-4 rounded-[8px] bg-[#00c2cb] text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer shrink-0"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false)
                  setNewTemplateName('')
                }}
                className="h-[36px] px-3 rounded-[8px] border border-[#d3d5d7] text-[13px] text-[#6f777f] hover:bg-[#eff1f3] cursor-pointer shrink-0"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onApply(selectedColumns, currentPresetId)
                  onClose()
                }}
                className="h-[36px] px-5 rounded-[8px] bg-[#1f2327] text-[14px] font-bold text-white hover:bg-[#2e3338] transition-colors cursor-pointer shadow-2xs"
              >
                Apply
              </button>
            </div>
          </div>
        ) : (
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#d3d5d7] bg-white">
            {/* Bottom Left Buttons: Reset & Save as Template */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleReset}
                className="h-[36px] px-3.5 rounded-[8px] border border-[#d3d5d7] bg-white text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn flex items-center gap-1.5"
              >
                <RotateCcw className="size-3.5 text-[#6f777f]" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="h-[36px] px-3.5 rounded-[8px] border border-[#d3d5d7] bg-white text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn flex items-center gap-1.5"
              >
                <Bookmark className="size-3.5 text-[#00c2cb]" />
                <span>Save as Template</span>
              </button>
            </div>

            {/* Bottom Right Buttons: Cancel & Apply */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="h-[36px] px-4 rounded-[8px] border border-[#d3d5d7] bg-white text-[14px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onApply(selectedColumns, currentPresetId)
                  onClose()
                }}
                className="h-[36px] px-5 rounded-[8px] bg-[#00c2cb] text-[14px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer ant-wave-btn shadow-2xs"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

