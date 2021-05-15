const { description } = require('../package');
const fs = require('fs');
const capitalize = require('capitalize');
const jc = require('../impl/nodejs');
const pj = require('prettyjson');

function files(root, filter) {
  const entries = fs
    .readdirSync(root, { withFileTypes: true })
    .filter(file => filter(file));

  if (entries.length == 0) {
    return {};
  }
  const result = {};
  for (const file of entries) {
    if (file.isDirectory()) {
      result[file.name] = {
        type: 'directory',
        children: files(`${root}/${file.name}`, filter)
      };
    } else {
      result[file.name] = {
        type: 'file'
      };
    }
  }

  return result;
}

async function load() {
  const fsConcepts = await jc.Concepts.load('./.vuepress/fs.concepts.json');
  const schema = fsConcepts.create(
    files('.', f => f.name != "node_modules" && /^[^.].*$/.test(f.name)),
    fsConcepts
  );

  console.log(pj.render(schema.shadow));

  const sidebarConcepts = await jc.Concepts.load('./.vuepress/sidebar.concepts.json');

  process.exit(1);

  const transformation = await jc.Transformation.load('./.vuepress/sidebar.from.fs.json', fsConcepts, sidebarConcepts);
}

load();

const specifications = fs.readdirSync('specification')
  .filter(item => /\d\d\-.*/.test(item))
  .map(item => {
    const children = fs.readdirSync(`specification/${item}`)
      .filter(child => /\d\d\-.*[.]md/.test(child))
      .map(child => `/specification/${item}/${child.substring(0, child.length - 3)}`);

    return {
      title: capitalize.words(item.substring(3).replace(/\-/g, ' ')),
      path: children[0],
      collapsable: false,
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
        '/use-cases/',
        ...useCases
      ],
      '/specification/': [
        '/specification/',
        ...specifications
      ]
    }
  },
  plugins: []
};
