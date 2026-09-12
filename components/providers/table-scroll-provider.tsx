'use client'

import * as React from 'react'

/**
 * Finds the closest scrollable table container for any given element
 */
function findTableScrollContainer(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null

  // Ignore interactive form controls and editable text
  const tag = target.tagName.toLowerCase()
  if (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable
  ) {
    return null
  }

  // 1. Find nearest table element
  const table = target.closest('table, [role="table"]')
  if (table && table.parentElement) {
    let parent: HTMLElement | null = table.parentElement
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent)
      const overflowX = style.overflowX
      if (
        (overflowX === 'auto' || overflowX === 'scroll') &&
        parent.scrollWidth > parent.clientWidth + 2
      ) {
        return parent
      }
      parent = parent.parentElement
    }
  }

  // 2. Direct container check fallback
  const container = target.closest(
    '.table-scrollbar, [data-table-scroll], .overflow-x-auto'
  ) as HTMLElement | null
  if (container && container.scrollWidth > container.clientWidth + 2) {
    return container
  }

  return null
}

/**
 * TableScrollProvider
 * Enables smooth press-and-drag mouse scrolling and header wheel scrolling
 * for EVERY table in the application, while guaranteeing natural touch momentum
 * on mobile devices.
 */
export function TableScrollProvider({ children }: { children: React.ReactNode }) {
  const isDownRef = React.useRef(false)
  const startXRef = React.useRef(0)
  const startYRef = React.useRef(0)
  const startScrollLeftRef = React.useRef(0)
  const activeContainerRef = React.useRef<HTMLElement | null>(null)
  const hasMovedRef = React.useRef(false)

  React.useEffect(() => {
    // 1. MOUSE DOWN HANDLER
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return // Left-click only

      const container = findTableScrollContainer(e.target)
      if (!container) return

      isDownRef.current = true
      hasMovedRef.current = false
      startXRef.current = e.pageX
      startYRef.current = e.pageY
      startScrollLeftRef.current = container.scrollLeft
      activeContainerRef.current = container

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDownRef.current || !activeContainerRef.current) return

        const dx = moveEvent.pageX - startXRef.current
        const dy = moveEvent.pageY - startYRef.current

        // Must move more than 4px and be primarily horizontal
        if (!hasMovedRef.current) {
          if (Math.abs(dx) > 4 && Math.abs(dx) >= Math.abs(dy)) {
            hasMovedRef.current = true
            activeContainerRef.current.classList.add('table-is-dragging')
            document.body.style.userSelect = 'none'
          }
        }

        if (hasMovedRef.current) {
          moveEvent.preventDefault()
          activeContainerRef.current.scrollLeft = startScrollLeftRef.current - dx
        }
      }

      const handleMouseUp = () => {
        isDownRef.current = false
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''

        if (activeContainerRef.current) {
          activeContainerRef.current.classList.remove('table-is-dragging')
          activeContainerRef.current = null
        }

        if (hasMovedRef.current) {
          // Intercept and swallow next click event so dragging does not trigger buttons/links
          const captureClick = (clickEvent: MouseEvent) => {
            clickEvent.stopPropagation()
            clickEvent.preventDefault()
            window.removeEventListener('click', captureClick, true)
          }
          window.addEventListener('click', captureClick, true)
          setTimeout(() => {
            window.removeEventListener('click', captureClick, true)
            hasMovedRef.current = false
          }, 80)
        }
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    // 2. WHEEL HANDLER (Horizontal scroll on Shift or table header)
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement
      if (!target) return
      const container = findTableScrollContainer(target)
      if (!container) return

      // Shift + Wheel: scroll horizontally
      if (e.shiftKey && e.deltaY !== 0 && e.deltaX === 0) {
        e.preventDefault()
        container.scrollLeft += e.deltaY * 1.1
        return
      }

      // Cursor over thead (table header) or tfoot
      const isHeaderOrFooter = !!target.closest('thead, tfoot')
      if (isHeaderOrFooter && e.deltaY !== 0 && e.deltaX === 0) {
        e.preventDefault()
        container.scrollLeft += e.deltaY * 1.1
        return
      }
    }

    document.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return <>{children}</>
}
