// One-time migration: Next.js/Contentlayer content  ->  Astro per-post layout.
//
//   OLD  data/blog/{de,en}/<year>/<file>.mdx  +  public/static/images/blog/<slug>/...
//   NEW  src/content/blog/<slug>/{de,en}.mdx  +  src/content/blog/<slug>/assets/...
//
// Rewrites every image reference (frontmatter image/images, standard ![](...),
// Obsidian ![[...]], and <Gallery slides={[...]}/>) to co-located ./assets/<file>,
// copying the referenced files into each post's assets/ folder. Gallery srcs become
// MDX image imports so the lightbox gets optimized, hashed URLs.
import fs from 'node:fs';
import path from 'node:path';
import GithubSlugger from 'github-slugger';

const OLD = 'C:/Projects/_comstock_old';
const NEW = 'C:/Projects/comstockch';
const BLOG_IMG_ROOT = path.join(OLD, 'public/static/images/blog');
const OUT_BLOG = path.join(NEW, 'src/content/blog');

const IMG_EXT = /\.(png|jpe?g|svg|gif|webp|avif)$/i;
const slugger = new GithubSlugger();

const warn = (m) => console.warn('  ⚠ ' + m);

/** decode %xx and make a filesystem/url-safe basename (spaces -> -) */
const safeBase = (p) => decodeURIComponent(p.split('/').pop()).replace(/\s+/g, '-');

/** normalize any image ref to a path relative to BLOG_IMG_ROOT */
function toBlogRel(ref) {
  let r = ref.trim().replace(/^['"]|['"]$/g, '');
  r = r.replace(/^\/static\/images\/blog\//, '').replace(/^\//, '');
  return decodeURIComponent(r);
}

// Returns the destination basename, or null if the source file does not exist
// (the original repo had a handful of broken image links).
function copyAsset(blogRel, assetsDir, copied) {
  const src = path.join(BLOG_IMG_ROOT, decodeURIComponent(blogRel));
  const base = safeBase(blogRel);
  const dest = path.join(assetsDir, base);
  if (copied.has(base)) return copied.get(base) ? base : null;
  if (!fs.existsSync(src)) {
    warn(`missing image (dropped): ${blogRel}`);
    copied.set(base, false);
    return null;
  }
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.copyFileSync(src, dest);
  copied.set(base, true);
  return base;
}

function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: '', body: raw };
  return { fm: m[1], body: m[2] };
}

// Rewrite image paths inside the frontmatter block; returns new fm text.
function rewriteFrontmatter(fm, assetsDir, copied) {
  const lines = fm.split(/\r?\n/);
  const out = [];
  let inImagesBlock = false;
  for (let line of lines) {
    // Drop an empty scalar `image:` line (YAML null breaks the image() schema)
    if (/^\s*image:\s*$/.test(line)) { continue; }
    // Drop `layout:` — Astro MDX treats it as a component import; we use our own PostLayout
    if (/^\s*layout:\s/.test(line)) { continue; }

    const single = line.match(/^(\s*image:\s*)(.+)$/);
    const inlineArr = line.match(/^(\s*images:\s*)\[(.*)\]\s*$/);
    const imagesKey = /^(\s*images:\s*)$/.test(line);
    const listItem = inImagesBlock && line.match(/^(\s*-\s*)(.+)$/);

    if (single) {
      const val = single[2].trim();
      if (/^https?:/.test(val) || !IMG_EXT.test(val.replace(/['"]/g, ''))) { out.push(line); continue; }
      const base = copyAsset(toBlogRel(val), assetsDir, copied);
      if (base) out.push(`${single[1]}./assets/${base}`); // drop line if file missing
    } else if (inlineArr) {
      const items = inlineArr[2].split(',').map((s) => s.trim()).filter(Boolean);
      const rewritten = items
        .map((it) => {
          if (/^https?:/.test(it.replace(/['"]/g, ''))) return it;
          const base = copyAsset(toBlogRel(it), assetsDir, copied);
          return base ? `'./assets/${base}'` : null;
        })
        .filter(Boolean);
      if (rewritten.length) out.push(`${inlineArr[1]}[${rewritten.join(', ')}]`); // drop key if empty
    } else if (imagesKey) {
      inImagesBlock = true;
      out.push(line);
    } else if (listItem) {
      const val = listItem[2].trim();
      if (!IMG_EXT.test(val.replace(/['"]/g, '')) || /^https?:/.test(val.replace(/['"]/g, ''))) { out.push(line); inImagesBlock = false; continue; }
      const base = copyAsset(toBlogRel(val), assetsDir, copied);
      if (base) out.push(`${listItem[1]}'./assets/${base}'`); // drop item if file missing
    } else {
      if (!/^\s/.test(line)) inImagesBlock = false; // dedent ends the block
      out.push(line);
    }
  }
  return out.join('\n');
}

function rewriteBody(body, assetsDir, copied) {
  const imports = [];
  let gi = 0;

  // 1) <Gallery slides={[ ... ]} />  -> import the island (hydrated) + each src as an
  //    optimized image import referenced via <var>.src
  let usesGallery = false;
  body = body.replace(/<Gallery\b[\s\S]*?\/>/g, (block) => {
    usesGallery = true;
    return block
      .replace(/^<Gallery\b/, '<Gallery client:visible')
      .replace(/src:\s*(["'])([^"']+)\1/g, (full, _q, src) => {
        if (!src.includes('/static/images/blog/') && !src.startsWith('./')) return full;
        const base = copyAsset(toBlogRel(src), assetsDir, copied);
        if (!base) return 'src: ""'; // missing file: empty slide src, no broken import
        const v = `gal${gi++}`;
        imports.push(`import ${v} from './assets/${base}';`);
        return `src: ${v}.src`;
      });
  });
  if (usesGallery) imports.unshift("import Gallery from '@/components/Gallery';");

  // 2) standard markdown images that point at the old static tree
  body = body.replace(/(!\[[^\]]*\]\()(\/static\/images\/blog\/[^)\s]+)(\))/g, (_m, pre, url, post) => {
    const base = copyAsset(toBlogRel(url), assetsDir, copied);
    return base ? `${pre}./assets/${base}${post}` : ''; // drop image if file missing
  });

  // 3) Obsidian ![[...]] — copy the file. Raster embeds stay literal (remark-obsidian
  //    resolves them at build); SVGs become `?url` imports + <img>, since Astro's image
  //    optimizer can't read metadata from styled SVGs.
  body = body.replace(/!\[\[([^\]]+)\]\]/g, (full, inner) => {
    const target = inner.split('|')[0].trim();
    const base = copyAsset(toBlogRel(target), assetsDir, copied);
    if (!base) return ''; // missing file: drop the embed
    if (/\.svg$/i.test(base)) {
      const v = `svg${gi++}`;
      imports.push(`import ${v} from './assets/${base}?url';`);
      return `<img src={${v}} alt="${base.replace(/\.[^.]+$/, '')}" />`;
    }
    return full;
  });

  return { body, imports };
}

function migratePostFile(srcPath, slug, lang) {
  const raw = fs.readFileSync(srcPath, 'utf8');
  const { fm, body } = splitFrontmatter(raw);
  const postDir = path.join(OUT_BLOG, slug);
  const assetsDir = path.join(postDir, 'assets');
  const copied = new Map();

  const newFm = rewriteFrontmatter(fm, assetsDir, copied);
  const { body: newBody, imports } = rewriteBody(body, assetsDir, copied);

  fs.mkdirSync(postDir, { recursive: true });
  const importBlock = imports.length ? imports.join('\n') + '\n\n' : '';
  const out = `---\n${newFm}\n---\n\n${importBlock}${newBody.replace(/^\s+/, '')}`;
  fs.writeFileSync(path.join(postDir, `${lang}.mdx`), out, 'utf8');
  return [...copied.values()].filter((v) => v === false).length;
}

// Return the array of opening-fence info strings (languages) in document order,
// plus the line index of each opening fence.
function codeFences(lines) {
  const fences = [];
  let inCode = false;
  lines.forEach((line, i) => {
    const m = line.match(/^(\s*)(`{3,})(.*)$/);
    if (!m) return;
    if (!inCode) {
      inCode = true;
      fences.push({ i, lang: m[3].trim() });
    } else {
      inCode = false; // closing fence
    }
  });
  return fences;
}

// DE/EN posts are translations sharing identical code blocks, but one language often
// forgot the ```lang annotation. When the block counts match, copy any missing language
// tag from the sibling so Shiki highlights both.
function syncCodeFences(slug) {
  const dePath = path.join(OUT_BLOG, slug, 'de.mdx');
  const enPath = path.join(OUT_BLOG, slug, 'en.mdx');
  if (!fs.existsSync(dePath) || !fs.existsSync(enPath)) return;
  const de = fs.readFileSync(dePath, 'utf8').split(/\r?\n/);
  const en = fs.readFileSync(enPath, 'utf8').split(/\r?\n/);
  const df = codeFences(de);
  const ef = codeFences(en);
  if (df.length === 0 || df.length !== ef.length) return;

  let changed = false;
  for (let i = 0; i < df.length; i++) {
    if (!df[i].lang && ef[i].lang) {
      de[df[i].i] = de[df[i].i].replace(/`{3,}\s*$/, (m) => `${m}${ef[i].lang}`);
      changed = true;
    } else if (!ef[i].lang && df[i].lang) {
      en[ef[i].i] = en[ef[i].i].replace(/`{3,}\s*$/, (m) => `${m}${df[i].lang}`);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(dePath, de.join('\n'), 'utf8');
    fs.writeFileSync(enPath, en.join('\n'), 'utf8');
  }
}

function listPosts(lang) {
  const base = path.join(OLD, 'data/blog', lang);
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.mdx')) files.push(p);
    }
  };
  walk(base);
  return files;
}

// --- run -------------------------------------------------------------------
fs.rmSync(OUT_BLOG, { recursive: true, force: true });

// Build slug map from filename (de & en share the same base name -> same slug)
const slugMap = new Map(); // basename(no ext) -> slug
const nameOf = (f) => path.basename(f, '.mdx');
for (const f of listPosts('de')) {
  const n = nameOf(f);
  if (!slugMap.has(n)) slugMap.set(n, slugger.slug(n));
}
for (const f of listPosts('en')) {
  const n = nameOf(f);
  if (!slugMap.has(n)) slugMap.set(n, slugger.slug(n));
}

let posts = 0, missing = 0;
for (const lang of ['de', 'en']) {
  for (const f of listPosts(lang)) {
    const slug = slugMap.get(nameOf(f));
    console.log(`${lang}  ${nameOf(f)}  ->  ${slug}/${lang}.mdx`);
    missing += migratePostFile(f, slug, lang);
    posts++;
  }
}

// Authors
const authorsOut = path.join(NEW, 'src/content/authors');
const authorAssets = path.join(authorsOut, 'assets');
fs.rmSync(authorsOut, { recursive: true, force: true });
fs.mkdirSync(authorAssets, { recursive: true });
for (const lang of ['de', 'en']) {
  const src = path.join(OLD, 'data/authors', lang, 'MajorTwip.mdx');
  if (!fs.existsSync(src)) continue;
  let raw = fs.readFileSync(src, 'utf8');
  // copy avatar
  const av = raw.match(/^avatar:\s*(.+)$/m);
  if (av) {
    const file = decodeURIComponent(av[1].trim()).split('/').pop();
    const aSrc = path.join(OLD, 'public/static/images/author', file);
    if (fs.existsSync(aSrc)) fs.copyFileSync(aSrc, path.join(authorAssets, file));
    raw = raw.replace(/^avatar:\s*.+$/m, `avatar: ./assets/${file}`);
  }
  fs.writeFileSync(path.join(authorsOut, `MajorTwip.${lang}.mdx`), raw, 'utf8');
}

// Sync code-fence languages between each post's DE/EN versions
for (const slug of new Set(slugMap.values())) syncCodeFences(slug);

console.log(`\nDone: ${posts} post files, ${slugMap.size} slugs, ${missing} missing images.`);
