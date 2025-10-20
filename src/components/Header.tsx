import { useMemo } from 'react';
import { useBasePath } from '../utils/useBasePath';

const Header = () => {
  const { basePath } = useBasePath();
  const enableAdmin = useMemo(() => import.meta.env.VITE_ENABLE_ADMIN === 'true', []);

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-accent/70">The Classical Collection</p>
        <h1 className="font-display text-2xl font-semibold tracking-wide">Timeless Works on Demand</h1>
      </div>
      {enableAdmin ? (
        <a
          className="rounded-full border border-accent/60 px-5 py-2 text-sm font-medium uppercase tracking-[0.2em] transition hover:bg-accent hover:text-midnight"
          href={`${basePath}/admin`}
        >
          Admin
        </a>
      ) : null}
    </header>
  );
};

export default Header;
