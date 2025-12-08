import { UserManagementContent } from '@/components/UserManagementContent';
import { Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management | Dashboard',
  description: 'Manage and search user database',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-700 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                User Management
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                Manage and search user database
              </p>
            </div>
          </div>
        </div>
      </header>

      <UserManagementContent />
    </div>
  );
}
