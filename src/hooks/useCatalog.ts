import { useEffect, useMemo, useState } from 'react';
import { BASE_PATH } from '../utils/useBasePath';

export type CatalogWork = {
  id: string;
  title: string;
  composerId: string;
  year: number;
  duration: string;
  description: string;
  youtubeId: string;
};

export type CatalogComposer = {
  id: string;
  name: string;
  era: string;
  works: string[];
  portraitUrl: string;
};

export type CatalogGenre = {
  id: string;
  label: string;
  description: string;
  works: string[];
};

export type Catalog = {
  updatedAt: string;
  genres: CatalogGenre[];
  composers: CatalogComposer[];
  works: CatalogWork[];
};

const parseCatalog = (raw: unknown): Catalog | null => {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Catalog;
  if (!Array.isArray(candidate.works) || !Array.isArray(candidate.genres) || !Array.isArray(candidate.composers)) {
    return null;
  }
  return candidate;
};

export const useCatalog = () => {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const prefix = BASE_PATH === '/' ? '' : BASE_PATH;
        const catalogUrl = prefix ? `${prefix}/catalog.json` : '/catalog.json';
        const response = await fetch(catalogUrl, { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error(`Failed to load catalog (${response.status})`);
        }
        const data = parseCatalog(await response.json());
        if (!cancelled) {
          if (!data) {
            setError('Catalog format is invalid.');
          } else {
            setCatalog(data);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const composersById = useMemo(() => {
    if (!catalog) return new Map<string, CatalogComposer>();
    return new Map(catalog.composers.map((composer) => [composer.id, composer]));
  }, [catalog]);

  const worksById = useMemo(() => {
    if (!catalog) return new Map<string, CatalogWork>();
    return new Map(catalog.works.map((work) => [work.id, work]));
  }, [catalog]);

  return {
    catalog,
    composersById,
    worksById,
    error,
    isLoading,
  };
};
