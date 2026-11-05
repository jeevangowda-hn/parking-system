import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-3 mb-6">
        <div className={`p-2 rounded-lg shrink-0 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-secondary leading-relaxed">{message}</p>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={isDestructive ? 'destructive' : 'primary'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

