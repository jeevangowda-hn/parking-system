import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button.jsx';

export function EmptyState({
  title = 'No items found',
  description = 'There is no data to display at this time.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/50 rounded-xl border border-dashed border-outline-variant">
      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-headline-sm text-sm font-semibold text-on-surface mb-1">{title}</h4>
      <p className="text-xs text-secondary max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

