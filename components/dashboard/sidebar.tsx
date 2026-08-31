'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileText,
  ScrollText,
  Sparkles,
  MessageSquare,
  Flag,
  Bell,
  CreditCard,
  Banknote,
  BarChart3,
  Megaphone,
  Wrench,
  Settings,
  HelpCircle,
  Clock,
  Bot,
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
  { label: 'Verification center', icon: ShieldCheck, id: 'verification' },
  { label: 'Requests', icon: FileText, id: 'requests' },
  { label: 'Offers', icon: ScrollText, id: 'offers' },
  { label: 'Deals', icon: Sparkles, id: 'deals' },
  { label: 'Conversations', icon: MessageSquare, id: 'conversations' },
  { label: 'Reports & moderation', icon: Flag, id: 'reports' },
  { label: 'Notifications', icon: Bell, id: 'notifications' },
  { label: 'Subscriptions', icon: CreditCard, id: 'subscriptions' },
  { label: 'Finance', icon: Banknote, id: 'finance' },
  { label: 'Analytics', icon: BarChart3, id: 'analytics' },
  { label: 'Marketing', icon: Megaphone, id: 'marketing' },
  { label: 'All tools', icon: Wrench, id: 'tools' },
]

const bottomNav: NavItem[] = [
  { label: 'Settings', icon: Settings, id: 'settings' },
  { label: 'Support center', icon: HelpCircle, id: 'support' },
  { label: 'Activity logs', icon: Clock, id: 'activity' },
  { label: 'AI moderation', icon: Bot, id: 'ai-moderation' },
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
        onClick={() => item.children ? setOpenGroups((items) => items.includes(item.id) ? items.filter((id) => id !== item.id) : [...items, item.id]) : onNavigate(item.id, item.label)}
        aria-current={active === item.id ? 'page' : undefined}
        aria-expanded={item.children ? isOpen : undefined}
        className={cn('group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all font-sans', collapsed && 'justify-center px-0', isActive ? 'bg-sidebar-primary font-medium text-sidebar-primary-foreground shadow-sm' : 'text-sidebar-foreground hover:bg-sidebar-accent')}
      >
        <Icon className={cn('size-[18px] shrink-0', isActive ? '' : 'text-muted-foreground group-hover:text-foreground')} />
        {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
        {!collapsed && item.children && <ChevronDown className={cn('size-3.5 transition-transform', isOpen && 'rotate-180')} />}
        {!collapsed && !item.children && active === item.id && <ChevronRight className="size-3.5 opacity-70" />}
      </button>
    )

    return (
      <li key={item.id}>
        {collapsed ? <Tooltip content={item.label} className="block">{button}</Tooltip> : button}
        {!collapsed && item.children && isOpen && (
          <ul className="mt-1 flex flex-col gap-1 pl-9">
            {item.children.map((child) => (
              <li key={child.id}>
                <button type="button" onClick={() => onNavigate(child.id, child.label)} className={cn('flex w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors font-sans', active === child.id ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground')}>{child.label}</button>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <>
      <div onClick={onMobileClose} aria-hidden={!mobileOpen} className={cn('fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity lg:hidden', mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0')} />
      <aside className={cn('fixed inset-y-0 left-0 z-50 flex h-dvh w-[244px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0', collapsed ? 'lg:w-[68px]' : 'lg:w-[220px]', mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div
          onClick={() => onNavigate('dashboard', 'Dashboard')}
          className={cn('flex h-[72px] cursor-pointer items-center gap-2 px-4 transition-opacity hover:opacity-85', collapsed && 'justify-center px-0')}
        >
          <img src="/figma/duseat-mark.svg" alt="Duseat" className="size-7" width={28} height={28} />
          {!collapsed && <span className="text-xl font-bold tracking-tight text-primary font-sans">Duseat</span>}
        </div>
        <div className={cn('px-3 pb-3', collapsed && 'px-2')}>
          <button type="button" onClick={() => onNavigate('admin', 'Admin management')} className={cn('flex w-full items-center gap-2.5 rounded-xl border border-sidebar-border p-1.5 hover:bg-sidebar-accent font-sans', collapsed && 'justify-center border-transparent p-1')}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">AK</span>
            {!collapsed && <><span className="flex-1 text-left leading-tight"><span className="block text-sm font-medium">Ahmad Khaled</span><span className="block text-xs text-muted-foreground">Super Admin</span></span><ChevronDown className="size-3.5 text-muted-foreground" /></>}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-3" aria-label="Primary"><ul className="flex flex-col gap-1">{mainNav.map(renderItem)}</ul></nav>
        <nav className="border-t border-sidebar-border px-3 py-3" aria-label="Secondary"><ul className="flex flex-col gap-1">{bottomNav.map(renderItem)}</ul></nav>
      </aside>
    </>
  )
}
