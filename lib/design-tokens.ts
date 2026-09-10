/**
 * Duseat Admin Dashboard — Design Tokens
 * Extracted from the canonical Users/Investors reference implementation & Figma design system.
 * Source of truth: investors-management.tsx & design.me
 */

export const colors = {
  brand: {
    50: '#E5F6F7',
    100: '#C7ECEE',
    200: '#92DCDF',
    300: '#5DCCD1',
    400: '#28BBC2',
    500: '#00C2CB', // Core Brand Teal
    600: '#00A4AC',
    700: '#00848B',
    800: '#00656A',
    900: '#00484B',
  },
  neutral: {
    50: '#F8F9FA',  // Zebra hover tint
    100: '#EFF1F3', // Secondary buttons, badge neutral
    200: '#E4E7EB', // Subtle dividers
    300: '#D3D5D7', // Canonical border color
    400: '#9DA4AE', // Placeholder, muted chevrons
    500: '#6F777F', // Secondary text, column headers
    600: '#4B5563',
    700: '#344054',
    800: '#1F2327', // Headings, Primary Text, Active Dark Pill
    900: '#14171A',
  },
  status: {
    success: {
      text: '#17B26A',
      bg: '#DFEFE8',
      bgAlt: '#ECFDF3',
      border: '#A6F4C5',
    },
    warning: {
      text: '#FDB022',
      textAlt: '#F79009',
      bg: '#F6EFE0',
      bgAlt: '#FFFAEB',
      border: '#FEDF89',
    },
    danger: {
      text: '#D92D20',
      textAlt: '#F04438',
      bg: '#F3E1E0',
      bgAlt: '#FEF3F2',
      border: '#FECDCA',
    },
    info: {
      text: '#1A7FF0',
      bg: '#F0F6FE',
      border: '#BADAFB',
    },
    neutral: {
      text: '#6F777F',
      bg: '#EFF1F3',
      border: '#D3D5D7',
    },
  },
} as const

export const typography = {
  fontFamily: {
    sans: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif)",
    mono: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)",
  },
  pageTitle: 'text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-foreground',
  pageDescription: 'text-[14px] leading-[20px] text-muted-foreground',
  sectionTitle: 'text-[18px] sm:text-[20px] font-bold leading-[26px] sm:leading-[28px] text-foreground',
  cardHeader: 'text-[15px] sm:text-[16px] font-semibold leading-[22px] text-foreground',
  tableHeader: 'text-[14px] font-semibold text-foreground',
  tableCell: 'text-[14px] leading-[20px] text-foreground',
  tableCellMuted: 'text-[14px] leading-[20px] text-muted-foreground',
  tableCellId: 'font-mono text-[14px] leading-[20px] font-semibold text-brand hover:underline',
  badge: 'text-[12px] leading-[16px] font-medium',
  tab: 'text-[14px] leading-[20px] font-medium',
  button: 'text-[13px] sm:text-[14px] font-semibold',
  metadata: 'text-[12px] leading-[16px] text-muted-foreground',
  caption: 'text-[11px] leading-[14px]',
} as const

export const dimensions = {
  table: {
    headerHeight: 'h-12', // 48px
    rowHeight: 'h-[60px]', // 60px canonical row height
    cellPaddingX: 'px-4', // 16px horizontal padding
    minWidth: 'min-w-[1200px]',
  },
  controls: {
    height: 'h-[38px]', // 38px toolbar inputs & dropdowns
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
    border: 'border border-[#d3d5d7]',
    shadow: 'shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]',
    padding: 'p-4 sm:p-5',
  },
  badge: {
    radius: 'rounded-[12px]',
    padding: 'px-3 py-1',
  },
} as const
