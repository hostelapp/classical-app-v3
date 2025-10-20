# Classical Catalog

This branch rebuilds the Classical app from the ground up with a static JSON catalog and a streamlined admin studio. It keeps the previous public design (hero, curated sections, responsive layout) while removing the Supabase dependency that caused constant merge conflicts.

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env` file if you need to override the default GitHub Pages path:

```
VITE_BASE_PATH=/classical-app-v2/
VITE_ENABLE_ADMIN=false
```

## Available scripts

- `npm run dev` – start the Vite development server.
- `npm run build` – create an optimized production bundle.
- `npm run preview` – preview the build output locally.
- `npm run lint` – run ESLint.
- `npm run typecheck` – run TypeScript without emitting files.

## Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site from this branch and publishes it to GitHub Pages automatically. Make sure the repository Settings → Pages is configured to use GitHub Actions.

## Catalog management

- The public site reads from `public/catalog.json`.
- Editors can visit `/admin` (when `VITE_ENABLE_ADMIN=true`) to add, edit, or remove works.
- Changes are saved to `localStorage` so you can curate the catalog without a backend.

Because this branch deletes the legacy Supabase files entirely, you can set it as the default branch to avoid future merge conflicts.
