/**
 * Duseat Admin API Base Client
 * Backend Swagger: https://backend.duseatbackend.com/api-docs/#/
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://backend.duseatbackend.com/api/v1'

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  success: boolean
  status: number
  total?: number
  totalPages?: number
  currentPage?: number
}

// Token helper
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('duseat_admin_jwt_token') || sessionStorage.getItem('duseat_admin_jwt_token') || null
}

export function setAuthToken(token: string, persist: boolean = true) {
  if (typeof window === 'undefined') return
  if (persist) {
    localStorage.setItem('duseat_admin_jwt_token', token)
  } else {
    sessionStorage.setItem('duseat_admin_jwt_token', token)
  }
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('duseat_admin_jwt_token')
  sessionStorage.removeItem('duseat_admin_jwt_token')
}

// Base Fetch Function
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken()
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${cleanEndpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'language': 'en',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const contentType = response.headers.get('content-type') || ''
    let data: any = null

    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data?.message || data?.error || `Request failed with status ${response.status}`,
        data,
      }
    }

    return {
      success: true,
      status: response.status,
      data: data?.data ?? data,
      total: data?.meta?.total ?? data?.total,
      totalPages: data?.meta?.totalPages ?? data?.totalPages,
      currentPage: data?.meta?.currentPage ?? data?.page,
      message: data?.message,
    }
  } catch (err: any) {
    return {
      success: false,
      status: 0,
      error: err?.message || 'Network error connecting to Duseat backend',
    }
  }
}
