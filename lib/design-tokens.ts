/**
 * Duseat Admin Dashboard — Master Design & UX Tokens
 * Strictly adhering to the Master Design & UX Specification (Sections 4, 5, 8, 9, 10, 11).
 */

export const colors = {
  // Section 5: Brand Colors
  brand: {
    primary: '#06B6C9', // Primary Teal
    dark: '#0891A6',    // Primary Dark
    soft: '#E8F9FB',    // Primary Soft
    50: '#E8F9FB',
    100: '#C7F1F6',
    200: '#94E4ED',
    300: '#54D2E1',
    400: '#1EBECF',
    500: '#06B6C9',
    600: '#0891A6',
    700: '#0B7486',
    800: '#0E5C6A',
    900: '#104D58',
  },
  // Section 5: Neutrals
  neutral: {
    background: '#F5F6F7',    // Background
    surface: '#FFFFFF',       // Surface
    surfaceSubtle: '#F8F9FA', // Surface Subtle
    border: '#E2E5E8',        // Border
    strongBorder: '#D4D8DD',  // Strong Border
    textPrimary: '#202428',   // Text Primary
    textSecondary: '#68727D', // Text Secondary
    textMuted: '#8A939D',     // Text Muted
    textDisabled: '#B3BAC1',  // Text Disabled
    50: '#F8F9FA',
    100: '#F5F6F7',
    200: '#E2E5E8',
    300: '#D4D8DD',
    400: '#B3BAC1',
    500: '#8A939D',
    600: '#68727D',
    700: '#4A535C',
    800: '#202428',
    900: '#15181B',
  },
  // Section 5 & 9: Semantic Colors
  semantic: {
    success: {
      text: '#16A86B',
      soft: '#E8F7F0',
      border: '#A6F4C5',
    },
    warning: {
      text: '#E99A18',
      soft: '#FFF5DF',
      border: '#FEDF89',
    },
    danger: {
      text: '#E5484D',
      soft: '#FDEBEC',
      border: '#FECDCA',
    },
    info: {
      text: '#3288D8',
      soft: '#EAF4FD',
      border: '#BADAFB',
    },
    neutral: {
      text: '#68727D',
      soft: '#F5F6F7',
      border: '#E2E5E8',
    },
  },
} as const

export const spacing = {
  micro: '4px',
  tight: '8px',
  compact: '12px',
  standard: '16px',
  section: '20px',
  page: '24px',
  major: '32px',
  exceptional: '40px',
  pagePadding: 'px-5 sm:px-6 py-5', // 20–24px desktop page padding
} as const

export const typography = {
  fontFamily: {
    sans: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif)",
    mono: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)",
  },
  // Section 5: Typography Scale
  pageTitle: 'text-[20px] sm:text-[24px] font-bold leading-[28px] sm:leading-[32px] text-[#202428]',
  sectionTitle: 'text-[14px] sm:text-[16px] font-semibold leading-[20px] sm:leading-[22px] text-[#202428]',
  body: 'text-[13px] sm:text-[14px] font-normal leading-[20px] text-[#202428]',
  label: 'text-[11px] sm:text-[12px] font-medium leading-[16px] text-[#68727D]',
  metadata: 'text-[10px] sm:text-[11px] font-medium leading-[14px] text-[#8A939D]',
  kpiValue: 'text-[20px] sm:text-[24px] font-bold leading-[28px] sm:leading-[32px] text-[#202428]',
  tableHeader: 'text-[13px] font-semibold text-[#202428]',
  tableCell: 'text-[13.5px] leading-[20px] text-[#202428]',
  tableCellMuted: 'text-[13px] leading-[18px] text-[#68727D]',
  tableCellId: 'font-mono text-[13px] leading-[18px] font-semibold text-[#06B6C9] hover:underline',
} as const

export const radius = {
  button: 'rounded-[8px]',
  input: 'rounded-[8px]',
  card: 'rounded-[12px]',
  drawer: 'rounded-[12px] sm:rounded-l-[16px]',
  modal: 'rounded-[16px]',
  badge: 'rounded-full', // 999px per Section 5
} as const

export const dimensions = {
  table: {
    headerHeight: 'h-11', // 40–44px per Section 11
    rowHeight: 'h-[62px]', // 60–72px per Section 11
    cellPaddingX: 'px-4',
    minWidth: 'min-w-[1100px]',
  },
  controls: {
    height: 'h-[38px]',
    smHeight: 'h-[32px]',
    iconSize: 'size-4',
    iconSmSize: 'size-3.5',
    buttonSmHeight: 'h-[34px]',
  },
  tabs: {
    height: 'h-[36px]',
    paddingX: 'px-3.5',
    radius: 'rounded-[8px]',
  },
  card: {
    radius: 'rounded-[12px]',
    border: 'border border-[#E2E5E8]',
    shadow: 'shadow-[0px_1px_3px_rgba(16,24,40,0.04)]',
    padding: 'p-4 sm:p-5',
  },
  sidebar: {
    width: 'w-[250px]',         // 240–256px per Section 6
    collapsedWidth: 'w-[68px]', // 64–72px per Section 6
  },
} as const
