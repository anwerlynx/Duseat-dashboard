'use client'

import * as React from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion'
import { cn } from '@/lib/utils'

export interface DockItemData {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  href?: string
  active?: boolean
  badge?: string | number
  className?: string
}

export interface DockProps {
  items: DockItemData[]
  className?: string
  panelHeight?: number
  baseItemSize?: number
  magnification?: number
  distance?: number
  spring?: {
    mass?: number
    stiffness?: number
    damping?: number
  }
}

interface DockItemProps {
  item: DockItemData
  mouseX: MotionValue<number>
  baseItemSize: number
  magnification: number
  distance: number
  spring?: {
    mass?: number
    stiffness?: number
    damping?: number
  }
}

function DockItem({
  item,
  mouseX,
  baseItemSize,
  magnification,
  distance,
  spring = { mass: 0.1, stiffness: 160, damping: 14 },
}: DockItemProps) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - (bounds.x + bounds.width / 2)
  })

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  )

  const width = useSpring(widthSync, spring)

  const iconScale = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [1, 1.28, 1]
  )
  const animatedScale = useSpring(iconScale, spring)

  return (
    <div className="relative flex items-center justify-center">
      {/* Tooltip on hover / touch */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-lg bg-[#202428] px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg border border-white/10 backdrop-blur-md"
          >
            {item.label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#202428]" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        type="button"
        style={{ width, height: width }}
        onClick={item.onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsHovered(false), 800)
        }}
        whileTap={{ scale: 0.9 }}
        aria-label={item.label}
        className={cn(
          'group relative flex items-center justify-center rounded-2xl transition-colors cursor-pointer select-none outline-none',
          item.active
            ? 'bg-[#00c2cb] text-white shadow-[0_4px_16px_rgba(0,194,203,0.35)]'
            : 'bg-white/90 dark:bg-[#202428]/90 text-[#434B53] dark:text-[#E2E5E8] hover:bg-[#F0F2F4] hover:text-[#202428] border border-[#E2E5E8]/80 dark:border-white/10 shadow-xs',
          item.className
        )}
      >
        <motion.div
          style={{ scale: animatedScale }}
          className="flex items-center justify-center shrink-0 transition-transform"
        >
          {item.icon}
        </motion.div>

        {/* Active indicator dot under icon */}
        {item.active && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-white shadow-xs" />
        )}

        {/* Badge counter or notification pill */}
        {item.badge !== undefined && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#EA3829] px-1 text-[9px] font-bold text-white shadow-xs">
            {item.badge}
          </span>
        )}
      </motion.button>
    </div>
  )
}

export function Dock({
  items = [],
  className,
  panelHeight = 68,
  baseItemSize = 50,
  magnification = 70,
  distance = 140,
  spring,
}: DockProps) {
  const mouseX = useMotionValue(Infinity)

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.pageX)
  }

  const handleMouseLeave = () => {
    mouseX.set(Infinity)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      mouseX.set(e.touches[0].pageX)
    }
  }

  const handleTouchEnd = () => {
    setTimeout(() => mouseX.set(Infinity), 300)
  }

  return (
    <motion.nav
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ height: panelHeight }}
      aria-label="Bottom Dock Navigation"
      className={cn(
        'relative flex items-center justify-center gap-2 rounded-3xl border border-[#E2E5E8]/90 dark:border-white/15 bg-white/80 dark:bg-[#181B1E]/85 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.14)] backdrop-blur-2xl transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)] font-sans',
        className
      )}
    >
      {items.map((item, index) => (
        <DockItem
          key={`${item.label}-${index}`}
          item={item}
          mouseX={mouseX}
          baseItemSize={baseItemSize}
          magnification={magnification}
          distance={distance}
          spring={spring}
        />
      ))}
    </motion.nav>
  )
}

export default Dock
