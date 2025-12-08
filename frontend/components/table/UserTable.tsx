'use client';

import { useState, useMemo, useCallback } from 'react';
import { User, deleteUser } from '@/lib/api';
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

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
}

export function UserTable({ users, isLoading }: UserTableProps) {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      setUserToDelete(null);
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

  const rows = useMemo(() => {
    return users.map((user) => (
      <UserTableRow
        key={user.id}
        user={user}
        onDeleteClick={handleDeleteClick}
      />
    ));
  }, [users, handleDeleteClick]);

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
            {rows}
          </TableBody>
        </Table>
      </div>

      <DeleteUserDialog
        user={userToDelete}
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
