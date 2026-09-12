export type ChatMessage = {
  id: string
  from: 'user' | 'agent' | 'system'
  text: string
  time: string
  propertyRef?: string
  offerRef?: string
}

export type Conversation = {
  id: string
  agentId: string
  with: string
  agency: string
  avatar?: string
  topic: string
  requestRef: string
  offerRef?: string
  updated: string
  unreadCount?: number
  dealStatus?: 'In negotiation' | 'Offer accepted' | 'Escrow active' | 'Deal closed'
  messages: ChatMessage[]
}

export type ActivityItem = {
  id?: string
  title: string
  detail: string
  date: string
  tone?: 'success' | 'warning' | 'info' | 'destructive'
  author?: string
}

export type PropertyOffer = {
  id: string
  requestId: string
  agentId: string
  agentName: string
  agency: string
  agentAvatar?: string
  verifiedRera: boolean
  proAgent: boolean
  rating: number
  reviewsCount: number
  propertyTitle: string
  location: string
  price: string
  roi?: string
  paymentPlan: string
  completionDate: string
  description: string
  status: 'Pending' | 'Accepted' | 'Declined' | 'Under review'
  submitted: string
  photos: string[]
}

export type PropertyRequest = {
  id: string
  investorId: string
  investorName: string
  investorAvatar?: string
  countryFlag?: string
  onlineStatus?: string
  timeAgo: string
  title: string
  note?: string
  purpose: 'Living' | 'Investment'
  investmentType?: 'Residential' | 'Commercial'
  commercialUnitType?: 'Office' | 'Retail Shop' | 'Warehouse' | 'Other'
  propertyType: 'Villa' | 'Townhouse' | 'Apartment' | 'Penthouse' | 'Office' | 'Retail Shop' | 'Warehouse' | 'Other' | string
  bedrooms: 'Studio' | '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '5 BHK' | '6 BHK' | '+7 BHK' | '1 Bedroom' | '2 Bedrooms' | '3 Bedrooms' | '4 Bedrooms' | '5 Bedrooms' | '6+ Bedrooms' | 'N/A' | string
  unitStatus: 'Ready' | 'Offplan' | 'Off-plan'
  budget: string
  preferredAreas: string[]
  paymentMethod: 'Mortgage' | 'Cash'
  mortgageEligibility?: 'Yes' | 'No' | 'not sure'
  mortgageEligible?: boolean
  paymentPlan?: 'Long-term payment plan' | 'Short-term payment plan' | 'Long term payment' | 'Not applicable' | 'Installments' | string
  developerPreference: {
    hasPreference: boolean
    selected: string[]
  }
  communication: {
    autoMatchLanguages: boolean
    preferredLanguages: string[]
  }
  agentsPitchingCount: number
  agentsPitching: { name: string; agency: string; avatar?: string }[]
  offersCount: number
  status: 'Draft' | 'Open' | 'Matched' | 'Closed' | 'Expired' | 'Archived' | 'Receiving offers' | 'Deal confirmed'
  created: string
  dealConfirmed?: boolean
  dealWinner?: {
    name: string
    title: string
    agency: string
    avatar?: string
    amount: string
    date: string
  }
  offers: PropertyOffer[]
}

export function generateRequestTitle(req: Partial<PropertyRequest>): string {
  const isComm = req.purpose === 'Investment' && req.investmentType === 'Commercial'
  const unitLabel = isComm
    ? `${req.commercialUnitType || req.propertyType || 'Commercial Unit'}`
    : `${req.bedrooms || '2 BHK'} ${req.propertyType || 'Apartment'}`
  const statusLabel = (req.unitStatus || 'Ready').toLowerCase().replace('off-plan', 'offplan')
  const purposeLabel = req.purpose === 'Living' ? 'for living' : req.investmentType === 'Commercial' ? 'for commercial investment' : 'for investment'
  const areaLabel = req.preferredAreas && req.preferredAreas.length > 0 ? `in ${req.preferredAreas[0]}` : 'in Dubai'
  return `I'm looking for a ${statusLabel} ${unitLabel} ${purposeLabel} ${areaLabel}.`
}

export type VerificationDocument = {
  id: string
  name: string
  type: 'Passport' | 'Emirates ID Front' | 'Emirates ID Back' | 'Proof of Funds' | 'Trade License'
  status: 'Verified' | 'In review' | 'Rejected' | 'Pending'
  uploadedAt: string
  reviewedBy?: string
  reviewNotes?: string
  fileUrl?: string
}

export type PlatformInvestor = {
  id: string
  name: string
  avatar?: string
  email: string
  phone: string
  country: string
  countryFlag: string
  status: 'Active' | 'Pending' | 'Suspended' | 'Banned' | string
  verification: 'Verified' | 'In review' | 'Under review' | 'Pending' | 'Revoked' | string
  requests: number
  deals: number
  lastLogin: string
  joined: string
  score: number
  personalInfo: {
    nationality: string
    language: string
    occupation: string
    budget: string
    preferredAreas: string[]
    address: string
    netWorthEstimated?: string
    sourceOfWealth?: string
    preferredLanguage?: string
  }
  devices: { name: string; location: string; ip: string; lastSeen: string; current?: boolean }[]
  loginHistory: ActivityItem[]
  timeline: ActivityItem[]
  verificationDocs: VerificationDocument[]
  requestsList: PropertyRequest[]
  offersReceived: PropertyOffer[]
  acceptedOffers: PropertyOffer[]
  dealList: {
    id: string
    agent: string
    agency: string
    property: string
    date: string
    amount: string
    commission: string
    status: 'In progress' | 'Escrow active' | 'Completed' | 'Cancelled'
  }[]
  conversations: Conversation[]
  reports: ActivityItem[]
  notifications: ActivityItem[]
  internalNotes: ActivityItem[]
  scoreBreakdown: {
    requestVelocity: number
    responseRate: number
    closingSpeed: number
    trustVerification: number
  }
}

export type PlatformAgent = {
  id: string
  name: string
  avatar?: string
  agency: string
  email: string
  phone: string
  country: string
  countryFlag: string
  reraNumber: string
  verification: string
  status: string
  license: string
  joined: string
  rating: number
  offers: number
  accepted: number
  subscription: string
  revenue: string
  lastLogin: string
  company: { tradeName: string; legalName: string; address: string; emirate: string; teamSize: string; website: string }
  tradeLicense: { number: string; expiry: string; issuer: string; status: string }
  reraVerification: { number: string; category: string; expiry: string; status: string }
  documents: { name: string; type: string; status: string; uploaded: string }[]
  performance: { responseRate: string; conversionRate: string; avgResponse: string; rating: string; activeDeals: number }
  offersList: {
    id?: string
    investor: string
    investorRole?: string
    investorAvatar?: string
    investorFlag?: string
    request: string
    proposalDescription?: string
    photos?: string[]
    location?: string
    brochureName?: string
    amount: string
    date: string
    status: 'Accepted' | 'Pending' | 'Declined' | 'Under review' | string
  }[]
  requestsWon: { title: string; investor: string; wonAt: string; value: string }[]
  dealList: { investor: string; property: string; date: string; amount: string; status: string }[]
  chats: Conversation[]
  payments: ActivityItem[]
  reports: ActivityItem[]
  timeline: ActivityItem[]
  notes: ActivityItem[]
}

export type InvestorBase = Pick<
  PlatformInvestor,
  'id' | 'name' | 'email' | 'phone' | 'country' | 'countryFlag' | 'status' | 'verification' | 'requests' | 'deals' | 'lastLogin' | 'joined' | 'score' | 'avatar'
>

export const investorBases: InvestorBase[] = [
  { id: 'IN-2048', name: 'Anwar Hosny', email: 'anwar.hosny@emirates.ae', phone: '+971 50 248 9912', country: 'United Arab Emirates', countryFlag: '🇦🇪', status: 'Active', verification: 'Verified', requests: 8, deals: 3, lastLogin: 'Today, 09:42', joined: '28 May 2026', score: 96, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80' },
  { id: 'IN-2047', name: 'Sarah Johnson', email: 'sarah.j@investments.co.uk', phone: '+971 52 441 0288', country: 'United Kingdom', countryFlag: '🇬🇧', status: 'Active', verification: 'Verified', requests: 12, deals: 5, lastLogin: 'Today, 08:16', joined: '27 May 2026', score: 92, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
  { id: 'IN-2046', name: 'Ahmed Al Mansoori', email: 'ahmed.m@almansoori.ae', phone: '+971 50 901 2248', country: 'United Arab Emirates', countryFlag: '🇦🇪', status: 'Active', verification: 'Verified', requests: 6, deals: 2, lastLogin: 'Yesterday, 19:04', joined: '26 May 2026', score: 94, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { id: 'IN-2045', name: 'Omar Nasser', email: 'omar.nasser@alrajhi-invest.sa', phone: '+966 54 667 1300', country: 'Saudi Arabia', countryFlag: '🇸🇦', status: 'Active', verification: 'Verified', requests: 17, deals: 6, lastLogin: 'Yesterday, 14:22', joined: '25 May 2026', score: 98, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80' },
  { id: 'IN-2044', name: 'Maya Karim', email: 'maya.karim@cairo-capital.eg', phone: '+20 100 555 1843', country: 'Egypt', countryFlag: '🇪🇬', status: 'Pending', verification: 'In review', requests: 3, deals: 0, lastLogin: '04 Jun 2026', joined: '23 May 2026', score: 68, avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80' },
  { id: 'IN-2043', name: 'Sara Mansour', email: 'sara.mansour@kuwait-fund.kw', phone: '+965 52 740 8531', country: 'Kuwait', countryFlag: '🇰🇼', status: 'Suspended', verification: 'Verified', requests: 5, deals: 1, lastLogin: '03 Jun 2026', joined: '22 May 2026', score: 54, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
]

function createOffersForRequest(requestId: string): PropertyOffer[] {
  return [
    {
      id: `OFF-${requestId}-01`,
      requestId,
      agentId: 'AG-1048',
      agentName: 'Ahmed Khaled',
      agency: 'Emirates Living Real Estate',
      agentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      verifiedRera: true,
      proAgent: true,
      rating: 4.9,
      reviewsCount: 42,
      propertyTitle: 'Luxury Golf-View 4BR Villa in Al Barsha',
      location: 'Al Barsha 3, Dubai',
      price: 'AED 4,650,000',
      roi: '8.2% Net ROI',
      paymentPlan: '30/70 Handover payment plan',
      completionDate: 'Q4 2026',
      description: 'Rare chance to own a luxury golf-view villa with premium finishes, spacious interiors, and prime location in Al Barsha. Ideal for upscale family living or high-yield investment.',
      status: 'Accepted',
      submitted: '15 min ago',
      photos: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: `OFF-${requestId}-02`,
      requestId,
      agentId: 'AG-1047',
      agentName: 'Layla Haddad',
      agency: 'Avenue Realty Dubai',
      agentAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      verifiedRera: true,
      proAgent: true,
      rating: 4.8,
      reviewsCount: 38,
      propertyTitle: 'Modern Contemporary 4BR Standalone Villa',
      location: 'Dubai Hills Estate, Maple',
      price: 'AED 4,850,000',
      roi: '7.6% Net ROI',
      paymentPlan: 'Post-handover 2-year payment plan',
      completionDate: 'Ready to move',
      description: 'Direct from developer, brand new 4-bedroom villa with private pool, landscaped garden and maids room. Walking distance to Dubai Hills park.',
      status: 'Pending',
      submitted: '35 min ago',
      photos: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      id: `OFF-${requestId}-03`,
      requestId,
      agentId: 'AG-1046',
      agentName: 'Omar Nasser',
      agency: 'Nexus Properties Dubai',
      agentAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      verifiedRera: true,
      proAgent: false,
      rating: 4.7,
      reviewsCount: 29,
      propertyTitle: 'Off-Plan 4BR Villa with Skyline View',
      location: 'The Valley by Emaar',
      price: 'AED 4,200,000',
      roi: '8.8% Capital Growth',
      paymentPlan: '80/20 Payment plan with Emaar',
      completionDate: 'Q2 2027',
      description: 'Prime investment opportunity with Emaar. Attractive launch price with guaranteed capital appreciation and flexible installments.',
      status: 'Under review',
      submitted: '2 hrs ago',
      photos: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      ],
    },
  ]
}

function buildInvestor(base: InvestorBase, index: number): PlatformInvestor {
  const isOmar = base.name === 'Omar Nasser' || base.id === 'IN-2045'
  const isAnwar = base.name === 'Anwar Hosny' || base.id === 'IN-2048'

  // Dynamic requests specific to the investor
  const omarReq1: PropertyRequest = {
    id: 'REQ-2040',
    investorId: base.id,
    investorName: 'Omar Nasser',
    investorAvatar: base.avatar,
    countryFlag: '🇸🇦',
    onlineStatus: 'Online (Avg 10m)',
    timeAgo: '12 min ago',
    title: "I'm looking for a ready 6 Bedrooms Luxury Beachfront Villa for living in Palm Jumeirah.",
    note: 'Private beach access with infinity pool and Dubai Marina skyline views. Proof of funds verified.',
    purpose: 'Living',
    propertyType: 'Villa',
    bedrooms: '6 Bedrooms',
    unitStatus: 'Ready',
    budget: '35M–40M AED',
    preferredAreas: ['Palm Jumeirah', 'Frond N', 'Frond K'],
    paymentMethod: 'Cash',
    mortgageEligible: false,
    mortgageEligibility: 'No',
    paymentPlan: '10% Escrow Deposit / Balance at DLD',
    developerPreference: {
      hasPreference: false,
      selected: ['Open to all signature developers'],
    },
    communication: {
      autoMatchLanguages: true,
      preferredLanguages: ['Arabic', 'English'],
    },
    agentsPitchingCount: 14,
    agentsPitching: [
      { name: 'Youssef Ali', agency: 'Palm Luxury Living Real Estate', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
      { name: 'Layla Haddad', agency: 'Avenue Realty Dubai' },
    ],
    offersCount: 14,
    status: 'Deal confirmed',
    dealConfirmed: true,
    dealWinner: {
      name: 'Youssef Ali',
      title: 'Palm Luxury Living Real Estate',
      agency: 'Palm Luxury Living Real Estate',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      amount: 'AED 38,000,000',
      date: '20 May 2026',
    },
    created: '18 Apr 2026',
    offers: [
      {
        id: 'OFF-9118',
        requestId: 'REQ-2040',
        agentId: 'AG-1046',
        agentName: 'Youssef Ali',
        agency: 'Palm Luxury Living Real Estate',
        agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        verifiedRera: true,
        proAgent: true,
        rating: 4.9,
        reviewsCount: 56,
        propertyTitle: 'Beachfront Signature Villa · Palm Jumeirah',
        location: 'Palm Jumeirah, Frond N, Dubai',
        price: 'AED 38,000,000',
        roi: 'Guaranteed Capital Appreciation',
        paymentPlan: '10% Escrow Deposit / Balance at DLD',
        completionDate: 'Ready to move',
        description: 'Signature beachfront villa on Frond N of Palm Jumeirah. Private beach access, infinity pool, Italian marble finishings, panoramic Dubai Marina skyline views.',
        status: 'Accepted',
        submitted: '18 Apr 2026',
        photos: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
        ],
      },
    ],
  }

  const omarReq2: PropertyRequest = {
    id: 'REQ-IN-2048-04',
    investorId: base.id,
    investorName: 'Omar Nasser',
    investorAvatar: base.avatar,
    countryFlag: '🇸🇦',
    onlineStatus: 'Online (Avg 10m)',
    timeAgo: '27 min ago',
    title: "I'm looking for a ready Office commercial unit for investment in Business Bay.",
    note: 'Grade A commercial tower with existing corporate tenant or high expected ROI (>8.5%).',
    purpose: 'Investment',
    investmentType: 'Commercial',
    commercialUnitType: 'Office',
    propertyType: 'Office',
    bedrooms: 'N/A',
    unitStatus: 'Ready',
    budget: '3.8M–5M AED',
    preferredAreas: ['Business Bay', 'DIFC', 'Downtown Dubai'],
    paymentMethod: 'Cash',
    mortgageEligible: false,
    paymentPlan: 'Not applicable',
    developerPreference: {
      hasPreference: false,
      selected: ['Open to all'],
    },
    communication: {
      autoMatchLanguages: true,
      preferredLanguages: ['Arabic', 'English'],
    },
    agentsPitchingCount: 19,
    agentsPitching: [
      { name: 'Noura Salem', agency: 'Prime Commercial Properties', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
      { name: 'Layla Haddad', agency: 'Avenue Realty Dubai' },
    ],
    offersCount: 19,
    status: 'Matched',
    dealConfirmed: false,
    created: '12 May 2026',
    offers: [
      {
        id: 'OFF-REQ-IN-2048-04-01',
        requestId: 'REQ-IN-2048-04',
        agentId: 'AG-1045',
        agentName: 'Noura Salem',
        agency: 'Prime Commercial Properties',
        agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        verifiedRera: true,
        proAgent: true,
        rating: 4.8,
        reviewsCount: 38,
        propertyTitle: 'Full Floor Commercial Office · Business Bay, Opus Tower',
        location: 'Business Bay, Opus Tower, Dubai',
        price: 'AED 4,650,000',
        roi: '8.9% Net ROI',
        paymentPlan: '100% Cash Transfer with Existing Lease',
        completionDate: 'Ready (Tenanted)',
        description: 'Prime corporate office floor in Zaha Hadid designed Opus Tower. Fully fitted with corporate multinational tenant paying 8.9% net ROI.',
        status: 'Under review',
        submitted: '10 min ago',
        photos: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        id: 'OFF-REQ-IN-2048-04-02',
        requestId: 'REQ-IN-2048-04',
        agentId: 'AG-1043',
        agentName: 'Layla Haddad',
        agency: 'Avenue Realty Dubai',
        agentAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        verifiedRera: true,
        proAgent: true,
        rating: 4.8,
        reviewsCount: 42,
        propertyTitle: 'Fitted Corporate Office · DIFC Gate Precinct',
        location: 'DIFC, Gate Precinct, Dubai',
        price: 'AED 4,950,000',
        roi: '8.4% Net ROI',
        paymentPlan: 'Cash Transfer',
        completionDate: 'Ready (Vacant)',
        description: 'Fitted premium office in DIFC financial center. Ideal for wealth advisory or family office.',
        status: 'Pending',
        submitted: '2 hrs ago',
        photos: [
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80',
        ],
      },
    ],
  }

  const omarReq3: PropertyRequest = {
    id: `REQ-${base.id}-03`,
    investorId: base.id,
    investorName: 'Omar Nasser',
    investorAvatar: base.avatar,
    countryFlag: '🇸🇦',
    onlineStatus: 'Online (Avg 10m)',
    timeAgo: '1 day ago',
    title: "I'm looking for a ready 3 BHK Penthouse for investment in Downtown Dubai.",
    note: 'Burj Khalifa view. Minimum 2,800 sq ft with private terrace.',
    purpose: 'Investment',
    propertyType: 'Penthouse',
    bedrooms: '3 BHK',
    unitStatus: 'Ready',
    budget: '8.5M–10M AED',
    preferredAreas: ['Downtown Dubai', 'Burj Crown', 'Il Primo'],
    paymentMethod: 'Cash',
    mortgageEligible: false,
    paymentPlan: 'Not applicable',
    developerPreference: {
      hasPreference: true,
      selected: ['Emaar'],
    },
    communication: {
      autoMatchLanguages: true,
      preferredLanguages: ['Arabic', 'English'],
    },
    agentsPitchingCount: 8,
    agentsPitching: [
      { name: 'Youssef Ali', agency: 'Palm Luxury Living Real Estate' },
    ],
    offersCount: 8,
    status: 'Open',
    created: '24 May 2026',
    offers: createOffersForRequest(`REQ-${base.id}-03`),
  }

  // Generic request generator for other investors
  const defaultReq1: PropertyRequest = {
    id: `REQ-${base.id}-01`,
    investorId: base.id,
    investorName: base.name,
    investorAvatar: base.avatar,
    countryFlag: base.countryFlag,
    onlineStatus: 'Online (Avg 10m)',
    timeAgo: '3 min ago',
    title: `I'm looking for a ready 4 Bedrooms Villa for living in ${base.country === 'United Arab Emirates' ? 'Nad Al Sheba' : 'Dubai Hills'}.`,
    note: 'Private garden and maid room preferred.',
    purpose: 'Living',
    propertyType: 'Villa',
    bedrooms: '4 BHK',
    unitStatus: 'Ready',
    budget: '4M–6M AED',
    preferredAreas: ['Nad Al Sheba', 'Dubai Hills Estate', 'Meydan'],
    paymentMethod: 'Cash',
    mortgageEligible: false,
    paymentPlan: 'Not applicable',
    developerPreference: {
      hasPreference: false,
      selected: ['Open to all'],
    },
    communication: {
      autoMatchLanguages: true,
      preferredLanguages: ['Arabic', 'English'],
    },
    agentsPitchingCount: 12,
    agentsPitching: [
      { name: 'Liam Johnson', agency: 'Apex Elite' },
      { name: 'Layla Haddad', agency: 'Avenue Realty' },
    ],
    offersCount: 12,
    status: 'Receiving offers',
    created: 'Today, 09:12',
    offers: createOffersForRequest(`REQ-${base.id}-01`),
  }

  const defaultReq2: PropertyRequest = {
    id: `REQ-${base.id}-02`,
    investorId: base.id,
    investorName: base.name,
    investorAvatar: base.avatar,
    countryFlag: base.countryFlag,
    onlineStatus: 'Online (Avg 10m)',
    timeAgo: '15 min ago',
    title: "I'm looking for a ready 2 BHK Apartment for living in Downtown Dubai.",
    note: 'Burj Khalifa or Fountain view is a must. Pre-approved.',
    purpose: 'Living',
    propertyType: 'Apartment',
    bedrooms: '2 BHK',
    unitStatus: 'Ready',
    budget: '2.2M–2.8M AED',
    preferredAreas: ['Downtown Dubai', 'DIFC', 'Business Bay'],
    paymentMethod: 'Mortgage',
    mortgageEligible: true,
    paymentPlan: 'Not applicable',
    developerPreference: {
      hasPreference: false,
      selected: ['Open to all'],
    },
    communication: {
      autoMatchLanguages: true,
      preferredLanguages: ['English', 'Arabic'],
    },
    agentsPitchingCount: 16,
    agentsPitching: [
      { name: 'Noura Salem', agency: 'Crescent Realty' },
      { name: 'Zayd Ibrahim', agency: 'Urban Key' },
    ],
    offersCount: 16,
    status: 'Receiving offers',
    created: 'Yesterday, 16:30',
    offers: createOffersForRequest(`REQ-${base.id}-02`),
  }

  const allRequests = isOmar
    ? [omarReq1, omarReq2, omarReq3]
    : [defaultReq1, defaultReq2]

  const allOffers = allRequests.flatMap((r) => r.offers)
  const acceptedOffers = allOffers.filter((o) => o.status === 'Accepted')

  return {
    ...base,
    personalInfo: isOmar
      ? {
          nationality: 'Saudi',
          language: 'Arabic, English',
          occupation: 'Managing Director · Al Rajhi Investment Group',
          budget: 'AED 50,000,000+ Allocation',
          preferredAreas: ['Palm Jumeirah', 'Business Bay', 'DIFC', 'Downtown Dubai'],
          address: 'Palm Jumeirah Signature Villa & Riyadh, KSA',
          netWorthEstimated: 'AED 65,000,000+',
          sourceOfWealth: 'Private Equity & Commercial Real Estate',
          preferredLanguage: 'Arabic',
        }
      : {
          nationality: base.country === 'United Arab Emirates' ? 'Emirati' : base.country === 'Saudi Arabia' ? 'Saudi' : 'International',
          language: 'Arabic, English',
          occupation: 'Property Investor',
          budget: 'AED 4M – 15M',
          preferredAreas: ['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah'],
          address: `Dubai, UAE & ${base.country}`,
          netWorthEstimated: 'AED 25,000,000+',
          sourceOfWealth: 'Business Capital',
          preferredLanguage: 'English',
        },
    devices: [
      { name: 'MacBook Pro 16" · Chrome', location: `${base.country}`, ip: '194.170.82.14', lastSeen: base.lastLogin, current: true },
      { name: 'iPhone 15 Pro Max · Duseat iOS App', location: `${base.country}`, ip: '185.12.44.91', lastSeen: 'Today, 08:30' },
    ],
    loginHistory: [
      { id: 'lh-1', title: 'Successful biometric login', detail: `Duseat iOS App · iPhone 15 Pro · ${base.country}`, date: base.lastLogin, tone: 'success' },
      { id: 'lh-2', title: 'Web dashboard access', detail: `MacBook Pro · Chrome 124 · ${base.country}`, date: 'Yesterday, 18:20', tone: 'info' },
      { id: 'lh-3', title: 'Security verification passed', detail: '2-Factor authentication token confirmed', date: '28 May 2026', tone: 'success' },
    ],
    timeline: isOmar
      ? [
          { id: 'tl-1', title: 'Deal Completed & Title Deed Conveyed', detail: 'DEAL-4820 executed at Dubai Land Department. Signature Villa Palm Jumeirah (AED 38,000,000) transferred.', date: '20 May 2026', tone: 'success' },
          { id: 'tl-2', title: 'Escrow Deposit Funded', detail: 'AED 3,800,000 security deposit funded to Duseat Trustee Account #9128.', date: '20 Apr 2026', tone: 'success' },
          { id: 'tl-3', title: 'Accepted Offer on REQ-2040', detail: 'Accepted exclusive proposal from Youssef Ali (Palm Luxury Living Real Estate).', date: '18 Apr 2026', tone: 'info' },
          { id: 'tl-4', title: 'Commercial Request Published', detail: 'Posted REQ-IN-2048-04 for Grade A Office in Business Bay (Budget 3.8M–5M AED).', date: '12 May 2026', tone: 'info' },
          { id: 'tl-5', title: 'VIP Solvency & KYC Approved', detail: 'Saudi Passport, UAE Golden Visa, and Al Rajhi Bank Solvency verified by Duseat Compliance.', date: base.joined, tone: 'success' },
        ]
      : [
          { id: 'tl-1', title: 'Deal Confirmed & Escrow Initialized', detail: `Accepted offer for luxury villa investment`, date: 'Today, 09:42', tone: 'success' },
          { id: 'tl-2', title: 'Property Request Published', detail: 'New request posted matching UAE criteria', date: 'Yesterday, 18:20', tone: 'info' },
          { id: 'tl-3', title: 'Identity Documents Approved', detail: 'Emirates ID and Passport verified by Duseat Compliance', date: '04 Jun 2026', tone: 'success' },
          { id: 'tl-4', title: 'Account Registered', detail: 'Joined Duseat investor network with verified phone and email', date: base.joined, tone: 'info' },
        ],
    verificationDocs: [
      { id: 'doc-1', name: isOmar ? 'Saudi Passport (Certified Copy)' : 'Emirates ID (Front & Back)', type: isOmar ? 'Passport' : 'Emirates ID Front', status: 'Verified', uploadedAt: base.joined, reviewedBy: 'Super Admin (Ahmad Khaled)', reviewNotes: 'Verified biometric passport, matched with immigration records.' },
      { id: 'doc-2', name: isOmar ? 'UAE Golden Visa / Emirates ID' : 'Passport Copy', type: isOmar ? 'Emirates ID Front' : 'Passport', status: 'Verified', uploadedAt: base.joined, reviewedBy: 'Compliance Officer (Layla S.)', reviewNotes: 'Valid 10-year Golden Visa residency.' },
      { id: 'doc-3', name: isOmar ? 'Al Rajhi Bank Solvency Letter (>AED 50M)' : 'Proof of Funds / Bank Letter', type: 'Proof of Funds', status: 'Verified', uploadedAt: '29 May 2026', reviewedBy: 'Finance Team', reviewNotes: 'Certified institutional liquidity letter.' },
    ],
    requestsList: allRequests,
    offersReceived: allOffers,
    acceptedOffers: acceptedOffers,
    dealList: isOmar
      ? [
          {
            id: 'DEAL-4820',
            agent: 'Youssef Ali',
            agency: 'Palm Luxury Living Real Estate',
            property: 'Beachfront Signature Villa · Palm Jumeirah',
            date: '20 May 2026',
            amount: 'AED 38,000,000',
            commission: 'AED 760,000 (2%)',
            status: 'Completed' as const,
          },
        ]
      : [
          {
            id: 'DEAL-9941',
            agent: 'Ahmed Khaled',
            agency: 'Emirates Living Real Estate',
            property: 'Al Barsha 4BR Villa · Golf View',
            date: base.lastLogin,
            amount: 'AED 4,650,000',
            commission: 'AED 93,000 (2%)',
            status: 'In progress' as const,
          },
        ],
    conversations: isOmar
      ? [
          {
            id: 'CHAT-DEAL-4820',
            agentId: 'AG-1046',
            with: 'Youssef Ali',
            agency: 'Palm Luxury Living Real Estate',
            topic: 'Beachfront Signature Villa · Palm Jumeirah · DEAL-4820',
            requestRef: 'REQ-2040',
            offerRef: 'OFF-9118',
            updated: '20 May 2026',
            unreadCount: 0,
            dealStatus: 'Deal closed',
            messages: [
              { id: 'm1', from: 'agent', text: 'Good morning Mr. Omar Nasser. I have submitted an exclusive off-market Frond N beachfront signature villa that matches your exact Palm Jumeirah criteria.', time: '18 Apr 2026, 10:15 AM', propertyRef: 'Beachfront Signature Villa' },
              { id: 'm2', from: 'user', text: 'Thank you Youssef. What is the exact plot size and beach frontage width?', time: '18 Apr 2026, 10:30 AM' },
              { id: 'm3', from: 'agent', text: 'Plot is 14,200 sq ft with 120 ft private beach frontage and infinity pool looking directly toward Marina skyline.', time: '18 Apr 2026, 10:45 AM' },
              { id: 'm4', from: 'user', text: 'Excellent. Offer accepted at AED 38,000,000. I have transferred the 10% escrow deposit (AED 3.8M) to Duseat Trustee account.', time: '20 Apr 2026, 02:00 PM' },
              { id: 'm5', from: 'system', text: 'Escrow Funded: AED 3,800,000 deposit verified. Nakheel NOC process initiated.', time: '20 Apr 2026, 02:15 PM' },
              { id: 'm6', from: 'agent', text: 'NOC from Nakheel cleared. Title deed transfer appointment confirmed at Dubai Land Department Al Barsha trustee office for 20 May.', time: '04 May 2026, 11:00 AM' },
              { id: 'm7', from: 'system', text: 'Deal Closed & Title Deed Issued: DEAL-4820 conveyance executed successfully.', time: '20 May 2026, 01:30 PM' },
            ],
          },
          {
            id: 'CHAT-IN-2048-04',
            agentId: 'AG-1045',
            with: 'Noura Salem',
            agency: 'Prime Commercial Properties',
            topic: 'Full Floor Commercial Office · Business Bay · REQ-IN-2048-04',
            requestRef: 'REQ-IN-2048-04',
            offerRef: 'OFF-REQ-IN-2048-04-01',
            updated: 'Today, 10:15',
            unreadCount: 1,
            dealStatus: 'In negotiation',
            messages: [
              { id: 'm11', from: 'agent', text: 'Hello Mr. Omar, regarding your commercial investment request REQ-IN-2048-04, we have a fitted full floor office in Opus Tower with existing multinational tenant paying 8.9% net ROI.', time: 'Yesterday, 03:20 PM' },
              { id: 'm12', from: 'user', text: 'Hello Noura. Please share the lease expiration date and audited service charge schedule.', time: 'Yesterday, 04:10 PM' },
              { id: 'm13', from: 'agent', text: 'Lease is locked until Q4 2028 with 5% annual escalation. I have uploaded the tenancy contract and Ejari to your offer card.', time: 'Today, 10:15 AM' },
            ],
          },
        ]
      : [
          {
            id: `CHAT-${base.id}-01`,
            agentId: 'AG-1048',
            with: 'Ahmed Khaled',
            agency: 'Emirates Living Real Estate',
            topic: `Villa Investment · REQ-${base.id}-01`,
            requestRef: `REQ-${base.id}-01`,
            updated: 'Today, 09:44',
            unreadCount: 0,
            dealStatus: 'In negotiation',
            messages: [
              { id: 'm1', from: 'agent', text: `Hello ${base.name}, I have an exclusive opportunity that matches your criteria.`, time: '09:14 AM' },
              { id: 'm2', from: 'user', text: 'Thank you, please send over the brochure and floor plan.', time: '09:20 AM' },
            ],
          },
        ],
    reports: [],
    notifications: isOmar
      ? [
          { id: 'notif-1', title: 'Deal DEAL-4820 Completed', detail: 'Title deed handover executed at Dubai Land Department for Beachfront Villa (AED 38M).', date: '20 May 2026', tone: 'success' },
          { id: 'notif-2', title: 'New Commercial Offer Received', detail: 'Noura Salem pitched Opus Tower Full Floor Office for REQ-IN-2048-04 (AED 4.65M).', date: 'Today, 10:15', tone: 'info' },
          { id: 'notif-3', title: 'VIP Verification Approved', detail: 'Saudi Passport & Al Rajhi Bank Solvency verified with top tier score.', date: base.joined, tone: 'success' },
        ]
      : [
          { id: 'notif-1', title: 'Offer received', detail: 'New matching offer received for your request.', date: 'Today, 09:15', tone: 'info' },
          { id: 'notif-2', title: 'Documents verified', detail: 'Your KYC was approved by Duseat Compliance.', date: base.joined, tone: 'success' },
        ],
    internalNotes: isOmar
      ? [
          { id: 'note-1', title: 'VIP Ultra High Net Worth Investor', detail: 'Managing Director at Al Rajhi Investment Group. Liquid assets exceed AED 65M. Closed DEAL-4820 seamlessly with zero friction.', date: '20 May 2026', author: 'Ahmad Khaled (Super Admin)', tone: 'success' },
          { id: 'note-2', title: 'Active Commercial Request REQ-IN-2048-04', detail: 'Currently reviewing commercial office offers in Business Bay/DIFC with yield >8.5%. Highly responsive in chat.', date: 'Today, 10:20', author: 'Layla S. (Compliance)', tone: 'info' },
        ]
      : [
          { id: 'note-1', title: 'Standard Investor Profile', detail: 'KYC verified and actively reviewing proposals.', date: base.joined, author: 'Admin Desk', tone: 'info' },
        ],
    scoreBreakdown: isOmar
      ? {
          requestVelocity: 96,
          responseRate: 98,
          closingSpeed: 96,
          trustVerification: 100,
        }
      : {
          requestVelocity: 88,
          responseRate: 90,
          closingSpeed: 85,
          trustVerification: 95,
        },
  }
}

export const agentBases: any[] = [
  { id: 'AG-1046', name: 'Youssef Ali', agency: 'Palm Luxury Living Real Estate', email: 'youssef@palmdubai.ae', phone: '+971 54 667 1300', country: 'United Arab Emirates', countryFlag: '🇦🇪', reraNumber: 'BRN-61284', verification: 'RERA + KYC', status: 'Verified', license: 'TL 991-042', joined: '28 May 2026', rating: 4.9, offers: 148, accepted: 42, subscription: 'Power agent', revenue: 'AED 3,420,000', lastLogin: 'Today, 10:24', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { id: 'AG-1045', name: 'Noura Salem', agency: 'Prime Commercial Properties', email: 'noura@primecommercial.ae', phone: '+971 50 402 7780', country: 'United Arab Emirates', countryFlag: '🇦🇪', reraNumber: 'BRN-77420', verification: 'RERA + KYC', status: 'Verified', license: 'TL 412-883', joined: '27 May 2026', rating: 4.8, offers: 126, accepted: 38, subscription: 'Elite agent', revenue: 'AED 1,180,000', lastLogin: 'Today, 07:58', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { id: 'AG-1044', name: 'Ahmed Khaled', agency: 'Emirates Living Real Estate', email: 'ahmed@emiratesliving.ae', phone: '+971 50 248 9912', country: 'United Arab Emirates', countryFlag: '🇦🇪', reraNumber: 'BRN-88219', verification: 'RERA + KYC', status: 'Verified', license: 'TL 882-194', joined: '25 May 2026', rating: 4.6, offers: 97, accepted: 27, subscription: 'Power agent', revenue: 'AED 845,000', lastLogin: 'Yesterday, 12:03', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' },
  { id: 'AG-1043', name: 'Layla Haddad', agency: 'Avenue Realty Dubai', email: 'layla@avenuerealty.ae', phone: '+971 55 807 1140', country: 'United Arab Emirates', countryFlag: '🇦🇪', reraNumber: 'BRN-55310', verification: 'KYC', status: 'Pending', license: 'TL 553-110', joined: '21 May 2026', rating: 4.8, offers: 155, accepted: 48, subscription: 'Elite agent', revenue: 'AED 1,650,000', lastLogin: 'Today, 06:47', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
  { id: 'AG-1042', name: 'Tariq Mansoor', agency: 'Nexus Properties Dubai', email: 'tariq@nexusproperties.ae', phone: '+971 52 441 0288', country: 'United Arab Emirates', countryFlag: '🇦🇪', reraNumber: 'BRN-33812', verification: 'Documents', status: 'Verified', license: 'TL 338-120', joined: '26 May 2026', rating: 4.7, offers: 112, accepted: 34, subscription: 'Power agent', revenue: 'AED 920,000', lastLogin: 'Yesterday, 20:11', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
  { id: 'AG-1041', name: 'Maya Karim', agency: 'Vista Estates International', email: 'maya@vistaestates.ae', phone: '+971 50 901 2248', country: 'Egypt', countryFlag: '🇪🇬', reraNumber: 'BRN-29418', verification: 'Documents', status: 'Rejected', license: 'TL 294-180', joined: '23 May 2026', rating: 4.2, offers: 74, accepted: 19, subscription: 'Elite agent', revenue: 'AED 480,000', lastLogin: '02 Jun 2026', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80' },
]

function buildAgent(base: any, index: number): PlatformAgent {
  const verified = base.status === 'Verified'
  const investorName = investorBases[index % investorBases.length].name
  return {
    ...base,
    company: { tradeName: base.agency, legalName: `${base.agency} Real Estate LLC`, address: 'Boulevard Plaza Tower 1', emirate: 'Dubai', teamSize: `${12 + index * 2} agents`, website: `${base.agency.toLowerCase().replace(/[^a-z]/g, '')}.ae` },
    tradeLicense: { number: `TL-DXB-${88210 - index}`, expiry: '14 Feb 2027', issuer: 'Dubai Economy & Tourism', status: verified ? 'Valid' : base.status === 'Suspended' ? 'Suspended' : 'Under review' },
    reraVerification: { number: base.license, category: 'Broker · Sale & Purchase', expiry: '28 Feb 2027', status: verified ? 'Verified' : 'Pending' },
    documents: [
      { name: 'Trade license', type: 'PDF', status: verified ? 'Approved' : 'Pending', uploaded: base.joined },
      { name: 'RERA certificate', type: 'PDF', status: verified ? 'Approved' : 'Pending', uploaded: base.joined },
      { name: 'Emirates ID', type: 'Image', status: 'Approved', uploaded: base.joined },
    ],
    performance: { responseRate: `${90 + (index % 9)}%`, conversionRate: `${(20 + index).toFixed(1)}%`, avgResponse: `${8 + index} min`, rating: `${base.rating.toFixed(1)} / 5`, activeDeals: Math.max(1, base.accepted % 10) },
    offersList: [
      {
        id: `OFF-${base.id}-01`,
        investor: investorName,
        investorRole: 'Investor',
        investorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        investorFlag: '🇦🇪',
        request: "I'm looking for a ready 2 BHK Apartment for living in Downtown Dubai.",
        proposalDescription: "Offering a modern, fully furnished 2-bedroom luxury apartment with skyline views, floor-to-ceiling windows, and smart home automation in Downtown Dubai.",
        photos: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop&q=80',
        ],
        location: 'Downtown Dubai',
        brochureName: 'Brochure.pdf',
        amount: '2.4M AED',
        date: 'Today, 08:30',
        status: 'Accepted',
      },
      {
        id: `OFF-${base.id}-02`,
        investor: 'Omar Nasser',
        investorRole: 'Investor',
        investorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
        investorFlag: '🇸🇦',
        request: "I'm looking for an offplan 4 BHK Villa for investment in Palm Jumeirah.",
        proposalDescription: "Exclusive luxury villa with private beach access, landscaped garden, private infinity pool, and guaranteed high capital appreciation.",
        photos: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
        ],
        location: 'Palm Jumeirah',
        brochureName: 'Villa_Brochure.pdf',
        amount: '5.8M AED',
        date: 'Yesterday, 13:44',
        status: 'Pending',
      },
      {
        id: `OFF-${base.id}-03`,
        investor: 'Sarah Jenkins',
        investorRole: 'Investor',
        investorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        investorFlag: '🇬🇧',
        request: "I'm looking for a ready Penthouse for living in Dubai Marina.",
        proposalDescription: "Spacious duplex penthouse with private terrace, panoramic canal views, floor-to-ceiling glass and 2 designated parking slots.",
        photos: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop&q=80',
        ],
        location: 'Dubai Marina',
        brochureName: 'Brochure.pdf',
        amount: '3.9M AED',
        date: '28 May 2026',
        status: 'Declined',
      },
    ],
    requestsWon: [{ title: '2 bedroom apartment', investor: investorName, wonAt: base.lastLogin, value: 'AED 2.35M' }],
    dealList: [{ investor: investorName, property: 'Downtown apartment · 2BR', date: base.lastLogin, amount: 'AED 2.35M', status: 'In progress' }],
    chats: [
      { id: `C-${base.id}`, agentId: base.id, with: investorName, agency: base.agency, topic: 'Downtown apartment · 2BR', requestRef: 'REQ-1048', updated: base.lastLogin, messages: [
        { id: '1', from: 'agent', text: 'I have confirmed the viewing for Thursday at 5 PM.', time: '09:12' },
        { id: '2', from: 'user', text: 'Perfect, please send the exact location.', time: '09:18' },
      ] },
    ],
    payments: [
      { id: 'p1', title: 'Subscription renewed', detail: `${base.subscription.split(' · ')[0]} plan · Visa ending 4242`, date: '01 Jun 2026', tone: 'success' },
      { id: 'p2', title: 'Commission payment', detail: `AED 18,500 · Deal ${investorName}`, date: '30 May 2026', tone: 'success' },
    ],
    reports: [],
    timeline: [
      { id: 't1', title: verified ? 'RERA verified' : 'Verification pending', detail: verified ? 'RERA and KYC approved' : 'Awaiting document review', date: base.joined, tone: verified ? 'success' : 'warning' },
      { id: 't2', title: 'Offer accepted', detail: `${investorName} accepted an offer`, date: base.lastLogin, tone: 'success' },
    ],
    notes: [
      { id: 'n1', title: 'Top performer', detail: `${base.accepted} accepted offers · ${base.rating.toFixed(1)} rating`, date: base.joined, tone: 'info' },
    ],
  }
}

export const investors: PlatformInvestor[] = investorBases.map(buildInvestor)
export const agents: PlatformAgent[] = agentBases.map(buildAgent)
export const allPlatformRequests: PropertyRequest[] = investors.flatMap((i) => i.requestsList)

export function investorById(id: string): PlatformInvestor | undefined {
  if (!id) return investors[0]
  const cleanId = id.trim().toLowerCase()
  return (
    investors.find((item) => item.id.toLowerCase() === cleanId) ||
    investors.find((item) => item.name.toLowerCase() === cleanId) ||
    (cleanId.includes('omar') || cleanId === 'in-2045' ? investors.find((item) => item.name === 'Omar Nasser' || item.id === 'IN-2045') : undefined)
  )
}

export function agentById(id: string): PlatformAgent | undefined {
  if (!id) return agents[0]
  const cleanId = id.trim().toLowerCase()
  return (
    agents.find((item) => item.id.toLowerCase() === cleanId) ||
    agents.find((item) => item.name.toLowerCase() === cleanId)
  )
}
