'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api';
import { UserTable } from '@/components/UserTable';
import { SearchBar } from '@/components/SearchBar';
import { Users } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', searchQuery],
    queryFn: () => fetchUsers(searchQuery),
  });

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
                Manage and search through your user database
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="mb-6">
          <div className="bg-white rounded-lg border border-neutral-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-neutral-900">
                  {users.length}
                </p>
              </div>
              {searchQuery && (
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-600">
                    Search Results
                  </p>
                  <p className="text-xl font-semibold text-neutral-700">
                    &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <UserTable users={users} isLoading={isLoading} />
      </main>
    </div>
  );
}
