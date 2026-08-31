'use client'

import * as React from 'react'
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  Check,
  Move,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sliders,
} from 'lucide-react'
import { Flag, getCountryCode } from '@/components/ui/flag'
import { cn } from '@/lib/utils'

interface ProfilePhotoEditorProps {
  currentPhoto?: string
  name: string
  country?: string
  onChange: (photoUrl: string) => void
  className?: string
}

const PRESET_AVATARS = [
  { label: 'Executive Male 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive Male 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive Male 3', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive Male 4', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive Female 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive Female 2', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive Female 3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive Female 4', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80' },
]

export function ProfilePhotoEditor({
  currentPhoto = '',
  name,
  country = 'United Arab Emirates',
  onChange,
  className,
}: ProfilePhotoEditorProps) {
  const [photoUrl, setPhotoUrl] = React.useState(currentPhoto)
  const [zoom, setZoom] = React.useState(100)
  const [offsetY, setOffsetY] = React.useState(0) // -50px (up) to +50px (down)
  const [offsetX, setOffsetX] = React.useState(0) // -50px (left) to +50px (right)
  const [shape, setShape] = React.useState<'rounded' | 'circle' | 'square'>('rounded')
  const [isUrlInputOpen, setIsUrlInputOpen] = React.useState(false)
  const [customUrl, setCustomUrl] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Drag-to-reposition state
  const [isDragging, setIsDragging] = React.useState(false)
  const dragStartPos = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const dragInitialOffset = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  React.useEffect(() => {
    setPhotoUrl(currentPhoto)
  }, [currentPhoto])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        if (result) {
          setPhotoUrl(result)
          onChange(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleApplyPreset = (url: string) => {
    setPhotoUrl(url)
    setOffsetY(0)
    setOffsetX(0)
    setZoom(100)
    onChange(url)
  }

  const handleRemovePhoto = () => {
    setPhotoUrl('')
    setOffsetY(0)
    setOffsetX(0)
    onChange('')
  }

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customUrl.trim()) {
      setPhotoUrl(customUrl.trim())
      setOffsetY(0)
      setOffsetX(0)
      onChange(customUrl.trim())
      setIsUrlInputOpen(false)
    }
  }

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!photoUrl) return
    setIsDragging(true)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    dragInitialOffset.current = { x: offsetX, y: offsetY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !photoUrl) return
    const deltaX = e.clientX - dragStartPos.current.x
    const deltaY = e.clientY - dragStartPos.current.y
    const newY = Math.max(-60, Math.min(60, dragInitialOffset.current.y + deltaY))
    const newX = Math.max(-60, Math.min(60, dragInitialOffset.current.x + deltaX))
    setOffsetY(Math.round(newY))
    setOffsetX(Math.round(newX))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleResetPosition = () => {
    setOffsetY(0)
    setOffsetX(0)
    setZoom(100)
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const shapeClasses = {
    rounded: 'rounded-[16px]',
    circle: 'rounded-full',
    square: 'rounded-[6px]',
  }[shape]

  return (
    <div className={cn('rounded-[14px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 sm:p-5 space-y-4 font-sans shadow-2xs', className)}>
      {/* Header & Shape Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d3d5d7] pb-3">
        <div>
          <h4 className="text-[16px] leading-[24px] font-semibold text-[#1f2327]">Profile Picture, Sizing & Alignment</h4>
          <p className="text-[12px] leading-[16px] text-[#6f777f]">Upload, zoom, pan up/down, and adjust dimensions</p>
        </div>
        <div className="flex items-center gap-1 bg-[#eff1f3] p-0.5 rounded-[8px]">
          <button
            type="button"
            onClick={() => setShape('rounded')}
            className={cn(
              'px-2.5 py-1 text-[12px] leading-[16px] font-semibold rounded-[6px] transition-colors cursor-pointer',
              shape === 'rounded' ? 'bg-white text-[#00c2cb] shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
            )}
          >
            Rounded
          </button>
          <button
            type="button"
            onClick={() => setShape('circle')}
            className={cn(
              'px-2.5 py-1 text-[12px] leading-[16px] font-semibold rounded-[6px] transition-colors cursor-pointer',
              shape === 'circle' ? 'bg-white text-[#00c2cb] shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
            )}
          >
            Circle
          </button>
          <button
            type="button"
            onClick={() => setShape('square')}
            className={cn(
              'px-2.5 py-1 text-[12px] leading-[16px] font-semibold rounded-[6px] transition-colors cursor-pointer',
              shape === 'square' ? 'bg-white text-[#00c2cb] shadow-2xs' : 'text-[#6f777f] hover:text-[#1f2327]'
            )}
          >
            Square
          </button>
        </div>
      </div>

      {/* Main Preview & Controls Row */}
      <div className="flex flex-col sm:flex-row items-center gap-5 bg-white p-4 rounded-[12px] border border-[#d3d5d7] shadow-2xs">
        {/* Interactive Drag & Preview Avatar */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="relative size-28 shrink-0 shadow-md select-none group"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className={cn(
                'size-28 overflow-hidden bg-gradient-to-br from-[#00c2cb] to-[#0a8288] flex items-center justify-center border-2 border-white ring-1 ring-black/10',
                photoUrl ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : '',
                shapeClasses
              )}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  draggable={false}
                  style={{
                    transform: `scale(${zoom / 100}) translate(${offsetX}px, ${offsetY}px)`,
                  }}
                  className="size-full object-cover transition-transform duration-75 pointer-events-none"
                />
              ) : (
                <span className="text-3xl font-bold text-white font-sans">{initials}</span>
              )}
            </div>

            {photoUrl && (
              <div className="absolute inset-0 rounded-[inherit] border-2 border-transparent group-hover:border-[#00c2cb]/50 pointer-events-none transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono transition-opacity">
                  Drag to pan ↕️
                </span>
              </div>
            )}

            <div className="absolute -top-1.5 -left-1.5 z-10">
              <Flag code={getCountryCode(country)} size="m" />
            </div>
          </div>

          {photoUrl && (
            <span className="text-[11px] font-mono text-[#6f777f]">
              Y: {offsetY > 0 ? `+${offsetY}px` : `${offsetY}px`}
            </span>
          )}
        </div>

        {/* Upload & Action Buttons */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-3.5 text-[13px] font-semibold text-white hover:bg-[#00a4ac] transition-colors cursor-pointer shadow-2xs ant-wave-btn"
            >
              <Upload className="size-4" />
              <span>Upload from device</span>
            </button>

            <button
              type="button"
              onClick={() => setIsUrlInputOpen(!isUrlInputOpen)}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            >
              <ImageIcon className="size-4 text-[#6f777f]" />
              <span>Image URL</span>
            </button>

            {photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="flex h-[36px] items-center gap-1 rounded-[8px] border border-rose-200 bg-rose-50 px-2.5 text-[13px] font-medium text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Remove photo and use initials"
              >
                <Trash2 className="size-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* URL Input Form if toggled */}
          {isUrlInputOpen && (
            <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
              <input
                type="url"
                placeholder="Paste image link https://..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 rounded-[8px] border border-[#d3d5d7] px-3 py-1.5 text-xs focus:border-[#00c2cb] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCustomUrlSubmit}
                className="rounded-[8px] bg-[#1f2327] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#333] cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}

          {/* Sizing, Zoom & Vertical Position Sliders */}
          {photoUrl && (
            <div className="space-y-3 pt-2.5 border-t border-[#eff1f3]">
              {/* Vertical Position (Up & Down Slider) */}
              <div className="space-y-1.5 bg-[#f8f9fa] p-2.5 rounded-[8px] border border-[#e5e7eb]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#1f2327]">
                    <Sliders className="size-3.5 text-[#00c2cb]" />
                    <span>تحريك الصورة لأعلى ولأسفل (Vertical Position):</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#00a4ac]">
                    {offsetY < 0 ? `أعلى (${Math.abs(offsetY)}px Up)` : offsetY > 0 ? `أسفل (${offsetY}px Down)` : 'المنتصف (Center)'}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setOffsetY((prev) => Math.max(-50, prev - 5))}
                    className="flex size-7 items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#1f2327] hover:bg-[#00c2cb] hover:text-white transition-colors cursor-pointer shadow-2xs"
                    title="تحريك لأعلى (Move Up)"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>

                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="1"
                    value={offsetY}
                    onChange={(e) => setOffsetY(Number(e.target.value))}
                    className="flex-1 h-2 bg-[#d3d5d7] rounded-lg appearance-none cursor-pointer accent-[#00c2cb]"
                  />

                  <button
                    type="button"
                    onClick={() => setOffsetY((prev) => Math.min(50, prev + 5))}
                    className="flex size-7 items-center justify-center rounded-[6px] border border-[#d3d5d7] bg-white text-[#1f2327] hover:bg-[#00c2cb] hover:text-white transition-colors cursor-pointer shadow-2xs"
                    title="تحريك لأسفل (Move Down)"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPosition}
                    className="flex h-7 items-center gap-1 rounded-[6px] border border-[#d3d5d7] bg-white px-2 text-[11px] font-semibold text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
                    title="إعادة ضبط للمنتصف (Reset Position)"
                  >
                    <RotateCcw className="size-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Zoom & Quick Preset Alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Zoom slider */}
                <div className="flex items-center gap-2 bg-[#f8f9fa] px-2.5 py-1.5 rounded-[8px] border border-[#e5e7eb]">
                  <ZoomOut className="size-3.5 text-[#6f777f] shrink-0" />
                  <input
                    type="range"
                    min="100"
                    max="220"
                    step="5"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-[#d3d5d7] rounded-lg appearance-none cursor-pointer accent-[#00c2cb]"
                  />
                  <ZoomIn className="size-3.5 text-[#6f777f] shrink-0" />
                  <span className="text-[11px] font-mono text-[#1f2327] font-semibold w-10 text-right">{zoom}%</span>
                </div>

                {/* Quick Shortcuts */}
                <div className="flex items-center justify-between gap-1.5 bg-[#f8f9fa] px-2.5 py-1.5 rounded-[8px] border border-[#e5e7eb]">
                  <span className="text-[11px] text-[#6f777f] shrink-0 font-medium">Quick Align:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setOffsetY(-25)}
                      className={cn(
                        'px-2 py-0.5 text-[11px] font-semibold rounded transition-colors cursor-pointer',
                        offsetY === -25 ? 'bg-[#00c2cb] text-white' : 'bg-white border border-[#d3d5d7] text-[#1f2327] hover:bg-[#eff1f3]'
                      )}
                    >
                      Top
                    </button>
                    <button
                      type="button"
                      onClick={() => setOffsetY(0)}
                      className={cn(
                        'px-2 py-0.5 text-[11px] font-semibold rounded transition-colors cursor-pointer',
                        offsetY === 0 ? 'bg-[#00c2cb] text-white' : 'bg-white border border-[#d3d5d7] text-[#1f2327] hover:bg-[#eff1f3]'
                      )}
                    >
                      Center
                    </button>
                    <button
                      type="button"
                      onClick={() => setOffsetY(25)}
                      className={cn(
                        'px-2 py-0.5 text-[11px] font-semibold rounded transition-colors cursor-pointer',
                        offsetY === 25 ? 'bg-[#00c2cb] text-white' : 'bg-white border border-[#d3d5d7] text-[#1f2327] hover:bg-[#eff1f3]'
                      )}
                    >
                      Bottom
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preset Portrait Avatars */}
      <div>
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6f777f] mb-2">
          <Sparkles className="size-3.5 text-[#00c2cb]" />
          <span>نماذج صور جاهزة بجودة فائقة (High-Res Verified Presets):</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {PRESET_AVATARS.map((preset, idx) => {
            const isSelected = photoUrl === preset.url
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.url)}
                className={cn(
                  'relative aspect-square rounded-[8px] overflow-hidden border transition-all cursor-pointer group',
                  isSelected ? 'border-[#00c2cb] ring-2 ring-[#00c2cb]/40 shadow-xs' : 'border-[#d3d5d7] hover:border-[#00c2cb]'
                )}
                title={preset.label}
              >
                <img src={preset.url} alt={preset.label} className="size-full object-cover group-hover:scale-105 transition-transform" />
                {isSelected && (
                  <div className="absolute inset-0 bg-[#00c2cb]/40 flex items-center justify-center">
                    <Check className="size-4 text-white drop-shadow" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
