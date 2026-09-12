export type OfferStatus =
  | 'Pending'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn'
  | 'Expired'
  | 'Flagged'

export interface OfferDocument {
  id: string
  name: string
  type: string
  url: string
  size: string
  status: 'Verified' | 'Pending' | 'Rejected'
  uploadedAt: string
}

export interface OfferTimelineStep {
  title: string
  date: string
  done: boolean
  desc: string
}

export interface OfferHistoryEvent {
  id: string
  action: string
  actor: string
  actorRole: string
  timestamp: string
  details: string
}

export interface PlatformOffer {
  id: string
  requestId: string
  requestTitle: string
  investorId?: string
  investorName: string
  investorAvatar?: string
  investorCountry: string
  agentId: string
  agentName: string
  agentAvatar?: string
  agentAgency: string
  agentRating: number
  agentDeals: number
  agentVerified: boolean
  agentPlan: 'Pro agent' | 'Starter agent' | 'Elite'
  propertyTitle: string
  propertyType: string
  propertyLocation: string
  bedrooms: string
  bathrooms: string
  sizeSqFt: string
  price: string
  priceNumber: number
  commission: string
  handoverDate: string
  paymentPlan: string
  description: string
  photos: string[]
  videos: string[]
  documents: OfferDocument[]
  status: OfferStatus
  flagReason?: string
  rejectionReason?: string
  submittedAt: string
  expiryDate: string
  timeline: OfferTimelineStep[]
  history: OfferHistoryEvent[]
}

export const initialPlatformOffers: PlatformOffer[] = [
  {
    id: 'OFF-9118',
    requestId: 'REQ-2040',
    requestTitle: "I'm looking for a ready 6 Bedrooms Luxury Beachfront Villa for living in Palm Jumeirah.",
    investorId: 'IN-2045',
    investorName: 'Omar Nasser',
    investorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    investorCountry: 'Saudi Arabia',
    agentId: 'AG-1046',
    agentName: 'Youssef Ali',
    agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    agentAgency: 'Palm Luxury Living Real Estate',
    agentRating: 4.9,
    agentDeals: 56,
    agentVerified: true,
    agentPlan: 'Power agent' as any,
    propertyTitle: 'Beachfront Signature Villa · Palm Jumeirah, Frond N',
    propertyType: 'Villa',
    propertyLocation: 'Palm Jumeirah, Frond N, Dubai',
    bedrooms: '6 BHK',
    bathrooms: '7 Baths',
    sizeSqFt: '9,800 sq.ft',
    price: 'AED 38,000,000',
    priceNumber: 38000000,
    commission: '2% (AED 760,000)',
    handoverDate: 'Ready for Immediate Occupancy',
    paymentPlan: '10% Escrow Deposit / Balance at DLD Conveyance',
    description:
      'Signature beachfront villa on Frond N of Palm Jumeirah with 120ft private beach frontage, infinity pool overlooking Dubai Marina skyline, Italian marble, and private elevator.',
    photos: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    ],
    videos: [],
    documents: [
      { id: 'DOC-91', name: 'Title Deed Transfer Certificate.pdf', type: 'Title Deed', url: '#', size: '5.2 MB', status: 'Verified', uploadedAt: '20 May 2026' },
      { id: 'DOC-92', name: 'Nakheel NOC Clearance Certificate.pdf', type: 'Developer NOC', url: '#', size: '2.1 MB', status: 'Verified', uploadedAt: '04 May 2026' },
    ],
    status: 'Accepted',
    submittedAt: '18 Apr 2026, 10:15',
    expiryDate: '20 May 2026',
    timeline: [
      { title: 'Proposal Pitched', date: '18 Apr 2026, 10:15', done: true, desc: 'Youssef Ali pitched off-market Frond N villa' },
      { title: 'Accepted by Investor', date: '18 Apr 2026, 14:00', done: true, desc: 'Omar Nasser accepted offer and executed Form B' },
      { title: 'Escrow Funded', date: '20 Apr 2026, 11:30', done: true, desc: 'AED 3.8M deposit verified in Central Escrow' },
      { title: 'Deal Closed (DEAL-4820)', date: '20 May 2026, 13:45', done: true, desc: 'Title deed handover at DLD Al Barsha' },
    ],
    history: [
      { id: 'H-91', action: 'Offer Submitted', actor: 'Youssef Ali', actorRole: 'Agent', timestamp: '18 Apr 2026', details: 'Submitted price AED 38,000,000' },
      { id: 'H-92', action: 'Offer Accepted', actor: 'Omar Nasser', actorRole: 'Investor', timestamp: '18 Apr 2026', details: 'Accepted proposal and created DEAL-4820' },
    ],
  },
  {
    id: 'OFF-REQ-IN-2048-04-01',
    requestId: 'REQ-IN-2048-04',
    requestTitle: "I'm looking for a ready Office commercial unit for investment in Business Bay.",
    investorId: 'IN-2045',
    investorName: 'Omar Nasser',
    investorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    investorCountry: 'Saudi Arabia',
    agentId: 'AG-1045',
    agentName: 'Noura Salem',
    agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    agentAgency: 'Prime Commercial Properties',
    agentRating: 4.8,
    agentDeals: 38,
    agentVerified: true,
    agentPlan: 'Elite' as any,
    propertyTitle: 'Full Floor Commercial Office · Business Bay, Opus Tower',
    propertyType: 'Office',
    propertyLocation: 'Business Bay, Opus Tower, Dubai',
    bedrooms: 'N/A',
    bathrooms: '4 Baths',
    sizeSqFt: '4,850 sq.ft',
    price: 'AED 4,650,000',
    priceNumber: 4650000,
    commission: '2% (AED 93,000)',
    handoverDate: 'Ready (Tenanted with 8.9% Net ROI)',
    paymentPlan: '100% Cash Transfer with Existing Lease',
    description:
      'Fully fitted corporate floor in Zaha Hadid designed Opus Tower, Business Bay. Includes 8 underground parking bays and existing blue-chip multinational tenant.',
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
    ],
    videos: [],
    documents: [
      { id: 'DOC-81', name: 'Ejari Lease Contract & Tenancy Audit.pdf', type: 'Tenancy', url: '#', size: '3.1 MB', status: 'Verified', uploadedAt: '12 May 2026' },
    ],
    status: 'Pending',
    submittedAt: 'Today, 10:15',
    expiryDate: '28 June 2026',
    timeline: [
      { title: 'Commercial Proposal Submitted', date: 'Today, 10:15', done: true, desc: 'Noura Salem pitched Opus Tower office floor' },
      { title: 'Auditing Yield & Lease', date: 'In Progress', done: false, desc: 'Investor reviewing corporate tenancy terms' },
    ],
    history: [
      { id: 'H-81', action: 'Offer Submitted', actor: 'Noura Salem', actorRole: 'Agent', timestamp: 'Today, 10:15', details: 'Submitted price AED 4,650,000' },
    ],
  },
  {
    id: 'OFF-9481',
    requestId: 'REQ-INV-1021-01',
    requestTitle: "I'm looking for a ready 5 Bedrooms Villa for living in Nad Al Sheba.",
    investorName: 'Anwar Hosny',
    investorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    investorCountry: 'United Arab Emirates',
    agentId: 'AG-1057',
    agentName: 'Layla Haddad',
    agentAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    agentAgency: 'Avenue Realty',
    agentRating: 4.9,
    agentDeals: 64,
    agentVerified: true,
    agentPlan: 'Pro agent',
    propertyTitle: 'Luxury 5BR Nad Al Sheba Gardens Villa with Private Pool',
    propertyType: 'Villa',
    propertyLocation: 'Nad Al Sheba 1, Dubai',
    bedrooms: '5 BHK',
    bathrooms: '6 Baths',
    sizeSqFt: '6,250 sq.ft',
    price: 'AED 4,850,000',
    priceNumber: 4850000,
    commission: '2% (AED 97,000)',
    handoverDate: 'Ready for Occupancy',
    paymentPlan: '100% Cash / Pre-approved Mortgage',
    description:
      'Single row contemporary villa with direct park views, private swimming pool, double-height ceiling lobby, driver room, and maid suite.',
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80',
    ],
    videos: ['https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-living-room-41334-large.mp4'],
    documents: [
      { id: 'DOC-1', name: 'Title Deed Copy (Verified).pdf', type: 'Title Deed', url: '#', size: '2.4 MB', status: 'Verified', uploadedAt: '28 May 2026' },
      { id: 'DOC-2', name: 'Architectural Floor Plans.pdf', type: 'Floor Plan', url: '#', size: '4.8 MB', status: 'Verified', uploadedAt: '28 May 2026' },
      { id: 'DOC-3', name: 'NOC from Master Developer (Meraas).pdf', type: 'Developer NOC', url: '#', size: '1.2 MB', status: 'Verified', uploadedAt: '28 May 2026' },
    ],
    status: 'Accepted',
    submittedAt: 'Today, 10:15',
    expiryDate: '15 June 2026',
    timeline: [
      { title: 'Proposal Submitted', date: '28 May 2026, 10:15', done: true, desc: 'Layla Haddad (Avenue Realty) submitted custom proposal' },
      { title: 'Compliance Vetting', date: '28 May 2026, 10:30', done: true, desc: 'DLD title deed and broker license verified' },
      { title: 'Presented to Investor', date: '28 May 2026, 10:45', done: true, desc: 'Investor viewed specs and requested inspection' },
      { title: 'Accepted Deal', date: 'Today, 11:30', done: true, desc: 'Investor accepted offer and initiated escrow booking' },
    ],
    history: [
      { id: 'H1', action: 'Offer Submitted', actor: 'Layla Haddad', actorRole: 'RERA Broker', timestamp: 'Today, 10:15', details: 'Submitted price AED 4,850,000' },
      { id: 'H2', action: 'Documents Certified', actor: 'Nadia Al-Hashimi', actorRole: 'Compliance Lead', timestamp: 'Today, 10:30', details: 'All 3 documents passed validation' },
      { id: 'H3', action: 'Deal Accepted', actor: 'Anwar Hosny', actorRole: 'Investor', timestamp: 'Today, 11:30', details: 'Offer accepted as primary winner' },
    ],
  },
  {
    id: 'OFF-9482',
    requestId: 'REQ-INV-1021-02',
    requestTitle: "I'm looking for a ready 2 BHK Apartment for living in Downtown Dubai.",
    investorName: 'Sarah Johnson',
    investorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    investorCountry: 'United Kingdom',
    agentId: 'AG-1058',
    agentName: 'Liam Johnson',
    agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    agentAgency: 'Apex Elite Properties',
    agentRating: 4.8,
    agentDeals: 42,
    agentVerified: true,
    agentPlan: 'Pro agent',
    propertyTitle: 'High-Floor 2BR Burj Crown with Full Burj Khalifa View',
    propertyType: 'Apartment',
    propertyLocation: 'Downtown Dubai',
    bedrooms: '2 BHK',
    bathrooms: '3 Baths',
    sizeSqFt: '1,320 sq.ft',
    price: 'AED 2,650,000',
    priceNumber: 2650000,
    commission: '2% (AED 53,000)',
    handoverDate: 'Ready (Vacant on Transfer)',
    paymentPlan: 'Cash or Mortgage (Eligible)',
    description:
      'Stunning high-floor luxury corner apartment in Burj Crown by Emaar. Features unobstructed views of the Burj Khalifa and Dubai Fountain with premium Italian finishes.',
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
    ],
    videos: [],
    documents: [
      { id: 'DOC-4', name: 'Title Deed & Ejari Certificate.pdf', type: 'Title Deed', url: '#', size: '1.8 MB', status: 'Verified', uploadedAt: 'Yesterday' },
      { id: 'DOC-5', name: 'Unit Layout Brochure.pdf', type: 'Floor Plan', url: '#', size: '3.1 MB', status: 'Verified', uploadedAt: 'Yesterday' },
    ],
    status: 'Pending',
    submittedAt: 'Yesterday, 14:30',
    expiryDate: '10 June 2026',
    timeline: [
      { title: 'Proposal Submitted', date: 'Yesterday, 14:30', done: true, desc: 'Liam Johnson pitched Burj Crown unit' },
      { title: 'Compliance Vetting', date: 'Yesterday, 15:00', done: true, desc: 'Title deed verified with DLD portal' },
      { title: 'Investor Review', date: 'In Progress', done: false, desc: 'Investor currently evaluating price vs floor view' },
    ],
    history: [
      { id: 'H4', action: 'Offer Submitted', actor: 'Liam Johnson', actorRole: 'Agent', timestamp: 'Yesterday, 14:30', details: 'Submitted price AED 2,650,000' },
    ],
  },
  {
    id: 'OFF-9483',
    requestId: 'REQ-INV-1021-03',
    requestTitle: "I'm looking for an offplan 3 BHK Townhouse in Dubai Hills Estate.",
    investorName: 'Ahmed Al Mansoori',
    investorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    investorCountry: 'United Arab Emirates',
    agentId: 'AG-1059',
    agentName: 'Noura Salem',
    agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    agentAgency: 'Crescent Realty',
    agentRating: 5.0,
    agentDeals: 88,
    agentVerified: true,
    agentPlan: 'Elite',
    propertyTitle: 'Emaar Golf Place II - 3BR Corner Unit with Green Belt View',
    propertyType: 'Townhouse',
    propertyLocation: 'Dubai Hills Estate',
    bedrooms: '3 BHK',
    bathrooms: '4 Baths',
    sizeSqFt: '2,890 sq.ft',
    price: 'AED 3,750,000',
    priceNumber: 3750000,
    commission: '2% (AED 75,000)',
    handoverDate: 'Q4 2027',
    paymentPlan: '80/20 Post-Handover Payment Plan',
    description:
      'Direct developer allocation resale. Corner plot on the central park with rooftop sky terrace and 3 private parking spaces.',
    photos: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
    ],
    videos: [],
    documents: [
      { id: 'DOC-6', name: 'SPA Developer Contract (Emaar).pdf', type: 'SPA Agreement', url: '#', size: '5.2 MB', status: 'Verified', uploadedAt: '24 May 2026' },
      { id: 'DOC-7', name: 'Payment Schedule Receipt.pdf', type: 'Statement', url: '#', size: '1.1 MB', status: 'Verified', uploadedAt: '24 May 2026' },
    ],
    status: 'Pending',
    submittedAt: '24 May 2026',
    expiryDate: '24 June 2026',
    timeline: [
      { title: 'Proposal Submitted', date: '24 May 2026', done: true, desc: 'Noura Salem submitted Emaar Golf Place unit' },
      { title: 'Compliance Vetting', date: '25 May 2026', done: true, desc: 'SPA and Escrow receipt checked' },
      { title: 'Shortlisted', date: '26 May 2026', done: true, desc: 'Investor marked as top contender' },
    ],
    history: [
      { id: 'H5', action: 'Offer Submitted', actor: 'Noura Salem', actorRole: 'Agent', timestamp: '24 May 2026', details: 'Price: AED 3,750,000' },
    ],
  },
  {
    id: 'OFF-9484',
    requestId: 'REQ-INV-1021-04',
    requestTitle: "I'm looking for a ready Office commercial unit in Business Bay.",
    investorName: 'Omar Nasser',
    investorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    investorCountry: 'Saudi Arabia',
    agentId: 'AG-1060',
    agentName: 'Ahmed Khaled',
    agentAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    agentAgency: 'Emirates Living Real Estate',
    agentRating: 4.6,
    agentDeals: 31,
    agentVerified: true,
    agentPlan: 'Pro agent',
    propertyTitle: 'Fitted Grade A Office Suite in The Opus by Omniyat',
    propertyType: 'Office',
    propertyLocation: 'Business Bay, Dubai',
    bedrooms: 'N/A',
    bathrooms: '2 Baths',
    sizeSqFt: '2,150 sq.ft',
    price: 'AED 3,100,000',
    priceNumber: 3100000,
    commission: '2% (AED 62,000)',
    handoverDate: 'Ready (Fully Furnished)',
    paymentPlan: '100% Cash / Cheque',
    description:
      'Zaha Hadid designed masterpiece. Grade A fitted corporate office with conference rooms, private pantry, and 4 allocated basement parking spots.',
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80',
    ],
    videos: [],
    documents: [
      { id: 'DOC-8', name: 'Commercial Title Deed.pdf', type: 'Title Deed', url: '#', size: '2.9 MB', status: 'Verified', uploadedAt: '20 May 2026' },
    ],
    status: 'Rejected',
    rejectionReason: 'Investor decided to pursue free-zone DIFC commercial unit instead.',
    submittedAt: '20 May 2026',
    expiryDate: '20 June 2026',
    timeline: [
      { title: 'Proposal Submitted', date: '20 May 2026', done: true, desc: 'Ahmed Khaled submitted Opus office' },
      { title: 'Rejected by Investor', date: '22 May 2026', done: true, desc: 'Jurisdiction mismatch with buyer trade license' },
    ],
    history: [
      { id: 'H6', action: 'Offer Submitted', actor: 'Ahmed Khaled', actorRole: 'Agent', timestamp: '20 May 2026', details: 'Price: AED 3,100,000' },
      { id: 'H7', action: 'Offer Rejected', actor: 'Omar Nasser', actorRole: 'Investor', timestamp: '22 May 2026', details: 'Reason: Non-freezone location' },
    ],
  },
  {
    id: 'OFF-9485',
    requestId: 'REQ-INV-1021-05',
    requestTitle: "I'm looking for a beachfront 4 Bedrooms Penthouse in Palm Jumeirah.",
    investorName: 'Elena Rostova',
    investorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    investorCountry: 'United Arab Emirates',
    agentId: 'AG-1061',
    agentName: 'Zayd Ibrahim',
    agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    agentAgency: 'Urban Key Properties',
    agentRating: 4.7,
    agentDeals: 56,
    agentVerified: true,
    agentPlan: 'Pro agent',
    propertyTitle: 'One Palm by Omniyat - Duplex Penthouse with Private Marina Berth',
    propertyType: 'Penthouse',
    propertyLocation: 'Palm Jumeirah Crescent',
    bedrooms: '4 BHK',
    bathrooms: '5 Baths',
    sizeSqFt: '7,800 sq.ft',
    price: 'AED 16,500,000',
    priceNumber: 16500000,
    commission: '2% (AED 330,000)',
    handoverDate: 'Ready',
    paymentPlan: 'Cash Wire Transfer',
    description:
      'Ultra-luxury beachfront penthouse managed by Dorchester Collection. Private infinity pool overlooking the Dubai Marina skyline and private yacht berth included.',
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80',
    ],
    videos: [],
    documents: [
      { id: 'DOC-9', name: 'One Palm Title Deed.pdf', type: 'Title Deed', url: '#', size: '3.6 MB', status: 'Verified', uploadedAt: '18 May 2026' },
      { id: 'DOC-10', name: 'Dorchester Residence Agreement.pdf', type: 'Management Agreement', url: '#', size: '4.1 MB', status: 'Verified', uploadedAt: '18 May 2026' },
    ],
    status: 'Flagged',
    flagReason: 'Price variance higher than 20% of investor target budget. Verified compliance escrow alert triggered.',
    submittedAt: '18 May 2026',
    expiryDate: '18 June 2026',
    timeline: [
      { title: 'Proposal Submitted', date: '18 May 2026', done: true, desc: 'Zayd Ibrahim submitted ultra-luxury penthouse' },
      { title: 'Compliance Flag Triggered', date: '18 May 2026', done: true, desc: 'Automated AML/Price ceiling check flagged for review' },
    ],
    history: [
      { id: 'H8', action: 'Offer Submitted', actor: 'Zayd Ibrahim', actorRole: 'Agent', timestamp: '18 May 2026', details: 'Price: AED 16,500,000' },
      { id: 'H9', action: 'Flagged by System', actor: 'Compliance AI Guard', actorRole: 'Automated Bot', timestamp: '18 May 2026', details: 'Price exceeds average brief ceiling' },
    ],
  },
  {
    id: 'OFF-9486',
    requestId: 'REQ-INV-1021-06',
    requestTitle: "I'm looking for a ready 1 BHK Apartment for investment in Dubai Marina.",
    investorName: 'Fahad Al-Otaibi',
    investorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    investorCountry: 'Saudi Arabia',
    agentId: 'AG-1062',
    agentName: 'Maya Karim',
    agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    agentAgency: 'Vista Estates',
    agentRating: 4.9,
    agentDeals: 71,
    agentVerified: true,
    agentPlan: 'Pro agent',
    propertyTitle: 'Marina Gate 2 - High ROI 1BR Furnished Unit',
    propertyType: 'Apartment',
    propertyLocation: 'Dubai Marina',
    bedrooms: '1 BHK',
    bathrooms: '2 Baths',
    sizeSqFt: '940 sq.ft',
    price: 'AED 1,650,000',
    priceNumber: 1650000,
    commission: '2% (AED 33,000)',
    handoverDate: 'Ready (Tenanted at 8.2% Net ROI)',
    paymentPlan: '100% Cash / Mortgage Pre-approved',
    description:
      'Prime investor package unit with guaranteed rental income. Direct marina promenade walk access, infinity pool, and state of the art health club.',
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
    ],
    videos: [],
    documents: [
      { id: 'DOC-11', name: 'Marina Gate Title Deed & Lease.pdf', type: 'Title Deed', url: '#', size: '2.1 MB', status: 'Verified', uploadedAt: '12 May 2026' },
    ],
    status: 'Withdrawn',
    rejectionReason: 'Unit sold off-market through private brokerage channel.',
    submittedAt: '12 May 2026',
    expiryDate: '12 June 2026',
    timeline: [
      { title: 'Proposal Submitted', date: '12 May 2026', done: true, desc: 'Maya Karim pitched Marina Gate unit' },
      { title: 'Withdrawn by Broker', date: '15 May 2026', done: true, desc: 'Agent withdrew listing due to direct offline sale' },
    ],
    history: [
      { id: 'H10', action: 'Offer Withdrawn', actor: 'Maya Karim', actorRole: 'Agent', timestamp: '15 May 2026', details: 'Unit sold offline' },
    ],
  },
]
