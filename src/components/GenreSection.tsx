import type { CatalogGenre, CatalogWork } from '../hooks/useCatalog';
import WorkCard from './WorkCard';

type Props = {
  genre: CatalogGenre;
  works: CatalogWork[];
};

const GenreSection = ({ genre, works }: Props) => (
  <section className="mx-auto mt-16 w-full max-w-6xl px-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-accent/70">{genre.label}</p>
        <h3 className="font-display text-3xl font-semibold leading-tight">{genre.description}</h3>
      </div>
      <p className="max-w-md text-sm text-white/70">
        Each playlist features definitive recordings and quick program notes so you can jump straight into the music.
      </p>
    </div>
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {works.map((work) => (
        <WorkCard key={work.id} work={work} />
      ))}
    </div>
  </section>
);

export default GenreSection;
