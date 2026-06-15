export const languages = { de: 'Deutsch', en: 'English' } as const;
export const defaultLang = 'de';
export type Lang = keyof typeof languages;

export const ui = {
  de: {
    'nav.home': 'Startseite',
    'nav.blog': 'Blog',
    'nav.about': 'Impressum',
    'nav.search': 'Suche',
    'theme.toggle': 'Farbschema wechseln',
    'lang.label': 'Sprache',
    'search.placeholder': 'Beiträge suchen',
    'search.noresults': 'Keine Ergebnisse für die Suche…',
    'search.title': 'Suche',
    'post.readingTime': 'Min. Lesezeit',
    'post.publishedOn': 'Veröffentlicht am',
    'post.updatedOn': 'Aktualisiert am',
    'post.by': 'von',
    'post.toc': 'Auf dieser Seite',
    'post.series': 'Serie',
    'post.draft': 'Entwurf',
    'post.allPosts': 'Alle Beiträge',
    'post.notInLang': 'Dieser Beitrag ist auf Deutsch nicht verfügbar.',
    'home.latest': 'Neuste Beiträge',
    'home.tagline': 'Persönliches Blog – eine Art Wissensspeicher.',
    'footer.rights': 'Alle Rechte vorbehalten.',
  },
  en: {
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.search': 'Search',
    'theme.toggle': 'Toggle color scheme',
    'lang.label': 'Language',
    'search.placeholder': 'Search posts',
    'search.noresults': 'No results for your search…',
    'search.title': 'Search',
    'post.readingTime': 'min read',
    'post.publishedOn': 'Published on',
    'post.updatedOn': 'Updated on',
    'post.by': 'by',
    'post.toc': 'On this page',
    'post.series': 'Series',
    'post.draft': 'Draft',
    'post.allPosts': 'All posts',
    'post.notInLang': 'This post is not available in English.',
    'home.latest': 'Latest posts',
    'home.tagline': 'Personal blog — some kind of knowledge store.',
    'footer.rights': 'All rights reserved.',
  },
} as const;

export type UIKey = keyof (typeof ui)['de'];
