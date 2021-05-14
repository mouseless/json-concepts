const { description } = require('../package');
const fs = require('fs');
const capitalize = require('capitalize');

const specifications = fs.readdirSync('specification')
  .filter(item => /\d\d\-.*/.test(item))
  .map(item => {
    const children = fs.readdirSync(`specification/${item}`)
      .filter(child => /\d\d\-.*[.]md/.test(child))
      .map(child => `/specification/${item}/${child.substring(0, child.length - 3)}`);

    return {
      title: capitalize.words(item.substring(3).replace(/\-/g, ' ')),
      path: children[0],
      collapsable: true,
      children: children
    }
  });

const useCases = fs.readdirSync('use-cases')
  .filter(item => /\d\d\-.*[.]md/.test(item))
  .map(item => `/use-cases/${item}`);

module.exports = {
  title: 'json concepts',
  description: description,
  base: '/json-concepts/',
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  patterns: ['use-cases/**/*.md', 'specification/**/*.md', '*.md'],
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Use Cases',
        link: '/use-cases/'
      },
      {
        text: 'Specification',
        link: '/specification/',
      }
    ],
    sidebar: {
      '/use-cases/': [
        {
          title: 'Use Cases',
          collapsable: false,
          children: [
            '/use-cases/',
            ...useCases
          ]
        }
      ],
      '/specification/': [
        {
          title: 'Specification',
          collapsable: false,
          children: [
            '/specification/',
            ...specifications
          ]
        }
      ]
    }
  },
  plugins: []
};
