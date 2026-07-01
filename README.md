# Macrio Web

The web companion to the Macrio iOS and Android food tracker, built with React + Vite. It shares
the same Supabase backend as the mobile apps, so logging a meal here shows up on your phone too.

## Local development

1. Copy the example env file and fill in your Supabase project's values:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local`:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   Both values are in your Supabase project's Settings → API page. `.env.local` is git-ignored
   and never committed.

2. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

   The app runs at `http://localhost:5173` by default.

## Deployment

Pushes to `main` are automatically built and deployed to GitHub Pages via
`.github/workflows/deploy.yml` — no manual deploy step needed. See that workflow for how the
Supabase env vars are injected at build time from repository secrets.
