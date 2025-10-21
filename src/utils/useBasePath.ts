import { useEffect, useState } from 'react';

const sanitizeBasePath = (rawBasePath: string | undefined) => {
  if (!rawBasePath || rawBasePath === '/') {
    return '/';
  }

  const trimmed = rawBasePath.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '/';
};

const normalizePath = (pathname: string, basePath: string) => {
  if (!basePath || basePath === '/') {
    return pathname || '/';
  }

  if (!pathname.startsWith(basePath)) {
    return pathname || '/';
  }

  const nextChar = pathname.charAt(basePath.length);
  if (nextChar && nextChar !== '/') {
    return pathname || '/';
  }

  const remainder = pathname.slice(basePath.length) || '/';
  return remainder.startsWith('/') ? remainder : `/${remainder}`;
};

const BASE_PATH = sanitizeBasePath(
  (import.meta.env.VITE_BASE_PATH as string | undefined) ??
    (import.meta.env.BASE_URL as string | undefined) ??
    '/',
);

export const useBasePath = () => {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname, BASE_PATH));

  useEffect(() => {
    const handler = () => setCurrentPath(normalizePath(window.location.pathname, BASE_PATH));
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return { currentPath, basePath: BASE_PATH === '/' ? '' : BASE_PATH };
};
