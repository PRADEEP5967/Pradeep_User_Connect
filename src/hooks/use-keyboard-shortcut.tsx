import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  callback: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcut({
  key,
  ctrl = false,
  shift = false,
  alt = false,
  meta = false,
  callback,
  enabled = true,
}: KeyboardShortcutOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesCtrl = ctrl === event.ctrlKey;
      const matchesShift = shift === event.shiftKey;
      const matchesAlt = alt === event.altKey;
      const matchesMeta = meta === event.metaKey;

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, ctrl, shift, alt, meta, callback, enabled]);
}

// Helper hook for common shortcuts
export function useCommonShortcuts({
  onSearch,
  onSave,
  onClose,
  onHelp,
}: {
  onSearch?: () => void;
  onSave?: () => void;
  onClose?: () => void;
  onHelp?: () => void;
}) {
  // Ctrl/Cmd + K for search
  useKeyboardShortcut({
    key: 'k',
    ctrl: true,
    callback: () => onSearch?.(),
    enabled: !!onSearch,
  });

  // Ctrl/Cmd + S for save
  useKeyboardShortcut({
    key: 's',
    ctrl: true,
    callback: () => onSave?.(),
    enabled: !!onSave,
  });

  // Escape for close
  useKeyboardShortcut({
    key: 'Escape',
    callback: () => onClose?.(),
    enabled: !!onClose,
  });

  // Ctrl/Cmd + / for help
  useKeyboardShortcut({
    key: '/',
    ctrl: true,
    callback: () => onHelp?.(),
    enabled: !!onHelp,
  });
}