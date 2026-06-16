---
title: { de: "Diese Website", en: "This website" }
order: 3
goal:
  de: "Eine schnelle, wartbare, eigene Wissens-Plattform."
  en: "A fast, maintainable, self-owned knowledge platform."
nodes:
  - id: proxy
    title: { de: "Reverse Proxy + TLS", en: "Reverse proxy + TLS" }
    requires: []
    post: wordpress-hinter-microsoft-web-app-proxy-mit-tls-https
  - id: obsidian
    title: { de: "Schreiben in Obsidian", en: "Writing in Obsidian" }
    requires: []
    post: write-with-obsidian
  - id: astro
    title: { de: "Rebuild mit Astro", en: "Rebuild on Astro" }
    requires: [obsidian, proxy]
    post: neue-website-mit-claude-code
  - id: skilltree
    title: { de: "Skilltree-Feature", en: "Skill-tree feature" }
    desc: { de: "Ziel", en: "Goal" }
    requires: [astro]
---

Wie aus einem WordPress-Blog diese statische Astro-Seite wurde.
