'use client';

import { useState, useCallback } from 'react';
import { User, deleteUser, ApiError } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/lib/ui/table';
import { DeleteUserDialog } from '../DeleteUserDialog';
import { UserTableRow } from './UserTableRow';
import { toast } from 'sonner';

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
}

export function UserTable({ users, isLoading }: UserTableProps) {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      setUserToDelete(null);
      toast.success('User deleted successfully', {
        description: 'The user has been removed from the database',
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiError) {
        toast.error('Failed to delete user', {
          description: error.message,
        });
      } else {
        toast.error('Network error', {
          description: 'Unable to connect to the server',
        });
      }
    },
  });

  const handleDeleteClick = useCallback((user: User) => {
    setUserToDelete(user);
  }, []);

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-lg text-neutral-500">
          Loading users...
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-neutral-500">No users found</div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 hover:bg-neutral-50">
              <TableHead className="font-semibold text-neutral-900">Name</TableHead>
              <TableHead className="font-semibold text-neutral-900">Email</TableHead>
              <TableHead className="font-semibold text-neutral-900">Company</TableHead>
              <TableHead className="font-semibold text-neutral-900">Address</TableHead>
              <TableHead className="font-semibold text-neutral-900">City</TableHead>
              <TableHead className="font-semibold text-neutral-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteUserDialog
        user={userToDelete}
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
        error={deleteMutation.error instanceof ApiError ? deleteMutation.error.message : undefined}
      />
    </>
  );
}
