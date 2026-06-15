# comstock.ch

Personal blog / knowledge store for **comstock.ch**. Bilingual (DE default, EN), static
site generated with **Astro 5**. Migrated from a Next.js (Contentlayer + MDX) site in 2026.

## Commands

```bash
npm run dev       # local dev server (search is unavailable in dev — needs a build)
npm run build     # astro build  +  pagefind --site dist   → static output in dist/
npm run preview   # serve the built dist/ locally
npm run migrate    # one-time content migration (see scripts/migrate.mjs) — already run
```

Search (Pagefind) only works against a **built** site (`npm run build` then `npm run preview`),
because the index lives in `dist/pagefind/`.

## Architecture

- **SSG only.** No SSR/adapter. Output is plain static files served by nginx (see `Dockerfile`).
- **i18n** via Astro's native routing (`astro.config.mjs` → `i18n`), `prefixDefaultLocale: true`.
  Every page lives under `/de/...` or `/en/...`; `/` redirects to `/de/` (config `redirects`).
- **Content** uses Astro Content Collections (`src/content.config.ts`), glob loader.

### Content layout — one folder per post

```
src/content/blog/<slug>/
  de.mdx            # German version   (frontmatter: language: de)
  en.mdx            # English version  (frontmatter: language: en)
  assets/           # this post's images, optimized by Astro at build
```

- **Slug = folder name**, shared across languages → paired URLs `/de/blog/<slug>` and
  `/en/blog/<slug>`. The language switcher just swaps the leading path segment.
- Entry id is `"<slug>/<lang>"`; helpers in `src/lib/posts.ts` derive slug/lang and query by language.
- Authors: `src/content/authors/MajorTwip.<lang>.mdx` (+ `assets/`), rendered on `/[lang]/about`.

### Authoring posts (Obsidian-friendly)

Images go in the post's `assets/` folder and are referenced **relative**:

- **Markdown image** (raster): `![alt](./assets/photo.jpg)` — optimized → WebP automatically.
- **Obsidian embed** (raster): `![[photo.jpg]]` — resolved at build by
  `src/plugins/remark-obsidian.mjs` to `./assets/photo.jpg`, then optimized. Folder prefixes
  (`![[sub/photo.jpg]]`) and `|alt` are stripped; spaces in filenames become `-`.
- **SVG**: Astro's image optimizer can't read metadata from styled SVGs, so SVGs must be
  imported with Vite's `?url` and rendered as `<img>`:
  ```mdx
  import diagram from './assets/diagram.svg?url';
  <img src={diagram} alt="diagram" />
  ```
  (The migration auto-converted existing `![[x.svg]]` embeds to this pattern. `![[x.svg]]`
  written in Obsidian will NOT work at build — use the import form.)
- **Gallery / lightbox**: React island at `src/components/Gallery.tsx`
  (`yet-another-react-lightbox`). Usage in MDX (note `client:visible` + image imports):
  ```mdx
  import Gallery from '@/components/Gallery';
  import a from './assets/a.jpg';
  import b from './assets/b.jpg';
  <Gallery client:visible slides={[{ src: a.src, width: 1024, height: 768 }, { src: b.src }]} />
  ```

Frontmatter `image:` is the social/preview image (relative `./assets/...`). Do **not** add a
`layout:` field — Astro treats it as a component import; rendering uses `src/layouts/PostLayout.astro`.

### Markdown pipeline (`astro.config.mjs`)

remark: `remark-obsidian` (local), `remark-math`, GitHub alerts (`remark-github-blockquote-alert`).
rehype: `rehype-slug`, `rehype-autolink-headings`, `rehype-katex`. Code highlighting is Shiki
(built in; light/dark themes follow the `.dark` class).

### Theming

Tailwind v4 (via `@tailwindcss/vite`, config-less; styles in `src/styles/global.css`).
Class-based dark mode (`@custom-variant dark`). `ThemeToggle.astro` toggles `.dark` on `<html>`
and persists to `localStorage`; a no-flash inline script in `BaseLayout.astro` applies it before
paint (site default is dark).

**Colors** are driven by semantic CSS variables in `global.css` — palette
`0b0033 / 370031 / 832232 / ffdde2 / eff9f0` exposed as `--c-*`, mapped to semantic tokens
`--bg --surface --chip --border --fg --fg-muted --brand --brand-hover` for light, overridden under
`html.dark`. Components use these via arbitrary utilities (`bg-[var(--bg)]`, `text-[var(--fg-muted)]`,
etc.) and carry **no `dark:` color variants** — the variables switch instead. The maroon `--brand`
is lightened to a rose in dark mode for contrast. To re-theme the whole site, edit those tokens.

### Search

A **modal** (`src/components/SearchModal.astro`, mounted once in `BaseLayout`) built on the Pagefind
**Component UI** (`<pagefind-modal>`, the generated `/pagefind/pagefind-component-ui.{js,css}`) —
this replaced the deprecated Default UI (`@pagefind/default-ui`) as of Pagefind 1.5. Opened by the
header search button (`[data-open-search]` → the modal's public `.open()` method) or ⌘/Ctrl-K
(handled by a small inline script in `SearchModal.astro`). Pagefind is multilingual, so it auto-scopes results to the page's `<html lang>` — there is
intentionally **no language filter facet**. Post `<article>`s carry `data-pagefind-body`; the footer
is excluded via `data-pagefind-ignore`. Modal colors are themed via `--pf-*` vars in `global.css`.
Search needs a built site (index in `dist/pagefind/`).

### Logo / header / navigation

Header (`src/components/Header.astro`) shows `public/static/logo.svg` + wordmark. Nav is just
**Home / About** plus the search button, language switcher, and theme toggle. There is no separate
Blog page — **Home (`/[lang]/`) is the full post listing**. Individual posts still live at
`/[lang]/blog/<slug>/`; the post footer's "all posts" link returns to Home.

## Deployment

`Dockerfile` is two-stage: Node builds the static site (`npm run build`, includes Pagefind),
then nginx (`nginx.conf`) serves `dist/`. `.github/workflows/build_push.yml` builds the image
and pushes to `ghcr.io` on every push (unchanged from the previous infra).

## Notes / known specifics

- Pinned to **Astro 5** intentionally: Astro 6's rolldown-based Vite is incompatible with
  `@tailwindcss/vite` (`Missing field tsconfigPaths`). Revisit when that's resolved upstream.
- The migration script (`scripts/migrate.mjs`) is one-time and reads from a sibling checkout of
  the old repo at `C:/Projects/_comstock_old`. It dropped 4 image references that were already
  broken in the source. Tags and the projects page were intentionally not migrated.
- Excluded by request (for now): tag pages, projects page.
