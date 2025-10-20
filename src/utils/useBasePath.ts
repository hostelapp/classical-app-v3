import { useEffect, useState } from 'react';

const normalizePath = (pathname: string, basePath: string) => {
  if (!basePath || basePath === '/' || !pathname.startsWith(basePath)) {
    return pathname;
  }
  const normalized = pathname.replace(basePath, '/') || '/';
  return normalized.endsWith('/') && normalized.length > 1
    ? normalized.slice(0, -1)
    : normalized;
};

export const useBasePath = () => {
  const basePath = import.meta.env.VITE_BASE_PATH || '/';
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname, basePath));

  useEffect(() => {
    const handler = () => setCurrentPath(normalizePath(window.location.pathname, basePath));
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [basePath]);

  return { currentPath, basePath: basePath === '/' ? '' : basePath };
};
