import { useEffect, useState } from 'react';

const sanitizeBasePath = (rawBasePath: string | undefined) => {
  if (!rawBasePath) {
    return '/';
  }

  const trimmed = rawBasePath.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '/';
};

const detectBasePathFromScript = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return undefined;
  }

  const scripts = Array.from(document.querySelectorAll('script[type="module"][src]'));
  for (const script of scripts) {
    const src = script.getAttribute('src');
    if (!src) {
      continue;
    }

    try {
      const url = new URL(src, window.location.origin);
      const assetsIndex = url.pathname.indexOf('/assets/');
      if (assetsIndex > 0) {
        return url.pathname.slice(0, assetsIndex);
      }
    } catch {
      continue;
    }
  }

  return undefined;
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

const resolveBasePath = () => {
  const envBasePath =
    (import.meta.env.VITE_BASE_PATH as string | undefined) ??
    (import.meta.env.BASE_URL as string | undefined) ??
    '/';

  const sanitizedEnv = sanitizeBasePath(envBasePath);
  if (sanitizedEnv !== '/' || typeof window === 'undefined') {
    return sanitizedEnv;
  }

  const runtimeBase = detectBasePathFromScript();
  return runtimeBase ? sanitizeBasePath(runtimeBase) : sanitizedEnv;
};

export const BASE_PATH = resolveBasePath();

export const useBasePath = () => {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname, BASE_PATH));

  useEffect(() => {
    const handler = () => setCurrentPath(normalizePath(window.location.pathname, BASE_PATH));
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return { currentPath, basePath: BASE_PATH === '/' ? '' : BASE_PATH };
};
