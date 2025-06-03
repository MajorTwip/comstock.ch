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
  multiauthors: false,
  analytics: { },
  newsletter: {
    // provider: 'buttondown',
  },
  iscomments: false,
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
      // This corresponds to the `data-lang="en"` in giscus's configurations
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: 'search.json', // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
  // formspree support :
  //if set to false, simple "mailto"
  // if set to true, get a free account there : https://formspree.io/ and go to read.me doc
  formspree: true,
  // waline support
  iswaline: false,
  walineServer: '',
}

module.exports = siteMetadata
