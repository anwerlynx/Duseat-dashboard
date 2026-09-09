export type ReportStatus =
  | 'pending'
  | 'under_review'
  | 'waiting_user'
  | 'escalated'
  | 'resolved'
  | 'rejected'

export type ReportCategory =
  | 'Spam'
  | 'Fake Agent'
  | 'Fake Investor'
  | 'Fraud'
  | 'Abuse'
  | 'Harassment'
  | 'Offensive Content'
  | 'Fake Property'
  | 'Copyright'
  | 'Payment Issue'
  | 'Technical Issue'
  | 'Other'

export type ReportPriority = 'critical' | 'high' | 'medium' | 'low'

export interface ReportEvidence {
  id: string
  type: 'image' | 'video' | 'document' | 'voice' | 'link' | 'message'
  title: string
  url?: string
  thumbnail?: string
  duration?: string
  size?: string
  ext?: string
  timestamp?: string
  messageData?: {
    sender: string
    senderAvatar: string
    senderRole: string
    text: string
    time: string
    context: string
  }
  linkData?: {
    title: string
    domain: string
    description: string
    url: string
  }
}

export interface ReportTimelineEvent {
  id: string
  event: string
  actor: string
  actorRole: string
  timestamp: string
  note?: string
  type: 'creation' | 'assignment' | 'review' | 'communication' | 'escalation' | 'decision' | 'action'
}

export interface ReportInternalNote {
  id: string
  author: string
  authorRole: string
  authorAvatar?: string
  date: string
  text: string
  category: 'Investigation' | 'Legal' | 'Action Log' | 'Risk'
}

export interface ReportItem {
  id: string
  category: ReportCategory
  status: ReportStatus
  priority: ReportPriority
  createdAt: string
  lastActivity: string
  description: string
  assignedModerator: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  } | null
  reporter: {
    id: string
    name: string
    email: string
    phone: string
    userType: 'Investor' | 'Agent'
    avatar?: string
    country: string
    accountStatus: 'Active' | 'Suspended' | 'Under Review' | 'Warned' | 'Banned'
    verified: boolean
    agency?: string
    licenseNo?: string
    riskScore?: number
    previousStrikes?: number
  }
  reportedUser: {
    id: string
    name: string
    email: string
    phone: string
    userType: 'Investor' | 'Agent'
    avatar?: string
    country: string
    accountStatus: 'Active' | 'Warned' | 'Suspended' | 'Banned' | 'Under Review'
    verified: boolean
    agency?: string
    licenseNo?: string
    riskScore: number
    previousStrikes: number
  }
  relatedRequest?: {
    id: string
    title: string
    budget: string
    status: string
    propertyType: string
    location: string
  }
  relatedConversation?: {
    id: string
    context: string
    lastMessage: string
    status: string
    lastActivity: string
  }
  relatedProperty?: {
    title: string
    location: string
    price: string
    developer?: string
  }
  relatedDeal?: {
    id: string
    price: string
    escrowStatus: string
  }
  evidence: ReportEvidence[]
  timeline: ReportTimelineEvent[]
  internalNotes: ReportInternalNote[]
  resolution?: {
    decision: 'resolved' | 'rejected'
    reason: string
    actionTaken: string
    resolvedBy: string
    resolvedAt: string
  }
}

export const initialReports: ReportItem[] = [
  {
    id: 'REP-8821',
    category: 'Fake Agent',
    status: 'pending',
    priority: 'critical',
    createdAt: 'Today, 09:15 AM',
    lastActivity: '12 mins ago',
    description:
      'The broker Tariq claimed to possess exclusive listing authorization for the Palm Jumeirah Frond N signature villa, but official DLD validation shows listing rights belong exclusively to Emaar Signature. He also requested an off-platform bank transfer of AED 250,000 to a personal Mashreq account.',
    assignedModerator: null,
    reporter: {
      id: 'IN-2048',
      name: 'Anwar Hosny',
      email: 'anwar.hosny@apexcapital.ae',
      phone: '+971 55 987 6543',
      userType: 'Investor',
      country: 'United Arab Emirates',
      accountStatus: 'Active',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    },
    reportedUser: {
      id: 'AG-1092',
      name: 'Tariq Al-Sabah',
      email: 'tariq.broker@fastmail.ae',
      phone: '+971 50 882 1199',
      userType: 'Agent',
      country: 'United Arab Emirates',
      accountStatus: 'Active',
      verified: false,
      agency: 'Al Sabah Real Estate LLC',
      licenseNo: 'RERA-BRN-EXPIRED',
      riskScore: 88,
      previousStrikes: 2,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    relatedRequest: {
      id: 'REQ-IN-2048-04',
      title: 'Palm Jumeirah Luxury Beachfront Villa',
      budget: 'AED 22,500,000',
      status: 'Open',
      propertyType: 'Villa',
      location: 'Frond N, Palm Jumeirah',
    },
    relatedConversation: {
      id: 'CHAT-714092',
      context: 'Palm Jumeirah Beachfront Villa • Frond N',
      lastMessage: 'Kindly transfer the 5% booking deposit to my personal Mashreq account to hold the key pass.',
      status: 'flagged',
      lastActivity: 'Today, 09:10 AM',
    },
    relatedProperty: {
      title: 'Signature Beachfront Villa Frond N',
      location: 'Palm Jumeirah, Dubai',
      price: 'AED 22,500,000',
      developer: 'Nakheel / Private Vendor',
    },
    evidence: [
      {
        id: 'ev-1',
        type: 'image',
        title: 'WhatsApp Deposit Request Screenshot',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        timestamp: '09:12 AM',
        size: '1.4 MB',
      },
      {
        id: 'ev-2',
        type: 'document',
        title: 'Unverified_Broker_NOC_Scan.pdf',
        size: '1.8 MB',
        ext: 'PDF',
        timestamp: '09:14 AM',
      },
      {
        id: 'ev-3',
        type: 'message',
        title: 'Off-Platform Bank Transfer Solicitation',
        messageData: {
          sender: 'Tariq Al-Sabah',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          senderRole: 'Agent',
          text: 'Kindly transfer the 5% booking deposit (AED 250,000) to my personal Mashreq account (AE290330000...) to secure the key pass.',
          time: '09:08 AM',
          context: 'Negotiation Room CHAT-714092',
        },
        timestamp: '09:08 AM',
      },
    ],
    timeline: [
      {
        id: 'tl-1',
        event: 'Report submitted by investor Anwar Hosny',
        actor: 'Anwar Hosny',
        actorRole: 'Investor',
        timestamp: 'Today, 09:15 AM',
        type: 'creation',
      },
      {
        id: 'tl-2',
        event: 'AI Sentinel detected high-risk payment keywords in CHAT-714092',
        actor: 'Security Sentinel Bot',
        actorRole: 'System',
        timestamp: 'Today, 09:16 AM',
        note: 'Severity: Critical. Personal IBAN transfer solicitation detected.',
        type: 'review',
      },
    ],
    internalNotes: [
      {
        id: 'in-1',
        author: 'Security Sentinel AI',
        authorRole: 'Automated Risk Engine',
        date: 'Today, 09:16 AM',
        text: 'Agent AG-1092 license expired on 14 July 2026. 2 prior warnings for off-platform payment solicitations on record.',
        category: 'Risk',
      },
    ],
  },
  {
    id: 'REP-8820',
    category: 'Fraud',
    status: 'under_review',
    priority: 'high',
    createdAt: 'Today, 08:30 AM',
    lastActivity: '45 mins ago',
    description:
      'Investor reported that the agent uploaded an altered Title Deed PDF where the owner name was electronically overwritten. DLD QR code inspection indicated metadata mismatch with plot registry.',
    assignedModerator: {
      id: 'MOD-102',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@duseat.ae',
      role: 'Senior Trust Officer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
    reporter: {
      id: 'IN-2047',
      name: 'Elena Rostova',
      email: 'e.rostova@genevacapital.ch',
      phone: '+41 22 819 9000',
      userType: 'Investor',
      country: 'United Kingdom',
      accountStatus: 'Active',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    },
    reportedUser: {
      id: 'AG-1033',
      name: 'Rami Mansour',
      email: 'rami@mansourholding.ae',
      phone: '+971 52 333 4455',
      userType: 'Agent',
      country: 'United Arab Emirates',
      accountStatus: 'Under Review',
      verified: true,
      agency: 'Mansour Real Estate Brokering',
      licenseNo: 'RERA-BRN-88102',
      riskScore: 74,
      previousStrikes: 1,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
    relatedRequest: {
      id: 'REQ-IN-2047-01',
      title: 'Burj Crown 3 Bed High Floor',
      budget: 'AED 6,500,000',
      status: 'Open',
      propertyType: 'Apartment',
      location: 'Downtown Dubai',
    },
    relatedConversation: {
      id: 'CHAT-802194',
      context: 'Burj Crown • 3 Bed Luxury Residence • Downtown',
      lastMessage: 'Please find attached the official title deed copy.',
      status: 'active',
      lastActivity: 'Today, 08:25 AM',
    },
    relatedProperty: {
      title: 'Burj Crown Luxury Residence 304',
      location: 'Downtown Dubai',
      price: 'AED 6,450,000',
      developer: 'Emaar Properties',
    },
    evidence: [
      {
        id: 'ev-10',
        type: 'document',
        title: 'Title_Deed_DLD_Unit_304.pdf',
        size: '3.4 MB',
        ext: 'PDF',
        timestamp: '08:24 AM',
      },
      {
        id: 'ev-11',
        type: 'image',
        title: 'OCR Digital Tampering Highlight Scan',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        timestamp: '08:40 AM',
        size: '2.1 MB',
      },
    ],
    timeline: [
      {
        id: 'tl-10',
        event: 'Report submitted by investor Elena Rostova',
        actor: 'Elena Rostova',
        actorRole: 'Investor',
        timestamp: 'Today, 08:30 AM',
        type: 'creation',
      },
      {
        id: 'tl-11',
        event: 'Assigned to Senior Trust Officer Sarah Jenkins',
        actor: 'System Auto-Dispatcher',
        actorRole: 'System',
        timestamp: 'Today, 08:32 AM',
        type: 'assignment',
      },
      {
        id: 'tl-12',
        event: 'DLD Title Deed QR Code validation initiated',
        actor: 'Sarah Jenkins',
        actorRole: 'Moderator',
        timestamp: 'Today, 08:45 AM',
        note: 'Verifying QR cryptographic hash with DLD REST API endpoint.',
        type: 'review',
      },
    ],
    internalNotes: [
      {
        id: 'in-10',
        author: 'Sarah Jenkins',
        authorRole: 'Senior Trust Officer',
        date: 'Today, 08:50 AM',
        text: 'DLD API response returned invalid signature on plot #4089. Preparing formal compliance warning.',
        category: 'Legal',
      },
    ],
  },
  {
    id: 'REP-8819',
    category: 'Fake Property',
    status: 'waiting_user',
    priority: 'medium',
    createdAt: 'Yesterday, 04:20 PM',
    lastActivity: '2 hours ago',
    description:
      'Investor alleges that the architectural render photos submitted in offer #OFF-9041 depict a residential estate in Bel Air, California rather than the actual Dubai Hills Estate project.',
    assignedModerator: {
      id: 'MOD-101',
      name: 'Ahmad Khaled',
      email: 'ahmad.khaled@duseat.ae',
      role: 'Operations Moderator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    },
    reporter: {
      id: 'IN-2045',
      name: 'Marcus Vance',
      email: 'marcus.vance@vanceholdings.co.uk',
      phone: '+44 20 7946 0192',
      userType: 'Investor',
      country: 'United Kingdom',
      accountStatus: 'Active',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400',
    },
    reportedUser: {
      id: 'AG-1022',
      name: 'Karim Al-Husseini',
      email: 'karim@husseinirealty.ae',
      phone: '+971 50 112 9900',
      userType: 'Agent',
      country: 'United Arab Emirates',
      accountStatus: 'Active',
      verified: true,
      agency: 'Husseini Luxury Properties',
      licenseNo: 'RERA-BRN-44912',
      riskScore: 32,
      previousStrikes: 0,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    },
    relatedRequest: {
      id: 'REQ-IN-2045-03',
      title: 'Dubai Hills Golf Place Villa',
      budget: 'AED 18,900,000',
      status: 'Open',
      propertyType: 'Villa',
      location: 'Dubai Hills Estate',
    },
    relatedProperty: {
      title: 'Golf Place Luxury Villa Phase 2',
      location: 'Dubai Hills Estate',
      price: 'AED 18,900,000',
      developer: 'Emaar Properties',
    },
    evidence: [
      {
        id: 'ev-20',
        type: 'image',
        title: 'Reverse Image Search Matching Architectural Digest California',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        timestamp: 'Yesterday, 04:22 PM',
        size: '1.9 MB',
      },
      {
        id: 'ev-21',
        type: 'link',
        title: 'Architectural Digest Source Verification',
        linkData: {
          title: 'Bel Air Contemporary Estate — Architectural Digest',
          domain: 'architecturaldigest.com',
          description: 'Contemporary villa estate located in Bel Air, California designed by SAOTA Architecture.',
          url: 'https://architecturaldigest.com',
        },
      },
    ],
    timeline: [
      {
        id: 'tl-20',
        event: 'Report submitted by Marcus Vance',
        actor: 'Marcus Vance',
        actorRole: 'Investor',
        timestamp: 'Yesterday, 04:20 PM',
        type: 'creation',
      },
      {
        id: 'tl-21',
        event: 'Assigned to Ahmad Khaled',
        actor: 'System',
        actorRole: 'System',
        timestamp: 'Yesterday, 04:25 PM',
        type: 'assignment',
      },
      {
        id: 'tl-22',
        event: 'Clarification requested from Agent Karim Al-Husseini',
        actor: 'Ahmad Khaled',
        actorRole: 'Moderator',
        timestamp: 'Yesterday, 05:10 PM',
        note: 'Requested verified site photographs and developer NOC within 24 hours.',
        type: 'communication',
      },
    ],
    internalNotes: [
      {
        id: 'in-20',
        author: 'Ahmad Khaled',
        authorRole: 'Operations Moderator',
        date: 'Yesterday, 05:15 PM',
        text: 'Awaiting broker response before taking down offer #OFF-9041.',
        category: 'Action Log',
      },
    ],
  },
  {
    id: 'REP-8818',
    category: 'Abuse',
    status: 'escalated',
    priority: 'critical',
    createdAt: '03 Sep 2026, 01:10 PM',
    lastActivity: 'Yesterday',
    description:
      'Reported investor used aggressive, threatening language and harassment in private chat room after broker submitted a counter-proposal.',
    assignedModerator: {
      id: 'MOD-103',
      name: 'Khalid Al-Nuaimi',
      email: 'khalid.nuaimi@duseat.ae',
      role: 'Head of Trust & Safety',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    },
    reporter: {
      id: 'AG-1044',
      name: 'Zaid Al-Harbi',
      email: 'zaid.harbi@palmestates.ae',
      phone: '+971 56 777 1122',
      userType: 'Agent',
      country: 'Saudi Arabia',
      accountStatus: 'Active',
      verified: true,
      agency: 'Palm Luxury Estates LLC',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    reportedUser: {
      id: 'IN-2033',
      name: 'Dmitri Volkov',
      email: 'dmitri.volkov@moscowholdings.ru',
      phone: '+7 916 123 4567',
      userType: 'Investor',
      country: 'Russian Federation',
      accountStatus: 'Warned',
      verified: true,
      riskScore: 92,
      previousStrikes: 3,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    },
    relatedConversation: {
      id: 'CHAT-601934',
      context: 'Emirates Hills Sector E Mansion',
      lastMessage: 'You will regret this refusal, I will ensure your brokerage is blacklisted across Dubai.',
      status: 'closed',
      lastActivity: '03 Sep 2026, 01:05 PM',
    },
    evidence: [
      {
        id: 'ev-30',
        type: 'message',
        title: 'Abusive & Threatening Transmission',
        messageData: {
          sender: 'Dmitri Volkov',
          senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
          senderRole: 'Investor',
          text: 'You will regret this refusal, I will ensure your brokerage is blacklisted across Dubai. You are dealing with the wrong people.',
          time: '01:05 PM',
          context: 'Negotiation Room CHAT-601934',
        },
        timestamp: '01:05 PM',
      },
    ],
    timeline: [
      {
        id: 'tl-30',
        event: 'Report submitted by broker Zaid Al-Harbi',
        actor: 'Zaid Al-Harbi',
        actorRole: 'Agent',
        timestamp: '03 Sep 2026, 01:10 PM',
        type: 'creation',
      },
      {
        id: 'tl-31',
        event: 'Escalated to Head of Trust & Safety Khalid Al-Nuaimi',
        actor: 'Sarah Jenkins',
        actorRole: 'Moderator',
        timestamp: '03 Sep 2026, 02:00 PM',
        note: 'Strike count = 3. Direct violation of platform safety charter.',
        type: 'escalation',
      },
    ],
    internalNotes: [
      {
        id: 'in-30',
        author: 'Khalid Al-Nuaimi',
        authorRole: 'Head of Trust & Safety',
        date: '03 Sep 2026, 02:30 PM',
        text: 'Preparing temporary 30-day suspension notice for user IN-2033. Legal consultation confirmed breach of Terms of Service §14.',
        category: 'Legal',
      },
    ],
  },
  {
    id: 'REP-8817',
    category: 'Payment Issue',
    status: 'resolved',
    priority: 'medium',
    createdAt: '01 Sep 2026, 10:00 AM',
    lastActivity: '02 Sep 2026',
    description:
      'Investor reported escrow deposit deduction discrepancy of AED 12,000 on transaction deal #DEAL-1048-DXB due to currency gateway conversion.',
    assignedModerator: {
      id: 'MOD-101',
      name: 'Ahmad Khaled',
      email: 'ahmad.khaled@duseat.ae',
      role: 'Operations Moderator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    },
    reporter: {
      id: 'IN-2048',
      name: 'Anwar Hosny',
      email: 'anwar.hosny@apexcapital.ae',
      phone: '+971 55 987 6543',
      userType: 'Investor',
      country: 'United Arab Emirates',
      accountStatus: 'Active',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    },
    reportedUser: {
      id: 'SYS-ESCROW',
      name: 'Duseat Escrow Engine',
      email: 'escrow@duseat.ae',
      phone: '+971 4 000 9000',
      userType: 'Agent',
      country: 'United Arab Emirates',
      accountStatus: 'Active',
      verified: true,
      riskScore: 0,
      previousStrikes: 0,
    },
    relatedDeal: {
      id: 'DEAL-1048-DXB',
      price: 'AED 14,200,000',
      escrowStatus: 'Locked',
    },
    evidence: [
      {
        id: 'ev-40',
        type: 'document',
        title: 'Bank_Swift_Receipt_AED_14M.pdf',
        size: '1.2 MB',
        ext: 'PDF',
        timestamp: '01 Sep, 10:05 AM',
      },
    ],
    timeline: [
      {
        id: 'tl-40',
        event: 'Report submitted by Anwar Hosny',
        actor: 'Anwar Hosny',
        actorRole: 'Investor',
        timestamp: '01 Sep 2026, 10:00 AM',
        type: 'creation',
      },
      {
        id: 'tl-41',
        event: 'Finance audit completed & refund issued',
        actor: 'Ahmad Khaled',
        actorRole: 'Moderator',
        timestamp: '02 Sep 2026, 03:15 PM',
        note: 'Gateway currency conversion rounding error credited back to investor wallet.',
        type: 'decision',
      },
    ],
    internalNotes: [
      {
        id: 'in-40',
        author: 'Ahmad Khaled',
        authorRole: 'Operations Moderator',
        date: '02 Sep 2026, 03:20 PM',
        text: 'Resolved and closed with Finance gateway reconciliation reference #REC-99124.',
        category: 'Action Log',
      },
    ],
    resolution: {
      decision: 'resolved',
      reason: 'Gateway fee adjustment verified and credited back to investor balance.',
      actionTaken: 'Refund of AED 12,000 processed via Stripe/ENBD Gateway.',
      resolvedBy: 'Ahmad Khaled',
      resolvedAt: '02 Sep 2026, 03:20 PM',
    },
  },
  {
    id: 'REP-8816',
    category: 'Spam',
    status: 'rejected',
    priority: 'low',
    createdAt: '30 Aug 2026, 02:45 PM',
    lastActivity: '31 Aug 2026',
    description:
      'Broker reported investor for sending identical property requirements to 8 different agency listings simultaneously.',
    assignedModerator: {
      id: 'MOD-102',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@duseat.ae',
      role: 'Senior Trust Officer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    },
    reporter: {
      id: 'AG-1046',
      name: 'Ahmed Khaled',
      email: 'ahmed.khaled@emaarproperties.ae',
      phone: '+971 50 123 4567',
      userType: 'Agent',
      country: 'Egypt',
      accountStatus: 'Active',
      verified: true,
      agency: 'Emaar Signature Properties',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    },
    reportedUser: {
      id: 'IN-2046',
      name: 'Nasser Al-Thani',
      email: 'nasser.thani@dohainvest.qa',
      phone: '+974 55 112 334',
      userType: 'Investor',
      country: 'Qatar',
      accountStatus: 'Active',
      verified: true,
      riskScore: 12,
      previousStrikes: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    evidence: [],
    timeline: [
      {
        id: 'tl-50',
        event: 'Report submitted by Ahmed Khaled',
        actor: 'Ahmed Khaled',
        actorRole: 'Agent',
        timestamp: '30 Aug 2026, 02:45 PM',
        type: 'creation',
      },
      {
        id: 'tl-51',
        event: 'Report rejected by Moderator',
        actor: 'Sarah Jenkins',
        actorRole: 'Moderator',
        timestamp: '31 Aug 2026, 11:30 AM',
        note: 'Submitting multiple inquiries across marketplace listings is permitted under buyer terms.',
        type: 'decision',
      },
    ],
    internalNotes: [
      {
        id: 'in-50',
        author: 'Sarah Jenkins',
        authorRole: 'Senior Trust Officer',
        date: '31 Aug 2026, 11:30 AM',
        text: 'No violation found. Investor was actively exploring different brokers for competitive offers.',
        category: 'Investigation',
      },
    ],
    resolution: {
      decision: 'rejected',
      reason: 'No policy breach. Multiple concurrent inquiries are standard marketplace behavior.',
      actionTaken: 'Report dismissed without penalty to either party.',
      resolvedBy: 'Sarah Jenkins',
      resolvedAt: '31 Aug 2026, 11:30 AM',
    },
  },
  {
    id: 'REP-8815',
    category: 'Copyright',
    status: 'under_review',
    priority: 'medium',
    createdAt: '28 Aug 2026, 11:10 AM',
    lastActivity: '1 day ago',
    description:
      'Photography studio reported that broker unauthorizedly used copyrighted interior staging photos in listing without license accreditation.',
    assignedModerator: {
      id: 'MOD-101',
      name: 'Ahmad Khaled',
      email: 'ahmad.khaled@duseat.ae',
      role: 'Operations Moderator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    },
    reporter: {
      id: 'STU-902',
      name: 'Studio Luxe Dubai',
      email: 'legal@studioluxe.ae',
      phone: '+971 4 399 2200',
      userType: 'Agent',
      country: 'United Arab Emirates',
      accountStatus: 'Active',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    },
    reportedUser: {
      id: 'AG-1015',
      name: 'Walid Hassan',
      email: 'walid@hassanprime.ae',
      phone: '+971 50 665 4433',
      userType: 'Agent',
      country: 'United Arab Emirates',
      accountStatus: 'Active',
      verified: true,
      agency: 'Hassan Prime Properties',
      licenseNo: 'RERA-BRN-33190',
      riskScore: 28,
      previousStrikes: 0,
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400',
    },
    evidence: [
      {
        id: 'ev-60',
        type: 'document',
        title: 'Copyright_Registration_Certificate_2026.pdf',
        size: '2.1 MB',
        ext: 'PDF',
      },
    ],
    timeline: [
      {
        id: 'tl-60',
        event: 'Copyright DMCA notice submitted',
        actor: 'Studio Luxe Dubai',
        actorRole: 'Agent',
        timestamp: '28 Aug 2026, 11:10 AM',
        type: 'creation',
      },
    ],
    internalNotes: [],
  },
  {
    id: 'REP-8814',
    category: 'Harassment',
    status: 'pending',
    priority: 'high',
    createdAt: '27 Aug 2026, 06:40 PM',
    lastActivity: '3 days ago',
    description:
      'Investor reported receiving unsolicited high-frequency promotional messages and calls outside platform negotiation hours.',
    assignedModerator: null,
    reporter: {
      id: 'IN-2041',
      name: 'Chloe Dupont',
      email: 'c.dupont@parisfamily.fr',
      phone: '+33 6 12 34 56 78',
      userType: 'Investor',
      country: 'France',
      accountStatus: 'Active',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    },
    reportedUser: {
      id: 'AG-1008',
      name: 'Faisal Al-Otaibi',
      email: 'faisal@otaibiproperties.ae',
      phone: '+971 50 887 7665',
      userType: 'Agent',
      country: 'Saudi Arabia',
      accountStatus: 'Active',
      verified: false,
      riskScore: 65,
      previousStrikes: 1,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    evidence: [],
    timeline: [],
    internalNotes: [],
  },
]
