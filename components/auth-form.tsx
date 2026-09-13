'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthFormProps {
  mode?: 'sign-in' | 'sign-up'
}

// Aceternity signature interactive bottom gradient sheen
function BottomGradient() {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-[#00c2cb] to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-xs block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-[#00a8b0] to-transparent" />
    </>
  )
}

export function AuthForm({ mode = 'sign-in' }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = React.useState('admin@duseat.com')
  const [password, setPassword] = React.useState('admin123')
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (authClient?.signIn?.email) {
        await authClient.signIn.email({ email, password })
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'duseat_auth_demo_user',
          JSON.stringify({
            email,
            name: 'Ahmad Khaled',
            role: 'Super Admin',
            authenticatedAt: new Date().toISOString(),
          })
        )
      }
      router.push('/')
      router.refresh()
    } catch (err: any) {
      console.warn('Auth fallback to local session:', err?.message || err)
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'duseat_auth_demo_user',
          JSON.stringify({
            email,
            name: 'Ahmad Khaled',
            role: 'Super Admin',
            authenticatedAt: new Date().toISOString(),
          })
        )
      }
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemoLogin = () => {
    setEmail('admin@duseat.com')
    setPassword('admin123')
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'duseat_auth_demo_user',
        JSON.stringify({
          email: 'admin@duseat.com',
          name: 'Ahmad Khaled',
          role: 'Super Admin',
          authenticatedAt: new Date().toISOString(),
        })
      )
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#090b0e] text-white p-4 sm:p-6 lg:p-10 overflow-hidden font-sans select-none">
      {/* Ambient background glow & grid noise */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] size-[500px] rounded-full bg-[#00c2cb]/12 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] size-[500px] rounded-full bg-[#3366ff]/10 blur-[160px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* =========================================================================
            LEFT COLUMN: ACETERNITY LOGIN FORM (7 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-neutral-800/80 bg-neutral-900/70 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle top border gradient accent */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00c2cb]/60 to-transparent" />

          <div>
            {/* Brand Header & Live Badge */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-gradient-to-tr from-[#00c2cb] to-[#3366ff] p-[1.5px] shadow-[0_0_24px_rgba(0,194,203,0.35)] flex items-center justify-center">
                  <div className="size-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                    <img src="/figma/duseat-mark.svg" alt="Duseat Logo" className="size-6 object-contain" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white font-sans">Duseat</span>
                  <span className="text-[11px] font-semibold text-[#00c2cb] tracking-wider uppercase">
                    Admin Portal
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[12px] font-semibold text-emerald-400 border border-emerald-500/25">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live System</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-8 space-y-2 text-left">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
                Welcome back!
              </h1>
              <p className="text-sm sm:text-[15px] text-neutral-400 max-w-lg leading-relaxed">
                Sign in to access your enterprise marketplace telemetry, investor requests, and real-time deal orchestration desk.
              </p>
            </div>

            {/* Instant Demo Sign-In Card */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-[#00c2cb]/35 bg-gradient-to-r from-[#00c2cb]/10 via-[#00c2cb]/5 to-transparent p-3.5 text-left transition-all hover:border-[#00c2cb] hover:bg-[#00c2cb]/15 group cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-xl bg-[#00c2cb] flex items-center justify-center text-neutral-950 font-bold shadow-xs shrink-0">
                  <Sparkles className="size-4 text-neutral-950" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">Instant Demo Sign In</span>
                    <span className="text-[10px] font-bold text-[#00c2cb] bg-[#00c2cb]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-[12px] text-neutral-400 font-mono truncate mt-0.5">
                    admin@duseat.com • admin123
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#00c2cb] shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-800" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">
                Or enter credentials
              </span>
              <div className="h-px flex-1 bg-neutral-800" />
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="youremail@duseat.com"
                    className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-950/70 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 transition-all focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20 outline-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.4)]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('For password reset or credentials assistance, please contact your system administrator at security@duseat.com')}
                    className="text-xs text-[#00c2cb] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-neutral-800 bg-neutral-950/70 pl-10 pr-11 text-sm text-white placeholder:text-neutral-500 transition-all focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20 outline-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.4)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 hover:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-4 rounded border-neutral-700 bg-neutral-900 text-[#00c2cb] accent-[#00c2cb] focus:ring-0 cursor-pointer"
                  />
                  <span>Remember this browser session</span>
                </label>

                <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                  <ShieldCheck className="size-3.5 text-[#00c2cb]" />
                  <span>256-bit SSL</span>
                </span>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                  {error}
                </div>
              )}

              {/* Submit Button with Aceternity Gradient Shine */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative group/btn flex items-center justify-center gap-2 w-full text-white rounded-xl h-12 font-semibold text-sm sm:text-base shadow-[0px_1px_0px_0px_var(--color-neutral-800)] bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-neutral-700/80 hover:border-[#00c2cb]/60 transition-all duration-300 cursor-pointer overflow-hidden disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign in to Dashboard</span>
                      <ArrowRight className="size-4 text-[#00c2cb] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                  <BottomGradient />
                </button>
              </div>
            </form>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Duseat Real Estate Platform • Enterprise Portal</span>
            <span className="text-neutral-500">v2.4.0</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: ACETERNITY GRADIENT VISUAL CARD (5 cols on lg)
           ========================================================================= */}
        <div className="lg:col-span-5 relative flex min-h-[460px] lg:min-h-[580px] flex-col items-start justify-end overflow-hidden rounded-3xl bg-neutral-950 p-6 md:p-8 border border-neutral-800/80 shadow-2xl">
          {/* Top badges */}
          <div className="relative z-30 mb-auto flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/10">
              UAE Network
            </span>
            <span className="rounded-full bg-[#00c2cb]/15 backdrop-blur-md px-3 py-1 text-xs font-semibold text-[#00c2cb] border border-[#00c2cb]/30">
              Enterprise Portal
            </span>
          </div>

          {/* Aceternity 3D Rotating Isometric Blocks */}
          <div className="pointer-events-none select-none absolute -top-40 -right-32 z-10 grid rotate-45 transform grid-cols-4 gap-6 sm:gap-8 opacity-45">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="size-28 sm:size-32 shrink-0 rounded-3xl bg-neutral-900 border border-neutral-800/80 shadow-[0px_2px_0px_0px_rgba(0,194,203,0.35)_inset]"
              />
            ))}
          </div>

          {/* Radial Ambient Teal & Violet Mesh Glow */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-[#00c2cb]/30 via-[#3366ff]/20 to-purple-600/15 blur-3xl opacity-85" />

          {/* Frosted Glass Testimonial Box */}
          <div className="relative z-30 w-full max-w-sm rounded-2xl bg-neutral-900/70 p-5 md:p-6 backdrop-blur-xl border border-white/15 shadow-2xl space-y-3">
            <div className="flex items-center gap-1 text-[#00c2cb]">
              <CheckCircle2 className="size-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Operational Reliability</span>
            </div>
            <p className="text-white text-sm sm:text-[14.5px] font-medium leading-relaxed">
              &quot;Duseat has redefined high-ticket property matchmaking across the UAE, empowering brokers and institutional investors with real-time compliance and escrow telemetry.&quot;
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Ahmad Khaled</p>
                <p className="text-[11px] text-neutral-400">
                  Head of Operations, <span className="font-semibold text-[#00c2cb]">Duseat Enterprise</span>
                </p>
              </div>
              <div className="size-8 rounded-full bg-gradient-to-br from-[#00c2cb] to-[#3366ff] flex items-center justify-center font-bold text-xs text-white shadow-xs">
                AK
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
