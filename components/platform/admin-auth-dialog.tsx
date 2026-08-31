'use client'

import * as React from 'react'
import { KeyRound, Lock, Mail, ShieldAlert, X } from 'lucide-react'
import { loginAdmin, logoutAdmin, getAdminProfile } from '@/lib/api/auth'
import { getAuthToken } from '@/lib/api/client'
import { useToast } from '@/components/dashboard/toast'

interface AdminAuthDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AdminAuthDialog({ isOpen, onClose, onSuccess }: AdminAuthDialogProps) {
  const { toast } = useToast()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [currentToken, setCurrentToken] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isOpen) {
      setCurrentToken(getAuthToken())
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({ variant: 'error', title: 'Validation Error', description: 'Please provide both email and password.' })
      return
    }

    setLoading(true)
    try {
      const res = await loginAdmin(email, password)
      if (res.success) {
        toast({
          variant: 'success',
          title: 'Connected to Backend',
          description: 'Successfully authenticated with Duseat Production API.',
        })
        setCurrentToken(getAuthToken())
        if (onSuccess) onSuccess()
        onClose()
      } else {
        toast({
          variant: 'error',
          title: 'Authentication Failed',
          description: res.error || 'Invalid admin credentials.',
        })
      }
    } catch {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Failed to connect to backend server.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    setCurrentToken(null)
    toast({
      variant: 'info',
      title: 'Signed Out',
      description: 'Cleared authentication token.',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-md rounded-[16px] border border-[#d3d5d7] bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-[#e5e7eb]">
          <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#00c2cb]/10 text-[#00c2cb]">
            <KeyRound className="size-5" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#1f2327]">Connect Backend API</h3>
            <p className="text-[12px] text-[#6f777f]">Authenticate with https://backend.duseatbackend.com</p>
          </div>
        </div>

        {currentToken ? (
          <div className="space-y-4 py-4">
            <div className="rounded-[10px] bg-[#ecfdf3] border border-[#a6f4c5] p-3 text-[13px] text-[#027a48]">
              <p className="font-bold">✓ Active JWT Token Attached</p>
              <p className="text-[12px] mt-0.5 break-all font-mono text-[#05603a] opacity-80">
                Bearer {currentToken.slice(0, 20)}...{currentToken.slice(-10)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full h-10 rounded-[10px] border border-[#f04438] text-[13px] font-bold text-[#f04438] hover:bg-[#fef3f2] transition-colors"
            >
              Sign Out & Clear Token
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#1f2327] mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6f777f]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@duseat.com"
                  required
                  className="h-10 w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1f2327] mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6f777f]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-10 w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-[10px] bg-[#00c2cb] text-[14px] font-bold text-white shadow-2xs hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Live Backend'}
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-[#e5e7eb] flex items-center justify-between text-[11px] text-[#6f777f]">
          <span>Role: ADMIN / SUPERADMIN</span>
          <span>API: v1.4.0</span>
        </div>
      </div>
    </div>
  )
}
