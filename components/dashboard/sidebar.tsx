'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Users,
  BadgeCheck,
  FileText,
  ScrollText,
  Handshake,
  MessageSquare,
  ShieldAlert,
  Bell,
  Menu,
  Settings,
  Headphones,
  History,
  Briefcase,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip } from './primitives'

type NavChild = { label: string; id: string }
type NavItem = { label: string; icon: LucideIcon; id: string; children?: NavChild[] }

const mainNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Users', icon: Users, id: 'users', children: [{ label: 'Investors', id: 'investors' }, { label: 'Agents', id: 'agents' }] },
  { label: 'Verification center', icon: BadgeCheck, id: 'verification' },
  { label: 'Requests', icon: FileText, id: 'requests' },
  { label: 'Offers', icon: ScrollText, id: 'offers' },
  { label: 'Deals', icon: Handshake, id: 'deals' },
  { label: 'Conversations', icon: MessageSquare, id: 'conversations' },
  { label: 'Reports and moderation', icon: ShieldAlert, id: 'reports' },
  { label: 'Notifications', icon: Bell, id: 'notifications' },
  { label: 'All Tools', icon: Menu, id: 'tools' },
]

const bottomNav: NavItem[] = [
  { label: 'Settings', icon: Settings, id: 'settings' },
  { label: 'Support center', icon: Headphones, id: 'support' },
  { label: 'Activity log', icon: History, id: 'activity' },
  { label: 'Admin management', icon: Briefcase, id: 'admin' },
]

interface SidebarProps {
  collapsed: boolean
  active: string
  onNavigate: (id: string, label: string) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ collapsed: collapsedProp, active, onNavigate, mobileOpen, onMobileClose }: SidebarProps) {
  const [openGroups, setOpenGroups] = React.useState<string[]>(['users'])
  const [isDesktop, setIsDesktop] = React.useState(true)

  React.useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const collapsed = isDesktop && collapsedProp

  const renderItem = (item: NavItem) => {
    const Icon = item.icon
    const childActive = item.children?.some((child) => child.id === active)
    const isActive = active === item.id || childActive
    const isOpen = openGroups.includes(item.id)

    const button = (
      <button
        type="button"
        onClick={() => {
          if (item.children) {
            setOpenGroups((items) =>
              items.includes(item.id) ? items.filter((id) => id !== item.id) : [...items, item.id]
            )
          } else {
            onNavigate(item.id, item.label)
          }
        }}
        aria-current={active === item.id ? 'page' : undefined}
        aria-expanded={item.children ? isOpen : undefined}
        className={cn(
          'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition-all font-sans cursor-pointer',
          collapsed && 'justify-center px-0 size-10 mx-auto',
          isActive
            ? 'bg-primary text-primary-foreground shadow-2xs font-semibold'
            : 'text-foreground hover:bg-secondary'
        )}
      >
        <Icon className={cn('size-5 shrink-0 transition-colors', isActive ? 'text-white' : 'text-[#1f2327]')} />
        {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
        {!collapsed && item.children && (
          <ChevronDown className={cn('size-3.5 text-[#6f777f] transition-transform', isOpen && 'rotate-180')} />
        )}
        {!collapsed && !item.children && active === item.id && (
          <ChevronRight className="size-3.5 text-white/70" />
        )}
      </button>
    )

    return (
      <li key={item.id}>
        {collapsed ? <Tooltip content={item.label} className="block">{button}</Tooltip> : button}
        {!collapsed && item.children && isOpen && (
          <ul className="mt-1 flex flex-col gap-1 pl-8">
            {item.children.map((child) => (
              <li key={child.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(child.id, child.label)}
                  className={cn(
                    'flex w-full rounded-[6px] px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors font-sans cursor-pointer',
                    active === child.id
                      ? 'bg-[#e5f6f7] font-semibold text-[#00c2cb]'
                      : 'text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                  )}
                >
                  {child.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onMobileClose}
        aria-hidden={!mobileOpen}
        className={cn(
          'fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 font-sans',
          collapsed ? 'w-[68px] lg:w-[68px]' : 'w-[230px] lg:w-[230px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Logo (Figma Node 33:1395) */}
        <div
          onClick={() => onNavigate('dashboard', 'Dashboard')}
          className={cn(
            'flex h-[64px] cursor-pointer items-center gap-2.5 px-4 transition-opacity hover:opacity-85',
            collapsed && 'justify-center px-0'
          )}
        >
          <img
            src="/figma/duseat-mark.svg"
            alt="Duseat"
            className="h-7 w-auto shrink-0"
          />
          {!collapsed && (
            <span className="text-[22px] font-bold tracking-tight text-[#1f2327] font-sans">
              Duseat
            </span>
          )}
        </div>

        {/* User Card: Ahmad Khaled, Admin (Figma Node 33:1395) */}
        <div className={cn('px-3 pb-3', collapsed && 'px-2')}>
          <button
            type="button"
            onClick={() => onNavigate('admin', 'Admin management')}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-[10px] border border-[#d3d5d7] bg-white p-2 hover:bg-[#eff1f3] transition-colors font-sans cursor-pointer shadow-2xs',
              collapsed && 'justify-center p-1.5'
            )}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
              alt="Ahmad Khaled"
              className="size-8 rounded-[8px] object-cover shrink-0 border border-[#d3d5d7]"
            />
            {!collapsed && (
              <>
                <div className="flex-1 text-left leading-tight min-w-0">
                  <span className="block text-[14px] font-bold text-[#1f2327] truncate">
                    Ahmad Khaled
                  </span>
                  <span className="block text-[12px] text-[#6f777f]">
                    Admin
                  </span>
                </div>
                <ChevronDown className="size-4 text-[#6f777f] shrink-0" />
              </>
            )}
          </button>
        </div>

        {/* Upper Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 pb-2" aria-label="Primary">
          <ul className="flex flex-col gap-1">
            {mainNav.map(renderItem)}
          </ul>
        </nav>

        {/* Divider and Lower Navigation List (Figma Node 33:1395) */}
        <div className="px-3">
          <hr className="border-t border-[#d3d5d7]" />
        </div>

        <nav className="px-3 py-3" aria-label="Secondary">
          <ul className="flex flex-col gap-1">
            {bottomNav.map(renderItem)}
          </ul>
        </nav>
      </aside>
    </>
  )
}
