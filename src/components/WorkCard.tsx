import type { CatalogWork } from '../hooks/useCatalog';
import YouTubeEmbed from './YouTubeEmbed';

const WorkCard = ({ work }: { work: CatalogWork }) => (
  <article className="group rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl transition hover:-translate-y-1 hover:bg-white/10">
    <div className="aspect-video overflow-hidden rounded-2xl border border-white/10">
      <YouTubeEmbed youtubeId={work.youtubeId} title={work.title} />
    </div>
    <div className="mt-4 space-y-2">
      <p className="text-xs uppercase tracking-[0.35em] text-accent/70">{work.year}</p>
      <h4 className="font-display text-xl font-semibold leading-tight">{work.title}</h4>
      <p className="text-sm text-white/70">{work.description}</p>
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{work.duration}</span>
        <span>Watch now →</span>
      </div>
    </div>
  </article>
);

export default WorkCard;
