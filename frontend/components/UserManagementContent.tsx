'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers, ApiError, User } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { UserTable } from '@/components/table';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/lib/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function UserManagementContent() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users = [], isLoading, error, refetch } = useQuery<User[], Error>({
    queryKey: [QUERY_KEYS.USERS, searchQuery],
    queryFn: () => fetchUsers(searchQuery),
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      if (error instanceof ApiError) {
        toast.error('Failed to fetch users', {
          description: error.message,
        });
      } else {
        toast.error('Network error', {
          description: 'Unable to connect to the server',
        });
      }
    }
  }, [error]);

  if (error) {
    const errorMessage = error instanceof ApiError
      ? error.message
      : 'Unable to connect to the server';

    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Failed to load users</h3>
              <p className="text-sm text-neutral-600">{errorMessage}</p>
            </div>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </main>
    );
  }

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
