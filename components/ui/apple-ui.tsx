'use client'

import * as React from 'react'
import { Search, ShoppingBag, ChevronRight, X, Sparkles, Check } from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

export type AppleButtonVariant =
  | 'primary'
  | 'secondary-pill'
  | 'dark-utility'
  | 'pearl-capsule'
  | 'store-hero'
  | 'icon-circular'

export interface AppleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppleButtonVariant
  children?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

// ============================================================================
// 1. Apple Buttons
// ============================================================================

export const AppleButton = React.forwardRef<HTMLButtonElement, AppleButtonProps>(
  ({ variant = 'primary', children, icon, className = '', ...props }, ref) => {
    let baseStyles =
      'inline-flex items-center justify-center font-normal transition-all duration-200 cursor-pointer select-none active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0071e3] focus-visible:outline-offset-2'

    switch (variant) {
      case 'primary':
        baseStyles +=
          ' bg-[#0066cc] hover:bg-[#0077ed] active:bg-[#0055b3] text-white rounded-full px-[22px] py-[11px] text-[17px] leading-[1.47] tracking-[-0.374px] font-sans min-h-[44px]'
        break
      case 'secondary-pill':
        baseStyles +=
          ' bg-transparent hover:bg-[#0066cc]/5 active:bg-[#0066cc]/10 text-[#0066cc] border border-[#0066cc] rounded-full px-[22px] py-[11px] text-[17px] leading-[1.47] tracking-[-0.374px] font-sans min-h-[44px]'
        break
      case 'dark-utility':
        baseStyles +=
          ' bg-[#1d1d1f] hover:bg-[#333333] active:bg-[#000000] text-white rounded-[8px] px-[15px] py-[8px] text-[14px] leading-[1.29] tracking-[-0.224px] font-sans'
        break
      case 'pearl-capsule':
        baseStyles +=
          ' bg-[#fafafc] hover:bg-white text-[#333333] border-[3px] border-[#f0f0f0] rounded-[11px] px-[14px] py-[8px] text-[14px] leading-[1.43] tracking-[-0.224px] font-sans'
        break
      case 'store-hero':
        baseStyles +=
          ' bg-[#0066cc] hover:bg-[#0077ed] active:bg-[#0055b3] text-white rounded-full px-[28px] py-[14px] text-[18px] font-light leading-none tracking-normal font-sans min-h-[48px]'
        break
      case 'icon-circular':
        baseStyles +=
          ' w-[44px] h-[44px] rounded-full bg-[rgba(210,210,215,0.64)] hover:bg-[rgba(210,210,215,0.85)] text-[#1d1d1f] backdrop-blur-[12px] p-0'
        break
    }

    return (
      <button ref={ref} className={`${baseStyles} ${className}`} {...props}>
        {icon && <span className={children ? 'mr-2' : ''}>{icon}</span>}
        {children}
      </button>
    )
  }
)
AppleButton.displayName = 'AppleButton'

// ============================================================================
// 2. Apple Global Nav (44px, Pure Black)
// ============================================================================

export interface AppleGlobalNavItem {
  label: string
  href?: string
  onClick?: () => void
}

export function AppleGlobalNav({
  items = [
    { label: 'Store' },
    { label: 'Mac' },
    { label: 'iPad' },
    { label: 'iPhone' },
    { label: 'Watch' },
    { label: 'Vision' },
    { label: 'AirPods' },
    { label: 'TV & Home' },
    { label: 'Entertainment' },
    { label: 'Accessories' },
    { label: 'Support' },
  ],
  onSearchClick,
  onBagClick,
}: {
  items?: AppleGlobalNavItem[]
  onSearchClick?: () => void
  onBagClick?: () => void
}) {
  return (
    <header className="fixed top-0 left-0 right-0 h-[44px] bg-black text-white z-[9999] flex items-center justify-center px-4 transition-colors">
      <div className="max-w-[1024px] w-full flex items-center justify-between text-[12px] font-normal tracking-[-0.12px]">
        {/* Apple Logo */}
        <a
          href="#"
          aria-label="Apple"
          className="text-white/80 hover:text-white transition-opacity p-1"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12-14.43-6-9.17-10.74-19.46-14.23-30.86-3.48-11.4-5.23-22.18-5.23-32.34 0-14.42 3.65-26.35 10.96-35.8 7.31-9.45 16.35-14.26 27.13-14.42 4.13 0 9.07 1.15 14.82 3.44 5.76 2.29 9.38 3.5 10.88 3.63 1.8.13 5.48-1.12 11.05-3.75 5.56-2.63 10.45-3.88 14.65-3.75 11.23.63 20.35 4.87 27.38 12.72-9.76 5.88-14.54 13.97-14.34 24.26.2 8.5 3.43 15.65 9.7 21.46 6.26 5.8 13.78 9.07 22.56 9.8-2.67 8.04-6.13 16.03-10.38 23.97zM119.22 31.84c0-7.06 2.5-13.73 7.5-20.02 5-6.28 11.28-10.48 18.84-12.6 1.02 6.88-.63 13.62-4.95 20.2-4.32 6.58-10.55 10.86-18.69 12.84-.52-.14-1.42-.23-2.7-.42z" />
          </svg>
        </a>

        {/* Links (Hidden on small mobile, visible on tablet/desktop) */}
        <nav className="hidden md:flex items-center space-x-7 text-white/80">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center space-x-5 text-white/80">
          <button
            onClick={onSearchClick}
            aria-label="Search"
            className="hover:text-white transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onBagClick}
            aria-label="Bag"
            className="hover:text-white transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  )
}

// ============================================================================
// 3. Apple Sub-Nav Frosted Glass (52px)
// ============================================================================

export function AppleSubNav({
  title = 'iPhone 17 Pro',
  links = ['Overview', 'Tech Specs'],
  buyButtonText = 'Buy',
  onBuyClick,
}: {
  title?: string
  links?: string[]
  buyButtonText?: string
  onBuyClick?: () => void
}) {
  return (
    <div className="sticky top-[44px] left-0 right-0 h-[52px] bg-[#f5f5f7]/80 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-black/[0.08] z-[9990] flex items-center justify-center px-4 transition-all">
      <div className="max-w-[1024px] w-full flex items-center justify-between">
        <h2 className="text-[21px] font-semibold tracking-[0.231px] text-[#1d1d1f]">
          {title}
        </h2>
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center space-x-5 text-[14px] text-[#1d1d1f]/80">
            {links.map((link, idx) => (
              <a
                key={idx}
                href="#"
                className="hover:text-[#0066cc] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          <AppleButton
            variant="primary"
            onClick={onBuyClick}
            className="!py-[4px] !px-[12px] !text-[12px] !min-h-[28px]"
          >
            {buyButtonText}
          </AppleButton>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. Apple Product Tile (Light, Parchment, Dark-1, Dark-2, Dark-3)
// ============================================================================

export type AppleTileSurface =
  | 'light'
  | 'parchment'
  | 'dark-1'
  | 'dark-2'
  | 'dark-3'

export interface AppleProductTileProps {
  surface?: AppleTileSurface
  headline: string
  lead: string
  primaryCtaText?: string
  secondaryCtaText?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  imageSrc?: string
  imageAlt?: string
  customImageNode?: React.ReactNode
  eyebrow?: string
  className?: string
}

export function AppleProductTile({
  surface = 'light',
  headline,
  lead,
  primaryCtaText = 'Learn more',
  secondaryCtaText = 'Buy',
  onPrimaryClick,
  onSecondaryClick,
  imageSrc,
  imageAlt = 'Product Image',
  customImageNode,
  eyebrow,
  className = '',
}: AppleProductTileProps) {
  let surfaceBg = 'bg-white text-[#1d1d1f]'
  let isDark = false

  if (surface === 'parchment') {
    surfaceBg = 'bg-[#f5f5f7] text-[#1d1d1f]'
  } else if (surface === 'dark-1') {
    surfaceBg = 'bg-[#272729] text-white'
    isDark = true
  } else if (surface === 'dark-2') {
    surfaceBg = 'bg-[#2a2a2c] text-white'
    isDark = true
  } else if (surface === 'dark-3') {
    surfaceBg = 'bg-[#252527] text-white'
    isDark = true
  }

  return (
    <section
      className={`w-full relative overflow-hidden flex flex-col items-center justify-between text-center pt-14 pb-10 md:pt-20 md:pb-16 px-4 transition-colors ${surfaceBg} ${className}`}
      style={{ minHeight: '580px' }}
    >
      {/* Top Text Group */}
      <div className="max-w-[720px] w-full flex flex-col items-center z-10">
        {eyebrow && (
          <span
            className={`text-[12px] font-semibold uppercase tracking-wider mb-2 ${
              isDark ? 'text-[#2997ff]' : 'text-[#0066cc]'
            }`}
          >
            {eyebrow}
          </span>
        )}

        <h1 className="text-[34px] sm:text-[40px] md:text-[56px] font-semibold leading-[1.07] tracking-[-0.28px] mb-2">
          {headline}
        </h1>

        <p
          className={`text-[20px] sm:text-[24px] md:text-[28px] font-normal leading-[1.14] tracking-[0.196px] mb-4 ${
            isDark ? 'text-[#cccccc]' : 'text-[#1d1d1f]/90'
          }`}
        >
          {lead}
        </p>

        {/* Actions Row */}
        <div className="flex items-center justify-center space-x-3 mt-1">
          {primaryCtaText && (
            <AppleButton variant="primary" onClick={onPrimaryClick}>
              {primaryCtaText}
            </AppleButton>
          )}
          {secondaryCtaText && (
            <AppleButton
              variant="secondary-pill"
              onClick={onSecondaryClick}
              className={isDark ? '!border-[#2997ff] !text-[#2997ff]' : ''}
            >
              {secondaryCtaText}
            </AppleButton>
          )}
        </div>
      </div>

      {/* Product Image Area with Signature System Shadow */}
      <div className="w-full max-w-[960px] flex items-center justify-center mt-8 relative z-0">
        {customImageNode ? (
          customImageNode
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-auto max-h-[380px] object-contain transition-transform duration-500 hover:scale-[1.02]"
            style={{
              filter: 'drop-shadow(3px 5px 30px rgba(0, 0, 0, 0.22))',
            }}
          />
        ) : (
          <div
            className={`w-[320px] sm:w-[460px] h-[240px] rounded-[18px] flex flex-col items-center justify-center p-6 ${
              isDark ? 'bg-[#1d1d1f]' : 'bg-[#f0f0f4]'
            }`}
            style={{
              boxShadow: '3px 5px 30px 0px rgba(0, 0, 0, 0.22)',
            }}
          >
            <Sparkles
              className={`w-12 h-12 mb-3 ${
                isDark ? 'text-[#2997ff]' : 'text-[#0066cc]'
              }`}
            />
            <span className="text-[14px] font-medium opacity-80">
              High-Fidelity Product Render Area
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

// ============================================================================
// 5. Store & Accessories Utility Card (18px radius)
// ============================================================================

export function AppleStoreCard({
  title,
  price,
  imageSrc,
  tag,
  actionText = 'Buy',
  onActionClick,
}: {
  title: string
  price: string
  imageSrc?: string
  tag?: string
  actionText?: string
  onActionClick?: () => void
}) {
  return (
    <div className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 flex flex-col items-center justify-between text-center transition-all duration-300 hover:border-[#cccccc]">
      <div className="w-full flex justify-between items-start mb-4">
        {tag ? (
          <span className="text-[12px] font-medium text-[#b64400] bg-[#fff2eb] px-2 py-0.5 rounded-[4px]">
            {tag}
          </span>
        ) : (
          <span />
        )}
      </div>

      <div className="w-full aspect-square max-w-[200px] flex items-center justify-center mb-4">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-contain rounded-[8px]"
            style={{
              filter: 'drop-shadow(3px 5px 30px rgba(0, 0, 0, 0.22))',
            }}
          />
        ) : (
          <div className="w-full h-full bg-[#f5f5f7] rounded-[8px] flex items-center justify-center text-gray-400">
            <Sparkles className="w-8 h-8 text-[#0066cc]" />
          </div>
        )}
      </div>

      <div className="w-full mt-auto">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-1">
          {title}
        </h3>
        <p className="text-[17px] font-normal text-[#1d1d1f]/80 tracking-[-0.374px] mb-4">
          {price}
        </p>
        <AppleButton
          variant="secondary-pill"
          onClick={onActionClick}
          className="!py-[6px] !px-[16px] !text-[14px] !min-h-[34px] w-full"
        >
          {actionText}
        </AppleButton>
      </div>
    </div>
  )
}

// ============================================================================
// 6. Configurator Option Chip
// ============================================================================

export function AppleConfiguratorChip({
  label,
  sublabel,
  priceDelta,
  selected = false,
  onClick,
}: {
  label: string
  sublabel?: string
  priceDelta?: string
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-left transition-all duration-200 cursor-pointer select-none active:scale-95 ${
        selected
          ? 'bg-white border-2 border-[#0071e3] shadow-sm'
          : 'bg-white border border-[#e0e0e0] hover:border-black/30'
      }`}
    >
      <div className="flex flex-col">
        <span className="text-[14px] font-semibold text-[#1d1d1f]">{label}</span>
        {sublabel && (
          <span className="text-[12px] text-[#7a7a7a]">{sublabel}</span>
        )}
      </div>
      {priceDelta && (
        <span className="text-[14px] font-medium text-[#1d1d1f]">
          {priceDelta}
        </span>
      )}
    </button>
  )
}

// ============================================================================
// 7. Search Input (Pill Shaped)
// ============================================================================

export function AppleSearchInput({
  placeholder = 'Search accessories...',
  value,
  onChange,
  className = '',
}: {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}) {
  return (
    <div
      className={`relative flex items-center w-full max-w-[480px] h-[44px] bg-white border border-black/[0.08] rounded-full px-4 focus-within:border-[#0071e3] focus-within:ring-2 focus-within:ring-[#0071e3]/20 transition-all ${className}`}
    >
      <Search className="w-4 h-4 text-[#7a7a7a] mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-[17px] text-[#1d1d1f] placeholder:text-[#7a7a7a] focus:outline-none tracking-[-0.374px]"
      />
    </div>
  )
}

// ============================================================================
// 8. Floating Sticky Purchasing Bar (64px)
// ============================================================================

export function AppleFloatingStickyBar({
  productName = 'iPhone 17 Pro 256GB Natural Titanium',
  price = '$1,099.00 or $45.79/mo. for 24 mo.',
  onAddToBag,
}: {
  productName?: string
  price?: string
  onAddToBag?: () => void
}) {
  return (
    <aside className="fixed bottom-0 left-0 right-0 h-[64px] bg-[#f5f5f7]/85 backdrop-blur-[20px] backdrop-saturate-[180%] border-t border-black/[0.08] z-[9000] flex items-center justify-center px-4 transition-all">
      <div className="max-w-[1024px] w-full flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-[#1d1d1f] truncate max-w-[320px] sm:max-w-none">
            {productName}
          </span>
          <span className="text-[12px] text-[#7a7a7a]">{price}</span>
        </div>
        <AppleButton variant="primary" onClick={onAddToBag}>
          Add to Bag
        </AppleButton>
      </div>
    </aside>
  )
}

// ============================================================================
// 9. Apple Environmental Quote Card
// ============================================================================

export function AppleEnvironmentQuoteCard({
  quote = 'A plan as ambitious as our products.',
  subtext = 'By 2030, all Apple products will be made with 100% recycled and renewable materials.',
  buttonText = 'Explore Apple 2030',
  onButtonClick,
}: {
  quote?: string
  subtext?: string
  buttonText?: string
  onButtonClick?: () => void
}) {
  return (
    <section className="w-full bg-[#272729] text-white py-20 px-6 flex flex-col items-center text-center">
      <div className="flex items-center space-x-2 text-[#2997ff] text-[14px] font-semibold tracking-wide uppercase mb-4">
        <span> Apple 2030</span>
      </div>
      <h2 className="text-[34px] sm:text-[40px] md:text-[56px] font-semibold leading-[1.07] tracking-[-0.28px] max-w-[780px] mb-4">
        {quote}
      </h2>
      <p className="text-[18px] sm:text-[24px] font-light leading-[1.5] text-[#cccccc] max-w-[640px] mb-8">
        {subtext}
      </p>
      <AppleButton
        variant="secondary-pill"
        onClick={onButtonClick}
        className="!border-[#2997ff] !text-[#2997ff]"
      >
        {buttonText}
      </AppleButton>
    </section>
  )
}

// ============================================================================
// 10. Apple Footer (Parchment #f5f5f7, 2.41 dense-link leading)
// ============================================================================

export function AppleFooter() {
  const footerColumns = [
    {
      title: 'Shop and Learn',
      links: ['Store', 'Mac', 'iPad', 'iPhone', 'Watch', 'Vision', 'AirPods', 'TV & Home', 'AirTag', 'Accessories'],
    },
    {
      title: 'Apple Wallet',
      links: ['Wallet', 'Apple Card', 'Apple Pay', 'Apple Cash'],
    },
    {
      title: 'Account',
      links: ['Manage Your Apple ID', 'Apple Store Account', 'iCloud.com'],
    },
    {
      title: 'Entertainment',
      links: ['Apple One', 'Apple TV+', 'Apple Music', 'Apple Arcade', 'Apple Podcasts', 'Apple Books'],
    },
    {
      title: 'Apple Values',
      links: ['Accessibility', 'Education', 'Environment', 'Inclusion and Diversity', 'Privacy', 'Racial Equity and Justice'],
    },
  ]

  return (
    <footer className="w-full bg-[#f5f5f7] text-[#333333] border-t border-[#e0e0e0] pt-12 pb-16 px-4">
      <div className="max-w-[1024px] mx-auto">
        {/* Footnote Fine Print */}
        <div className="text-[12px] leading-relaxed text-[#7a7a7a] border-b border-[#e0e0e0] pb-6 mb-8 space-y-2">
          <p>
            1. Trade-in values will vary based on the condition, year, and configuration of your eligible trade-in device. Not all devices are eligible for credit.
          </p>
          <p>
            2. To access and use all Apple Card features and products available only to Apple Card users, you must add Apple Card to Wallet on an iPhone or iPad with the latest version of iOS or iPadOS.
          </p>
        </div>

        {/* Columns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-10">
          {footerColumns.map((col, idx) => (
            <div key={idx} className="flex flex-col">
              <h4 className="text-[14px] font-semibold text-[#1d1d1f] tracking-[-0.224px] mb-3">
                {col.title}
              </h4>
              <ul className="space-y-1">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href="#"
                      className="text-[12px] sm:text-[14px] text-[#333333] hover:text-[#1d1d1f] transition-colors leading-[2.0]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Legal Row */}
        <div className="border-t border-[#e0e0e0] pt-6 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#7a7a7a] gap-4">
          <p>Copyright © 2026 Apple Inc. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:underline">Terms of Use</a>
            <span>|</span>
            <a href="#" className="hover:underline">Sales Policy</a>
            <span>|</span>
            <a href="#" className="hover:underline">Legal</a>
            <span>|</span>
            <a href="#" className="hover:underline">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
