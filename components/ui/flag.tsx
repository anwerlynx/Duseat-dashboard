'use client'

import * as React from 'react'
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

export interface FlagProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  code?: CountryCode
  size?: 's' | 'm' | 'l' | 'xl'
  aspectRatio?: '3:2' | '1:1'
  className?: string
  alt?: string
}

// Comprehensive country name to ISO 3166-1 alpha-2 mapping dictionary
const countryCodeMap: Record<string, string> = {
  // Middle East & GCC
  uae: 'ae',
  'united arab emirates': 'ae',
  dubai: 'ae',
  'abu dhabi': 'ae',
  emirates: 'ae',
  egypt: 'eg',
  masr: 'eg',
  saudi: 'sa',
  'saudi arabia': 'sa',
  ksa: 'sa',
  kuwait: 'kw',
  qatar: 'qa',
  bahrain: 'bh',
  oman: 'om',
  lebanon: 'lb',
  jordan: 'jo',
  iraq: 'iq',
  morocco: 'ma',
  algeria: 'dz',
  tunisia: 'tn',

  // Europe
  uk: 'gb',
  'united kingdom': 'gb',
  britain: 'gb',
  england: 'gb',
  germany: 'de',
  deutschland: 'de',
  france: 'fr',
  italy: 'it',
  spain: 'es',
  switzerland: 'ch',
  netherlands: 'nl',
  holland: 'nl',
  sweden: 'se',
  norway: 'no',
  russia: 'ru',
  'russian federation': 'ru',
  turkey: 'tr',
  türkiye: 'tr',
  monaco: 'mc',
  cyprus: 'cy',
  greece: 'gr',
  portugal: 'pt',
  austria: 'at',
  belgium: 'be',
  ireland: 'ie',
  poland: 'pl',

  // Americas
  us: 'us',
  usa: 'us',
  'united states': 'us',
  'united states of america': 'us',
  america: 'us',
  canada: 'ca',
  brazil: 'br',
  mexico: 'mx',
  argentina: 'ar',

  // Asia & Oceania
  china: 'cn',
  india: 'in',
  japan: 'jp',
  'south korea': 'kr',
  korea: 'kr',
  singapore: 'sg',
  pakistan: 'pk',
  australia: 'au',
  'new zealand': 'nz',
  'hong kong': 'hk',
  malaysia: 'my',
  thailand: 'th',
  indonesia: 'id',
  philippines: 'ph',
  vietnam: 'vn',
}

export function getCountryCode(countryName: string = ''): string {
  if (!countryName) return 'AE'
  const clean = countryName.toLowerCase().trim()

  // Direct 2-letter ISO match
  if (clean.length === 2) return clean.toUpperCase()

  // Match in country dictionary
  for (const [key, code] of Object.entries(countryCodeMap)) {
    if (clean === key || clean.includes(key)) {
      return code.toUpperCase()
    }
  }

  return 'AE'
}

/**
 * Figma Node 2724:22777 Standard Vector Country Flag
 * Aspect ratio: 3:2 (standard 36x24px, 24x16px, 18x12px, 48x32px)
 */
export function Flag({
  code = 'AE',
  size = 'm',
  aspectRatio = '3:2',
  className,
  alt,
  ...props
}: FlagProps) {
  const [hasError, setHasError] = React.useState(false)

  // Normalize code
  const iso = (code.length === 2 ? code : getCountryCode(code)).toLowerCase()

  const sizeClasses = {
    s: aspectRatio === '3:2' ? 'w-[18px] h-[12px] rounded-[2px]' : 'size-[14px] rounded-full',
    m: aspectRatio === '3:2' ? 'w-[24px] h-[16px] rounded-[3px]' : 'size-[18px] rounded-full',
    l: aspectRatio === '3:2' ? 'w-[36px] h-[24px] rounded-[4px]' : 'size-[24px] rounded-full',
    xl: aspectRatio === '3:2' ? 'w-[48px] h-[32px] rounded-[5px]' : 'size-[32px] rounded-full',
  }[size]

  if (hasError) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center font-mono font-bold text-[9px] uppercase bg-[#e5f6f7] text-[#00a4ac] ring-1 ring-black/10 shrink-0 select-none shadow-2xs',
          sizeClasses,
          className
        )}
        title={code}
      >
        {iso.toUpperCase()}
      </span>
    )
  }

  // High-def vector SVG from FlagCDN
  const flagSvgUrl = `https://flagcdn.com/${iso}.svg`

  return (
    <img
      src={flagSvgUrl}
      alt={alt || `${code} flag`}
      loading="lazy"
      onError={() => setHasError(true)}
      className={cn(
        'inline-block shrink-0 object-cover shadow-[0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-black/10 overflow-hidden select-none',
        sizeClasses,
        className
      )}
      {...props}
    />
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
  size?: 's' | 'm' | 'l'
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
      <div className="absolute -bottom-1 -right-1 z-10">
        <Flag code={code} size="s" className="ring-2 ring-white" />
      </div>
    </div>
  )
}
