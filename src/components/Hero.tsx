const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16 lg:flex-row lg:items-center">
      <div className="flex-1">
        <p className="text-sm uppercase tracking-[0.35em] text-accent/70">Curated for modern listeners</p>
        <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
          Discover orchestral gems, iconic concertos, and intimate chamber music in one place.
        </h2>
        <p className="mt-4 max-w-xl text-base text-white/80">
          A handpicked program of classical essentials with context, recordings, and beautiful visuals. Stream instantly
          and keep exploring with our interactive catalog.
        </p>
      </div>
      <div className="flex-1">
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
          <div className="aspect-video overflow-hidden rounded-2xl border border-white/10">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/_4IRMYuE1hI"
              title="Featured performance"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-4">
            <p className="text-sm uppercase tracking-[0.35em] text-accent/70">Featured work</p>
            <h3 className="mt-2 font-display text-xl font-semibold">Beethoven — Symphony No. 5</h3>
            <p className="mt-2 text-sm text-white/70">
              The iconic opening motif that shaped the course of orchestral writing, performed by the Vienna Philharmonic.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
