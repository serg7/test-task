'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { User, deleteUser } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DeleteUserDialog } from './DeleteUserDialog';
import { Trash2 } from 'lucide-react';

interface UserTableProps {
  users: User[];
  isLoading?: boolean;
}

interface UserTableRowProps {
  user: User;
  onDeleteClick: (user: User) => void;
}

const UserTableRow = memo(({ user, onDeleteClick }: UserTableRowProps) => {
  return (
    <TableRow
      className="hover:bg-neutral-50 transition-colors"
    >
      <TableCell className="font-medium text-neutral-900">{user.name}</TableCell>
      <TableCell className="text-neutral-600">{user.email}</TableCell>
      <TableCell className="text-neutral-600">{user.company}</TableCell>
      <TableCell className="text-neutral-600">{user.address}</TableCell>
      <TableCell className="text-neutral-600">{user.city}</TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteClick(user)}
          className="hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
});

export function UserTable({ users, isLoading }: UserTableProps) {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
