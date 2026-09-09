import { Metadata } from 'next';
import { MarketingManagement } from '@/components/platform/marketing-management';

export const metadata: Metadata = {
  title: 'Marketing Operations & Growth Command Center | Duseat Admin',
  description: 'Manage campaigns, referral programs, promo codes, featured listings, landing pages, and growth analytics.',
};

export default function MarketingPage() {
  return <MarketingManagement />;
}
