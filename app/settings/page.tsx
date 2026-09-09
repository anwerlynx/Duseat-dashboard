import { Metadata } from 'next';
import { SettingsManagement } from '@/components/platform/settings-management';

export const metadata: Metadata = {
  title: 'Platform Settings & System Control Center | Duseat Admin',
  description: 'Manage platform identity, localization, taxonomy, notifications, integrations, security, feature flags, maintenance, and backups.',
};

export default function SettingsPage() {
  return <SettingsManagement />;
}
