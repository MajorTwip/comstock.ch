/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'COMSTOCK Logs',
  author: 'MajorTwip',
  headerTitle: 'COMSTOCK Projects',
  description: 'Personal Blog, some kind of Knowledge-Store',
  language: 'de-ch',
  theme: 'dark', // system, dark or light
  siteUrl: 'https://majortwip.github.io/',
  siteRepo: 'https://github.com/MajorTwip/majortwip.github.io',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  mastodon: '',
  email: 'majortwip@comstock.ch',
  github: 'https://github.com/MajorTwip',
  x: 'https://twitter.com/MajorTwip',
  // facebook: '',
  youtube: 'https://www.youtube.com/@majortwip',
  linkedin: '',
  threads: 'https://www.threads.com/@comstockprojects',
  instagram: 'https://www.instagram.com/comstockprojects/',
  locale: 'en',
  multiauthors: true,

  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: 'search.json', // path to load documents to search
    },
  }
}

module.exports = siteMetadata
