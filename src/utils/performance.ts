// Performance monitoring utilities

export const measurePerformance = (name: string, callback: () => void) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  const duration = end - start;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`⚡ ${name} took ${duration.toFixed(2)}ms`);
  }
  
  return duration;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const lazyLoad = <T>(
  importFunc: () => Promise<{ default: T }>
): Promise<{ default: T }> => {
  return new Promise((resolve) => {
    // Add artificial delay in development for testing
    const delay = process.env.NODE_ENV === 'development' ? 300 : 0;
    
    setTimeout(() => {
      importFunc().then(resolve);
    }, delay);
  });
};

// Web Vitals monitoring
export const logWebVital = (metric: { name: string; value: number }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 ${metric.name}:`, metric.value.toFixed(2));
  }
};