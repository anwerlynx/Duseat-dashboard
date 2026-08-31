import { apiRequest } from './client'
import { agents as fallbackAgents, type PlatformAgent } from '@/lib/platform-users'

export interface ApiAgentRaw {
  _id?: string
  id?: string
  userId?: string
  firstName?: string
  lastName?: string
  name?: string
  agencyName?: string
  agency?: string
  email?: string
  phoneNumber?: string
  phone?: string
  countryCode?: string
  country?: string
  countryFlag?: string
  licenseNumber?: string
  reraNumber?: string
  isLicenseVerified?: boolean
  licenseStatus?: string
  verification?: string
  isActive?: boolean
  status?: string
  rating?: number
  offersCount?: number
  offers?: number
  acceptedOffersCount?: number
  accepted?: number
  subscriptionTier?: string
  subscription?: string
  revenue?: string
  lastLogin?: string
  createdAt?: string
  joined?: string
  profileImage?: string
  avatar?: string
  tradeLicense?: {
    number?: string
    expiry?: string
    issuer?: string
    status?: string
  }
  reraVerification?: {
    number?: string
    category?: string
    expiry?: string
    status?: string
  }
}

export function transformApiAgent(raw: ApiAgentRaw, index: number = 0): PlatformAgent {
  const fallback = fallbackAgents[index % fallbackAgents.length]
  const id = raw.id || raw._id || raw.userId || `AG-${1040 + index}`
  const fullName =
    raw.name ||
    (raw.firstName && raw.lastName ? `${raw.firstName} ${raw.lastName}` : raw.firstName) ||
    fallback.name

  const isLicenseVerified =
    raw.isLicenseVerified === true ||
    raw.licenseStatus === 'APPROVED' ||
    raw.licenseStatus === 'VERIFIED' ||
    raw.verification === 'Verified'

  const verification = isLicenseVerified ? 'Verified' : raw.verification || 'In review'
  const status = raw.isActive === false || raw.status === 'Suspended' ? 'Suspended' : raw.status || 'Active'

  const createdDate = raw.createdAt || raw.joined || fallback.joined
  const joinedFormatted = createdDate
    ? new Date(createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : fallback.joined

  return {
    id: String(id),
    name: fullName,
    agency: raw.agencyName || raw.agency || fallback.agency,
    email: raw.email || fallback.email,
    phone: raw.phoneNumber || raw.phone || fallback.phone,
    country: raw.country || fallback.country,
    countryFlag: raw.countryFlag || (raw.countryCode === '+971' ? '🇦🇪' : fallback.countryFlag),
    reraNumber: raw.licenseNumber || raw.reraNumber || fallback.reraNumber,
    verification,
    status,
    license: isLicenseVerified ? 'Active' : 'Pending Verification',
    joined: joinedFormatted,
    rating: raw.rating ?? fallback.rating,
    offers: raw.offersCount ?? raw.offers ?? fallback.offers,
    accepted: raw.acceptedOffersCount ?? raw.accepted ?? fallback.accepted,
    subscription: raw.subscriptionTier || raw.subscription || fallback.subscription,
    revenue: raw.revenue || fallback.revenue,
    lastLogin: raw.lastLogin ? new Date(raw.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : fallback.lastLogin,
    company: fallback.company,
    tradeLicense: {
      number: raw.tradeLicense?.number || fallback.tradeLicense.number,
      expiry: raw.tradeLicense?.expiry || fallback.tradeLicense.expiry,
      issuer: raw.tradeLicense?.issuer || fallback.tradeLicense.issuer,
      status: raw.tradeLicense?.status || fallback.tradeLicense.status,
    },
    reraVerification: {
      number: raw.reraVerification?.number || raw.licenseNumber || fallback.reraVerification.number,
      category: raw.reraVerification?.category || fallback.reraVerification.category,
      expiry: raw.reraVerification?.expiry || fallback.reraVerification.expiry,
      status: isLicenseVerified ? 'Verified' : 'Pending',
    },
    documents: fallback.documents,
    performance: fallback.performance,
    offersList: fallback.offersList,
    requestsWon: fallback.requestsWon,
    dealList: fallback.dealList,
    chats: fallback.chats,
    payments: fallback.payments,
    reports: fallback.reports,
    timeline: fallback.timeline,
    notes: fallback.notes,
  }
}

export async function fetchAgentsList(params?: {
  page?: number
  limit?: number
  search?: string
  licenseStatus?: string
  isActive?: boolean
}): Promise<{ items: PlatformAgent[]; total: number; success: boolean }> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.set('page', String(params.page))
  if (params?.limit) queryParams.set('limit', String(params.limit))
  if (params?.search) queryParams.set('search', params.search)
  if (params?.licenseStatus) queryParams.set('licenseStatus', params.licenseStatus)
  if (params?.isActive !== undefined) queryParams.set('isActive', String(params.isActive))

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  const response = await apiRequest<any[]>(`/admin/agents${queryString}`)

  if (response.success && Array.isArray(response.data)) {
    const transformed = response.data.map((item, idx) => transformApiAgent(item, idx))
    return {
      items: transformed,
      total: response.total ?? transformed.length,
      success: true,
    }
  }

  return {
    items: fallbackAgents,
    total: fallbackAgents.length,
    success: false,
  }
}

export async function fetchAgentDetails(agentId: string) {
  return apiRequest<ApiAgentRaw>(`/admin/agents/${agentId}`)
}

export async function setAgentActiveStatus(agentId: string, activate: boolean) {
  const endpoint = `/admin/agents/${agentId}/${activate ? 'activate' : 'deactivate'}`
  return apiRequest(endpoint, { method: 'PATCH' })
}

export async function deleteAgentAccount(agentId: string) {
  return apiRequest(`/admin/agents/${agentId}`, { method: 'DELETE' })
}

export async function reviewAgentLicense(agentId: string, action: 'APPROVE' | 'REJECT', rejectionReason?: string) {
  return apiRequest(`/admin/verifications/license/${agentId}/review`, {
    method: 'PUT',
    body: JSON.stringify({ action, rejectionReason }),
  })
}
