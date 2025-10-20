import Footer from '../components/Footer';
import Header from '../components/Header';
import { useBasePath } from '../utils/useBasePath';

type Props = {
  requestedPath: string;
};

const NotFoundPage = ({ requestedPath }: Props) => {
  const { basePath } = useBasePath();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md space-y-4 rounded-3xl border border-white/10 bg-white/5 p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-accent/70">404</p>
          <h2 className="font-display text-3xl font-semibold">We lost that cadence.</h2>
          <p className="text-sm text-white/70">
            The route <code>{requestedPath}</code> does not exist. Return to the program and keep exploring our collection.
          </p>
          <a
            className="inline-flex items-center justify-center rounded-full border border-accent/60 px-5 py-2 text-xs uppercase tracking-[0.25em] text-accent transition hover:bg-accent hover:text-midnight"
            href={`${basePath}/`}
          >
            Back to home
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
