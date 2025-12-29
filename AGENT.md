# AGENT Instructions

- Purpose: quick guide for Codex agents working on this repo.

## Stack and features
- Next.js App Router blog starter with Tailwind CSS, Contentlayer2 + MDX, Zustand-driven client pagination/tags, i18next-based i18n, kbar search, share buttons, series + featured posts, optional audio player/lightbox/Framer Motion touches, Waline comments, Formspree modal.
- Routes + layouts under `app/[locale]`; custom middleware rewrites default locale and handles missing locale.

## Local dev
- Install deps with `npm install` (lockfile present) or `npm ci`; `packageManager` points to Yarn 4 but `package-lock.json` is committed; prefer npm to avoid churn.
- Run dev with `npm run dev`; build with `npm run build` (runs `next build` then `scripts/postbuild.mjs`); lint `npm run lint`; format `npm run format`.
- Node 18+ required (Next 15); if using corepack, align with repo locks.

## i18n/content conventions
- Supported locales defined in `app/[locale]/i18n/locales.js` (fallback + second). Translations live in `app/[locale]/i18n/locales/<lang>/*.json`; every namespace/file must exist for each language with matching keys.
- Content stored by language: posts in `data/blog/<lang>/`, authors in `data/authors/<lang>/`; slugs must match across translations. Frontmatter fields include `language`, `authors`, `tags`, `series`, `featured`, etc. Contentlayer enforces required fields and builds tag counts per locale; if adding more languages, update the tag-count logic and locale arrays.
- Localized metadata in `data/localeMetadata.ts` (title/description). Projects per locale in `data/projectsData.ts`.

## Feature toggles and gotchas
- Comments: Waline supported via `data/siteMetadata.js` flags (`iscomments`, `iswaline`, `walineServer`). Formspree key set in `components/formspree/useContactForm.ts`; disable via site metadata.
- Kbar search uses locale-specific labels; adjust hardcoded section titles if new languages are added.
- Animations: `template.tsx` was removed for mobile perf; only reintroduce if you accept the cost.
- README warns not to upgrade dependencies; keep versions pinned unless explicitly asked.

## Testing/verification
- Run `npm run lint` and `npm run build`; spot-check locale-specific routes and tag pagination when changing i18n or contentlayer.
