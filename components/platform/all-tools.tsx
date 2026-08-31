'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Search } from 'lucide-react'
import { PlatformShell } from './platform-shell'
import { platformModules } from '@/lib/platform-modules'

const groups = ['Users', 'Marketplace', 'Trust & safety', 'Revenue', 'Intelligence', 'Experience', 'Operations', 'Administration']

function groupFor(eyebrow: string) {
  if (['Users'].includes(eyebrow)) return 'Users'
  if (['Marketplace', 'Communication'].includes(eyebrow)) return 'Marketplace'
  if (['Trust & safety', 'Trust intelligence'].includes(eyebrow)) return 'Trust & safety'
  if (['Revenue', 'Monetization'].includes(eyebrow)) return 'Revenue'
  if (['Intelligence', 'Executive', 'Marketplace intelligence'].includes(eyebrow)) return 'Intelligence'
  if (['Experience', 'Growth', 'Engagement'].includes(eyebrow)) return 'Experience'
  if (['Operations', 'Audit', 'Customer success'].includes(eyebrow)) return 'Operations'
  return 'Administration'
}

export function AllTools() {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const tools = [{ slug: 'agents', title: 'Agents Management', eyebrow: 'Users', description: 'Agent verification, performance and account operations.' }, ...platformModules]
  const filtered = tools.filter((tool) => `${tool.title} ${tool.description} ${tool.eyebrow}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <PlatformShell title="All Tools" eyebrow="Platform" query={query} onQueryChange={setQuery}>
      <div className="flex w-full min-w-0 flex-col gap-4 px-4 sm:px-6 lg:px-8 py-5 font-sans">
        <section className="rounded-[12px] border border-border bg-[#1f2327] p-4 sm:p-6 text-white shadow-sm">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#00c2cb]">Duseat operating system</p>
          <div className="mt-1.5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h2 className="max-w-2xl text-balance text-2xl font-bold tracking-tight sm:text-3xl">Every marketplace control, in one workspace.</h2>
              <p className="mt-1.5 max-w-2xl text-pretty text-xs sm:text-sm leading-relaxed text-white/70">Navigate users, trust, marketplace operations, revenue, intelligence and system administration without losing context.</p>
            </div>
            <div className="flex items-center gap-3 rounded-[10px] border border-white/20 bg-white/10 px-3.5 py-2 shrink-0">
              <strong className="text-xl sm:text-2xl font-bold">{tools.length}</strong>
              <span className="text-xs text-white/70">active<br/>modules</span>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3 rounded-[8px] border border-[#d3d5d7] bg-white px-3 md:hidden">
          <Search className="size-4 text-[#9da4ae]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools…" className="h-9 flex-1 bg-transparent text-sm outline-none" />
        </div>

        <div className="flex flex-col gap-5 pt-1">
          {groups.map((group) => {
            const items = filtered.filter((tool) => groupFor(tool.eyebrow) === group)
            if (!items.length) return null
            return (
              <section key={group}>
                <div className="mb-2.5 flex items-center gap-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#6f777f]">{group}</h3>
                  <span className="h-px flex-1 bg-[#d3d5d7]" />
                  <span className="text-xs font-semibold text-[#6f777f]">{items.length}</span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((tool, index) => (
                    <button
                      key={tool.slug}
                      type="button"
                      onClick={() => router.push(`/${tool.slug}`)}
                      className="group flex min-h-28 flex-col rounded-[12px] border border-[#d3d5d7] bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-[#00c2cb] hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <span className="flex size-7 items-center justify-center rounded-[6px] bg-[#eff1f3] text-xs font-bold text-[#1f2327]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <ArrowUpRight className="size-4 text-[#9da4ae] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#00c2cb]" />
                      </div>
                      <h4 className="mt-2.5 text-[15px] font-semibold text-[#1f2327]">{tool.title}</h4>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#6f777f]">{tool.description}</p>
                    </button>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </PlatformShell>
  )
}
