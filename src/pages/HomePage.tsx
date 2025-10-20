import ComposerSpotlight from '../components/ComposerSpotlight';
import Footer from '../components/Footer';
import GenreSection from '../components/GenreSection';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { useCatalog } from '../hooks/useCatalog';

const HomePage = () => {
  const { catalog, worksById, isLoading, error } = useCatalog();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm uppercase tracking-[0.35em] text-white/50">Loading catalog…</p>
      </main>
    );
  }

  if (error || !catalog) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="max-w-md rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-center">
          <h2 className="font-display text-2xl">Unable to load catalog</h2>
          <p className="mt-3 text-sm text-red-100/80">{error ?? 'Please try refreshing the page or contact support.'}</p>
        </div>
      </main>
    );
  }

  const heroComposer = catalog.composers[0];
  const heroWorks = heroComposer?.works.slice(0, 2).map((id) => worksById.get(id)).filter(Boolean) ?? [];

  return (
    <div className="pb-20">
      <Header />
      <Hero />
      {catalog.genres.map((genre) => {
        const works = genre.works
          .map((id) => worksById.get(id))
          .filter(Boolean)
          .slice(0, 3) as typeof heroWorks;
        return <GenreSection key={genre.id} genre={genre} works={works} />;
      })}
      {heroComposer && heroWorks.length > 0 ? (
        <ComposerSpotlight composer={heroComposer} works={heroWorks} />
      ) : null}
      <Footer />
    </div>
  );
};

export default HomePage;
