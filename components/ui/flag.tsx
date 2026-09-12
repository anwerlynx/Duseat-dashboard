'use client'

import * as React from 'react'
import * as Flags3x2 from 'country-flag-icons/react/3x2'
import * as Flags1x1 from 'country-flag-icons/react/1x1'
import { cn } from '@/lib/utils'

export type CountryCode =
  | 'AE'
  | 'EG'
  | 'GB'
  | 'SA'
  | 'KW'
  | 'US'
  | 'QA'
  | 'BH'
  | 'OM'
  | 'DE'
  | 'FR'
  | 'IT'
  | 'ES'
  | 'CH'
  | 'NL'
  | 'SE'
  | 'NO'
  | 'CA'
  | 'AU'
  | 'IN'
  | 'CN'
  | 'JP'
  | 'KR'
  | 'SG'
  | 'RU'
  | 'TR'
  | 'LB'
  | 'JO'
  | 'BR'
  | 'PK'
  | string

export interface FlagProps extends React.HTMLAttributes<HTMLElement> {
  code?: CountryCode
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
  aspectRatio?: '3:2' | '1:1'
  className?: string
  alt?: string
}

// Comprehensive country name to ISO 3166-1 alpha-2 mapping dictionary
const countryCodeMap: Record<string, string> = {
  // Middle East & GCC
  uae: 'AE',
  'united arab emirates': 'AE',
  dubai: 'AE',
  'abu dhabi': 'AE',
  emirates: 'AE',
  egypt: 'EG',
  masr: 'EG',
  saudi: 'SA',
  'saudi arabia': 'SA',
  ksa: 'SA',
  kuwait: 'KW',
  qatar: 'QA',
  bahrain: 'BH',
  oman: 'OM',
  lebanon: 'LB',
  jordan: 'JO',
  iraq: 'IQ',
  morocco: 'MA',
  algeria: 'DZ',
  tunisia: 'TN',

  // Europe
  uk: 'GB',
  'united kingdom': 'GB',
  britain: 'GB',
  england: 'GB',
  germany: 'DE',
  deutschland: 'DE',
  france: 'FR',
  italy: 'IT',
  spain: 'ES',
  switzerland: 'CH',
  netherlands: 'NL',
  holland: 'NL',
  sweden: 'SE',
  norway: 'NO',
  russia: 'RU',
  'russian federation': 'RU',
  turkey: 'TR',
  türkiye: 'TR',
  monaco: 'MC',
  cyprus: 'CY',
  greece: 'GR',
  portugal: 'PT',
  austria: 'AT',
  belgium: 'BE',
  ireland: 'IE',
  poland: 'PL',

  // Americas
  us: 'US',
  usa: 'US',
  'united states': 'US',
  'united states of america': 'US',
  america: 'US',
  canada: 'CA',
  brazil: 'BR',
  mexico: 'MX',
  argentina: 'AR',

  // Asia & Oceania
  china: 'CN',
  india: 'IN',
  japan: 'JP',
  'south korea': 'KR',
  korea: 'KR',
  singapore: 'SG',
  pakistan: 'PK',
  australia: 'AU',
  'new zealand': 'NZ',
  'hong kong': 'HK',
  malaysia: 'MY',
  thailand: 'TH',
  indonesia: 'ID',
  philippines: 'PH',
  vietnam: 'VN',
}

/**
 * Converts country name, raw emoji flag (e.g. '🇦🇪'), or ISO code into a standard 2-letter uppercase ISO code.
 */
export function getCountryCode(input: string = ''): string {
  if (!input) return 'AE'
  const trimmed = input.trim()

  // 1. Check if input is a unicode Regional Indicator Symbol flag (e.g. '🇦🇪')
  const chars = Array.from(trimmed)
  if (chars.length === 2) {
    const code0 = chars[0].codePointAt(0)
    const code1 = chars[1].codePointAt(0)
    if (
      code0 &&
      code1 &&
      code0 >= 0x1f1e6 &&
      code0 <= 0x1f1ff &&
      code1 >= 0x1f1e6 &&
      code1 <= 0x1f1ff
    ) {
      const c1 = String.fromCharCode(code0 - 0x1f1e6 + 65)
      const c2 = String.fromCharCode(code1 - 0x1f1e6 + 65)
      return `${c1}${c2}`.toUpperCase()
    }
  }

  // 2. Direct 2-letter ISO match
  if (trimmed.length === 2 && /^[a-zA-Z]{2}$/.test(trimmed)) {
    return trimmed.toUpperCase()
  }

  // 3. Match in country dictionary
  const clean = trimmed.toLowerCase()
  for (const [key, code] of Object.entries(countryCodeMap)) {
    if (clean === key || clean.includes(key)) {
      return code
    }
  }

  return 'AE'
}

/**
 * Modern Vector Country Flag Component powered by country-flag-icons
 * Features:
 * - 100% offline, high-precision SVG vectors
 * - Elegant rounded corners and subtle border ring
 * - Automatic conversion from unicode emojis (e.g. '🇦🇪' -> 'AE') and country names
 */
export function Flag({
  code = 'AE',
  size = 'm',
  aspectRatio = '3:2',
  className,
  alt,
  ...props
}: FlagProps) {
  const isoCode = getCountryCode(code)

  const sizeClasses = {
    xs: aspectRatio === '3:2' ? 'w-[15px] h-[10px] rounded-[2px]' : 'size-[12px] rounded-full',
    s: aspectRatio === '3:2' ? 'w-[18px] h-[12px] rounded-[2px]' : 'size-[14px] rounded-full',
    m: aspectRatio === '3:2' ? 'w-[24px] h-[16px] rounded-[3px]' : 'size-[18px] rounded-full',
    l: aspectRatio === '3:2' ? 'w-[36px] h-[24px] rounded-[4px]' : 'size-[24px] rounded-full',
    xl: aspectRatio === '3:2' ? 'w-[48px] h-[32px] rounded-[5px]' : 'size-[32px] rounded-full',
  }[size]

  // Retrieve matching SVG vector from country-flag-icons
  const FlagsMap = aspectRatio === '1:1' ? (Flags1x1 as Record<string, React.ComponentType<any>>) : (Flags3x2 as Record<string, React.ComponentType<any>>)
  const FlagSvg = FlagsMap[isoCode] || (Flags3x2 as Record<string, React.ComponentType<any>>)[isoCode]

  if (FlagSvg) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center overflow-hidden align-middle shadow-[0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-black/10 select-none bg-slate-100',
          sizeClasses,
          className
        )}
        title={alt || isoCode}
        {...props}
      >
        <FlagSvg className="h-full w-full object-cover" />
      </span>
    )
  }

  // Fallback if country code is not in package
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-mono font-bold text-[9px] uppercase bg-[#e5f6f7] text-[#00a4ac] ring-1 ring-black/10 shrink-0 select-none shadow-2xs',
        sizeClasses,
        className
      )}
      title={isoCode}
      {...props}
    >
      {isoCode}
    </span>
  )
}

/**
 * Composite Country Badge with 3:2 flag + Country Name + Dial code
 */
export function CountryBadge({
  code = 'AE',
  name,
  dial,
  size = 'm',
  className,
}: {
  code: CountryCode
  name?: string
  dial?: string
  size?: 'xs' | 's' | 'm' | 'l'
  className?: string
}) {
  const resolvedCode = getCountryCode(code)
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-2 py-1 font-sans text-[13px] font-medium text-[#1f2327] shadow-2xs',
        className
      )}
    >
      <Flag code={resolvedCode} size={size} />
      {name && <span className="truncate">{name}</span>}
      {dial && <span className="font-mono text-[11px] text-[#6f777f]">{dial}</span>}
    </div>
  )
}

/**
 * Avatar Flag Overlay Badge
 */
export function AvatarFlagOverlay({
  code = 'AE',
  children,
  className,
}: {
  code: CountryCode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      <div className="absolute -bottom-1 -right-1 z-10 shadow-xs">
        <Flag code={code} size="s" className="ring-2 ring-white" />
      </div>
    </div>
  )
}
