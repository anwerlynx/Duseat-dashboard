export interface PropertyCardData {
  id?: string
  title: string
  subtitle: string
  price: string
  location?: string
  propertyType?: string
  bedrooms?: number
  area?: string
  url: string
  image: string
}

export interface DocumentAttachment {
  name: string
  size: string
  ext: string
  url: string
}

export interface LinkPreviewData {
  title: string
  description: string
  url: string
  domain: string
  image?: string
}

export interface ChatMessage {
  id: string
  sender: 'agent' | 'investor' | 'system' | 'admin'
  senderName: string
  senderRole?: string
  avatar?: string
  country?: string
  type:
    | 'text'
    | 'image'
    | 'gallery'
    | 'video'
    | 'voice'
    | 'document'
    | 'link_preview'
    | 'property_card'
    | 'system_notice'
    | 'system_event'
    | 'internal_note'
  text?: string
  time: string
  date?: string
  status?: 'sent' | 'delivered' | 'read' | 'error' | 'sending'
  duration?: string
  waveform?: number[]
  videoThumbnail?: string
  mediaUrl?: string
  photos?: string[]
  document?: DocumentAttachment
  linkPreview?: LinkPreviewData
  propertyCard?: PropertyCardData
  systemType?:
    | 'deal_created'
    | 'deal_secured'
    | 'offer_accepted'
    | 'chat_closed'
    | 'chat_reopened'
    | 'agent_assigned'
    | 'media_deleted'
    | 'message_deleted'
    | 'warning'
    | 'info'
  isEdited?: boolean
  isDeleted?: boolean
  isFlagged?: boolean
  isPinned?: boolean
  replyTo?: {
    senderName: string
    type: string
    snippet: string
  }
}

export interface TimelineEvent {
  id: string
  title: string
  description: string
  time: string
  actor: string
  type: 'milestone' | 'security' | 'offer' | 'deal' | 'system'
}

export interface InternalComplianceNote {
  id: string
  author: string
  authorRole: string
  date: string
  text: string
  category?: 'compliance' | 'negotiation' | 'risk' | 'general'
}

export interface ChatThread {
  id: string
  requestId: string
  context: string
  dealPrice?: string
  status: 'active' | 'closed' | 'flagged' | 'reported'
  startedDate: string
  lastActivity: string
  duration: string
  totalMessages: number
  unreadCount?: number
  isFlagged?: boolean
  isReported?: boolean
  flagReason?: string
  reportReason?: string
  agent: {
    id: string
    name: string
    email?: string
    phone?: string
    agency?: string
    licenseNo?: string
    rating?: number
    avatar?: string
    country?: string
    reraVerified: boolean
    plan: string
    isOnline: boolean
    lastSeen?: string
  }
  investor: {
    id: string
    name: string
    email?: string
    phone?: string
    avatar?: string
    country?: string
    kycVerified: boolean
    score: number
    isOnline: boolean
    lastSeen?: string
  }
  property: {
    id: string
    title: string
    price: string
    type: string
    location: string
    bedrooms: number
    area: string
    image: string
    requestStatus: string
  }
  messages: ChatMessage[]
  timeline: TimelineEvent[]
  complianceNotes: InternalComplianceNote[]
}

export const initialChatThreads: ChatThread[] = [
  {
    id: 'CHAT-917212',
    requestId: 'REQ-IN-2048-04',
    context: 'Downtown Luxury Penthouse • 4 Bed • Full Burj View',
    dealPrice: 'AED 14,200,000',
    status: 'closed',
    startedDate: '01 Sep 2026, 09:30 AM',
    lastActivity: 'Yesterday, 11:06 PM',
    duration: '4.2 days',
    totalMessages: 14,
    unreadCount: 0,
    isFlagged: false,
    agent: {
      id: 'AG-1046',
      name: 'Ahmed Khaled',
      email: 'ahmed.khaled@emaarproperties.ae',
      phone: '+971 50 123 4567',
      agency: 'Emaar Signature Properties',
      licenseNo: 'RERA-BRN-48921',
      rating: 4.9,
      country: 'Egypt',
      reraVerified: true,
      plan: 'Pro agent',
      isOnline: true,
      lastSeen: 'Active now',
    },
    investor: {
      id: 'IN-2048',
      name: 'Anwar Hosny',
      email: 'anwar.hosny@apexcapital.ae',
      phone: '+971 55 987 6543',
      country: 'United Arab Emirates',
      kycVerified: true,
      score: 96,
      isOnline: true,
      lastSeen: 'Active now',
    },
    property: {
      id: 'PROP-DXB-902',
      title: 'Il Primo Ultra-Luxury Penthouse',
      price: 'AED 14,200,000',
      type: 'Penthouse',
      location: 'Opera District, Downtown Dubai',
      bedrooms: 4,
      area: '5,420 sq.ft',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
      requestStatus: 'Negotiation Finalized',
    },
    timeline: [
      {
        id: 't-1',
        title: 'Conversation Initiated',
        description: 'Auto-created upon offer acceptance on Request #REQ-IN-2048-04',
        time: '01 Sep 2026, 09:30 AM',
        actor: 'System',
        type: 'system',
      },
      {
        id: 't-2',
        title: 'Floor Plan Shared',
        description: 'Agent uploaded official high-res CAD layout and payment schedule',
        time: '02 Sep 2026, 02:15 PM',
        actor: 'Ahmed Khaled',
        type: 'milestone',
      },
      {
        id: 't-3',
        title: 'Price Agreement Reached',
        description: 'Buyer accepted revised counter-offer at AED 14,200,000 (Escrow ready)',
        time: '04 Sep 2026, 06:40 PM',
        actor: 'Anwar Hosny',
        type: 'deal',
      },
      {
        id: 't-4',
        title: 'Room Concluded & Closed',
        description: 'Deal locked in escrow; room closed for participant messaging',
        time: '04 Sep 2026, 11:06 PM',
        actor: 'Duseat Moderator',
        type: 'milestone',
      },
    ],
    complianceNotes: [
      {
        id: 'n-1',
        author: 'Admin Compliance Desk',
        authorRole: 'Senior Moderator',
        date: '04 Sep 2026, 11:15 PM',
        text: 'Buyer ID and RERA Broker Card verified against DLD Registry. Escrow contract generated.',
        category: 'compliance',
      },
      {
        id: 'n-2',
        author: 'Security Sentinel AI',
        authorRole: 'Automated Bot',
        date: '03 Sep 2026, 04:22 PM',
        text: 'Zero phone/email leakage detected in 14 transmissions. Confidence: 99.4%.',
        category: 'risk',
      },
    ],
    messages: [
      {
        id: 'm-0',
        sender: 'system',
        senderName: 'Duseat System',
        type: 'system_event',
        systemType: 'deal_created',
        text: 'Negotiation room created for Request #REQ-IN-2048-04 between Anwar Hosny (Investor) and Ahmed Khaled (Emaar Properties).',
        time: '01 Sep, 09:30 AM',
        date: '01 September 2026',
      },
      {
        id: 'm-1',
        sender: 'agent',
        senderName: 'Ahmed Khaled',
        type: 'text',
        text: 'Good morning Anwar. Thank you for accepting our proposal on the Il Primo Penthouse in Downtown Dubai. I have the full floor plan and payment terms ready.',
        time: '09:35 AM',
        status: 'read',
      },
      {
        id: 'm-2',
        sender: 'agent',
        senderName: 'Ahmed Khaled',
        type: 'video',
        time: '09:38 AM',
        duration: '01:42',
        videoThumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
        mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        status: 'read',
      },
      {
        id: 'm-3',
        sender: 'investor',
        senderName: 'Anwar Hosny',
        type: 'text',
        text: 'Thanks Ahmed. The terrace panoramic view of the Burj Khalifa looks exceptional. Could you send the official SPA draft and DLD transfer fee schedule?',
        time: '10:14 AM',
        status: 'read',
      },
      {
        id: 'm-4',
        sender: 'agent',
        senderName: 'Ahmed Khaled',
        type: 'document',
        time: '10:20 AM',
        status: 'read',
        document: {
          name: 'Il_Primo_Unit_804_SPA_Draft_V2.pdf',
          size: '3.8 MB',
          ext: 'PDF',
          url: '#',
        },
      },
      {
        id: 'm-5',
        sender: 'investor',
        senderName: 'Anwar Hosny',
        type: 'voice',
        time: '11:02 AM',
        duration: '00:28',
        waveform: [25, 40, 70, 95, 60, 45, 80, 100, 65, 40, 55, 90, 75, 50, 30, 65, 85, 40, 60, 30],
        status: 'read',
      },
      {
        id: 'm-6',
        sender: 'agent',
        senderName: 'Ahmed Khaled',
        type: 'link_preview',
        time: '11:15 AM',
        status: 'read',
        linkPreview: {
          title: 'Il Primo Opera District by Emaar — Virtual 3D Tour',
          description: 'Experience 360-degree immersive architectural visualization of 4-bedroom duplex residences.',
          url: 'https://property.emaar.com/en/our-communities/downtown-dubai/il-primo',
          domain: 'emaar.com',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'm-7',
        sender: 'admin',
        senderName: 'Duseat Moderator',
        senderRole: 'Compliance Desk',
        type: 'text',
        text: 'Official notice: Escrow milestone generated for AED 14,200,000. All parties are protected under Duseat Smart Contracts.',
        time: '04:15 PM',
        status: 'read',
      },
      {
        id: 'm-8',
        sender: 'system',
        senderName: 'Duseat System',
        type: 'system_event',
        systemType: 'offer_accepted',
        text: 'Offer of AED 14,200,000 accepted by both parties. Escrow deposit lock initiated.',
        time: '06:40 PM',
        date: 'Yesterday',
      },
      {
        id: 'm-9',
        sender: 'system',
        senderName: 'Duseat System',
        type: 'system_notice',
        systemType: 'deal_secured',
        text: 'Congratulations! Ahmed Khaled has successfully concluded the deal. Room is now locked in audit status.',
        time: '11:06 PM',
      },
      {
        id: 'm-10',
        sender: 'system',
        senderName: 'Duseat System',
        type: 'system_event',
        systemType: 'chat_closed',
        text: 'Conversation closed automatically upon escrow binding completion.',
        time: '11:06 PM',
      },
    ],
  },
  {
    id: 'CHAT-802194',
    requestId: 'REQ-IN-2047-01',
    context: 'Burj Crown • 3 Bed Luxury Residence • Downtown',
    dealPrice: 'AED 6,450,000',
    status: 'active',
    startedDate: '03 Sep 2026, 11:00 AM',
    lastActivity: 'Today, 02:15 PM',
    duration: '2.1 days',
    totalMessages: 9,
    unreadCount: 2,
    isFlagged: false,
    agent: {
      id: 'AG-1045',
      name: 'Tariq Al-Mansoor',
      email: 'tariq.mansoor@damacgroup.ae',
      phone: '+971 52 444 8899',
      agency: 'DAMAC Luxury Estates',
      licenseNo: 'RERA-BRN-31092',
      rating: 4.8,
      country: 'United Arab Emirates',
      reraVerified: true,
      plan: 'Elite agent',
      isOnline: true,
      lastSeen: 'Active now',
    },
    investor: {
      id: 'IN-2047',
      name: 'Elena Rostova',
      email: 'e.rostova@genevacapital.ch',
      phone: '+41 22 819 9000',
      country: 'United Kingdom',
      kycVerified: true,
      score: 98,
      isOnline: true,
      lastSeen: 'Active now',
    },
    property: {
      id: 'PROP-DXB-771',
      title: 'Burj Crown Residence High Floor',
      price: 'AED 6,450,000',
      type: 'Apartment',
      location: 'Downtown Dubai',
      bedrooms: 3,
      area: '2,150 sq.ft',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      requestStatus: 'Active Negotiation',
    },
    timeline: [
      {
        id: 't-10',
        title: 'Conversation Initiated',
        description: 'Matched with DAMAC Luxury Estates broker Tariq Al-Mansoor',
        time: '03 Sep 2026, 11:00 AM',
        actor: 'System',
        type: 'system',
      },
      {
        id: 't-11',
        title: 'Voice Memo Sent',
        description: 'Broker explained 60/40 payment plan option with 2-year post handover',
        time: 'Today, 02:12 PM',
        actor: 'Tariq Al-Mansoor',
        type: 'milestone',
      },
    ],
    complianceNotes: [
      {
        id: 'n-11',
        author: 'AI Monitor',
        authorRole: 'Automated Bot',
        date: 'Today, 02:16 PM',
        text: 'High responsiveness. Negotiation pace optimal.',
        category: 'negotiation',
      },
    ],
    messages: [
      {
        id: 'm-101',
        sender: 'investor',
        senderName: 'Elena Rostova',
        type: 'text',
        text: 'Hello Tariq, I reviewed the Burj Crown unit floor plan. Is the developer offering the 60/40 payment structure with 2 years post-handover waiver?',
        time: '02:10 PM',
        date: 'Today',
        status: 'read',
      },
      {
        id: 'm-102',
        sender: 'agent',
        senderName: 'Tariq Al-Mansoor',
        type: 'voice',
        time: '02:12 PM',
        duration: '00:45',
        waveform: [30, 50, 80, 100, 70, 90, 40, 60, 85, 95, 60, 75, 45, 90, 65, 50, 70, 40, 30, 20],
        status: 'read',
      },
      {
        id: 'm-103',
        sender: 'agent',
        senderName: 'Tariq Al-Mansoor',
        type: 'property_card',
        time: '02:15 PM',
        status: 'delivered',
        propertyCard: {
          title: 'Burj Crown Residence High Floor',
          subtitle: 'Full Burj Khalifa View • 2,150 sq.ft • 3 Bed',
          price: 'AED 6,450,000',
          location: 'Downtown Dubai',
          url: 'https://duseat.com/properties/burj-crown-771',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
        },
      },
    ],
  },
  {
    id: 'CHAT-714092',
    requestId: 'REQ-IN-2046-02',
    context: 'Palm Jumeirah Beachfront Villa • Frond N',
    dealPrice: 'AED 22,500,000',
    status: 'flagged',
    startedDate: '02 Sep 2026, 04:00 PM',
    lastActivity: 'Yesterday, 06:30 PM',
    duration: '3.0 days',
    totalMessages: 6,
    unreadCount: 0,
    isFlagged: true,
    flagReason: 'Suspicious off-platform contact exchange attempt flagged by AI Sentinel.',
    agent: {
      id: 'AG-1044',
      name: 'Zaid Al-Harbi',
      email: 'zaid.harbi@palmestates.ae',
      phone: '+971 56 777 1122',
      agency: 'Palm Luxury Estates LLC',
      licenseNo: 'RERA-BRN-19044',
      rating: 4.6,
      country: 'Saudi Arabia',
      reraVerified: true,
      plan: 'Power agent',
      isOnline: false,
      lastSeen: '1 hour ago',
    },
    investor: {
      id: 'IN-2046',
      name: 'Nasser Al-Thani',
      email: 'nasser.thani@dohainvest.qa',
      phone: '+974 55 112 334',
      country: 'Qatar',
      kycVerified: true,
      score: 91,
      isOnline: true,
      lastSeen: 'Active now',
    },
    property: {
      id: 'PROP-DXB-550',
      title: 'Signature Beach Villa Frond N',
      price: 'AED 22,500,000',
      type: 'Villa',
      location: 'Frond N, Palm Jumeirah',
      bedrooms: 6,
      area: '8,200 sq.ft',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
      requestStatus: 'Under Compliance Review',
    },
    timeline: [
      {
        id: 't-20',
        title: 'Conversation Initiated',
        description: 'Direct inquiry on Palm Jumeirah Beachfront Villa',
        time: '02 Sep 2026, 04:00 PM',
        actor: 'System',
        type: 'system',
      },
      {
        id: 't-21',
        title: 'AI Flag Triggered',
        description: 'Automated contact matching detected potential phone number sharing in message m-202',
        time: 'Yesterday, 06:31 PM',
        actor: 'AI Sentinel',
        type: 'security',
      },
    ],
    complianceNotes: [
      {
        id: 'n-21',
        author: 'Moderation Team',
        authorRole: 'Compliance Officer',
        date: 'Yesterday, 06:45 PM',
        text: 'Flagged for inspection. Agent reminded of strict platform escrow policies.',
        category: 'risk',
      },
    ],
    messages: [
      {
        id: 'm-201',
        sender: 'investor',
        senderName: 'Nasser Al-Thani',
        type: 'text',
        text: 'Can we schedule a private VIP site viewing tomorrow morning around 11:00 AM on Frond N?',
        time: '06:25 PM',
        date: 'Yesterday',
        status: 'read',
      },
      {
        id: 'm-202',
        sender: 'agent',
        senderName: 'Zaid Al-Harbi',
        type: 'text',
        text: 'Confirmed. The security gate pass has been registered for Frond N. Looking forward to meeting you on site.',
        time: '06:30 PM',
        status: 'read',
      },
      {
        id: 'm-203',
        sender: 'system',
        senderName: 'Security Sentinel AI',
        type: 'system_notice',
        systemType: 'warning',
        text: 'Compliance reminder: All negotiations, offer adjustments, and payments must be finalized through Duseat Escrow.',
        time: '06:31 PM',
      },
    ],
  },
  {
    id: 'CHAT-601934',
    requestId: 'REQ-IN-2045-03',
    context: 'Dubai Hills Estate • Golf Place 5 Bed Villa',
    dealPrice: 'AED 18,900,000',
    status: 'reported',
    startedDate: '01 Sep 2026, 02:00 PM',
    lastActivity: '03 Sep 2026, 05:10 PM',
    duration: '2.5 days',
    totalMessages: 8,
    unreadCount: 1,
    isReported: true,
    reportReason: 'Investor submitted report claiming delayed document disclosures.',
    agent: {
      id: 'AG-1043',
      name: 'Fatima Al-Nuaimi',
      email: 'fatima@dubaihillsrealty.ae',
      phone: '+971 50 999 4433',
      agency: 'Dubai Hills Premium Real Estate',
      licenseNo: 'RERA-BRN-55102',
      rating: 4.7,
      country: 'United Arab Emirates',
      reraVerified: true,
      plan: 'Pro agent',
      isOnline: false,
      lastSeen: '3 hours ago',
    },
    investor: {
      id: 'IN-2045',
      name: 'Marcus Vance',
      email: 'marcus.vance@vanceholdings.co.uk',
      phone: '+44 20 7946 0192',
      country: 'United Kingdom',
      kycVerified: true,
      score: 95,
      isOnline: true,
      lastSeen: 'Active now',
    },
    property: {
      id: 'PROP-DXB-420',
      title: 'Golf Place Luxury Villa Phase 2',
      price: 'AED 18,900,000',
      type: 'Villa',
      location: 'Golf Place, Dubai Hills Estate',
      bedrooms: 5,
      area: '7,400 sq.ft',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      requestStatus: 'Reported by Investor',
    },
    timeline: [
      {
        id: 't-30',
        title: 'Conversation Initiated',
        description: 'Investor Marcus Vance requested full title deed and NOC from Emaar',
        time: '01 Sep 2026, 02:00 PM',
        actor: 'System',
        type: 'system',
      },
      {
        id: 't-31',
        title: 'Report Filed by Investor',
        description: 'Investor reported broker response delay exceeding SLA threshold',
        time: '03 Sep 2026, 05:10 PM',
        actor: 'Marcus Vance',
        type: 'security',
      },
    ],
    complianceNotes: [
      {
        id: 'n-30',
        author: 'Customer Support Lead',
        authorRole: 'Admin Supervisor',
        date: '03 Sep 2026, 05:30 PM',
        text: 'Assigned secondary broker to expedite NOC delivery to investor.',
        category: 'compliance',
      },
    ],
    messages: [
      {
        id: 'm-301',
        sender: 'investor',
        senderName: 'Marcus Vance',
        type: 'text',
        text: 'Fatima, I am awaiting the official NOC from developer and verified floor plan. Please provide these within 24 hours.',
        time: '04:50 PM',
        date: '03 September 2026',
        status: 'read',
      },
      {
        id: 'm-302',
        sender: 'agent',
        senderName: 'Fatima Al-Nuaimi',
        type: 'text',
        text: 'Working on obtaining the final sign-off from developer today. Will upload the PDF as soon as issued.',
        time: '05:05 PM',
        status: 'read',
      },
      {
        id: 'm-303',
        sender: 'system',
        senderName: 'Duseat Support',
        type: 'system_notice',
        systemType: 'info',
        text: 'Support ticket #TICK-8842 opened regarding document delivery. Priority SLA active.',
        time: '05:10 PM',
      },
    ],
  },
]
