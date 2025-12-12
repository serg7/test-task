'use client';

import { User } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/lib/ui/dialog';
import { Button } from '@/lib/ui/button';
import { AlertCircle } from 'lucide-react';

interface DeleteUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  error?: string;
}

export function DeleteUserDialog({
  user,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  error,
}: DeleteUserDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Delete User</DialogTitle>
              <DialogDescription className="mt-2">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-neutral-900">{user.name}</span>?
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Error deleting user</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-neutral-200"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
