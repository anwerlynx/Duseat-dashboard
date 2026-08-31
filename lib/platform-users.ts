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
  status: 'Open' | 'Receiving offers' | 'Matched' | 'Deal confirmed' | 'Closed'
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
  email: string
  phone: string
  country: string
  countryFlag: string
  status: 'Active' | 'Pending' | 'Suspended' | 'Banned'
  verification: 'Verified' | 'In review' | 'Pending' | 'Revoked'
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
  offersList: { investor: string; request: string; amount: string; date: string; status: string }[]
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
  'id' | 'name' | 'email' | 'phone' | 'country' | 'countryFlag' | 'status' | 'verification' | 'requests' | 'deals' | 'lastLogin' | 'joined' | 'score'
>

export const investorBases: (InvestorBase & { avatar?: string })[] = [
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
  const req1: PropertyRequest = {
    id: `REQ-${base.id}-01`,
    investorId: base.id,
    investorName: 'Anwar Hosny',
    countryFlag: '🇦🇪',
    onlineStatus: 'Online (Avg 10m)',
    timeAgo: '3 min ago',
    title: "I'm looking for a ready 5 Bedrooms Villa for living in Nad Al Sheba.",
    note: 'I want to move ASAP. Private garden and maid room preferred.',
    purpose: 'Living',
    propertyType: 'Villa',
    bedrooms: '5 BHK',
    unitStatus: 'Ready',
    budget: '4M–6M AED',
    preferredAreas: ['Nad Al Sheba', 'Dubai Hills Estate', 'Meydan'],
    paymentMethod: 'Cash',
    mortgageEligible: false,
    mortgageEligibility: 'No',
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
      { name: 'Ahmed Khaled', agency: 'Emirates Living' },
    ],
    offersCount: 12,
    status: 'Receiving offers',
    created: 'Today, 09:12',
    offers: createOffersForRequest(`REQ-${base.id}-01`),
  }

  const req2: PropertyRequest = {
    id: `REQ-${base.id}-02`,
    investorId: base.id,
    investorName: 'Sarah Johnson',
    countryFlag: '🇬🇧',
    onlineStatus: 'Online (Avg 10m)',
    timeAgo: '15 min ago',
    title: "I'm looking for a ready 2 BHK Apartment for living in Downtown Dubai.",
    note: 'Burj Khalifa or Fountain view is a must. Mortgage pre-approved.',
    purpose: 'Living',
    propertyType: 'Apartment',
    bedrooms: '2 BHK',
    unitStatus: 'Ready',
    budget: '2.2M–2.8M AED',
    preferredAreas: ['Downtown Dubai', 'DIFC', 'Business Bay'],
    paymentMethod: 'Mortgage',
    mortgageEligible: true,
    mortgageEligibility: 'Yes',
    paymentPlan: 'Not applicable',
    developerPreference: {
      hasPreference: false,
      selected: ['Open to all'],
    },
    communication: {
      autoMatchLanguages: true,
      preferredLanguages: ['English', 'French'],
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

  const req3: PropertyRequest = {
    id: `REQ-${base.id}-03`,
    investorId: base.id,
    investorName: 'Ahmed Al Mansoori',
    countryFlag: '🇦🇪',
    onlineStatus: 'Online (Avg 10m)',
    timeAgo: '8 min ago',
    title: "I'm looking for an offplan 3 BHK Townhouse for living in Dubai Hills Estate.",
    note: 'Prefer Q4 2027 handover with flexible post-handover payment plan.',
    purpose: 'Living',
    propertyType: 'Townhouse',
    bedrooms: '3 BHK',
    unitStatus: 'Offplan',
    budget: '3.5M–4.2M AED',
    preferredAreas: ['Dubai Hills Estate', 'The Valley', 'Arabian Ranches III'],
    paymentMethod: 'Cash',
    mortgageEligible: false,
    paymentPlan: 'Long-term payment plan',
    developerPreference: {
      hasPreference: true,
      selected: ['Emaar', 'Meraas'],
    },
    communication: {
      autoMatchLanguages: true,
      preferredLanguages: ['Arabic', 'English'],
    },
    agentsPitchingCount: 8,
    agentsPitching: [
      { name: 'Ahmed Khaled', agency: 'Emirates Living' },
      { name: 'Maya Karim', agency: 'Vista Estates' },
    ],
    offersCount: 8,
    status: 'Matched',
    dealConfirmed: false,
    created: '24 May 2026',
    offers: createOffersForRequest(`REQ-${base.id}-03`),
  }

  const req4: PropertyRequest = {
    id: `REQ-${base.id}-04`,
    investorId: base.id,
    investorName: 'Omar Nasser',
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
    agentsPitchingCount: 21,
    agentsPitching: [
      { name: 'Ahmed Khaled', agency: 'Emirates Living' },
      { name: 'Liam Johnson', agency: 'Apex Elite' },
    ],
    offersCount: 21,
    status: 'Deal confirmed',
    dealConfirmed: true,
    dealWinner: {
      name: 'Ahmed Khaled',
      title: 'Won the deal!',
      agency: 'Emirates Living Real Estate',
      amount: 'AED 4,200,000',
      date: 'Today, 10:15',
    },
    created: '18 May 2026',
    offers: createOffersForRequest(`REQ-${base.id}-04`),
  }

  const allRequests = [req1, req2, req3, req4]
  const allOffers = allRequests.flatMap((r) => r.offers)
  const acceptedOffers = allOffers.filter((o) => o.status === 'Accepted')

  return {
    ...base,
    personalInfo: {
      nationality: 'Emirati',
      language: 'Arabic, English',
      occupation: 'Property investor',
      budget: 'AED 1.5M – 4M',
      preferredAreas: ['Downtown Dubai', 'Dubai Marina', 'Business Bay'],
      address: 'Villa 14, Palm Jumeirah, Dubai, UAE',
      netWorthEstimated: 'AED 25,000,000+',
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
    timeline: [
      { id: 'tl-1', title: 'Deal Confirmed & Escrow Initialized', detail: `Accepted offer from Ahmed Khaled for Al Barsha 4BR Villa (AED 4.65M)`, date: 'Today, 09:42', tone: 'success' },
      { id: 'tl-2', title: 'Property Request Published', detail: 'New request posted for 4BR Villa in Al Barsha (Budget 4M–5M AED)', date: 'Yesterday, 18:20', tone: 'info' },
      { id: 'tl-3', title: 'Identity Documents Approved', detail: 'Emirates ID and Passport verified by Duseat Compliance', date: '04 Jun 2026', tone: 'success' },
      { id: 'tl-4', title: 'Account Registered', detail: 'Joined Duseat investor network with verified phone and email', date: base.joined, tone: 'info' },
    ],
    verificationDocs: [
      { id: 'doc-1', name: 'Emirates ID (Front & Back)', type: 'Emirates ID Front', status: 'Verified', uploadedAt: base.joined, reviewedBy: 'Super Admin (Ahmad Khaled)', reviewNotes: 'Valid until 2028. Matched with UAE ICP database.' },
      { id: 'doc-2', name: 'Passport Copy', type: 'Passport', status: 'Verified', uploadedAt: base.joined, reviewedBy: 'Compliance Officer (Layla S.)', reviewNotes: 'Clear copy, valid biometric passport.' },
      { id: 'doc-3', name: 'Proof of Funds / Bank Letter', type: 'Proof of Funds', status: 'Verified', uploadedAt: '29 May 2026', reviewedBy: 'Finance Team', reviewNotes: 'Certified bank solvency letter exceeding AED 5M.' },
    ],
    requestsList: allRequests,
    offersReceived: allOffers,
    acceptedOffers: acceptedOffers,
    dealList: [
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
      {
        id: 'DEAL-8820',
        agent: 'Layla Haddad',
        agency: 'Avenue Realty',
        property: 'Downtown 2BR Luxury Suite',
        date: '14 May 2026',
        amount: 'AED 2,850,000',
        commission: 'AED 57,000 (2%)',
        status: 'Completed' as const,
      },
    ].slice(0, Math.max(1, base.deals)),
    conversations: [
      {
        id: `CHAT-${base.id}-01`,
        agentId: 'AG-1048',
        with: 'Ahmed Khaled',
        agency: 'Emirates Living Real Estate',
        topic: 'Al Barsha 4BR Luxury Villa · REQ-1048',
        requestRef: `REQ-${base.id}-01`,
        offerRef: `OFF-REQ-${base.id}-01-01`,
        updated: 'Today, 09:44',
        unreadCount: 1,
        dealStatus: 'Offer accepted',
        messages: [
          { id: 'm1', from: 'agent', text: 'Hello Anwar, I just submitted an exclusive 4BR villa in Al Barsha 3 that matches your exact living criteria.', time: '09:14 AM', propertyRef: 'Al Barsha 4BR Villa' },
          { id: 'm2', from: 'user', text: 'Thank you Ahmed! Is it ready to move immediately or does it need notice to the tenant?', time: '09:20 AM' },
          { id: 'm3', from: 'agent', text: 'It is vacant on transfer and ready for immediate handover. I can schedule a private viewing for you this Thursday at 4 PM.', time: '09:28 AM' },
          { id: 'm4', from: 'user', text: 'Perfect! I have accepted your offer on Duseat. Please prepare the MOU Form F.', time: '09:40 AM' },
          { id: 'm5', from: 'system', text: 'Deal Confirmed: Offer #OFF-01 accepted. Escrow and document flow initiated.', time: '09:42 AM' },
        ],
      },
      {
        id: `CHAT-${base.id}-02`,
        agentId: 'AG-1047',
        with: 'Layla Haddad',
        agency: 'Avenue Realty Dubai',
        topic: 'Dubai Hills 4BR Standalone Villa · REQ-1048',
        requestRef: `REQ-${base.id}-01`,
        offerRef: `OFF-REQ-${base.id}-01-02`,
        updated: 'Yesterday, 17:15',
        unreadCount: 0,
        dealStatus: 'In negotiation',
        messages: [
          { id: 'm21', from: 'agent', text: 'Good afternoon, we have a standalone 4BR in Maple, Dubai Hills within your 4M-5M budget.', time: 'Yesterday, 04:30 PM' },
          { id: 'm22', from: 'user', text: 'What is the exact built-up area and plot size?', time: 'Yesterday, 05:10 PM' },
          { id: 'm23', from: 'agent', text: 'BUA is 3,450 sqft and the plot is 4,100 sqft with private garden.', time: 'Yesterday, 05:15 PM' },
        ],
      },
      {
        id: `CHAT-${base.id}-03`,
        agentId: 'AG-1046',
        with: 'Omar Nasser',
        agency: 'Nexus Properties Dubai',
        topic: 'Dubai Creek Harbour Off-Plan 2BR · REQ-1049',
        requestRef: `REQ-${base.id}-02`,
        updated: '28 May 2026',
        unreadCount: 0,
        dealStatus: 'In negotiation',
        messages: [
          { id: 'm31', from: 'agent', text: 'Greetings! Emaar just launched a new waterfront tower in Creek Harbour with 8% projected rental yield.', time: '28 May 2026, 11:00 AM' },
          { id: 'm32', from: 'user', text: 'Please send over the payment plan and floor plans.', time: '28 May 2026, 11:20 AM' },
        ],
      },
    ],
    reports: [],
    notifications: [
      { id: 'notif-1', title: 'Offer accepted confirmed', detail: 'Your deal for Al Barsha Villa has been locked with Ahmed Khaled.', date: 'Today, 09:42', tone: 'success' },
      { id: 'notif-2', title: 'New matching offer received', detail: 'Layla Haddad submitted an offer for 4BR Villa in Dubai Hills.', date: 'Today, 09:15', tone: 'info' },
      { id: 'notif-3', title: 'Documents verified', detail: 'Your KYC and identity verification was approved by Duseat Compliance.', date: base.joined, tone: 'success' },
    ],
    internalNotes: [
      { id: 'note-1', title: 'VIP High-Intent Investor', detail: 'Verified high net worth buyer. Responsive in chat and ready with mortgage pre-approval.', date: base.joined, author: 'Ahmad Khaled (Super Admin)', tone: 'info' },
      { id: 'note-2', title: 'Offer acceptance completed', detail: 'Accepted deal with agent Ahmed Khaled. Handover scheduled for Q4 2026.', date: 'Today, 09:45', author: 'Layla S. (Compliance)', tone: 'success' },
    ],
    scoreBreakdown: {
      requestVelocity: 94,
      responseRate: 98,
      closingSpeed: 92,
      trustVerification: 100,
    },
  }
}

export const agentBases: any[] = [
  { id: 'AG-1046', name: 'Youssef Ali', agency: 'Harbor Homes Real Estate', email: 'youssef@harborhomes.ae', phone: '+971 54 667 1300', country: 'United Arab Emirates', countryFlag: '🇦🇪', reraNumber: 'BRN-61284', verification: 'RERA + KYC', status: 'Verified', license: 'TL 991-042', joined: '28 May 2026', rating: 4.9, offers: 148, accepted: 42, subscription: 'Pro agent', revenue: 'AED 1,420,000', lastLogin: 'Today, 10:24', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { id: 'AG-1045', name: 'Noura Salem', agency: 'Crescent Realty Luxury', email: 'noura@crescent.ae', phone: '+971 50 402 7780', country: 'United Arab Emirates', countryFlag: '🇦🇪', reraNumber: 'BRN-77420', verification: 'RERA + KYC', status: 'Verified', license: 'TL 412-883', joined: '27 May 2026', rating: 4.8, offers: 126, accepted: 38, subscription: 'Elite agent', revenue: 'AED 1,180,000', lastLogin: 'Today, 07:58', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { id: 'AG-1044', name: 'Ahmed Al Mansoori', agency: 'Emirates Living Real Estate', email: 'ahmed@emiratesliving.ae', phone: '+971 50 248 9912', country: 'United Arab Emirates', countryFlag: '🇦🇪', reraNumber: 'BRN-88219', verification: 'RERA + KYC', status: 'Verified', license: 'TL 882-194', joined: '25 May 2026', rating: 4.6, offers: 97, accepted: 27, subscription: 'Power agent', revenue: 'AED 845,000', lastLogin: 'Yesterday, 12:03', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { id: 'AG-1043', name: 'Layla Haddad', agency: 'Avenue Realty Dubai', email: 'layla@avenuerealty.ae', phone: '+971 55 807 1140', country: 'United Arab Emirates', countryFlag: '🇦🇪', reraNumber: 'BRN-55310', verification: 'KYC', status: 'Pending', license: 'TL 553-110', joined: '21 May 2026', rating: 4.8, offers: 155, accepted: 48, subscription: 'Elite agent', revenue: 'AED 1,650,000', lastLogin: 'Today, 06:47', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
  { id: 'AG-1042', name: 'Omar Nasser', agency: 'Nexus Properties Dubai', email: 'omar@nexusproperties.ae', phone: '+971 52 441 0288', country: 'Saudi Arabia', countryFlag: '🇸🇦', reraNumber: 'BRN-33812', verification: 'Documents', status: 'Verified', license: 'TL 338-120', joined: '26 May 2026', rating: 4.7, offers: 112, accepted: 34, subscription: 'Power agent', revenue: 'AED 920,000', lastLogin: 'Yesterday, 20:11', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
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
      { investor: investorName, request: '2 bedroom apartment · Downtown', amount: 'AED 2.35M', date: 'Today, 08:30', status: 'Accepted' },
      { investor: 'Omar Nasser', request: 'Villa · Palm Jumeirah', amount: 'AED 5.8M', date: 'Yesterday, 13:44', status: 'Under review' },
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
  return investors.find((item) => item.id === id)
}

export function agentById(id: string): PlatformAgent | undefined {
  return agents.find((item) => item.id === id)
}
