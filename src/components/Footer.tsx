import { useBasePath } from '../utils/useBasePath';

const Footer = () => {
  const { basePath } = useBasePath();

  return (
    <footer className="mt-24 border-t border-white/10 bg-black/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Classical Catalog. All rights reserved.</p>
        <nav className="flex flex-wrap items-center gap-4 uppercase tracking-[0.25em] text-xs text-white/40">
          <a href={`${basePath}/`}>Home</a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
            YouTube Channel
          </a>
          <a href="mailto:hello@classical.app">Contact</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
