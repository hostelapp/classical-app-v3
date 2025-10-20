import type { CatalogComposer, CatalogWork } from '../hooks/useCatalog';
import WorkCard from './WorkCard';

interface Props {
  composer: CatalogComposer;
  works: CatalogWork[];
}

const ComposerSpotlight = ({ composer, works }: Props) => (
  <section className="mx-auto mt-20 w-full max-w-6xl px-6">
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl md:flex md:items-center md:gap-8">
      <div className="flex-1 space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-accent/70">Composer spotlight</p>
        <h3 className="font-display text-3xl font-semibold leading-tight">{composer.name}</h3>
        <p className="text-sm text-white/70">Era: {composer.era}</p>
        <p className="text-sm text-white/70">
          Explore signature works that defined {composer.name.split(' ')[0]}'s voice. Each performance is hand-selected for
          clarity, passion, and high-fidelity sound.
        </p>
      </div>
      <div className="mt-8 grid flex-1 gap-4 md:mt-0">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    </div>
  </section>
);

export default ComposerSpotlight;
