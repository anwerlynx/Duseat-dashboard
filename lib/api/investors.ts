import { apiRequest } from './client'
import { investors as fallbackInvestors, type PlatformInvestor } from '@/lib/platform-users'

export interface ApiInvestorRaw {
  _id?: string
  id?: string
  userId?: string
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  phoneNumber?: string
  phone?: string
  countryCode?: string
  country?: string
  countryFlag?: string
  isActive?: boolean
  status?: string
  isEmailVerified?: boolean
  isIdentityVerified?: boolean
  verificationStatus?: string
  verification?: string
  requestsCount?: number
  requests?: number
  dealsCount?: number
  deals?: number
  score?: number
  lastLogin?: string
  createdAt?: string
  joined?: string
  profileImage?: string
  avatar?: string
  nationality?: string
  preferredLanguage?: string
  language?: string
  occupation?: string
  budget?: string
  preferredAreas?: string[]
  address?: string
  identityVerification?: {
    status?: string
    documentType?: string
    documentFront?: string
    documentBack?: string
    passport?: string
    submittedAt?: string
    reviewedAt?: string
    rejectionReason?: string
  }
}

export function transformApiInvestor(raw: ApiInvestorRaw, index: number = 0): PlatformInvestor {
  const fallback = fallbackInvestors[index % fallbackInvestors.length]
  const id = raw.id || raw._id || raw.userId || `INV-${1000 + index}`
  const fullName =
    raw.name ||
    (raw.firstName && raw.lastName ? `${raw.firstName} ${raw.lastName}` : raw.firstName) ||
    fallback.name

  const isVerified =
    raw.isIdentityVerified === true ||
    raw.verificationStatus === 'APPROVED' ||
    raw.verificationStatus === 'VERIFIED' ||
    raw.verification === 'Verified'

  const isInReview =
    raw.verificationStatus === 'PENDING' ||
    raw.verificationStatus === 'IN_REVIEW' ||
    raw.verification === 'In review'

  const verification: PlatformInvestor['verification'] = isVerified
    ? 'Verified'
    : isInReview
    ? 'In review'
    : raw.verification === 'Revoked'
    ? 'Revoked'
    : 'Pending'

  const status: PlatformInvestor['status'] =
    raw.isActive === false || raw.status === 'Suspended' || raw.status === 'DEACTIVATED'
      ? 'Suspended'
      : raw.status === 'Banned'
      ? 'Banned'
      : raw.status === 'Pending'
      ? 'Pending'
      : 'Active'

  const createdDate = raw.createdAt || raw.joined || fallback.joined
  const joinedFormatted = createdDate ? new Date(createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : fallback.joined

  return {
    id: String(id),
    name: fullName,
    email: raw.email || fallback.email,
    phone: raw.phoneNumber || raw.phone || fallback.phone,
    country: raw.country || (raw.countryCode === '+971' ? 'United Arab Emirates' : raw.countryCode === '+20' ? 'Egypt' : fallback.country),
    countryFlag: raw.countryFlag || (raw.countryCode === '+971' || raw.country === 'UAE' ? '🇦🇪' : '🇪🇬'),
    status,
    verification,
    requests: raw.requestsCount ?? raw.requests ?? fallback.requests,
    deals: raw.dealsCount ?? raw.deals ?? fallback.deals,
    lastLogin: raw.lastLogin ? new Date(raw.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : fallback.lastLogin,
    joined: joinedFormatted,
    score: raw.score ?? fallback.score,
    personalInfo: {
      nationality: raw.nationality || fallback.personalInfo.nationality,
      language: raw.preferredLanguage || raw.language || fallback.personalInfo.language,
      occupation: raw.occupation || fallback.personalInfo.occupation,
      budget: raw.budget || fallback.personalInfo.budget,
      preferredAreas: raw.preferredAreas && raw.preferredAreas.length ? raw.preferredAreas : fallback.personalInfo.preferredAreas,
      address: raw.address || fallback.personalInfo.address,
      netWorthEstimated: fallback.personalInfo.netWorthEstimated,
    },
    devices: fallback.devices,
    loginHistory: fallback.loginHistory,
    timeline: fallback.timeline,
    verificationDocs: raw.identityVerification
      ? [
          {
            id: 'doc-1',
            name: raw.identityVerification.documentType || 'Emirates ID Front',
            type: 'Emirates ID Front',
            status: isVerified ? 'Verified' : isInReview ? 'In review' : 'Pending',
            uploadedAt: raw.identityVerification.submittedAt || joinedFormatted,
            fileUrl: raw.identityVerification.documentFront,
          },
        ]
      : fallback.verificationDocs,
    requestsList: fallback.requestsList,
    offersReceived: fallback.offersReceived,
    acceptedOffers: fallback.acceptedOffers,
    dealList: fallback.dealList,
    conversations: fallback.conversations,
    reports: fallback.reports,
    notifications: fallback.notifications,
    internalNotes: fallback.internalNotes,
    scoreBreakdown: fallback.scoreBreakdown,
  }
}

export async function fetchInvestorsList(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<{ items: PlatformInvestor[]; total: number; success: boolean }> {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.set('page', String(params.page))
  if (params?.limit) queryParams.set('limit', String(params.limit))
  if (params?.search) queryParams.set('search', params.search)

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
  const response = await apiRequest<any[]>(`/admin/investors${queryString}`)

  if (response.success && Array.isArray(response.data)) {
    const transformed = response.data.map((item, idx) => transformApiInvestor(item, idx))
    return {
      items: transformed,
      total: response.total ?? transformed.length,
      success: true,
    }
  }

  // Fallback to local data if backend unauthenticated or offline
  return {
    items: fallbackInvestors,
    total: fallbackInvestors.length,
    success: false,
  }
}

export async function fetchInvestorDetails(investorId: string) {
  return apiRequest<ApiInvestorRaw>(`/admin/investors/${investorId}`)
}

export async function setInvestorActiveStatus(investorId: string, activate: boolean) {
  const endpoint = `/admin/investors/${investorId}/${activate ? 'activate' : 'deactivate'}`
  return apiRequest(endpoint, { method: 'PATCH' })
}

export async function deleteInvestorAccount(investorId: string) {
  return apiRequest(`/admin/investors/${investorId}`, { method: 'DELETE' })
}

export async function reviewInvestorKYC(userId: string, action: 'APPROVE' | 'REJECT', rejectionReason?: string) {
  return apiRequest(`/admin/verifications/identity/${userId}/review`, {
    method: 'PUT',
    body: JSON.stringify({ action, rejectionReason }),
  })
}
