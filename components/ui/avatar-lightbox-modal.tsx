'use client'

import * as React from 'react'
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react'
import { Flag, getCountryCode } from './flag'

export interface AvatarLightboxProps {
  isOpen: boolean
  onClose: () => void
  src?: string | null
  name?: string | null
  country?: string | null
  countryCode?: string | null
  subtitle?: string | null
}

export function AvatarLightboxModal({
  isOpen,
  onClose,
  src,
  name = 'User Avatar',
  country,
  countryCode,
  subtitle,
}: AvatarLightboxProps) {
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [isDownloading, setIsDownloading] = React.useState(false)

  // Reset zoom & rotation whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setRotation(0)
      setIsDownloading(false)
    }
  }, [isOpen])

  // ESC key to close
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const resolvedCode = countryCode || (country ? getCountryCode(country) : null)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  // Robust cross-origin image download handler
  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const safeName = (name || 'user_avatar').replace(/[^a-z0-9]/gi, '_').toLowerCase()

      if (src) {
        // Try fetching blob to bypass cross-origin browser opening
        const res = await fetch(src)
        const blob = await res.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `${safeName}_avatar.jpg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(blobUrl)
      } else {
        // Generate high-res avatar image with initials if no image exists
        const canvas = document.createElement('canvas')
        canvas.width = 400
        canvas.height = 400
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = '#00c2cb'
          ctx.fillRect(0, 0, 400, 400)
          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 160px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const initials = (name || 'U')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
          ctx.fillText(initials, 200, 200)

          const dataUrl = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = dataUrl
          a.download = `${safeName}_avatar.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      }
    } catch {
      // Direct fallback if fetch fails due to CORS
      if (src) {
        const a = document.createElement('a')
        a.href = src
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.download = `${(name || 'avatar').replace(/\s+/g, '_')}.jpg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 font-sans"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center max-w-lg w-full rounded-[20px] bg-[#1f2327] border border-white/10 shadow-2xl p-6 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex w-full items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            {resolvedCode && (
              <Flag code={resolvedCode} size="m" className="rounded-[3px] shadow-xs shrink-0" />
            )}
            <div className="min-w-0">
              <h3 className="text-[16px] font-bold truncate text-white leading-tight">
                {name || 'User Photo'}
              </h3>
              {subtitle && (
                <p className="text-[12px] text-white/60 truncate mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            aria-label="Close image viewer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Central Image Canvas */}
        <div className="relative my-6 flex items-center justify-center w-full min-h-[280px] max-h-[420px] rounded-[16px] bg-black/40 border border-white/5 overflow-hidden p-4 select-none">
          {src ? (
            <img
              src={src}
              alt={name || 'User avatar'}
              className="max-h-[360px] max-w-full object-contain rounded-[12px] shadow-lg transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />
          ) : (
            <div
              className="flex size-44 items-center justify-center rounded-full bg-gradient-to-br from-[#00c2cb] to-[#0a8288] text-white font-bold text-5xl shadow-2xl tracking-wider transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            >
              {(name || 'U')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex w-full flex-wrap items-center justify-between gap-3 pt-2">
          {/* Zoom & Rotation Controls */}
          <div className="flex items-center gap-1.5 rounded-[10px] bg-white/10 p-1 border border-white/5">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="flex size-8 items-center justify-center rounded-[8px] text-white/80 hover:bg-white/15 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="text-[12px] font-mono px-1 text-white/70 min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="flex size-8 items-center justify-center rounded-[8px] text-white/80 hover:bg-white/15 hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="size-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/20 mx-0.5" />
            <button
              type="button"
              onClick={handleRotate}
              className="flex size-8 items-center justify-center rounded-[8px] text-white/80 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              title="Rotate 90 degrees"
            >
              <RotateCw className="size-4" />
            </button>
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex h-[38px] items-center gap-2 rounded-[10px] bg-[#00c2cb] px-4 text-[13.5px] font-bold text-white shadow-md hover:bg-[#00a8b0] active:scale-95 transition-all cursor-pointer ant-wave-btn disabled:opacity-60"
          >
            <Download className="size-4" />
            <span>{isDownloading ? 'Downloading...' : 'Download Image'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
