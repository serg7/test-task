'use client';

import { memo } from 'react';
import { User } from '@/lib/api';
import {
  TableCell,
  TableRow,
} from '@/lib/ui/table';
import { Button } from '@/lib/ui/button';
import { Trash2 } from 'lucide-react';

interface UserTableRowProps {
  user: User;
  onDeleteClick: (user: User) => void;
}

export const UserTableRow = memo(({ user, onDeleteClick }: UserTableRowProps) => {
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

UserTableRow.displayName = 'UserTableRow';
