const { description } = require('../package');
const { create, Levels } = require('./auto-config');

const config = create({
  "use-cases": Levels.ONE,
  "specs": Levels.TWO,
  "roadmap": Levels.ONE,
  "proposals": Levels.ONE
});

module.exports = {
  title: 'json concepts',
  description: description,
  base: '/json-concepts/',
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  pagePatterns: config.pagePatterns,
  themeConfig: {
    repo: 'https://github.com/codingatwill/json-concepts',
    repoLabel: 'GitHub',
    docsRepo: 'https://github.com/codingatwill/json-concepts',
    docsBranch: 'main',
    docsDir: '',
    editLink: false,
    lastUpdated: false,
    contributors: false,
    navbar: config.navbar,
    sidebar: config.sidebar,
    sidebarDepth: 1
  },
  plugins: [
    [
      '@vuepress/plugin-search',
      {
        locales: { '/': { placeholder: 'Search' } },
        isSearchable: (page) => page.path !== '/'
      }
    ]
  ]
};
