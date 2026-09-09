export type ModuleMetric = {
  label: string
  value: string
  change: string
  positive?: boolean
}

export type ModuleRecord = {
  id: string
  primary: string
  secondary: string
  status: string
  value: string
  date: string
}

export type PlatformModule = {
  slug: string
  navId: string
  title: string
  eyebrow: string
  description: string
  accent: string
  tabs: string[]
  filters: string[]
  columns: [string, string, string, string, string, string]
  metrics: ModuleMetric[]
  records: ModuleRecord[]
  primaryAction: string
}

const people = ['Amal Haddad', 'Omar Nasser', 'Maya Karim', 'Youssef Ali', 'Sara Mansour', 'Zayd Ibrahim']
const statuses = ['Active', 'Pending', 'Verified', 'Under review', 'Completed', 'Flagged']

function records(prefix: string, subjects: string[], values: string[]): ModuleRecord[] {
  return Array.from({ length: 12 }, (_, index) => ({
    id: `${prefix}-${String(1048 - index).padStart(4, '0')}`,
    primary: subjects[index % subjects.length],
    secondary: people[index % people.length],
    status: statuses[index % statuses.length],
    value: values[index % values.length],
    date: `${String(28 - (index % 8)).padStart(2, '0')} May 2026`,
  }))
}

const baseMetrics = (noun: string): ModuleMetric[] => [
  { label: `Total ${noun}`, value: '12,846', change: '+12.4%', positive: true },
  { label: 'Active now', value: '3,208', change: '+8.1%', positive: true },
  { label: 'Pending review', value: '184', change: '-3.2%', positive: true },
  { label: 'Needs attention', value: '28', change: '+2.1%', positive: false },
]

function module(config: Omit<PlatformModule, 'records'> & { subjects: string[]; values?: string[] }): PlatformModule {
  return {
    ...config,
    records: records(config.slug.slice(0, 3).toUpperCase(), config.subjects, config.values ?? ['AED 24,800', 'AED 18,500', 'AED 9,250']),
  }
}

export const platformModules: PlatformModule[] = [
  module({ slug: 'investors', navId: 'investors', title: 'Investors Management', eyebrow: 'Users', description: 'Manage investor profiles, verification, activity, requests and account health.', accent: 'Investor network', tabs: ['All investors', 'Verified', 'Pending', 'Suspended'], filters: ['Country', 'Status', 'Verification', 'Registration date'], columns: ['Investor ID', 'Investor', 'Country', 'Status', 'Requests', 'Joined'], metrics: baseMetrics('investors'), primaryAction: 'Add investor', subjects: ['Private investor', 'Portfolio buyer', 'Family office'] }),
  module({ slug: 'verification', navId: 'verification', title: 'Verification Center', eyebrow: 'Trust & safety', description: 'Review identity and company documents with a complete decision history.', accent: 'Document review', tabs: ['Queue', 'Approved', 'Rejected', 'Expired', 'Resubmitted'], filters: ['User type', 'Document', 'Status', 'Submitted date'], columns: ['Case ID', 'Applicant', 'Document', 'Status', 'Reviewer', 'Submitted'], metrics: baseMetrics('cases'), primaryAction: 'Start review', subjects: ['Trade license', 'RERA certificate', 'Passport', 'Emirates ID'] }),
  module({ slug: 'requests', navId: 'requests', title: 'Requests', eyebrow: 'Marketplace', description: 'Monitor property requirements from creation through matching and closure.', accent: 'Demand pipeline', tabs: ['All requests', 'Open', 'Matched', 'Closed', 'Expired'], filters: ['Status', 'Budget', 'Country', 'Property type'], columns: ['Request ID', 'Investor', 'Property type', 'Status', 'Budget', 'Created'], metrics: baseMetrics('requests'), primaryAction: 'Create request', subjects: ['Downtown apartment', 'Palm villa', 'Business Bay office', 'Dubai Hills townhouse'] }),
  module({ slug: 'offers', navId: 'offers', title: 'Offers', eyebrow: 'Marketplace', description: 'Review agent proposals, values, response times and acceptance outcomes.', accent: 'Supply pipeline', tabs: ['All offers', 'Pending', 'Accepted', 'Rejected', 'Flagged'], filters: ['Status', 'Agent', 'Value', 'Submitted date'], columns: ['Offer ID', 'Property', 'Agent', 'Status', 'Offer value', 'Submitted'], metrics: baseMetrics('offers'), primaryAction: 'Review offer', subjects: ['Canal residence', 'Marina penthouse', 'JVC apartment'] }),
  module({ slug: 'deals', navId: 'deals', title: 'Deals', eyebrow: 'Marketplace', description: 'Track active transactions, documents, payments and closing progress.', accent: 'Closing pipeline', tabs: ['All deals', 'Active', 'Completed', 'Cancelled', 'Failed'], filters: ['Status', 'Manager', 'Value', 'Close date'], columns: ['Deal ID', 'Property', 'Parties', 'Status', 'Deal value', 'Updated'], metrics: baseMetrics('deals'), primaryAction: 'Create deal', subjects: ['Off-plan purchase', 'Secondary sale', 'Commercial lease'] }),
  module({ slug: 'conversations', navId: 'conversations', title: 'Conversations', eyebrow: 'Communication', description: 'Monitor marketplace conversations, response quality and flagged content.', accent: 'Live messaging', tabs: ['All', 'Active', 'Closed', 'Reported', 'AI flagged'], filters: ['Status', 'Investor', 'Agent', 'Date'], columns: ['Conversation', 'Request', 'Participants', 'Status', 'Last message', 'Activity'], metrics: baseMetrics('conversations'), primaryAction: 'Open inbox', subjects: ['Property discussion', 'Viewing schedule', 'Offer negotiation'] }),
  module({ slug: 'reports', navId: 'reports', title: 'Reports & Moderation', eyebrow: 'Trust & safety', description: 'Resolve reports with evidence, assignment, escalation and enforcement tools.', accent: 'Moderation queue', tabs: ['Pending', 'Under review', 'Waiting', 'Escalated', 'Resolved'], filters: ['Category', 'Priority', 'Assignee', 'Date'], columns: ['Report ID', 'Category', 'Reported user', 'Status', 'Priority', 'Submitted'], metrics: baseMetrics('reports'), primaryAction: 'Assign reports', subjects: ['Spam', 'Fraud', 'Fake property', 'Payment issue'] }),
  module({ slug: 'notifications', navId: 'notifications', title: 'Notifications', eyebrow: 'Engagement', description: 'Create, schedule and measure push, email and in-app communications.', accent: 'Audience delivery', tabs: ['Campaigns', 'Scheduled', 'Templates', 'History', 'Analytics'], filters: ['Channel', 'Audience', 'Status', 'Date'], columns: ['Campaign ID', 'Campaign', 'Audience', 'Status', 'Delivery', 'Sent'], metrics: baseMetrics('campaigns'), primaryAction: 'Create notification', subjects: ['Market update', 'Verification reminder', 'New offer alert'] }),
  module({ slug: 'subscriptions', navId: 'subscriptions', title: 'Subscriptions', eyebrow: 'Monetization', description: 'Manage plans, subscribers, promo codes, invoices and renewals.', accent: 'Recurring revenue', tabs: ['Plans', 'Subscribers', 'Payments', 'Promo codes', 'Invoices'], filters: ['Plan', 'Status', 'Country', 'Renewal date'], columns: ['Subscription', 'Subscriber', 'Plan', 'Status', 'Amount', 'Renewal'], metrics: baseMetrics('subscriptions'), primaryAction: 'Create plan', subjects: ['Power Agent', 'Elite', 'Pro', 'Enterprise'] }),
  module({ slug: 'finance', navId: 'finance', title: 'Finance', eyebrow: 'Revenue', description: 'Understand transactions, refunds, taxes, gateways and financial performance.', accent: 'Financial control', tabs: ['Overview', 'Transactions', 'Refunds', 'Taxes', 'Gateway logs'], filters: ['Status', 'Gateway', 'Method', 'Date'], columns: ['Transaction', 'User', 'Method', 'Status', 'Amount', 'Date'], metrics: [{ label: 'Revenue this month', value: 'AED 2.48M', change: '+18.2%', positive: true }, { label: 'MRR', value: 'AED 824K', change: '+9.7%', positive: true }, { label: 'Refund rate', value: '1.8%', change: '-0.4%', positive: true }, { label: 'Failed payments', value: '42', change: '+1.2%', positive: false }], primaryAction: 'Export report', subjects: ['Subscription payment', 'Plan upgrade', 'Refund', 'Annual renewal'] }),
  module({ slug: 'analytics', navId: 'analytics', title: 'Analytics', eyebrow: 'Intelligence', description: 'Explore acquisition, engagement, marketplace conversion and retention.', accent: 'Platform signals', tabs: ['Executive', 'Users', 'Investors', 'Agents', 'Revenue'], filters: ['Country', 'Segment', 'Channel', 'Date range'], columns: ['Metric', 'Segment', 'Dimension', 'Status', 'Current value', 'Period'], metrics: [{ label: 'Daily active users', value: '18,420', change: '+14.6%', positive: true }, { label: 'Retention rate', value: '78.4%', change: '+3.1%', positive: true }, { label: 'Conversion rate', value: '12.8%', change: '+1.7%', positive: true }, { label: 'Churn rate', value: '2.4%', change: '-0.8%', positive: true }], primaryAction: 'Build report', subjects: ['User growth', 'Revenue growth', 'Agent performance'] }),
  module({ slug: 'cms', navId: 'cms', title: 'Content Management', eyebrow: 'Experience', description: 'Manage website, mobile app, marketing, help center and SEO content.', accent: 'Publishing desk', tabs: ['Website', 'Mobile app', 'Marketing', 'Help center', 'SEO'], filters: ['Content type', 'Status', 'Author', 'Updated date'], columns: ['Content ID', 'Page', 'Owner', 'Status', 'Locale', 'Updated'], metrics: baseMetrics('content items'), primaryAction: 'Create content', subjects: ['Homepage hero', 'Frequently asked questions', 'Privacy policy'] }),
  module({ slug: 'marketing', navId: 'marketing', title: 'Marketing', eyebrow: 'Growth', description: 'Run campaigns, referrals, promotions, featured listings and landing pages.', accent: 'Campaign studio', tabs: ['Campaigns', 'Referrals', 'Promo codes', 'Featured', 'Landing pages'], filters: ['Channel', 'Status', 'Country', 'Date'], columns: ['Campaign ID', 'Campaign', 'Channel', 'Status', 'Performance', 'Started'], metrics: baseMetrics('campaigns'), primaryAction: 'New campaign', subjects: ['Summer investor push', 'Agent referral', 'Elite upgrade'] }),
  module({ slug: 'settings', navId: 'settings', title: 'Platform Settings', eyebrow: 'Configuration', description: 'Control localization, marketplace rules, integrations, security and maintenance.', accent: 'System controls', tabs: ['General', 'Localization', 'Marketplace', 'Integrations', 'Security'], filters: ['Category', 'Environment', 'Status', 'Updated'], columns: ['Setting', 'Category', 'Environment', 'Status', 'Value', 'Updated'], metrics: baseMetrics('configurations'), primaryAction: 'Save changes', subjects: ['Platform identity', 'Google Maps', 'Payment gateway'] }),
  module({ slug: 'support', navId: 'support', title: 'Support Center', eyebrow: 'Customer success', description: 'Triage support tickets, bugs, feature requests and contact messages.', accent: 'Resolution desk', tabs: ['Open', 'Pending', 'Closed', 'Features', 'Bugs'], filters: ['Type', 'Priority', 'Assignee', 'Date'], columns: ['Ticket ID', 'Subject', 'Customer', 'Status', 'Priority', 'Updated'], metrics: baseMetrics('tickets'), primaryAction: 'Create ticket', subjects: ['Payment assistance', 'Account access', 'Verification help'] }),
  module({ slug: 'activity', navId: 'activity', title: 'Activity Logs', eyebrow: 'Audit', description: 'Search admin, user, payment, API and security events across the platform.', accent: 'Audit trail', tabs: ['All logs', 'Admins', 'Users', 'Payments', 'API'], filters: ['User', 'Module', 'Action', 'IP address'], columns: ['Event ID', 'Action', 'Actor', 'Status', 'IP address', 'Timestamp'], metrics: baseMetrics('events'), primaryAction: 'Export logs', subjects: ['Profile updated', 'Subscription changed', 'Admin login'] }),
  module({ slug: 'ai-moderation', navId: 'ai-moderation', title: 'AI Moderation', eyebrow: 'Trust intelligence', description: 'Review automatic detection, risk scores and recommended enforcement actions.', accent: 'Risk engine', tabs: ['Detection', 'Risk scores', 'Suggestions', 'Reviewed'], filters: ['Risk level', 'Type', 'Decision', 'Date'], columns: ['Signal ID', 'Detection', 'Subject', 'Status', 'Risk score', 'Detected'], metrics: baseMetrics('signals'), primaryAction: 'Review queue', subjects: ['Suspicious conversation', 'Duplicate request', 'Fake document'] }),
  module({ slug: 'monitoring', navId: 'monitoring', title: 'System Monitoring', eyebrow: 'Operations', description: 'Observe infrastructure, application health, queues, storage and errors.', accent: 'Service health', tabs: ['Infrastructure', 'Application', 'Messaging', 'Storage', 'Errors'], filters: ['Service', 'Environment', 'Severity', 'Date'], columns: ['Service', 'Metric', 'Environment', 'Status', 'Current', 'Checked'], metrics: [{ label: 'API uptime', value: '99.99%', change: '+0.02%', positive: true }, { label: 'Average latency', value: '128ms', change: '-18ms', positive: true }, { label: 'Queue depth', value: '248', change: '-12.1%', positive: true }, { label: 'Open incidents', value: '2', change: '+1', positive: false }], primaryAction: 'Create incident', subjects: ['API gateway', 'Primary database', 'Email queue'] }),
  module({ slug: 'admin', navId: 'admin', title: 'Admin Management', eyebrow: 'Administration', description: 'Manage roles, permissions, admin profiles and audit trails.', accent: 'Access governance', tabs: ['Admins', 'Roles', 'Permissions', 'Audit trail'], filters: ['Role', 'Status', 'Permission', 'Last activity'], columns: ['Admin ID', 'Administrator', 'Role', 'Status', 'Permissions', 'Activity'], metrics: baseMetrics('admins'), primaryAction: 'Add admin', subjects: ['Super Admin', 'Operations Manager', 'Moderator'] }),
  module({ slug: 'business-intelligence', navId: 'business-intelligence', title: 'Business Intelligence', eyebrow: 'Executive', description: 'Connect acquisition economics, revenue quality and marketplace forecasting.', accent: 'Decision room', tabs: ['Executive KPIs', 'Marketplace', 'Forecasting', 'Benchmarking'], filters: ['Period', 'Country', 'Segment', 'Forecast'], columns: ['Insight', 'Dimension', 'Owner', 'Status', 'Value', 'Period'], metrics: [{ label: 'LTV / CAC ratio', value: '4.8x', change: '+0.6x', positive: true }, { label: 'Annual recurring revenue', value: 'AED 9.8M', change: '+22.4%', positive: true }, { label: 'Net revenue growth', value: '18.7%', change: '+4.2%', positive: true }, { label: 'Churn prediction', value: '2.1%', change: '-0.7%', positive: true }], primaryAction: 'Generate insight', subjects: ['Revenue forecast', 'Agency ranking', 'Country benchmark'] }),
  module({ slug: 'request-insights', navId: 'request-insights', title: 'Request Insights', eyebrow: 'Marketplace intelligence', description: 'Understand request reach, engagement, conversion, response and market fit.', accent: 'Request score', tabs: ['Overview', 'Reach', 'Engagement', 'Timeline', 'Market reach'], filters: ['Request', 'Country', 'Property type', 'Date'], columns: ['Request ID', 'Insight', 'Investor', 'Status', 'Score', 'Updated'], metrics: [{ label: 'Average request score', value: '82.4', change: '+4.8', positive: true }, { label: 'Reach rate', value: '68.2%', change: '+7.3%', positive: true }, { label: 'Offer submission rate', value: '21.8%', change: '+2.9%', positive: true }, { label: 'Average first offer', value: '2h 14m', change: '-18m', positive: true }], primaryAction: 'Select request', subjects: ['Reach performance', 'Offer conversion', 'Market fit'] }),
]

export const moduleBySlug = Object.fromEntries(platformModules.map((item) => [item.slug, item])) as Record<string, PlatformModule>

export const routeByNavId: Record<string, string> = {
  dashboard: '/',
  agents: '/agents',
  tools: '/all-tools',
  'design-system': '/design-system',
  ...Object.fromEntries(platformModules.map((item) => [item.navId, `/${item.slug}`])),
}
