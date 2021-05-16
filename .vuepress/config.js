const { description } = require('../package');
const { create, Levels } = require('./auto-config');

const config = create({
  "use-cases": Levels.ONE,
  "specs": Levels.TWO,
  "roadmap": Levels.ONE
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
  patterns: config.patterns,
  themeConfig: {
    repo: 'https://github.com/codingatwill/json-concepts',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: config.nav,
    sidebar: config.sidebar
  },
  plugins: []
};
