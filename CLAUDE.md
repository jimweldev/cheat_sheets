# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint`
- **Preview production build:** `npm run preview`

## Architecture

React + TypeScript SPA using Vite, with Supabase as the backend (auth + database).

**Auth:** Google OAuth via Supabase, managed through `AuthContext` (`src/context/AuthContext.tsx`). The `useAuth()` hook provides `user`, `session`, `signInWithGoogle`, and `signOut`. `ProtectedRoute` wraps authenticated pages and redirects to `/login`.

**Data model:** Single `cheat_sheets` table in Supabase with fields: `id`, `user_id`, `title`, `content` (markdown), `created_at`, `updated_at`. The `CheatSheet` type is in `src/types.ts`.

**Routes:**
- `/login` — Google sign-in
- `/` — Dashboard (list/delete sheets)
- `/new` — Create new sheet
- `/edit/:id` — Edit existing sheet

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin. Dark theme using Slate color palette. Markdown preview nested styles are in `index.css` using `@layer components`.

**Markdown rendering:** `react-markdown` with `remark-gfm` plugin for GFM support (tables, strikethrough, etc.) in the editor preview.

## Environment Variables

Supabase config is in `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. These are accessed via `import.meta.env` in `src/lib/supabase.ts`.
