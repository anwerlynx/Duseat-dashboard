export interface PropertyCardData {
  title: string
  subtitle: string
  price: string
  url: string
  image: string
}

export interface ChatMessage {
  id: string
  sender: 'agent' | 'investor' | 'system' | 'admin'
  senderName: string
  senderRole?: string
  avatar?: string
  country?: string
  type: 'text' | 'voice' | 'video' | 'gallery' | 'property_card' | 'system_notice'
  text?: string
  time: string
  date?: string
  status?: 'sent' | 'delivered' | 'read' | 'error' | 'sending'
  duration?: string
  videoThumbnail?: string
  photos?: string[]
  propertyCard?: PropertyCardData
  systemType?: 'deal_secured' | 'chat_closed' | 'warning' | 'info'
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

export interface ChatThread {
  id: string
  requestId: string
  context: string
  dealPrice?: string
  status: 'active' | 'closed' | 'flagged' | 'deal_concluded'
  agent: {
    id: string
    name: string
    avatar?: string
    country?: string
    reraVerified: boolean
    plan: string
    isOnline: boolean
  }
  investor: {
    id: string
    name: string
    avatar?: string
    country?: string
    kycVerified: boolean
    score: number
    isOnline: boolean
  }
  messages: ChatMessage[]
  lastActivity: string
}

export const initialChatThreads: ChatThread[] = [
  {
    id: 'CHAT-917212',
    requestId: '#917212',
    context: '4 Bedroom Villa • Al Barsha • 3-4M AED',
    dealPrice: 'AED 3,850,000',
    status: 'closed',
    agent: {
      id: 'AG-1046',
      name: 'Ahmed Khaled',
      country: 'Egypt',
      reraVerified: true,
      plan: 'Pro agent',
      isOnline: true,
    },
    investor: {
      id: 'IN-2048',
      name: 'Anwar Hosny',
      country: 'United Arab Emirates',
      kycVerified: true,
      score: 94,
      isOnline: true,
    },
    lastActivity: 'Yesterday, 11:06 PM',
    messages: [
      {
        id: 'm-1',
        sender: 'investor',
        senderName: 'Ahmed Khaled',
        type: 'video',
        time: '11:06 PM',
        date: 'Yesterday',
        videoThumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
        duration: '01:42',
        status: 'read',
      },
      {
        id: 'm-2',
        sender: 'investor',
        senderName: 'Ahmed Khaled',
        type: 'gallery',
        time: '11:06 PM',
        photos: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
        ],
        status: 'read',
      },
      {
        id: 'm-3',
        sender: 'investor',
        senderName: 'Ahmed Khaled',
        type: 'voice',
        time: '11:06 PM',
        duration: '00:25',
        status: 'read',
      },
      {
        id: 'm-4',
        sender: 'agent',
        senderName: 'Anwar Hosny',
        type: 'text',
        text: 'The investor has accepted this offer for request #917212. This chat has been created automatically to complete the deal details.',
        time: '11:06 PM',
        status: 'read',
      },
      {
        id: 'm-5',
        sender: 'agent',
        senderName: 'Anwar Hosny',
        type: 'property_card',
        time: '11:06 PM',
        status: 'read',
        replyTo: {
          senderName: 'Anwar Hosny',
          type: 'Voice message',
          snippet: '00:25 voice memo regarding payment schedule',
        },
        propertyCard: {
          title: 'Property emaar',
          subtitle: 'Luxury Homes Starting From AED 1.7 Mn',
          price: 'AED 3,850,000',
          url: 'https://property.emaar.com/',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'm-6',
        sender: 'system',
        senderName: 'Duseat System',
        type: 'system_notice',
        systemType: 'deal_secured',
        text: 'Congratulations! We are pleased to inform you that Ahmed has successfully secured the deal, and the chat has been concluded.',
        time: '11:06 PM',
      },
      {
        id: 'm-7',
        sender: 'system',
        senderName: 'Duseat System',
        type: 'system_notice',
        systemType: 'chat_closed',
        text: 'The chat is closed. Once the deal is confirmed with any agent, the chat will close automatically.',
        time: '11:06 PM',
      },
    ],
  },
  {
    id: 'CHAT-802194',
    requestId: '#802194',
    context: 'Penthouse • Downtown Dubai • 12-15M AED',
    dealPrice: 'AED 14,200,000',
    status: 'active',
    agent: {
      id: 'AG-1045',
      name: 'Tariq Al-Mansoor',
      country: 'United Arab Emirates',
      reraVerified: true,
      plan: 'Elite agent',
      isOnline: true,
    },
    investor: {
      id: 'IN-2047',
      name: 'Elena Rostova',
      country: 'United Kingdom',
      kycVerified: true,
      score: 98,
      isOnline: true,
    },
    lastActivity: 'Today, 02:15 PM',
    messages: [
      {
        id: 'm-101',
        sender: 'investor',
        senderName: 'Elena Rostova',
        type: 'text',
        text: 'Hello Tariq, I reviewed the Burj Khalifa view layout. Is the developer offering a 60/40 payment plan with 2 years post-handover?',
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
        status: 'read',
      },
      {
        id: 'm-103',
        sender: 'agent',
        senderName: 'Tariq Al-Mansoor',
        type: 'property_card',
        time: '02:15 PM',
        status: 'read',
        propertyCard: {
          title: 'Il Primo Penthouse Downtown',
          subtitle: 'Full Burj Khalifa View • 5,400 sq.ft',
          price: 'AED 14,200,000',
          url: 'https://duseat.com/properties/il-primo-penthouse',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
        },
      },
    ],
  },
  {
    id: 'CHAT-714092',
    requestId: '#714092',
    context: 'Beachfront Villa • Palm Jumeirah • 22M AED',
    dealPrice: 'AED 22,500,000',
    status: 'active',
    agent: {
      id: 'AG-1044',
      name: 'Zaid Al-Harbi',
      country: 'Saudi Arabia',
      reraVerified: true,
      plan: 'Power agent',
      isOnline: false,
    },
    investor: {
      id: 'IN-2046',
      name: 'Nasser Al-Thani',
      country: 'Qatar',
      kycVerified: true,
      score: 91,
      isOnline: true,
    },
    lastActivity: 'Yesterday, 06:30 PM',
    messages: [
      {
        id: 'm-201',
        sender: 'investor',
        senderName: 'Nasser Al-Thani',
        type: 'text',
        text: 'Can we schedule a private VIP site viewing tomorrow morning around 11:00 AM?',
        time: '06:25 PM',
        date: 'Yesterday',
        status: 'read',
      },
      {
        id: 'm-202',
        sender: 'agent',
        senderName: 'Zaid Al-Harbi',
        type: 'text',
        text: 'Confirmed. The security gate pass has been requested for Frond N. Looking forward to meeting you.',
        time: '06:30 PM',
        status: 'read',
      },
    ],
  },
]
