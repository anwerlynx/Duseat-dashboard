export type DealStatus = 'Active' | 'Completed' | 'Cancelled' | 'Failed'

export interface DealPayment {
  id: string
  title: string
  amount: string
  amountNumber: number
  status: 'Paid' | 'Escrow Funded' | 'Released' | 'Pending' | 'Refunded'
  date: string
  method: string
  reference: string
}

export interface DealDocument {
  id: string
  name: string
  type: string
  size: string
  status: 'Verified' | 'Pending' | 'Signed'
  uploadedAt: string
  url: string
}

export interface DealTimelineStep {
  id: string
  title: string
  date: string
  done: boolean
  desc: string
}

export interface DealNote {
  id: string
  author: string
  role: string
  date: string
  text: string
}

export interface DealMessage {
  id: string
  sender: string
  senderRole: 'Investor' | 'Agent' | 'Manager' | 'System'
  text: string
  time: string
}

export interface PlatformDeal {
  id: string
  requestId: string
  offerId: string
  propertyTitle: string
  propertyType: string
  propertyLocation: string
  propertyImage?: string
  bedrooms: string
  sizeSqFt: string
  
  // Investor
  investorId: string
  investorName: string
  investorEmail: string
  investorPhone: string
  investorCountry: string
  investorAvatar?: string

  // Agent
  agentId: string
  agentName: string
  agentEmail: string
  agentAgency: string
  agentPlan: 'Pro agent' | 'Starter agent' | 'Elite' | 'Power'
  agentAvatar?: string
  agentCountry: string

  // Deal Financials
  dealValue: string
  dealValueNumber: number
  commissionRate: string
  commissionAmount: string
  commissionSplit: string // e.g. "70% Agency / 30% Platform"
  escrowStatus: 'Funded' | 'Released' | 'Refunding' | 'Pending'
  escrowAmount: string
  
  // Status & Governance
  status: DealStatus
  assignedManager: string
  managerEmail: string
  startDate: string
  expectedCloseDate: string
  completedDate?: string
  
  // Sub-objects
  timeline: DealTimelineStep[]
  documents: DealDocument[]
  payments: DealPayment[]
  conversation: DealMessage[]
  notes: DealNote[]
}

export const initialPlatformDeals: PlatformDeal[] = [
  {
    id: 'DEAL-4821',
    requestId: 'REQ-2041',
    offerId: 'OFF-9120',
    propertyTitle: 'Luxury 4BR Villa · Nad Al Sheba Gardens',
    propertyType: 'Villa',
    propertyLocation: 'Nad Al Sheba, Dubai, UAE',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    bedrooms: '4 Bedrooms',
    sizeSqFt: '5,200 sq ft',
    investorId: 'IN-2048',
    investorName: 'Amal Haddad',
    investorEmail: 'amal.haddad@example.com',
    investorPhone: '+971 50 248 9912',
    investorCountry: 'United Arab Emirates',
    investorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    agentId: 'AG-1048',
    agentName: 'Layla Haddad',
    agentEmail: 'layla@avenuedubai.ae',
    agentAgency: 'Avenue Real Estate Dubai',
    agentPlan: 'Elite',
    agentAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    agentCountry: 'United Arab Emirates',
    dealValue: 'AED 14,500,000',
    dealValueNumber: 14500000,
    commissionRate: '2.0%',
    commissionAmount: 'AED 290,000',
    commissionSplit: 'AED 203,000 Agency (70%) / AED 87,000 Platform (30%)',
    escrowStatus: 'Funded',
    escrowAmount: 'AED 1,450,000 (10% Security Deposit)',
    status: 'Active',
    assignedManager: 'Ahmad Khaled',
    managerEmail: 'ahmad@duseat.ae',
    startDate: '12 May 2026',
    expectedCloseDate: '15 Jun 2026',
    timeline: [
      { id: 't1', title: 'Offer Accepted & Reservation Signed', date: '12 May 2026, 11:30', done: true, desc: 'Investor accepted agent offer and Form B was signed.' },
      { id: 't2', title: 'Security Deposit In Escrow', date: '14 May 2026, 15:45', done: true, desc: '10% security deposit verified and locked in escrow account.' },
      { id: 't3', title: 'NOC Application Submission', date: '22 May 2026, 09:15', done: true, desc: 'Developer NOC applied with Dubai Land Department.' },
      { id: 't4', title: 'DLD Title Deed Transfer', date: 'Expected 10 Jun 2026', done: false, desc: 'Trustee office appointment for final conveyance and keys.' },
      { id: 't5', title: 'Escrow Payout & Commission Release', date: 'Pending completion', done: false, desc: 'Automatic payout to seller and agent commission disbursement.' },
    ],
    documents: [
      { id: 'doc-1', name: 'MOU_Form_F_Signed.pdf', type: 'Contract', size: '2.8 MB', status: 'Signed', uploadedAt: '12 May 2026', url: '#' },
      { id: 'doc-2', name: 'Escrow_Deposit_Receipt_DLD.pdf', type: 'Receipt', size: '1.2 MB', status: 'Verified', uploadedAt: '14 May 2026', url: '#' },
      { id: 'doc-3', name: 'Developer_NOC_Certificate.pdf', type: 'Certificate', size: '3.4 MB', status: 'Verified', uploadedAt: '22 May 2026', url: '#' },
      { id: 'doc-4', name: 'Buyer_Passport_EID_Copy.pdf', type: 'ID Document', size: '4.1 MB', status: 'Verified', uploadedAt: '12 May 2026', url: '#' },
    ],
    payments: [
      { id: 'pay-1', title: '10% Reservation Escrow Deposit', amount: 'AED 1,450,000', amountNumber: 1450000, status: 'Escrow Funded', date: '14 May 2026', method: 'Bank Wire / Central Escrow', reference: 'ESC-992140' },
      { id: 'pay-2', title: 'Platform Conveyance & Tech Fee', amount: 'AED 14,500', amountNumber: 14500, status: 'Paid', date: '12 May 2026', method: 'Corporate Card', reference: 'TX-481902' },
      { id: 'pay-3', title: 'Remaining Balance at DLD Transfer', amount: 'AED 13,050,000', amountNumber: 13050000, status: 'Pending', date: 'Due 10 Jun 2026', method: 'Manager Cheque', reference: 'PENDING' },
    ],
    conversation: [
      { id: 'm1', sender: 'Layla Haddad', senderRole: 'Agent', text: 'Good morning Amal, developer NOC has been issued and uploaded to the deal room.', time: '22 May, 09:20' },
      { id: 'm2', sender: 'Amal Haddad', senderRole: 'Investor', text: 'Thank you Layla. I will ensure the manager cheque is ready for the trustee office.', time: '22 May, 10:15' },
      { id: 'm3', sender: 'Ahmad Khaled', senderRole: 'Manager', text: 'Deal room monitored. Trustee appointment scheduled for 10 June at Al Barsha.', time: '22 May, 11:00' },
    ],
    notes: [
      { id: 'n1', author: 'Ahmad Khaled', role: 'Deal Manager', date: '22 May 2026', text: 'All KYC and proof of funds cleared with UAE Central Bank standard compliance.' },
      { id: 'n2', author: 'Compliance Desk', role: 'Trustee', date: '14 May 2026', text: 'Escrow funds locked securely under Duseat Trustee Account #9128.' },
    ],
  },
  {
    id: 'DEAL-4820',
    requestId: 'REQ-2040',
    offerId: 'OFF-9118',
    propertyTitle: 'Beachfront Signature Villa · Palm Jumeirah',
    propertyType: 'Villa',
    propertyLocation: 'Palm Jumeirah, Frond N, Dubai',
    propertyImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
    bedrooms: '6 Bedrooms',
    sizeSqFt: '9,800 sq ft',
    investorId: 'IN-2045',
    investorName: 'Omar Nasser',
    investorEmail: 'omar.nasser@alrajhi-invest.sa',
    investorPhone: '+966 54 667 1300',
    investorCountry: 'Saudi Arabia',
    investorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    agentId: 'AG-1046',
    agentName: 'Youssef Ali',
    agentEmail: 'youssef@palmdubai.ae',
    agentAgency: 'Palm Luxury Living Real Estate',
    agentPlan: 'Power',
    agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    agentCountry: 'United Arab Emirates',
    dealValue: 'AED 38,000,000',
    dealValueNumber: 38000000,
    commissionRate: '2.0%',
    commissionAmount: 'AED 760,000',
    commissionSplit: 'AED 532,000 Agency (70%) / AED 228,000 Platform (30%)',
    escrowStatus: 'Released',
    escrowAmount: 'AED 3,800,000 (10% Security Deposit)',
    status: 'Completed',
    assignedManager: 'Ahmad Khaled',
    managerEmail: 'ahmad@duseat.ae',
    startDate: '18 Apr 2026',
    expectedCloseDate: '20 May 2026',
    completedDate: '20 May 2026',
    timeline: [
      { id: 't1', title: 'Reservation Agreement & Form B', date: '18 Apr 2026', done: true, desc: 'Signed by Omar Nasser & seller via Duseat portal.' },
      { id: 't2', title: 'Escrow Deposit Funded', date: '20 Apr 2026', done: true, desc: 'AED 3.8M security deposit funded to Duseat Trustee Account #9128.' },
      { id: 't3', title: 'Developer NOC & Clearance', date: '04 May 2026', done: true, desc: 'Nakheel clearance certificate approved and issued.' },
      { id: 't4', title: 'Title Deed Handover at DLD', date: '20 May 2026', done: true, desc: 'Conveyance executed at Dubai Land Department trustee office.' },
      { id: 't5', title: 'Commission Disbursed', date: '20 May 2026', done: true, desc: 'Broker commission (AED 532K) & platform fee (AED 228K) released.' },
    ],
    documents: [
      { id: 'doc-1', name: 'Title_Deed_Transfer_Certificate.pdf', type: 'Title Deed', size: '5.2 MB', status: 'Signed', uploadedAt: '20 May 2026', url: '#' },
      { id: 'doc-2', name: 'Nakheel_NOC_Clearance.pdf', type: 'NOC', size: '2.1 MB', status: 'Verified', uploadedAt: '04 May 2026', url: '#' },
      { id: 'doc-3', name: 'Form_F_Contract_of_Sale.pdf', type: 'Form F', size: '3.4 MB', status: 'Signed', uploadedAt: '18 Apr 2026', url: '#' },
      { id: 'doc-4', name: 'Central_Escrow_Receipt_3.8M.pdf', type: 'Receipt', size: '1.1 MB', status: 'Verified', uploadedAt: '20 Apr 2026', url: '#' },
    ],
    payments: [
      { id: 'pay-1', title: '10% Reservation Escrow Deposit', amount: 'AED 3,800,000', amountNumber: 3800000, status: 'Released', date: '20 Apr 2026', method: 'Central Bank Wire / Escrow', reference: 'ESC-DXB-9128' },
      { id: 'pay-2', title: 'Platform Conveyance & Advisory Fee', amount: 'AED 38,000', amountNumber: 38000, status: 'Paid', date: '18 Apr 2026', method: 'Corporate Wire', reference: 'TX-482001' },
      { id: 'pay-3', title: 'Remaining Purchase Price at DLD Conveyance', amount: 'AED 34,200,000', amountNumber: 34200000, status: 'Paid', date: '20 May 2026', method: 'Manager Cheques', reference: 'DLD-492100' },
    ],
    conversation: [
      { id: 'm1', sender: 'Youssef Ali', senderRole: 'Agent', text: 'Good morning Mr. Omar Nasser. Developer NOC from Nakheel has been approved and uploaded to your deal room.', time: '04 May, 10:15' },
      { id: 'm2', sender: 'Omar Nasser', senderRole: 'Investor', text: 'Thank you Youssef. I have confirmed with Al Rajhi Bank that the manager cheques are issued for the DLD appointment.', time: '04 May, 10:45' },
      { id: 'm3', sender: 'Ahmad Khaled', senderRole: 'Manager', text: 'Duseat trustee officer will accompany both parties at the DLD Al Barsha branch on 20 May at 11 AM.', time: '05 May, 09:30' },
      { id: 'm4', sender: 'Youssef Ali', senderRole: 'Agent', text: 'Conveyance executed successfully. Congratulations Mr. Omar on acquiring this landmark signature villa!', time: '20 May, 01:45' },
    ],
    notes: [
      { id: 'n1', author: 'Ahmad Khaled', role: 'Deal Manager', date: '20 May 2026', text: 'Deal completed seamlessly. Title deed issued in name of Omar Nasser. Escrow funds released to seller.' },
      { id: 'n2', author: 'Compliance Desk', role: 'Trustee', date: '20 Apr 2026', text: 'Full KYC & solvency documents cleared under UAE Central Bank standards.' },
    ],
  },
  {
    id: 'DEAL-4819',
    requestId: 'REQ-2039',
    offerId: 'OFF-9115',
    propertyTitle: 'Full Floor Commercial Office · Business Bay',
    propertyType: 'Office',
    propertyLocation: 'Business Bay, Dubai, UAE',
    propertyImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    bedrooms: 'Office Space',
    sizeSqFt: '7,400 sq ft',
    investorId: 'IN-2046',
    investorName: 'Sarah Johnson',
    investorEmail: 'sarah.j@capitalholdings.co.uk',
    investorPhone: '+44 20 7946 0912',
    investorCountry: 'United Kingdom',
    investorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    agentId: 'AG-1045',
    agentName: 'Noura Salem',
    agentEmail: 'noura@primecommercial.ae',
    agentAgency: 'Prime Commercial Properties',
    agentPlan: 'Elite',
    agentAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    agentCountry: 'United Arab Emirates',
    dealValue: 'AED 8,200,000',
    dealValueNumber: 8200000,
    commissionRate: '2.0%',
    commissionAmount: 'AED 164,000',
    commissionSplit: 'AED 114,800 Agency / AED 49,200 Platform',
    escrowStatus: 'Refunding',
    escrowAmount: 'AED 820,000',
    status: 'Cancelled',
    assignedManager: 'Ahmad Khaled',
    managerEmail: 'ahmad@duseat.ae',
    startDate: '02 May 2026',
    expectedCloseDate: '28 May 2026',
    timeline: [
      { id: 't1', title: 'Reservation Signed', date: '02 May 2026', done: true, desc: 'Initial contract signed.' },
      { id: 't2', title: 'Deal Cancelled by Mutual Agreement', date: '14 May 2026', done: true, desc: 'Commercial lease terms not agreeable with building management.' },
      { id: 't3', title: 'Deposit Refund Initiated', date: '15 May 2026', done: true, desc: '100% refund processed back to investor.' },
    ],
    documents: [],
    payments: [
      { id: 'pay-1', title: 'Refunded Deposit', amount: 'AED 820,000', amountNumber: 820000, status: 'Refunded', date: '15 May 2026', method: 'Bank Wire', reference: 'REF-88190' },
    ],
    conversation: [],
    notes: [
      { id: 'n1', author: 'Ahmad Khaled', role: 'Manager', date: '14 May 2026', text: 'Cancelled per investor request without penalty.' },
    ],
  },
  {
    id: 'DEAL-4818',
    requestId: 'REQ-2038',
    offerId: 'OFF-9110',
    propertyTitle: 'Sky Penthouse with Burj View · Downtown',
    propertyType: 'Penthouse',
    propertyLocation: 'Downtown Dubai, UAE',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    bedrooms: '3 Bedrooms',
    sizeSqFt: '3,800 sq ft',
    investorId: 'IN-2048',
    investorName: 'Amal Haddad',
    investorEmail: 'amal.haddad@example.com',
    investorPhone: '+971 50 248 9912',
    investorCountry: 'United Arab Emirates',
    investorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    agentId: 'AG-1044',
    agentName: 'Ahmed Al Mansoori',
    agentEmail: 'ahmed@downtowndxb.ae',
    agentAgency: 'Prestige Homes Downtown',
    agentPlan: 'Pro agent',
    agentAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    agentCountry: 'United Arab Emirates',
    dealValue: 'AED 9,500,000',
    dealValueNumber: 9500000,
    commissionRate: '2.0%',
    commissionAmount: 'AED 190,000',
    commissionSplit: 'AED 133,000 Agency / AED 57,000 Platform',
    escrowStatus: 'Pending',
    escrowAmount: 'AED 0',
    status: 'Failed',
    assignedManager: 'Ahmad Khaled',
    managerEmail: 'ahmad@duseat.ae',
    startDate: '20 Apr 2026',
    expectedCloseDate: '05 May 2026',
    timeline: [
      { id: 't1', title: 'Reservation Lapsed', date: '05 May 2026', done: true, desc: 'Buyer failed to transfer security deposit within the 7-day statutory period.' },
    ],
    documents: [],
    payments: [],
    conversation: [],
    notes: [
      { id: 'n1', author: 'System', role: 'Automated Check', date: '05 May 2026', text: 'Deal automatically marked Failed due to deposit deadline expiry.' },
    ],
  },
]
