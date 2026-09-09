'use client'

import * as React from 'react'
import {
  Layers,
  Palette,
  Sliders,
  Type,
  Maximize2,
  Copy,
  Check,
  Search,
  Filter,
  ArrowUpRight,
  Code2,
  Hash,
  Square,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/dashboard/toast'

export type VariableType = 'number' | 'color' | 'string' | 'boolean'

export interface FoundationToken {
  id: string
  name: string
  type: VariableType
  mode1: {
    aliasName: string
    value: string
    colorHex?: string
  }
  description?: string
  scopes: string[]
}

export const DUSEAT_FOUNDATION_TOKENS: FoundationToken[] = [
  // 1. Border Radius
  {
    id: 'br-none',
    name: 'BorderRadius/none',
    type: 'number',
    mode1: { aliasName: 'Numbers/Scales/0 (0px)', value: '0px' },
    description: 'Zero radius for sharp rectangular items and flush borders',
    scopes: ['CORNER_RADIUS'],
  },
  {
    id: 'br-sm',
    name: 'BorderRadius/sm',
    type: 'number',
    mode1: { aliasName: 'Numbers/Scales/2 (8px)', value: '8px' },
    description: 'Small badges, chips, action buttons, and nested pills',
    scopes: ['CORNER_RADIUS'],
  },
  {
    id: 'br-md',
    name: 'BorderRadius/md',
    type: 'number',
    mode1: { aliasName: 'Numbers/Scales/3 (12px)', value: '12px' },
    description: 'Main buttons, input fields, standard card containers',
    scopes: ['CORNER_RADIUS'],
  },
  {
    id: 'br-lg',
    name: 'BorderRadius/lg',
    type: 'number',
    mode1: { aliasName: 'Numbers/Scales/6 (24px)', value: '24px' },
    description: 'Large surface dialogs and master modal layouts',
    scopes: ['CORNER_RADIUS'],
  },
  {
    id: 'br-circle',
    name: 'BorderRadius/circle',
    type: 'number',
    mode1: { aliasName: 'Numbers/Scales/24 (96px)', value: '96px / 9999px' },
    description: 'Fully rounded avatars, online status dots, and pill tags',
    scopes: ['CORNER_RADIUS'],
  },

  // 2. Border Width
  {
    id: 'bw-none',
    name: 'BorderWidth/none',
    type: 'number',
    mode1: { aliasName: 'Numbers/Scales/0 (0px)', value: '0px' },
    description: 'Borderless elements',
    scopes: ['STROKE_FLOAT'],
  },
  {
    id: 'bw-sm',
    name: 'BorderWidth/sm',
    type: 'number',
    mode1: { aliasName: 'Numbers/Scales/1 (1px)', value: '1px' },
    description: 'Default subtle card borders, table separators, and dialog outlines',
    scopes: ['STROKE_FLOAT'],
  },
  {
    id: 'bw-md',
    name: 'BorderWidth/md',
    type: 'number',
    mode1: { aliasName: 'Numbers/Scales/0.5 (2px)', value: '2px' },
    description: 'Active state rings, outline buttons, and focused inputs',
    scopes: ['STROKE_FLOAT'],
  },
  {
    id: 'bw-lg',
    name: 'BorderWidth/lg',
    type: 'number',
    mode1: { aliasName: 'Numbers/Scales/1 (4px)', value: '4px' },
    description: 'Heavy callout borders and prominent indicators',
    scopes: ['STROKE_FLOAT'],
  },

  // 3. Primary Action Cyan Palette
  {
    id: 'col-primary-50',
    name: 'Primary/50',
    type: 'color',
    mode1: { aliasName: 'Colors/Cyan/50', value: '#E5F6F7', colorHex: '#E5F6F7' },
    description: 'Light surface background for active pills, table selections and badge surfaces',
    scopes: ['FILL_COLOR', 'STROKE_COLOR'],
  },
  {
    id: 'col-primary-100',
    name: 'Primary/100',
    type: 'color',
    mode1: { aliasName: 'Colors/Cyan/100', value: '#C7ECEE', colorHex: '#C7ECEE' },
    description: 'Subtle offers tag pill background and light borders',
    scopes: ['FILL_COLOR', 'STROKE_COLOR'],
  },
  {
    id: 'col-primary-300',
    name: 'Primary/300',
    type: 'color',
    mode1: { aliasName: 'Colors/Cyan/300', value: '#3CC4CB', colorHex: '#3CC4CB' },
    description: 'Hover border state for secondary outline buttons',
    scopes: ['STROKE_COLOR'],
  },
  {
    id: 'col-primary-default',
    name: 'Primary/default',
    type: 'color',
    mode1: { aliasName: 'Colors/Cyan/500', value: '#00C2CB', colorHex: '#00C2CB' },
    description: 'Primary platform brand accent, main action buttons and active icons',
    scopes: ['FILL_COLOR', 'TEXT_COLOR', 'STROKE_COLOR'],
  },
  {
    id: 'col-primary-hover',
    name: 'Primary/hover',
    type: 'color',
    mode1: { aliasName: 'Colors/Cyan/600', value: '#007A80', colorHex: '#007A80' },
    description: 'Button hover background and dark text on cyan surface',
    scopes: ['FILL_COLOR', 'TEXT_COLOR'],
  },
  {
    id: 'col-primary-active',
    name: 'Primary/active',
    type: 'color',
    mode1: { aliasName: 'Colors/Cyan/700', value: '#004F55', colorHex: '#004F55' },
    description: 'Button pressed / active state',
    scopes: ['FILL_COLOR'],
  },

  // 4. Error & Danger Red Palette
  {
    id: 'col-err-50',
    name: 'Error/50',
    type: 'color',
    mode1: { aliasName: 'Colors/Red/50', value: '#F3E1E0', colorHex: '#F3E1E0' },
    description: 'Soft danger button background and rejected badge surface',
    scopes: ['FILL_COLOR'],
  },
  {
    id: 'col-err-100',
    name: 'Error/100',
    type: 'color',
    mode1: { aliasName: 'Colors/Red/100', value: '#EFCDCA', colorHex: '#EFCDCA' },
    description: 'Subtle error background',
    scopes: ['FILL_COLOR'],
  },
  {
    id: 'col-err-400',
    name: 'Error/400',
    type: 'color',
    mode1: { aliasName: 'Colors/Red/400', value: '#DF554B', colorHex: '#DF554B' },
    description: 'Error icon highlight',
    scopes: ['TEXT_COLOR', 'STROKE_COLOR'],
  },
  {
    id: 'col-err-default',
    name: 'Error/default',
    type: 'color',
    mode1: { aliasName: 'Colors/Red/500', value: '#D92D20', colorHex: '#D92D20' },
    description: 'Primary destructive action, critical error badge, and permanent delete',
    scopes: ['FILL_COLOR', 'TEXT_COLOR'],
  },
  {
    id: 'col-err-600',
    name: 'Error/600',
    type: 'color',
    mode1: { aliasName: 'Colors/Red/600', value: '#AE241A', colorHex: '#AE241A' },
    description: 'Dark error hover',
    scopes: ['FILL_COLOR'],
  },

  // 5. Success Green Palette
  {
    id: 'col-suc-50',
    name: 'Success/50',
    type: 'color',
    mode1: { aliasName: 'Colors/Green/50', value: '#DFEFE8', colorHex: '#DFEFE8' },
    description: 'Verified badge background, deal awarded surface',
    scopes: ['FILL_COLOR'],
  },
  {
    id: 'col-suc-default',
    name: 'Success/default',
    type: 'color',
    mode1: { aliasName: 'Colors/Green/500', value: '#17B26A', colorHex: '#17B26A' },
    description: 'Verified checkmarks, confirmed escrow, and online status pulse',
    scopes: ['TEXT_COLOR', 'FILL_COLOR'],
  },

  // 6. Warning Orange Palette
  {
    id: 'col-warn-50',
    name: 'Warning/50',
    type: 'color',
    mode1: { aliasName: 'Colors/Orange/50', value: '#FFF4E5', colorHex: '#FFF4E5' },
    description: 'Hot request callout background and pending verification tag surface',
    scopes: ['FILL_COLOR'],
  },
  {
    id: 'col-warn-default',
    name: 'Warning/default',
    type: 'color',
    mode1: { aliasName: 'Colors/Orange/500', value: '#F79009', colorHex: '#F79009' },
    description: 'Hot request flame icon, star ratings, and pending alerts',
    scopes: ['FILL_COLOR', 'TEXT_COLOR'],
  },
  {
    id: 'col-warn-700',
    name: 'Warning/700',
    type: 'color',
    mode1: { aliasName: 'Colors/Orange/700', value: '#B54708', colorHex: '#B54708' },
    description: 'Warning badge text on light orange surface',
    scopes: ['TEXT_COLOR'],
  },

  // 7. Information Blue Palette
  {
    id: 'col-info-100',
    name: 'Information/100',
    type: 'color',
    mode1: { aliasName: 'Colors/Blue/100', value: '#D6E4FF', colorHex: '#D6E4FF' },
    description: 'Information banner surface',
    scopes: ['FILL_COLOR'],
  },
  {
    id: 'col-info-default',
    name: 'Information/default',
    type: 'color',
    mode1: { aliasName: 'Colors/Blue/500', value: '#2F54EB', colorHex: '#2F54EB' },
    description: 'System info messages and general links',
    scopes: ['FILL_COLOR', 'TEXT_COLOR'],
  },

  // 8. Neutrals & Grayscale
  {
    id: 'col-neu-white',
    name: 'Neutral/white',
    type: 'color',
    mode1: { aliasName: 'Colors/Base/White', value: '#FFFFFF', colorHex: '#FFFFFF' },
    description: 'Base background for all cards, tables, and modals',
    scopes: ['FILL_COLOR'],
  },
  {
    id: 'col-neu-50',
    name: 'Neutral/50',
    type: 'color',
    mode1: { aliasName: 'Colors/Gray/50', value: '#F8F9FA', colorHex: '#F8F9FA' },
    description: 'Card body canvas and specs container background',
    scopes: ['FILL_COLOR'],
  },
  {
    id: 'col-neu-100',
    name: 'Neutral/100',
    type: 'color',
    mode1: { aliasName: 'Colors/Gray/100', value: '#EFF1F3', colorHex: '#EFF1F3' },
    description: 'Table row hover background and placeholder avatar backdrop',
    scopes: ['FILL_COLOR'],
  },
  {
    id: 'col-neu-200',
    name: 'Neutral/200',
    type: 'color',
    mode1: { aliasName: 'Colors/Gray/200', value: '#D3D5D7', colorHex: '#D3D5D7' },
    description: 'Master border color for all cards, tables, dividers and modals',
    scopes: ['STROKE_COLOR'],
  },
  {
    id: 'col-neu-300',
    name: 'Neutral/300',
    type: 'color',
    mode1: { aliasName: 'Colors/Gray/300', value: '#90969C', colorHex: '#90969C' },
    description: 'Disabled text and inactive input placeholder',
    scopes: ['TEXT_COLOR'],
  },
  {
    id: 'col-neu-400',
    name: 'Neutral/400',
    type: 'color',
    mode1: { aliasName: 'Colors/Gray/400', value: '#6F777F', colorHex: '#6F777F' },
    description: 'Secondary labels, subtitles, and metadata text',
    scopes: ['TEXT_COLOR'],
  },
  {
    id: 'col-neu-900',
    name: 'Neutral/900',
    type: 'color',
    mode1: { aliasName: 'Colors/Gray/900', value: '#1F2327', colorHex: '#1F2327' },
    description: 'Top header bar, admin action buttons, and active filter tabs',
    scopes: ['FILL_COLOR', 'TEXT_COLOR'],
  },
  {
    id: 'col-neu-dark',
    name: 'Neutral/dark',
    type: 'color',
    mode1: { aliasName: 'Colors/Base/Dark', value: '#010413', colorHex: '#010413' },
    description: 'Primary bold typography and prominent headlines',
    scopes: ['TEXT_COLOR'],
  },
]

export function VariablesDocumentationTable() {
  const { toast } = useToast()
  const [query, setQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('All')
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const copyToken = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    toast({
      variant: 'success',
      title: 'Token Copied',
      description: `${label} (${text}) copied to clipboard.`,
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredTokens = DUSEAT_FOUNDATION_TOKENS.filter((t) => {
    const text = `${t.name} ${t.mode1.aliasName} ${t.mode1.value} ${t.description || ''} ${t.scopes.join(' ')}`.toLowerCase()
    const matchesQuery = !query || text.includes(query.toLowerCase())
    const matchesType = typeFilter === 'All' || t.type === typeFilter
    return matchesQuery && matchesType
  })

  return (
    <div className="rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-2xs font-sans space-y-5">
      {/* Header Banner matching Figma node 4720:879 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d3d5d7] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[22px] font-bold text-[#1f2327]">Variables Documentation - Alias</h2>
            <span className="rounded-full bg-[#e5f6f7] text-[#00c2cb] px-2.5 py-0.5 text-[11px] font-bold font-mono">
              Figma Node 4720:879
            </span>
          </div>
          <p className="text-[13px] text-[#6f777f]">
            Generated from Duseat-Foundations • The unified design token alias architecture
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search token name, scope, value..."
              className="h-[36px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[13px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb]"
            />
          </div>

          <div className="flex items-center gap-1">
            {(['All', 'number', 'color'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={cn(
                  'h-[36px] rounded-[8px] px-3 text-[12px] font-semibold transition-colors cursor-pointer ant-wave-btn',
                  typeFilter === t
                    ? 'bg-[#1f2327] text-white shadow-2xs'
                    : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3]'
                )}
              >
                {t === 'All' ? 'All Tokens' : t === 'number' ? 'Numbers' : 'Colors'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Structure matching Figma Node 4720:896 */}
      <div className="overflow-x-auto rounded-[12px] border border-[#d3d5d7]">
        <table className="w-full min-w-[900px] border-collapse text-left font-sans text-[13px]">
          <thead>
            <tr className="border-b border-[#d3d5d7] bg-[#fcfcfc] text-[12px] font-bold uppercase tracking-wider text-[#6f777f] h-11">
              <th className="w-12 px-4 py-2.5 text-center">Type</th>
              <th className="px-4 py-2.5">Token Name</th>
              <th className="px-4 py-2.5">Mode 1 (Resolved Value)</th>
              <th className="px-4 py-2.5">Description</th>
              <th className="px-4 py-2.5">Variable Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d3d5d7]/70">
            {filteredTokens.map((token) => {
              const isCopied = copiedId === token.mode1.value || copiedId === token.name
              return (
                <tr
                  key={token.id}
                  className="hover:bg-[#f8f9fa] transition-colors group cursor-pointer"
                  onClick={() => copyToken(token.name, token.name)}
                >
                  {/* Type Icon */}
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex size-6 items-center justify-center rounded-[4px] bg-[#eff1f3] text-[#6f777f]">
                      {token.type === 'color' ? (
                        <Palette className="size-3.5" />
                      ) : (
                        <Hash className="size-3.5" />
                      )}
                    </div>
                  </td>

                  {/* Token Name */}
                  <td className="px-4 py-3 font-semibold text-[#1f2327]">
                    <div className="flex items-center gap-1.5">
                      <span>{token.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToken(token.name, token.name)
                        }}
                        className="opacity-0 group-hover:opacity-100 text-[#00c2cb] hover:text-[#007a80] transition-opacity"
                        title="Copy token name"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </td>

                  {/* Value / Mode 1 Badge */}
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-[#fcfcfc] px-2.5 py-1 text-[12px] font-mono shadow-2xs">
                      {token.mode1.colorHex && (
                        <span
                          className="size-3.5 rounded-[3px] border border-black/10 shrink-0"
                          style={{ backgroundColor: token.mode1.colorHex }}
                        />
                      )}
                      <span className="text-[#00c2cb] flex items-center gap-0.5">
                        <ArrowUpRight className="size-3" />
                        <span className="truncate max-w-[180px]">{token.mode1.aliasName}</span>
                      </span>
                      <span className="text-[#9da4ae]">•</span>
                      <span className="font-bold text-[#1f2327]">{token.mode1.value}</span>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3 text-[#6f777f] max-w-xs">
                    {token.description || '—'}
                  </td>

                  {/* Scope Badges */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {token.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="rounded-[4px] bg-[#eff1f3] px-2 py-0.5 font-mono text-[10px] font-bold text-[#1f2327] uppercase"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-[12px] text-[#6f777f] pt-1">
        <span>Showing {filteredTokens.length} of {DUSEAT_FOUNDATION_TOKENS.length} foundation alias variables</span>
        <span>Click any row to copy variable token name</span>
      </div>
    </div>
  )
}
