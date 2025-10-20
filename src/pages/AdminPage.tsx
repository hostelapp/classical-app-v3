import { FormEvent, useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCatalog, type Catalog, type CatalogWork } from '../hooks/useCatalog';

const STORAGE_KEY = 'classical-catalog';

type DraftCatalog = Catalog;

type FormState = {
  id: string;
  title: string;
  composerId: string;
  year: string;
  duration: string;
  description: string;
  youtubeId: string;
};

const emptyForm: FormState = {
  id: '',
  title: '',
  composerId: '',
  year: '',
  duration: '',
  description: '',
  youtubeId: '',
};

const AdminPage = () => {
  const adminEnabled = useMemo(() => import.meta.env.VITE_ENABLE_ADMIN === 'true', []);
  const { catalog, isLoading, error } = useCatalog();
  const [draft, setDraft] = useState<DraftCatalog | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (!catalog || draft) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DraftCatalog;
        setDraft(parsed);
        return;
      } catch (err) {
        console.warn('Failed to parse stored catalog', err);
      }
    }
    setDraft(catalog);
  }, [catalog, draft]);

  useEffect(() => {
    if (!draft) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  if (!adminEnabled) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-lg space-y-4 rounded-3xl border border-white/10 bg-white/5 p-10">
          <h2 className="font-display text-3xl">Admin studio disabled</h2>
          <p className="text-sm text-white/70">
            Set <code>VITE_ENABLE_ADMIN=true</code> in your environment to unlock the catalog editor.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading || !draft) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm uppercase tracking-[0.35em] text-white/50">Loading admin studio…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="max-w-md rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-center">
          <h2 className="font-display text-2xl">Catalog unavailable</h2>
          <p className="mt-3 text-sm text-red-100/80">{error}</p>
        </div>
      </main>
    );
  }

  const handleSelect = (work: CatalogWork) => {
    setForm({
      id: work.id,
      title: work.title,
      composerId: work.composerId,
      year: String(work.year),
      duration: work.duration,
      description: work.description,
      youtubeId: work.youtubeId,
    });
    const containingGenre = draft.genres.find((genre) => genre.works.includes(work.id));
    if (containingGenre) setSelectedGenre(containingGenre.id);
    setStatus('Editing existing work.');
  };

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedGenre('');
    setStatus('Ready for a new entry.');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title || !form.youtubeId) {
      setStatus('Title and YouTube ID are required.');
      return;
    }

    const workId = form.id || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updatedWork: CatalogWork = {
      id: workId,
      title: form.title,
      composerId: form.composerId || 'unknown',
      year: Number(form.year) || new Date().getFullYear(),
      duration: form.duration || 'N/A',
      description: form.description || 'Add program notes to enrich this entry.',
      youtubeId: form.youtubeId,
    };

    const existed = draft?.works.some((work) => work.id === workId) ?? false;

    setDraft((prev) => {
      if (!prev) return prev;
      const existingIndex = prev.works.findIndex((work) => work.id === workId);
      const works = [...prev.works];
      if (existingIndex >= 0) {
        works[existingIndex] = updatedWork;
      } else {
        works.push(updatedWork);
      }

      const genres = prev.genres.map((genre) => {
        if (!selectedGenre) return genre;
        if (genre.id !== selectedGenre) {
          return { ...genre, works: genre.works.filter((id) => id !== workId) };
        }
        return {
          ...genre,
          works: genre.works.includes(workId) ? genre.works : [...genre.works, workId],
        };
      });

      return { ...prev, works, genres, updatedAt: new Date().toISOString() };
    });

    setStatus(existingWorkMessage(workId, existed));
  };

  const handleDelete = (workId: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        works: prev.works.filter((work) => work.id !== workId),
        genres: prev.genres.map((genre) => ({
          ...genre,
          works: genre.works.filter((id) => id !== workId),
        })),
        updatedAt: new Date().toISOString(),
      };
    });
    resetForm();
    setStatus('Work deleted from catalog.');
  };

  const exportCatalog = () => {
    if (!draft) return;
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalog.json';
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Catalog exported. Replace public/catalog.json to publish changes.');
  };

  return (
    <div>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="mt-10 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-accent/70">Catalog Admin</p>
              <h2 className="font-display text-3xl font-semibold">Curate your collection</h2>
              <p className="text-sm text-white/70">Last updated {new Date(draft.updatedAt).toLocaleString()}.</p>
            </div>
            <button
              type="button"
              className="self-start rounded-full border border-accent/60 px-4 py-2 text-xs uppercase tracking-[0.25em] text-accent transition hover:bg-accent hover:text-midnight"
              onClick={exportCatalog}
            >
              Export catalog
            </button>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.35em] text-white/60">Title</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.35em] text-white/60">Composer ID</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent"
                value={form.composerId}
                onChange={(event) => setForm((prev) => ({ ...prev, composerId: event.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.35em] text-white/60">Year</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent"
                value={form.year}
                onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.35em] text-white/60">Duration</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent"
                value={form.duration}
                onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.35em] text-white/60">Description</span>
              <textarea
                className="min-h-[120px] rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.35em] text-white/60">YouTube ID</span>
              <input
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent"
                value={form.youtubeId}
                onChange={(event) => setForm((prev) => ({ ...prev, youtubeId: event.target.value }))}
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.35em] text-white/60">Assign to genre</span>
              <select
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-accent"
                value={selectedGenre}
                onChange={(event) => setSelectedGenre(event.target.value)}
              >
                <option value="">No genre</option>
                {draft.genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-full border border-accent/60 px-5 py-2 text-xs uppercase tracking-[0.25em] text-accent transition hover:bg-accent hover:text-midnight"
              >
                Save work
              </button>
              <button
                type="button"
                className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.25em] text-white/70 transition hover:border-white/40 hover:text-white"
                onClick={resetForm}
              >
                Reset form
              </button>
              {form.id ? (
                <button
                  type="button"
                  className="rounded-full border border-red-400/60 px-5 py-2 text-xs uppercase tracking-[0.25em] text-red-300 transition hover:bg-red-400 hover:text-midnight"
                  onClick={() => handleDelete(form.id)}
                >
                  Delete work
                </button>
              ) : null}
            </div>
          </form>

          <p className="text-sm text-white/60">{status || 'Select a work to edit or add a new entry below.'}</p>
        </div>

        <section className="mt-12">
          <p className="text-sm uppercase tracking-[0.35em] text-accent/70">Catalog overview</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {draft.works.map((work) => {
              const genreNames = draft.genres.filter((genre) => genre.works.includes(work.id)).map((genre) => genre.label);
              return (
                <button
                  key={work.id}
                  type="button"
                  onClick={() => handleSelect(work)}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-accent/50"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">{genreNames.join(', ') || 'Unassigned'}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold leading-tight">{work.title}</h3>
                  <p className="mt-2 text-sm text-white/70">YouTube ID: {work.youtubeId}</p>
                </button>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const existingWorkMessage = (id: string, exists: boolean) =>
  exists ? `Updated existing work (${id}).` : `Added new work (${id}).`;

export default AdminPage;
