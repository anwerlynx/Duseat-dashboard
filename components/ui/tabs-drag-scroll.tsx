'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// =============================================================================
// HOOK: useDragScroll
// Provides mouse press-and-drag horizontal scrolling, wheel translation,
// boundary detection, and accidental click prevention after dragging.
// =============================================================================

export interface UseDragScrollOptions {
  multiplier?: number
  enableWheel?: boolean
}

export function useDragScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseDragScrollOptions = {}
) {
  const { multiplier = 1.3, enableWheel = true } = options
  const ref = React.useRef<T | null>(null)

  const [isDragging, setIsDragging] = React.useState(false)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const isDownRef = React.useRef(false)
  const startXRef = React.useRef(0)
  const scrollLeftRef = React.useRef(0)
  const hasMovedRef = React.useRef(false)
  const dragTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const checkScrollability = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
  }, [])

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    checkScrollability()
    const handleResize = () => checkScrollability()
    window.addEventListener('resize', handleResize)

    const observer = new ResizeObserver(checkScrollability)
    observer.observe(el)

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current)
    }
  }, [checkScrollability])

  // Horizontal wheel scrolling
  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      if (!enableWheel) return
      const el = ref.current
      if (!el) return
      if (el.scrollWidth <= el.clientWidth) return

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY * 0.9
        checkScrollability()
      }
    },
    [enableWheel, checkScrollability]
  )

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current
      if (!el) return
      if (e.button !== 0) return // Left click only

      isDownRef.current = true
      hasMovedRef.current = false
      startXRef.current = e.pageX
      scrollLeftRef.current = el.scrollLeft

      const handleGlobalMouseMove = (moveEvent: MouseEvent) => {
        if (!isDownRef.current || !ref.current) return
        const dx = moveEvent.pageX - startXRef.current

        if (Math.abs(dx) > 4) {
          if (!hasMovedRef.current) {
            hasMovedRef.current = true
            setIsDragging(true)
          }
          moveEvent.preventDefault()
          ref.current.scrollLeft = scrollLeftRef.current - dx * multiplier
          checkScrollability()
        }
      }

      const handleGlobalMouseUp = () => {
        isDownRef.current = false
        window.removeEventListener('mousemove', handleGlobalMouseMove)
        window.removeEventListener('mouseup', handleGlobalMouseUp)

        if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current)
        // Keep hasMovedRef true for a tiny window so onClickCapture catches and stops the click
        dragTimeoutRef.current = setTimeout(() => {
          hasMovedRef.current = false
          setIsDragging(false)
        }, 60)
      }

      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('mouseup', handleGlobalMouseUp)
    },
    [multiplier, checkScrollability]
  )

  const onClickCapture = React.useCallback((e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.stopPropagation()
      e.preventDefault()
    }
  }, [])

  const scrollByAmount = React.useCallback(
    (amount: number) => {
      const el = ref.current
      if (!el) return
      el.scrollBy({ left: amount, behavior: 'smooth' })
      setTimeout(checkScrollability, 320)
    },
    [checkScrollability]
  )

  const scrollLeft = React.useCallback(() => scrollByAmount(-260), [scrollByAmount])
  const scrollRight = React.useCallback(() => scrollByAmount(260), [scrollByAmount])

  return {
    ref,
    isDragging,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    checkScrollability,
    containerProps: {
      ref,
      onMouseDown,
      onClickCapture,
      onWheel,
      onScroll: checkScrollability,
    },
  }
}

// =============================================================================
// COMPONENT: ScrollableTabsBar
// Beautiful, accessible wrapper with left/right fade gradients, navigation
// arrow buttons, and drag-and-press mouse scrolling.
// =============================================================================

export interface ScrollableTabsBarProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  showArrows?: boolean
}

export function ScrollableTabsBar({
  children,
  className,
  innerClassName,
  showArrows = true,
}: ScrollableTabsBarProps) {
  const {
    containerProps,
    isDragging,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  } = useDragScroll<HTMLDivElement>()

  return (
    <div className={cn('relative min-w-0 max-w-full flex-1 group/tabs', className)}>
      {/* Left Scroll Chevron & Gradient */}
      {showArrows && canScrollLeft && (
        <>
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/90 to-transparent z-10 transition-opacity duration-200"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-[#d3d5d7] shadow-sm text-[#1f2327] hover:bg-[#eff1f3] active:scale-95 transition-all cursor-pointer"
            aria-label="Scroll left"
            title="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </button>
        </>
      )}

      {/* Right Scroll Chevron & Gradient */}
      {showArrows && canScrollRight && (
        <>
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/90 to-transparent z-10 transition-opacity duration-200"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-[#d3d5d7] shadow-sm text-[#1f2327] hover:bg-[#eff1f3] active:scale-95 transition-all cursor-pointer"
            aria-label="Scroll right"
            title="Scroll right"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}

      {/* Horizontal Tabs Container */}
      <div
        {...containerProps}
        className={cn(
          'flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 select-none',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}
