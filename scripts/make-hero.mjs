// Generates the hero image for the "built with Claude Code" post.
// Renders an on-brand SVG to PNG (raster works with Astro's image() pipeline; styled SVGs don't).
// Palette: https://coolors.co/0b0033-370031-832232-ffdde2-eff9f0
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('src/content/blog/neue-website-mit-claude-code/assets/hero.png');
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const W = 1200, H = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0033"/>
      <stop offset="1" stop-color="#2a0a2e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffdde2"/>
      <stop offset="1" stop-color="#f0a8b5"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1c0c2e"/>
      <stop offset="1" stop-color="#120620"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- soft glows -->
  <circle cx="980" cy="150" r="240" fill="#832232" opacity="0.22"/>
  <circle cx="200" cy="560" r="200" fill="#ffdde2" opacity="0.07"/>

  <!-- sparkle (Claude motif) -->
  <g fill="url(#accent)" transform="translate(905,86)">
    <path d="M30 0 L37 23 L60 30 L37 37 L30 60 L23 37 L0 30 L23 23 Z"/>
  </g>

  <!-- terminal card -->
  <g>
    <rect x="70" y="150" width="660" height="360" rx="18" fill="url(#card)" stroke="#3a234a" stroke-width="1.5"/>
    <!-- title bar -->
    <circle cx="104" cy="186" r="7" fill="#ff5f56"/>
    <circle cx="128" cy="186" r="7" fill="#ffbd2e"/>
    <circle cx="152" cy="186" r="7" fill="#27c93f"/>
    <text x="184" y="191" font-family="monospace" font-size="17" fill="#b89aa8">comstock.ch — claude code</text>
    <line x1="70" y1="210" x2="730" y2="210" stroke="#3a234a" stroke-width="1.5"/>

    <!-- lines -->
    <text font-family="monospace" font-size="20" x="100" y="258">
      <tspan fill="#27c93f">$</tspan><tspan fill="#eff9f0"> npm create astro@latest</tspan>
    </text>
    <text font-family="monospace" font-size="19" x="100" y="296" fill="#b89aa8">› migrating 31 posts × 2 languages…</text>
    <text font-family="monospace" font-size="19" x="100" y="330" fill="#f0a8b5">› de.mdx · en.mdx · assets/  <tspan fill="#27c93f">✓</tspan></text>
    <text font-family="monospace" font-size="19" x="100" y="364" fill="#f0a8b5">› pagefind · dark mode · i18n  <tspan fill="#27c93f">✓</tspan></text>
    <text font-family="monospace" font-size="19" x="100" y="398" fill="#f0a8b5">› 80 images → webp  <tspan fill="#27c93f">✓</tspan></text>
    <text font-family="monospace" font-size="20" x="100" y="440">
      <tspan fill="#27c93f">✓</tspan><tspan fill="#eff9f0"> 73 pages built </tspan><tspan fill="#a07e8e">in 5.8s</tspan>
    </text>
  </g>

  <!-- right panel -->
  <g transform="translate(778,210)">
    <text font-family="sans-serif" font-size="22" fill="#c9aab5">Kosten / cost</text>
    <text font-family="sans-serif" font-weight="800" font-size="100" fill="url(#accent)" y="118">≈ Fr. 30</text>
    <text font-family="sans-serif" font-size="24" fill="#d9c2cb" y="158">in Tokens</text>

    <g font-family="sans-serif" font-size="20" fill="#ead9df">
      <rect x="0" y="196" width="330" height="44" rx="10" fill="#1e0c2b" stroke="#3a234a"/>
      <text x="20" y="224">Next.js  →  Astro (SSG)</text>
      <rect x="0" y="252" width="158" height="44" rx="10" fill="#1e0c2b" stroke="#3a234a"/>
      <text x="20" y="280">DE / EN</text>
      <rect x="172" y="252" width="158" height="44" rx="10" fill="#1e0c2b" stroke="#3a234a"/>
      <text x="192" y="280">Markdown</text>
    </g>
  </g>

  <!-- wordmark -->
  <text x="70" y="560" font-family="sans-serif" font-weight="700" font-size="24" fill="#eff9f0">COMSTOCK <tspan fill="#f0a8b5">Projects</tspan></text>
</svg>`;

await sharp(Buffer.from(svg), { density: 192 }).resize(W, H).png().toFile(OUT);
console.log('Wrote', OUT);
