// Accessibility utilities

export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
    
    if (e.key === 'Escape') {
      element.dispatchEvent(new CustomEvent('escape'));
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  firstFocusable?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

export const setFocusIndicator = () => {
  let isUsingMouse = false;
  
  document.addEventListener('mousedown', () => {
    isUsingMouse = true;
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isUsingMouse = false;
    }
  });
  
  document.addEventListener('focusin', () => {
    if (isUsingMouse) {
      document.body.classList.add('using-mouse');
    } else {
      document.body.classList.remove('using-mouse');
    }
  });
};

export const getAriaLabel = (text: string, context?: string): string => {
  return context ? `${text}, ${context}` : text;
};