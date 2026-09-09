'use client'

import * as React from 'react'
import {
  AppleGlobalNav,
  AppleSubNav,
  AppleProductTile,
  AppleButton,
  AppleStoreCard,
  AppleConfiguratorChip,
  AppleSearchInput,
  AppleFloatingStickyBar,
  AppleEnvironmentQuoteCard,
  AppleFooter,
} from '@/components/ui/apple-ui'
import { Sparkles, Layers, Sliders, Palette, Check, ArrowRight } from 'lucide-react'

export default function AppleDesignShowcasePage() {
  const [activeStorage, setActiveStorage] = React.useState('256GB')
  const [activeColor, setActiveColor] = React.useState('Natural Titanium')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showStickyBar, setShowStickyBar] = React.useState(true)

  const storageOptions = [
    { label: '256GB', sublabel: 'From $1,099', priceDelta: '$1,099' },
    { label: '512GB', sublabel: 'From $1,299', priceDelta: '+$200' },
    { label: '1TB', sublabel: 'From $1,499', priceDelta: '+$400' },
  ]

  const colorOptions = [
    { name: 'Natural Titanium', hex: '#8a8885' },
    { name: 'Desert Titanium', hex: '#c5b59f' },
    { name: 'White Titanium', hex: '#e3e4e5' },
    { name: 'Black Titanium', hex: '#343538' },
  ]

  const accessories = [
    {
      title: 'AirPods Pro 2',
      price: '$249.00',
      tag: 'Free Engraving',
    },
    {
      title: 'iPhone 17 Pro Silicone Case',
      price: '$49.00',
      tag: 'New Colors',
    },
    {
      title: 'MagSafe Charger (2m)',
      price: '$39.00',
    },
    {
      title: 'Apple Watch Ultra 2 Alpine Loop',
      price: '$99.00',
      tag: 'Carbon Neutral',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-[#0066cc] selection:text-white">
      {/* 1. Global Navigation Bar (44px) */}
      <AppleGlobalNav />

      {/* 2. Frosted Glass Sub-Nav (52px) */}
      <AppleSubNav
        title="Design System & Showroom"
        links={['Overview', 'Hardware Stack', 'Configurator', 'Tokens Spec']}
        buyButtonText="Buy iPhone"
        onBuyClick={() => alert('Action Blue Pill clicked!')}
      />

      {/* Top Banner Notice */}
      <div className="bg-[#f5f5f7] border-b border-[#e0e0e0] py-3 px-4 text-center text-[14px] text-[#1d1d1f]">
        <span>
          Live implementation of the <strong>Apple Design System Standard</strong> (SF Pro typography, Action Blue, signature single drop-shadow).
        </span>
      </div>

      <main className="w-full">
        {/* =========================================================================
            1. HERO TILE - Light Canvas (#ffffff)
            ========================================================================= */}
        <AppleProductTile
          surface="light"
          eyebrow="New"
          headline="iPhone 17 Pro"
          lead="All out. All Pro. All titanium."
          primaryCtaText="Learn more"
          secondaryCtaText="Buy"
          onPrimaryClick={() => {}}
          onSecondaryClick={() => {}}
          customImageNode={
            <div className="relative flex flex-col items-center">
              <div
                className="w-[280px] sm:w-[380px] h-[340px] rounded-[32px] bg-gradient-to-b from-[#e3e4e5] to-[#c5b59f] p-4 flex flex-col items-center justify-center border-4 border-white"
                style={{
                  filter: 'drop-shadow(3px 5px 30px rgba(0, 0, 0, 0.22))',
                }}
              >
                <div className="w-[80px] h-[18px] bg-black rounded-full mb-6" />
                <div className="w-full flex-1 bg-[#1d1d1f] rounded-[24px] flex flex-col items-center justify-center text-white p-4 text-center">
                  <Sparkles className="w-10 h-10 text-[#2997ff] mb-2" />
                  <span className="text-[14px] font-semibold">Super Retina XDR</span>
                  <span className="text-[12px] text-[#cccccc]">ProMotion 120Hz</span>
                </div>
              </div>
            </div>
          }
        />

        {/* =========================================================================
            2. TILE 2 - Dark Tile 1 (#272729)
            ========================================================================= */}
        <AppleProductTile
          surface="dark-1"
          headline="Apple Watch Ultra 2"
          lead="Engineered for extremes. Ready for anything."
          primaryCtaText="Learn more"
          secondaryCtaText="Buy"
          customImageNode={
            <div className="relative flex flex-col items-center">
              <div
                className="w-[260px] sm:w-[320px] h-[300px] rounded-[44px] bg-[#1d1d1f] border-2 border-[#424245] p-5 flex flex-col items-center justify-center text-white"
                style={{
                  filter: 'drop-shadow(3px 5px 30px rgba(0, 0, 0, 0.35))',
                }}
              >
                <div className="w-[180px] h-[180px] rounded-full border-4 border-[#0066cc] flex flex-col items-center justify-center text-center p-2">
                  <span className="text-[12px] font-semibold text-[#2997ff] uppercase">Depth Gauge</span>
                  <span className="text-[32px] font-semibold">40m</span>
                  <span className="text-[11px] text-[#7a7a7a]">Water Resistant</span>
                </div>
              </div>
            </div>
          }
        />

        {/* =========================================================================
            3. TILE 3 - Parchment Canvas (#f5f5f7)
            ========================================================================= */}
        <AppleProductTile
          surface="parchment"
          headline="MacBook Pro"
          lead="Mind-blowing. Head-turning."
          primaryCtaText="Learn more"
          secondaryCtaText="Buy"
          customImageNode={
            <div
              className="w-[340px] sm:w-[520px] h-[260px] bg-[#1d1d1f] rounded-t-[16px] border border-gray-700 p-3 flex flex-col justify-between text-white"
              style={{
                filter: 'drop-shadow(3px 5px 30px rgba(0, 0, 0, 0.22))',
              }}
            >
              <div className="w-full flex items-center justify-center pt-2">
                <div className="w-3 h-3 rounded-full bg-gray-900 border border-gray-600" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-[28px] font-semibold tracking-tight text-white">M4 Max</span>
                <span className="text-[14px] text-[#cccccc]">Unrivaled Performance</span>
              </div>
              <div className="w-full h-3 bg-gray-300 rounded-b-[4px]" />
            </div>
          }
        />

        {/* =========================================================================
            4. INTERACTIVE HARDWARE CONFIGURATOR & STORE GRID
            ========================================================================= */}
        <section className="max-w-[1024px] mx-auto py-20 px-4">
          <div className="text-center mb-12">
            <h2 className="text-[40px] font-semibold tracking-[-0.28px] text-[#1d1d1f] mb-3">
              Buy iPhone 17 Pro
            </h2>
            <p className="text-[21px] font-normal text-[#1d1d1f]/80">
              Choose your finish and storage capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-[#e0e0e0] rounded-[24px] p-8 mb-16">
            {/* Left Preview */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#f5f5f7] rounded-[18px]">
              <div
                className="w-[220px] h-[320px] rounded-[28px] border-4 border-white flex flex-col items-center justify-center p-4 transition-colors duration-300"
                style={{
                  backgroundColor: colorOptions.find((c) => c.name === activeColor)?.hex || '#8a8885',
                  filter: 'drop-shadow(3px 5px 30px rgba(0, 0, 0, 0.22))',
                }}
              >
                <div className="w-16 h-3 bg-black rounded-full mb-auto" />
                <div className="text-white text-center">
                  <span className="text-[16px] font-semibold block">{activeColor}</span>
                  <span className="text-[13px] opacity-80">{activeStorage}</span>
                </div>
                <div className="mt-auto text-[11px] text-white/70"> Titanium Design</div>
              </div>
            </div>

            {/* Right Form */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Finish Selector */}
              <div>
                <label className="text-[14px] font-semibold text-[#1d1d1f] block mb-3">
                  Finish: <span className="font-normal text-[#7a7a7a]">{activeColor}</span>
                </label>
                <div className="flex items-center space-x-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setActiveColor(color.name)}
                      className={`w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                        activeColor === color.name
                          ? 'ring-2 ring-offset-2 ring-[#0071e3]'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    >
                      {activeColor === color.name && (
                        <Check className="w-4 h-4 text-white drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Selector */}
              <div>
                <label className="text-[14px] font-semibold text-[#1d1d1f] block mb-3">
                  Storage:
                </label>
                <div className="space-y-3">
                  {storageOptions.map((opt) => (
                    <AppleConfiguratorChip
                      key={opt.label}
                      label={opt.label}
                      sublabel={opt.sublabel}
                      priceDelta={opt.priceDelta}
                      selected={activeStorage === opt.label}
                      onClick={() => setActiveStorage(opt.label)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search and Accessories Grid */}
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-[28px] font-semibold text-[#1d1d1f]">
                Accessories
              </h3>
              <p className="text-[14px] text-[#7a7a7a]">
                Essential companions designed specifically for Apple devices.
              </p>
            </div>
            <AppleSearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {accessories
              .filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item, idx) => (
                <AppleStoreCard
                  key={idx}
                  title={item.title}
                  price={item.price}
                  tag={item.tag}
                  onActionClick={() => alert(`Added ${item.title} to bag`)}
                />
              ))}
          </div>
        </section>

        {/* =========================================================================
            5. ENVIRONMENTAL QUOTE CARD
            ========================================================================= */}
        <AppleEnvironmentQuoteCard />

        {/* =========================================================================
            6. DESIGN TOKENS MATRIX (Interactive Reference)
            ========================================================================= */}
        <section className="max-w-[1024px] mx-auto py-16 px-4">
          <div className="border border-[#e0e0e0] bg-white rounded-[24px] p-8">
            <h3 className="text-[24px] font-semibold tracking-[-0.28px] text-[#1d1d1f] mb-6 flex items-center">
              <Palette className="w-5 h-5 text-[#0066cc] mr-2" />
              Design System Tokens Blueprint
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[14px]">
              {/* Colors */}
              <div className="bg-[#f5f5f7] p-4 rounded-[14px]">
                <h4 className="font-semibold text-[#1d1d1f] mb-3">Color Standards</h4>
                <ul className="space-y-2 text-[#333333]">
                  <li className="flex items-center justify-between">
                    <span>Action Blue:</span>
                    <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border">#0066cc</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Sky Link Blue:</span>
                    <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border">#2997ff</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Ink Text:</span>
                    <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border">#1d1d1f</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Parchment Canvas:</span>
                    <span className="font-mono text-[12px] bg-white px-2 py-0.5 rounded border">#f5f5f7</span>
                  </li>
                </ul>
              </div>

              {/* Typography */}
              <div className="bg-[#f5f5f7] p-4 rounded-[14px]">
                <h4 className="font-semibold text-[#1d1d1f] mb-3">Typography Rules</h4>
                <ul className="space-y-2 text-[#333333]">
                  <li>• Base Body: <strong>17px / 1.47</strong></li>
                  <li>• Tracking: <strong>-0.28px to -0.374px</strong></li>
                  <li>• Weights: <strong>300, 400, 600, 700</strong></li>
                  <li>• Weight 500: <em>Deliberately Absent</em></li>
                </ul>
              </div>

              {/* Geometry & Shadow */}
              <div className="bg-[#f5f5f7] p-4 rounded-[14px]">
                <h4 className="font-semibold text-[#1d1d1f] mb-3">Geometry & Elevation</h4>
                <ul className="space-y-2 text-[#333333]">
                  <li>• Product Shadow: <br /><code className="text-[11px] bg-white p-1 rounded block mt-1">rgba(0,0,0,0.22) 3px 5px 30px</code></li>
                  <li>• Buttons: <strong>9999px (Pill)</strong></li>
                  <li>• Cards: <strong>18px (LG)</strong></li>
                  <li>• Section Tiles: <strong>0px (Edge-to-edge)</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. FLOATING STICKY PURCHASING BAR
            ========================================================================= */}
        {showStickyBar && (
          <AppleFloatingStickyBar
            productName={`iPhone 17 Pro ${activeStorage} ${activeColor}`}
            price="$1,099.00 or $45.79/mo. for 24 mo."
            onAddToBag={() =>
              alert(`Added iPhone 17 Pro (${activeStorage}, ${activeColor}) to bag!`)
            }
          />
        )}
      </main>

      {/* 8. Full Extended Parchment Footer */}
      <AppleFooter />
    </div>
  )
}
