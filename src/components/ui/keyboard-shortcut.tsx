import React from 'react';
import { cn } from '@/lib/utils';

interface KeyboardShortcutProps {
  keys: string[];
  className?: string;
}

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({ keys, className }) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <kbd className="px-2 py-1 text-xs font-semibold bg-muted border border-border rounded">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-xs text-muted-foreground">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};