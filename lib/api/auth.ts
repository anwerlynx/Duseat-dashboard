import { apiRequest, setAuthToken, clearAuthToken, getAuthToken } from './client'

export interface AdminUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  role: 'ADMIN' | 'SUPERADMIN' | 'AGENT' | 'INVESTOR'
  avatar?: string
  phone?: string
}

export async function loginAdmin(email: string, password: string) {
  const res = await apiRequest<{ token: string; user: AdminUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  if (res.success && res.data?.token) {
    setAuthToken(res.data.token, true)
    if (res.data.user) {
      localStorage.setItem('duseat_admin_user', JSON.stringify(res.data.user))
    }
  }

  return res
}

export async function getAdminProfile() {
  const res = await apiRequest<AdminUser>('/auth/me', {
    method: 'GET',
  })
  return res
}

export function logoutAdmin() {
  clearAuthToken()
  if (typeof window !== 'undefined') {
    localStorage.removeItem('duseat_admin_user')
  }
}
