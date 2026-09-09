export type VerificationUserRole = 'Investor' | 'Agent'

export type VerificationQueueStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Expired'
  | 'Resubmitted'

export type DocumentType =
  | 'Passport'
  | 'National ID'
  | 'Emirates ID'
  | 'Trade License'
  | 'RERA Certificate'
  | 'Company Documents'
  | 'Proof of Funds'
  | 'Power of Attorney'
  | 'Memorandum of Association'

export type ItemVerificationStatus =
  | 'Verified'
  | 'Pending'
  | 'Rejected'
  | 'Expired'
  | 'In review'
  | 'Resubmission Required'
  | 'Resubmitted'

export interface VerificationDocumentItem {
  id: string
  name: string
  type: DocumentType
  status: ItemVerificationStatus
  uploadedAt: string
  expiryDate?: string
  daysExpired?: number
  documentNumber?: string
  issuingAuthority?: string
  issuingCountry?: string
  frontImageUrl?: string
  backImageUrl?: string
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  rejectionReason?: string
  ocrConfidence?: number
  fileSize?: string
  ocrExtractedData?: {
    fullName?: string
    dob?: string
    documentNumber?: string
    expiryDate?: string
    issueDate?: string
    nationality?: string
    address?: string
    tradeName?: string
    licenseNumber?: string
    reraNumber?: string
    legalType?: string
  }
}

export interface ContactVerificationItem {
  type: 'Phone' | 'Email'
  value: string
  status: 'Verified' | 'Unverified' | 'Pending OTP'
  verifiedAt?: string
  method?: 'SMS OTP' | 'WhatsApp OTP' | 'Magic Link' | 'Email Code'
  carrierOrDomain?: string
  riskScore?: 'Low' | 'Medium' | 'High'
  lastAttempt?: string
}

export interface InvestorVerificationDetails {
  passport?: VerificationDocumentItem
  nationalId?: VerificationDocumentItem
  phone: ContactVerificationItem
  email: ContactVerificationItem
  proofOfFunds?: VerificationDocumentItem
}

export interface AgentVerificationDetails {
  tradeLicense?: VerificationDocumentItem
  reraCertificate?: VerificationDocumentItem
  emiratesId?: VerificationDocumentItem
  passport?: VerificationDocumentItem
  companyDocuments?: VerificationDocumentItem
  agencyName: string
  tradeLicenseNumber: string
  reraBrokerNumber: string
  reraOfficeNumber: string
}

export interface VerificationHistoryEvent {
  id: string
  caseId: string
  targetName: string
  targetRole: VerificationUserRole
  action:
    | 'Case Created'
    | 'Document Uploaded'
    | 'Document Approved'
    | 'Document Rejected'
    | 'Document Expired'
    | 'Resubmission Requested'
    | 'Case Approved'
    | 'Case Rejected'
    | 'Phone Verified'
    | 'Email Verified'
    | 'Note Added'
    | 'Risk Flagged'
    | 'Reviewer Assigned'
    | 'Reviewer Reassigned'
    | 'Reviewer Unassigned'
    | 'Review Started'
  documentType?: DocumentType | 'Contact' | 'All Requirements'
  reviewer: string
  reviewerAvatar?: string
  timestamp: string
  details: string
  statusFrom?: string
  statusTo?: string
  reason?: string
  notes?: string
}

export interface VerificationNote {
  id: string
  caseId: string
  targetName: string
  targetRole: VerificationUserRole
  author: string
  authorRole: string
  authorAvatar?: string
  content: string
  tag: 'General' | 'High Risk' | 'PEP Check' | 'Document Mismatch' | 'License Expiry' | 'Compliance Approved'
  createdAt: string
  isPinned?: boolean
}

export interface ReviewerUser {
  id: string
  name: string
  role: string
  avatar: string
  email: string
  activeCasesCount: number
}

export const availableReviewers: ReviewerUser[] = [
  {
    id: 'rev-1',
    name: 'Nadia Al-Hashimi',
    role: 'Senior Compliance Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    email: 'nadia.hashimi@duseat.ae',
    activeCasesCount: 4,
  },
  {
    id: 'rev-2',
    name: 'Tariq Al-Mansoor',
    role: 'KYC Supervisor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    email: 'tariq.mansoor@duseat.ae',
    activeCasesCount: 3,
  },
  {
    id: 'rev-3',
    name: 'Sarah Jenkins',
    role: 'AML & PEP Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    email: 'sarah.jenkins@duseat.ae',
    activeCasesCount: 2,
  },
  {
    id: 'rev-4',
    name: 'Zayd Ibrahim',
    role: 'Legal Counsel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    email: 'zayd.ibrahim@duseat.ae',
    activeCasesCount: 1,
  },
]

export interface VerificationCase {
  id: string // e.g. VER-10294 or VC-8901
  userId: string // e.g. AG-1048 or IN-2048
  applicantName: string
  applicantAvatar?: string
  applicantEmail: string
  applicantPhone: string
  role: VerificationUserRole
  country: string
  countryFlag: string
  city?: string
  status: VerificationQueueStatus
  submittedAt: string
  submittedDateExact: string
  lastUpdatedAt: string
  assignedReviewer?: {
    name: string
    avatar?: string
    role: string
    email?: string
  }
  slaDeadline?: string
  riskLevel: 'Low' | 'Medium' | 'High'
  riskScore: number // 0-100
  notesCount: number
  investorDetails?: InvestorVerificationDetails
  agentDetails?: AgentVerificationDetails
  documents: VerificationDocumentItem[]
  accountStatus: 'Active' | 'Pending' | 'Suspended' | 'Banned'
  rejectionReason?: string
  rejectionNotes?: string
  resubmissionItems?: string[]
}

export const initialVerificationCases: VerificationCase[] = [
  {
    id: 'VER-10294',
    userId: 'AG-1048',
    applicantName: 'Ahmed Khaled',
    applicantAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    applicantEmail: 'ahmed.khaled@eliterealty.ae',
    applicantPhone: '+971 50 123 4567',
    role: 'Agent',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    city: 'Dubai',
    status: 'Pending',
    submittedAt: 'Today, 09:15',
    submittedDateExact: 'Sep 4, 2026, 09:15 AM',
    lastUpdatedAt: 'Today, 09:15',
    accountStatus: 'Active',
    assignedReviewer: {
      name: 'Nadia Al-Hashimi',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      role: 'Senior Compliance Officer',
      email: 'nadia.hashimi@duseat.ae',
    },
    slaDeadline: 'In 2 hours',
    riskLevel: 'Low',
    riskScore: 94,
    notesCount: 2,
    agentDetails: {
      agencyName: 'Emirates Living Real Estate LLC',
      tradeLicenseNumber: 'CN-2894102',
      reraBrokerNumber: 'BRN-48912',
      reraOfficeNumber: 'ORN-1284',
      tradeLicense: {
        id: 'DOC-10294-TL',
        name: 'DED Commercial Trade License 2026.pdf',
        type: 'Trade License',
        status: 'Pending',
        uploadedAt: 'Sep 4, 2026, 09:15 AM',
        expiryDate: '15 Dec 2026',
        documentNumber: 'CN-2894102',
        issuingAuthority: 'Dubai Department of Economy & Tourism (DED)',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 98,
        fileSize: '2.4 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
        ocrExtractedData: {
          tradeName: 'Emirates Living Real Estate LLC',
          licenseNumber: 'CN-2894102',
          legalType: 'Limited Liability Company',
          expiryDate: '15 Dec 2026',
          issueDate: '15 Dec 2023',
          address: 'Office 1402, Business Bay Tower, Dubai',
        },
      },
      reraCertificate: {
        id: 'DOC-10294-RC',
        name: 'RERA Certified Broker Card.pdf',
        type: 'RERA Certificate',
        status: 'Pending',
        uploadedAt: 'Sep 4, 2026, 09:15 AM',
        expiryDate: '30 Oct 2026',
        documentNumber: 'BRN-48912',
        issuingAuthority: 'Dubai Land Department (RERA)',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 96,
        fileSize: '1.8 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
        ocrExtractedData: {
          fullName: 'Ahmed Khaled Mansoor',
          reraNumber: 'BRN-48912',
          expiryDate: '30 Oct 2026',
          issueDate: '30 Oct 2024',
        },
      },
      emiratesId: {
        id: 'DOC-10294-EID',
        name: 'Emirates ID (Front & Back).jpg',
        type: 'Emirates ID',
        status: 'Verified',
        uploadedAt: 'Sep 4, 2026, 09:10 AM',
        expiryDate: '18 Aug 2027',
        documentNumber: '784-1988-1294819-1',
        issuingAuthority: 'Federal Authority for Identity, Citizenship & Customs',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 99,
        fileSize: '3.1 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        ocrExtractedData: {
          fullName: 'Ahmed Khaled Mansoor',
          dob: '14 May 1988',
          documentNumber: '784-1988-1294819-1',
          expiryDate: '18 Aug 2027',
          issueDate: '19 Aug 2022',
          nationality: 'United Arab Emirates',
        },
      },
      passport: {
        id: 'DOC-10294-PP',
        name: 'UAE Biometric Passport Copy.pdf',
        type: 'Passport',
        status: 'Verified',
        uploadedAt: 'Sep 4, 2026, 09:10 AM',
        expiryDate: '04 Mar 2029',
        documentNumber: 'N04829104',
        issuingAuthority: 'Ministry of Interior',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 97,
        fileSize: '1.2 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        ocrExtractedData: {
          fullName: 'Ahmed Khaled Mansoor',
          documentNumber: 'N04829104',
          expiryDate: '04 Mar 2029',
          issueDate: '05 Mar 2019',
          nationality: 'United Arab Emirates',
        },
      },
      companyDocuments: {
        id: 'DOC-10294-CD',
        name: 'Company MOA & Power of Attorney.pdf',
        type: 'Company Documents',
        status: 'Pending',
        uploadedAt: 'Sep 4, 2026, 09:15 AM',
        documentNumber: 'POA-2024-8812',
        issuingAuthority: 'Dubai Notary Public',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 94,
        fileSize: '4.5 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
        ocrExtractedData: {
          tradeName: 'Emirates Living Real Estate LLC',
          legalType: 'Power of Attorney & Partner Resolution',
        },
      },
    },
    documents: [
      {
        id: 'DOC-10294-TL',
        name: 'DED Commercial Trade License 2026.pdf',
        type: 'Trade License',
        status: 'Pending',
        uploadedAt: 'Sep 4, 2026, 09:15 AM',
        expiryDate: '15 Dec 2026',
        documentNumber: 'CN-2894102',
        issuingAuthority: 'Dubai Department of Economy & Tourism (DED)',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 98,
        fileSize: '2.4 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10294-RC',
        name: 'RERA Certified Broker Card.pdf',
        type: 'RERA Certificate',
        status: 'Pending',
        uploadedAt: 'Sep 4, 2026, 09:15 AM',
        expiryDate: '30 Oct 2026',
        documentNumber: 'BRN-48912',
        issuingAuthority: 'Dubai Land Department (RERA)',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 96,
        fileSize: '1.8 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10294-EID',
        name: 'Emirates ID (Front & Back).jpg',
        type: 'Emirates ID',
        status: 'Verified',
        uploadedAt: 'Sep 4, 2026, 09:10 AM',
        expiryDate: '18 Aug 2027',
        documentNumber: '784-1988-1294819-1',
        issuingAuthority: 'Federal Authority for Identity',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 99,
        fileSize: '3.1 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10294-PP',
        name: 'UAE Biometric Passport Copy.pdf',
        type: 'Passport',
        status: 'Verified',
        uploadedAt: 'Sep 4, 2026, 09:10 AM',
        expiryDate: '04 Mar 2029',
        documentNumber: 'N04829104',
        issuingAuthority: 'Ministry of Interior',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 97,
        fileSize: '1.2 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10294-CD',
        name: 'Company MOA & Power of Attorney.pdf',
        type: 'Company Documents',
        status: 'Pending',
        uploadedAt: 'Sep 4, 2026, 09:15 AM',
        documentNumber: 'POA-2024-8812',
        issuingAuthority: 'Dubai Notary Public',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 94,
        fileSize: '4.5 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'VER-10295',
    userId: 'IN-2048',
    applicantName: 'Anwar Hosny',
    applicantAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    applicantEmail: 'anwar.hosny@emirates.ae',
    applicantPhone: '+971 50 248 9912',
    role: 'Investor',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    city: 'Dubai',
    status: 'Approved',
    submittedAt: 'Sep 3, 2026, 16:30',
    submittedDateExact: 'Sep 3, 2026, 04:30 PM',
    lastUpdatedAt: 'Sep 3, 2026, 18:40',
    accountStatus: 'Active',
    assignedReviewer: {
      name: 'Tariq Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      role: 'KYC Supervisor',
      email: 'tariq.mansoor@duseat.ae',
    },
    riskLevel: 'Low',
    riskScore: 98,
    notesCount: 1,
    investorDetails: {
      passport: {
        id: 'DOC-10295-PP',
        name: 'Passport_Anwar_Hosny.pdf',
        type: 'Passport',
        status: 'Verified',
        uploadedAt: 'Sep 3, 2026, 04:30 PM',
        expiryDate: '12 Jan 2030',
        documentNumber: 'P29481028',
        issuingAuthority: 'UAE Immigration Authority',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 99,
        fileSize: '1.4 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        ocrExtractedData: {
          fullName: 'Anwar Hosny',
          dob: '08 Feb 1985',
          documentNumber: 'P29481028',
          expiryDate: '12 Jan 2030',
          issueDate: '12 Jan 2020',
          nationality: 'United Arab Emirates',
        },
      },
      nationalId: {
        id: 'DOC-10295-NID',
        name: 'Emirates_ID_Anwar.jpg',
        type: 'National ID',
        status: 'Verified',
        uploadedAt: 'Sep 3, 2026, 04:30 PM',
        expiryDate: '12 Jan 2028',
        documentNumber: '784-1985-9928192-3',
        issuingAuthority: 'Federal Authority for Identity',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 99,
        fileSize: '2.0 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        ocrExtractedData: {
          fullName: 'Anwar Hosny',
          documentNumber: '784-1985-9928192-3',
          expiryDate: '12 Jan 2028',
          issueDate: '13 Jan 2023',
        },
      },
      phone: {
        type: 'Phone',
        value: '+971 50 248 9912',
        status: 'Verified',
        verifiedAt: 'Sep 3, 2026, 04:32 PM',
        method: 'SMS OTP',
        carrierOrDomain: 'Etisalat UAE',
        riskScore: 'Low',
      },
      email: {
        type: 'Email',
        value: 'anwar.hosny@emirates.ae',
        status: 'Verified',
        verifiedAt: 'Sep 3, 2026, 04:31 PM',
        method: 'Magic Link',
        carrierOrDomain: 'Corporate Domain (emirates.ae)',
        riskScore: 'Low',
      },
    },
    documents: [
      {
        id: 'DOC-10295-PP',
        name: 'Passport_Anwar_Hosny.pdf',
        type: 'Passport',
        status: 'Verified',
        uploadedAt: 'Sep 3, 2026, 04:30 PM',
        expiryDate: '12 Jan 2030',
        documentNumber: 'P29481028',
        issuingAuthority: 'UAE Immigration Authority',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 99,
        fileSize: '1.4 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10295-NID',
        name: 'Emirates_ID_Anwar.jpg',
        type: 'National ID',
        status: 'Verified',
        uploadedAt: 'Sep 3, 2026, 04:30 PM',
        expiryDate: '12 Jan 2028',
        documentNumber: '784-1985-9928192-3',
        issuingAuthority: 'Federal Authority for Identity',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 99,
        fileSize: '2.0 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'VER-10296',
    userId: 'AG-1047',
    applicantName: 'Layla Haddad',
    applicantAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    applicantEmail: 'layla.haddad@avenuerealty.ae',
    applicantPhone: '+971 52 441 0288',
    role: 'Agent',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    city: 'Dubai',
    status: 'Resubmitted',
    submittedAt: 'Today, 08:20',
    submittedDateExact: 'Sep 4, 2026, 08:20 AM',
    lastUpdatedAt: 'Today, 08:20',
    accountStatus: 'Active',
    assignedReviewer: {
      name: 'Nadia Al-Hashimi',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      role: 'Senior Compliance Officer',
      email: 'nadia.hashimi@duseat.ae',
    },
    slaDeadline: 'In 3 hours',
    riskLevel: 'Medium',
    riskScore: 78,
    notesCount: 3,
    agentDetails: {
      agencyName: 'Avenue Realty Dubai LLC',
      tradeLicenseNumber: 'CN-1940294',
      reraBrokerNumber: 'BRN-39102',
      reraOfficeNumber: 'ORN-8491',
      tradeLicense: {
        id: 'DOC-10296-TL',
        name: 'Trade_License_Updated_2026.pdf',
        type: 'Trade License',
        status: 'Resubmitted',
        uploadedAt: 'Today, 08:20 AM',
        expiryDate: '19 Nov 2026',
        documentNumber: 'CN-1940294',
        issuingAuthority: 'Dubai Economy (DED)',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 97,
        fileSize: '2.9 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
        reviewNotes: 'Re-uploaded with clear official stamp and partners page as requested.',
      },
      reraCertificate: {
        id: 'DOC-10296-RC',
        name: 'RERA_Card_Layla_Haddad.pdf',
        type: 'RERA Certificate',
        status: 'Verified',
        uploadedAt: 'May 28, 2026, 11:15 AM',
        expiryDate: '15 Sep 2026',
        documentNumber: 'BRN-39102',
        issuingAuthority: 'Dubai Land Department',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 98,
        fileSize: '1.5 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      },
      emiratesId: {
        id: 'DOC-10296-EID',
        name: 'Emirates_ID_Front_Back.jpg',
        type: 'Emirates ID',
        status: 'Verified',
        uploadedAt: 'May 28, 2026, 11:15 AM',
        expiryDate: '10 Oct 2027',
        documentNumber: '784-1992-8819201-4',
        issuingAuthority: 'Federal Authority for Identity',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 99,
        fileSize: '2.8 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
      passport: {
        id: 'DOC-10296-PP',
        name: 'Passport_Copy.pdf',
        type: 'Passport',
        status: 'Verified',
        uploadedAt: 'May 28, 2026, 11:15 AM',
        expiryDate: '22 Feb 2028',
        documentNumber: 'L8291039',
        issuingAuthority: 'Lebanese Directorate General of General Security',
        issuingCountry: 'Lebanon',
        ocrConfidence: 95,
        fileSize: '1.7 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      },
      companyDocuments: {
        id: 'DOC-10296-CD',
        name: 'Agency_Appointment_Letter.pdf',
        type: 'Company Documents',
        status: 'Verified',
        uploadedAt: 'May 28, 2026, 11:15 AM',
        documentNumber: 'APPT-2024-11',
        issuingAuthority: 'Avenue Realty Dubai LLC',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 92,
        fileSize: '1.1 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
      },
    },
    documents: [
      {
        id: 'DOC-10296-TL',
        name: 'Trade_License_Updated_2026.pdf',
        type: 'Trade License',
        status: 'Resubmitted',
        uploadedAt: 'Today, 08:20 AM',
        expiryDate: '19 Nov 2026',
        documentNumber: 'CN-1940294',
        issuingAuthority: 'Dubai Economy (DED)',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 97,
        fileSize: '2.9 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10296-RC',
        name: 'RERA_Card_Layla_Haddad.pdf',
        type: 'RERA Certificate',
        status: 'Verified',
        uploadedAt: 'May 28, 2026, 11:15 AM',
        expiryDate: '15 Sep 2026',
        documentNumber: 'BRN-39102',
        issuingAuthority: 'Dubai Land Department',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 98,
        fileSize: '1.5 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10296-EID',
        name: 'Emirates_ID_Front_Back.jpg',
        type: 'Emirates ID',
        status: 'Verified',
        uploadedAt: 'May 28, 2026, 11:15 AM',
        expiryDate: '10 Oct 2027',
        documentNumber: '784-1992-8819201-4',
        issuingAuthority: 'Federal Authority for Identity',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 99,
        fileSize: '2.8 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10296-PP',
        name: 'Passport_Copy.pdf',
        type: 'Passport',
        status: 'Verified',
        uploadedAt: 'May 28, 2026, 11:15 AM',
        expiryDate: '22 Feb 2028',
        documentNumber: 'L8291039',
        issuingAuthority: 'Lebanese Directorate General of General Security',
        issuingCountry: 'Lebanon',
        ocrConfidence: 95,
        fileSize: '1.7 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10296-CD',
        name: 'Agency_Appointment_Letter.pdf',
        type: 'Company Documents',
        status: 'Verified',
        uploadedAt: 'May 28, 2026, 11:15 AM',
        documentNumber: 'APPT-2024-11',
        issuingAuthority: 'Avenue Realty Dubai LLC',
        issuingCountry: 'United Arab Emirates',
        ocrConfidence: 92,
        fileSize: '1.1 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'VER-10297',
    userId: 'IN-2044',
    applicantName: 'Maya Karim',
    applicantAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    applicantEmail: 'maya.karim@cairo-capital.eg',
    applicantPhone: '+20 100 555 1843',
    role: 'Investor',
    country: 'Egypt',
    countryFlag: '🇪🇬',
    city: 'Cairo',
    status: 'Pending',
    submittedAt: 'Today, 07:45',
    submittedDateExact: 'Sep 4, 2026, 07:45 AM',
    lastUpdatedAt: 'Today, 07:45',
    accountStatus: 'Pending',
    assignedReviewer: {
      name: 'Tariq Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      role: 'KYC Supervisor',
      email: 'tariq.mansoor@duseat.ae',
    },
    slaDeadline: 'In 4 hours',
    riskLevel: 'Low',
    riskScore: 89,
    notesCount: 1,
    investorDetails: {
      passport: {
        id: 'DOC-10297-PP',
        name: 'Passport_Maya_Karim.pdf',
        type: 'Passport',
        status: 'In review',
        uploadedAt: 'Today, 07:45 AM',
        expiryDate: '14 May 2029',
        documentNumber: 'A28401928',
        issuingAuthority: 'Passport & Immigration Administration Cairo',
        issuingCountry: 'Egypt',
        ocrConfidence: 97,
        fileSize: '1.9 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        ocrExtractedData: {
          fullName: 'Maya Mostafa Karim',
          dob: '22 Jul 1991',
          documentNumber: 'A28401928',
          expiryDate: '14 May 2029',
          nationality: 'Egypt',
        },
      },
      nationalId: {
        id: 'DOC-10297-NID',
        name: 'National_ID_Egypt.jpg',
        type: 'National ID',
        status: 'In review',
        uploadedAt: 'Today, 07:45 AM',
        expiryDate: '01 Jan 2028',
        documentNumber: '29107220102948',
        issuingAuthority: 'Civil Status Authority Egypt',
        issuingCountry: 'Egypt',
        ocrConfidence: 96,
        fileSize: '2.1 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
      phone: {
        type: 'Phone',
        value: '+20 100 555 1843',
        status: 'Verified',
        verifiedAt: 'Today, 07:46 AM',
        method: 'SMS OTP',
        carrierOrDomain: 'Vodafone Egypt',
        riskScore: 'Low',
      },
      email: {
        type: 'Email',
        value: 'maya.karim@cairo-capital.eg',
        status: 'Verified',
        verifiedAt: 'Today, 07:48 AM',
        method: 'Email Code',
        carrierOrDomain: 'cairo-capital.eg',
        riskScore: 'Low',
      },
    },
    documents: [
      {
        id: 'DOC-10297-PP',
        name: 'Passport_Maya_Karim.pdf',
        type: 'Passport',
        status: 'In review',
        uploadedAt: 'Today, 07:45 AM',
        expiryDate: '14 May 2029',
        documentNumber: 'A28401928',
        issuingAuthority: 'Passport & Immigration Administration Cairo',
        issuingCountry: 'Egypt',
        ocrConfidence: 97,
        fileSize: '1.9 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10297-NID',
        name: 'National_ID_Egypt.jpg',
        type: 'National ID',
        status: 'In review',
        uploadedAt: 'Today, 07:45 AM',
        expiryDate: '01 Jan 2028',
        documentNumber: '29107220102948',
        issuingAuthority: 'Civil Status Authority Egypt',
        issuingCountry: 'Egypt',
        ocrConfidence: 96,
        fileSize: '2.1 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'VER-10298',
    userId: 'AG-1044',
    applicantName: 'Vikram Mehta',
    applicantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    applicantEmail: 'vikram@mehtaproperties.com',
    applicantPhone: '+971 55 918 3344',
    role: 'Agent',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    city: 'Dubai',
    status: 'Rejected',
    submittedAt: 'Jun 1, 2026, 10:15',
    submittedDateExact: 'Jun 1, 2026, 10:15 AM',
    lastUpdatedAt: 'Jun 1, 2026, 14:10',
    accountStatus: 'Suspended',
    rejectionReason: 'Invalid documents',
    rejectionNotes: 'Trade license expired on 15 Jan 2026. BRN number failed automated RERA registry lookup.',
    assignedReviewer: {
      name: 'Nadia Al-Hashimi',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      role: 'Senior Compliance Officer',
      email: 'nadia.hashimi@duseat.ae',
    },
    riskLevel: 'High',
    riskScore: 32,
    notesCount: 4,
    agentDetails: {
      agencyName: 'Mehta Commercial Real Estate',
      tradeLicenseNumber: 'CN-0092144',
      reraBrokerNumber: 'BRN-18491',
      reraOfficeNumber: 'ORN-4412',
      tradeLicense: {
        id: 'DOC-10298-TL',
        name: 'Old_Trade_License_Expired.pdf',
        type: 'Trade License',
        status: 'Rejected',
        uploadedAt: 'Jun 1, 2026, 10:15 AM',
        expiryDate: '15 Jan 2026',
        documentNumber: 'CN-0092144',
        rejectionReason: 'Trade license is expired (expired on 15 Jan 2026). Please provide a renewed certificate.',
        frontImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
      },
      reraCertificate: {
        id: 'DOC-10298-RC',
        name: 'RERA_Card_Unverified.pdf',
        type: 'RERA Certificate',
        status: 'Rejected',
        uploadedAt: 'Jun 1, 2026, 10:15 AM',
        rejectionReason: 'RERA Broker BRN could not be validated against DLD Land Registry database.',
        frontImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      },
      emiratesId: {
        id: 'DOC-10298-EID',
        name: 'Emirates_ID_Front.jpg',
        type: 'Emirates ID',
        status: 'Rejected',
        uploadedAt: 'Jun 1, 2026, 10:15 AM',
        rejectionReason: 'Back page of Emirates ID was missing. Cut-off margins.',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
    },
    documents: [
      {
        id: 'DOC-10298-TL',
        name: 'Old_Trade_License_Expired.pdf',
        type: 'Trade License',
        status: 'Rejected',
        uploadedAt: 'Jun 1, 2026, 10:15 AM',
        expiryDate: '15 Jan 2026',
        documentNumber: 'CN-0092144',
        rejectionReason: 'Trade license is expired (expired on 15 Jan 2026). Please provide a renewed certificate.',
        frontImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10298-RC',
        name: 'RERA_Card_Unverified.pdf',
        type: 'RERA Certificate',
        status: 'Rejected',
        uploadedAt: 'Jun 1, 2026, 10:15 AM',
        rejectionReason: 'RERA Broker BRN could not be validated against DLD Land Registry database.',
        frontImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10298-EID',
        name: 'Emirates_ID_Front.jpg',
        type: 'Emirates ID',
        status: 'Rejected',
        uploadedAt: 'Jun 1, 2026, 10:15 AM',
        rejectionReason: 'Back page of Emirates ID was missing. Cut-off margins.',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'VER-10299',
    userId: 'AG-1043',
    applicantName: 'Elena Rostova',
    applicantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    applicantEmail: 'elena@dubailuxuryestates.ru',
    applicantPhone: '+971 58 332 9184',
    role: 'Agent',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    city: 'Dubai',
    status: 'Expired',
    submittedAt: 'May 15, 2025',
    submittedDateExact: 'May 15, 2025, 11:20 AM',
    lastUpdatedAt: 'Sep 3, 2026, 00:00',
    accountStatus: 'Active',
    assignedReviewer: {
      name: 'Nadia Al-Hashimi',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      role: 'Senior Compliance Officer',
      email: 'nadia.hashimi@duseat.ae',
    },
    riskLevel: 'Medium',
    riskScore: 65,
    notesCount: 2,
    agentDetails: {
      agencyName: 'Dubai Luxury Estates LLC',
      tradeLicenseNumber: 'CN-8821940',
      reraBrokerNumber: 'BRN-99482',
      reraOfficeNumber: 'ORN-2201',
      tradeLicense: {
        id: 'DOC-10299-TL',
        name: 'Trade_License_2025.pdf',
        type: 'Trade License',
        status: 'Expired',
        uploadedAt: 'May 15, 2025',
        expiryDate: 'May 31, 2026',
        daysExpired: 96,
        documentNumber: 'CN-8821940',
        frontImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
      },
      reraCertificate: {
        id: 'DOC-10299-RC',
        name: 'RERA_Card_Elena.pdf',
        type: 'RERA Certificate',
        status: 'Expired',
        uploadedAt: 'May 15, 2025',
        expiryDate: 'May 31, 2026',
        daysExpired: 96,
        documentNumber: 'BRN-99482',
        frontImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      },
      emiratesId: {
        id: 'DOC-10299-EID',
        name: 'Emirates_ID.jpg',
        type: 'Emirates ID',
        status: 'Verified',
        uploadedAt: 'May 15, 2025',
        expiryDate: 'Nov 14, 2027',
        documentNumber: '784-1990-2819402-9',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
    },
    documents: [
      {
        id: 'DOC-10299-TL',
        name: 'Trade_License_2025.pdf',
        type: 'Trade License',
        status: 'Expired',
        uploadedAt: 'May 15, 2025',
        expiryDate: 'May 31, 2026',
        daysExpired: 96,
        documentNumber: 'CN-8821940',
        frontImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10299-RC',
        name: 'RERA_Card_Elena.pdf',
        type: 'RERA Certificate',
        status: 'Expired',
        uploadedAt: 'May 15, 2025',
        expiryDate: 'May 31, 2026',
        daysExpired: 96,
        documentNumber: 'BRN-99482',
        frontImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10299-EID',
        name: 'Emirates_ID.jpg',
        type: 'Emirates ID',
        status: 'Verified',
        uploadedAt: 'May 15, 2025',
        expiryDate: 'Nov 14, 2027',
        documentNumber: '784-1990-2819402-9',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'VER-10300',
    userId: 'IN-2045',
    applicantName: 'Omar Nasser',
    applicantAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    applicantEmail: 'omar.nasser@alrajhi-invest.sa',
    applicantPhone: '+966 54 667 1300',
    role: 'Investor',
    country: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    city: 'Riyadh',
    status: 'Approved',
    submittedAt: 'May 25, 2026',
    submittedDateExact: 'May 25, 2026, 02:22 PM',
    lastUpdatedAt: 'May 25, 2026',
    accountStatus: 'Active',
    assignedReviewer: {
      name: 'Tariq Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      role: 'KYC Supervisor',
      email: 'tariq.mansoor@duseat.ae',
    },
    riskLevel: 'Low',
    riskScore: 99,
    notesCount: 1,
    investorDetails: {
      passport: {
        id: 'DOC-10300-PP',
        name: 'Saudi_Passport_Omar_Nasser.pdf',
        type: 'Passport',
        status: 'Verified',
        uploadedAt: 'May 25, 2026',
        expiryDate: 'Sep 9, 2031',
        documentNumber: 'K9281048',
        issuingAuthority: 'General Directorate of Passports',
        issuingCountry: 'Saudi Arabia',
        ocrConfidence: 99,
        fileSize: '1.6 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      },
      nationalId: {
        id: 'DOC-10300-NID',
        name: 'Saudi_National_ID.jpg',
        type: 'National ID',
        status: 'Verified',
        uploadedAt: 'May 25, 2026',
        expiryDate: 'Oct 14, 2029',
        documentNumber: '1092840192',
        issuingAuthority: 'Ministry of Interior KSA',
        issuingCountry: 'Saudi Arabia',
        ocrConfidence: 99,
        fileSize: '2.3 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
      phone: {
        type: 'Phone',
        value: '+966 54 667 1300',
        status: 'Verified',
        verifiedAt: 'May 25, 2026',
        method: 'SMS OTP',
        carrierOrDomain: 'STC Saudi Telecom',
        riskScore: 'Low',
      },
      email: {
        type: 'Email',
        value: 'omar.nasser@alrajhi-invest.sa',
        status: 'Verified',
        verifiedAt: 'May 25, 2026',
        method: 'Magic Link',
        carrierOrDomain: 'alrajhi-invest.sa',
        riskScore: 'Low',
      },
    },
    documents: [
      {
        id: 'DOC-10300-PP',
        name: 'Saudi_Passport_Omar_Nasser.pdf',
        type: 'Passport',
        status: 'Verified',
        uploadedAt: 'May 25, 2026',
        expiryDate: 'Sep 9, 2031',
        documentNumber: 'K9281048',
        issuingAuthority: 'General Directorate of Passports',
        issuingCountry: 'Saudi Arabia',
        ocrConfidence: 99,
        fileSize: '1.6 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'DOC-10300-NID',
        name: 'Saudi_National_ID.jpg',
        type: 'National ID',
        status: 'Verified',
        uploadedAt: 'May 25, 2026',
        expiryDate: 'Oct 14, 2029',
        documentNumber: '1092840192',
        issuingAuthority: 'Ministry of Interior KSA',
        issuingCountry: 'Saudi Arabia',
        ocrConfidence: 99,
        fileSize: '2.3 MB',
        frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      },
    ],
  },
]

export const initialVerificationHistory: VerificationHistoryEvent[] = [
  {
    id: 'VH-1001',
    caseId: 'VER-10294',
    targetName: 'Ahmed Khaled',
    targetRole: 'Agent',
    action: 'Document Uploaded',
    documentType: 'Trade License',
    reviewer: 'System OCR',
    timestamp: 'Today, 09:15',
    details: 'Commercial trade license uploaded. Optical Character Recognition passed with 98% confidence score.',
    statusTo: 'Pending Review',
  },
  {
    id: 'VH-1002',
    caseId: 'VER-10294',
    targetName: 'Ahmed Khaled',
    targetRole: 'Agent',
    action: 'Document Approved',
    documentType: 'Emirates ID',
    reviewer: 'Nadia Al-Hashimi',
    reviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    timestamp: 'Today, 09:18',
    details: 'Emirates ID verified against ICA identity gateway registry. Valid until 18 Aug 2027.',
    statusFrom: 'Pending',
    statusTo: 'Verified',
  },
  {
    id: 'VH-1003',
    caseId: 'VER-10296',
    targetName: 'Layla Haddad',
    targetRole: 'Agent',
    action: 'Resubmission Requested',
    documentType: 'Trade License',
    reviewer: 'Nadia Al-Hashimi',
    reviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    timestamp: 'Yesterday, 14:10',
    details: 'Requested re-upload with clear official stamp and partners page.',
    statusTo: 'Resubmission Required',
    reason: 'Document unclear / missing stamp',
  },
  {
    id: 'VH-1004',
    caseId: 'VER-10296',
    targetName: 'Layla Haddad',
    targetRole: 'Agent',
    action: 'Document Uploaded',
    documentType: 'Trade License',
    reviewer: 'Layla Haddad (Applicant)',
    timestamp: 'Today, 08:20',
    details: 'Uploaded updated trade license PDF with full 3-page appendix.',
    statusTo: 'Resubmitted',
  },
  {
    id: 'VH-1005',
    caseId: 'VER-10295',
    targetName: 'Anwar Hosny',
    targetRole: 'Investor',
    action: 'Case Approved',
    documentType: 'Passport',
    reviewer: 'Tariq Al-Mansoor',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    timestamp: 'Yesterday, 18:40',
    details: 'Investor KYC Tier 2 verified. Level 2 Verification Badge issued.',
    statusFrom: 'In Review',
    statusTo: 'Approved',
  },
  {
    id: 'VH-1006',
    caseId: 'VER-10298',
    targetName: 'Vikram Mehta',
    targetRole: 'Agent',
    action: 'Case Rejected',
    documentType: 'Trade License',
    reviewer: 'Nadia Al-Hashimi',
    reviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    timestamp: 'Jun 1, 2026, 14:10',
    details: 'Trade license was expired on 15 Jan 2026. BRN number failed automated RERA database lookup.',
    statusFrom: 'Pending',
    statusTo: 'Rejected',
    reason: 'Invalid documents / Expired license',
  },
  {
    id: 'VH-1007',
    caseId: 'VER-10299',
    targetName: 'Elena Rostova',
    targetRole: 'Agent',
    action: 'Document Expired',
    documentType: 'Trade License',
    reviewer: 'System Expiry Daemon',
    timestamp: 'Yesterday, 00:00',
    details: 'Trade license validity reached expiration deadline (May 31, 2026). Automated renewal request email dispatched.',
    statusFrom: 'Verified',
    statusTo: 'Expired',
  },
]

export const initialVerificationNotes: VerificationNote[] = [
  {
    id: 'VN-501',
    caseId: 'VER-10294',
    targetName: 'Ahmed Khaled',
    targetRole: 'Agent',
    author: 'Nadia Al-Hashimi',
    authorRole: 'Senior Compliance Officer',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    content: 'Cross-checked with Dubai DED portal; Emirates Living Real Estate LLC is in good standing. Waiting to finish checking the RERA card broker number.',
    tag: 'General',
    createdAt: 'Today, 09:20',
    isPinned: true,
  },
  {
    id: 'VN-502',
    caseId: 'VER-10296',
    targetName: 'Layla Haddad',
    targetRole: 'Agent',
    author: 'Nadia Al-Hashimi',
    authorRole: 'Senior Compliance Officer',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    content: 'Layla re-uploaded the official stamp appendix at 08:20. The document matches the trade license registry now. Recommended for approval.',
    tag: 'Compliance Approved',
    createdAt: 'Today, 08:35',
    isPinned: true,
  },
  {
    id: 'VN-503',
    caseId: 'VER-10298',
    targetName: 'Vikram Mehta',
    targetRole: 'Agent',
    author: 'Tariq Al-Mansoor',
    authorRole: 'KYC Supervisor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    content: 'Applicant provided expired trade license (expired Jan 2026) and RERA certificate that did not resolve on Dubai REST API. Flagged for fraud audit.',
    tag: 'High Risk',
    createdAt: 'Jun 1, 2026, 14:15',
    isPinned: true,
  },
  {
    id: 'VN-504',
    caseId: 'VER-10299',
    targetName: 'Elena Rostova',
    targetRole: 'Agent',
    author: 'System Auto-Audit',
    authorRole: 'Automated Bot',
    content: 'Commercial trade license expired on May 31, 2026. Account access restricted to pending deals only until renewal is submitted.',
    tag: 'License Expiry',
    createdAt: 'Yesterday, 00:05',
    isPinned: false,
  },
  {
    id: 'VN-505',
    caseId: 'VER-10295',
    targetName: 'Anwar Hosny',
    targetRole: 'Investor',
    author: 'Tariq Al-Mansoor',
    authorRole: 'KYC Supervisor',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    content: 'High Net Worth Verified Investor. Phone number and corporate email match official Emirates executive profile. Zero AML matches.',
    tag: 'Compliance Approved',
    createdAt: 'Yesterday, 18:35',
    isPinned: false,
  },
]

export const VERIFICATION_STORAGE_KEY = 'duseat_verification_records_master'
export const VERIFICATION_HISTORY_KEY = 'duseat_verification_history_master'
export const VERIFICATION_NOTES_KEY = 'duseat_verification_notes_master'

export function getStoredVerificationCases(): VerificationCase[] {
  if (typeof window === 'undefined') return initialVerificationCases
  try {
    const raw = localStorage.getItem(VERIFICATION_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return initialVerificationCases
}

export function saveStoredVerificationCases(cases: VerificationCase[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(cases))
  } catch {}
}

export function getStoredVerificationHistory(): VerificationHistoryEvent[] {
  if (typeof window === 'undefined') return initialVerificationHistory
  try {
    const raw = localStorage.getItem(VERIFICATION_HISTORY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return initialVerificationHistory
}

export function saveStoredVerificationHistory(events: VerificationHistoryEvent[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(VERIFICATION_HISTORY_KEY, JSON.stringify(events))
  } catch {}
}

export function getStoredVerificationNotes(): VerificationNote[] {
  if (typeof window === 'undefined') return initialVerificationNotes
  try {
    const raw = localStorage.getItem(VERIFICATION_NOTES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return initialVerificationNotes
}

export function saveStoredVerificationNotes(notes: VerificationNote[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(VERIFICATION_NOTES_KEY, JSON.stringify(notes))
  } catch {}
}

export function findVerificationCase(idOrUserId: string): VerificationCase | undefined {
  const all = getStoredVerificationCases()
  const clean = idOrUserId.trim().toLowerCase()
  return all.find(
    (c) =>
      c.id.toLowerCase() === clean ||
      c.userId.toLowerCase() === clean ||
      c.id.replace(/-/g, '').toLowerCase() === clean.replace(/-/g, '')
  )
}
