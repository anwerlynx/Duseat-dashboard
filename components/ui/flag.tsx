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
  | 'IN'
  | 'RU'
  | 'CN'
  | 'LB'
  | 'JO'
  | 'CA'
  | 'AU'
  | 'CH'
  | 'TR'
  | 'SG'
  | 'PK'
  | 'ES'
  | 'IT'
  | 'NL'
  | 'SE'
  | 'NO'
  | 'ZA'
  | 'BR'
  | 'JP'
  | 'KR'
  | 'GLOBAL'
  | string

export interface FlagProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  code?: CountryCode
  size?: 's' | 'm' | 'l'
  className?: string
  alt?: string
}

// Country name to ISO 3166-1 alpha-2 code mapping dictionary
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

  // Americas
  us: 'us',
  usa: 'us',
  'united states': 'us',
  'united states of america': 'us',
  america: 'us',
  canada: 'ca',
  brazil: 'br',

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
 * RestCountries / FlagCDN Official High-Quality Vector Flag Component
 * Powered by RestCountries flags dataset with crisp SVG rendering
 */
export function Flag({
  code = 'AE',
  size = 'm',
  className,
  alt,
  ...props
}: FlagProps) {
  const [hasError, setHasError] = React.useState(false)

  // Normalize code
  const iso = (code.length === 2 ? code : getCountryCode(code)).toLowerCase()

  const sizeClasses = {
    s: 'w-4 h-[11px] rounded-[2px]',
    m: 'w-5 h-[14px] rounded-[3px]',
    l: 'w-7 h-[19px] rounded-[4px]',
  }[size]

  // If error, show sleek SVG fallback
  if (hasError) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center font-mono font-bold text-[9px] uppercase bg-[#e5f6f7] text-[#00a4ac] ring-1 ring-black/10 shrink-0 select-none',
          sizeClasses,
          className
        )}
        title={code}
      >
        {iso.toUpperCase()}
      </span>
    )
  }

  // Official RestCountries / FlagCDN vector flag URL
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
