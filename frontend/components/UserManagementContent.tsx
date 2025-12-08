'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { UserTable } from '@/components/table';
import { SearchBar } from '@/components/SearchBar';

export function UserManagementContent() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USERS, searchQuery],
    queryFn: () => fetchUsers(searchQuery),
  });

  return (
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
  );
}
