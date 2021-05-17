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

  const sidebarConcepts = await jc.Concepts.load('./.vuepress/sidebar.concepts.json');

  process.exit(1);

  const transformation = await jc.Transformation.load('./.vuepress/sidebar.from.fs.json', fsConcepts, sidebarConcepts);
}

load();

const shadow = {
    "entry":
        [
            { "_": "LICENSE", "type": "file", "entry": [] },
            { "_": "README.md", "type": "file", "entry": [] },
            {
                "_": "examples", "type": "directory", "entry": [
                    {
                        "_": "openapi", "type": "directory", "entry": [
                            { "_": "openapi.concepts.json", "type": "file", "entry": [] },
                            { "_": "pets.openapi.json", "type": "file", "entry": [] },
                            { "_": "petstore-expanded.openapi.json", "type": "file", "entry": [] }
                        ]
                    },
                    { "_": "package-lock.json", "type": "file", "entry": [] },
                    { "_": "package.json", "type": "file", "entry": [] },
                    { "_": "validate.js", "type": "file", "entry": [] }
                ]
            },
            { "_": "package-lock.json", "type": "file", "entry": [] },
            { "_": "package.json", "type": "file", "entry": [] },
            {
                "_": "specification", "type": "directory", "entry": [
                    {
                        "_": "01-basics", "type": "directory", "entry": [
                            { "_": "01-literals.md", "type": "file", "entry": [] },
                            { "_": "02-variables.md", "type": "file", "entry": [] },
                            { "_": "03-concepts.md", "type": "file", "entry": [] },
                            { "_": "04-schemas.md", "type": "file", "entry": [] },
                            { "_": "05-shadows.md", "type": "file", "entry": [] },
                            { "_": "06-transformations.md", "type": "file", "entry": [] }
                        ]
                    }, {
                        "_": "02-quantifiers", "type": "directory", "entry": [
                            { "_": "01-exactly-one.md", "type": "file", "entry": [] },
                            { "_": "02-zero-or-one.md", "type": "file", "entry": [] },
                            { "_": "03-one-or-more.md", "type": "file", "entry": [] },
                            { "_": "04-zero-or-more.md", "type": "file", "entry": [] },
                            { "_": "05-custom.md", "type": "file", "entry": [] }]
                    },
                    {
                        "_": "03-variables", "type": "directory", "entry": [
                            { "_": "01-non-string-variables.md", "type": "file", "entry": [] },
                            { "_": "02-variable-types.md", "type": "file", "entry": [] },
                            { "_": "03-multiple-reference-to-a-variable.md", "type": "file", "entry": [] }
                        ]
                    }, {
                        "_": "04-custom-types", "type": "directory", "entry": [
                            { "_": "01-defining-a-custom-type.md", "type": "file", "entry": [] },
                            { "_": "02-regex-validator.md", "type": "file", "entry": [] },
                            { "_": "03-enum-validator.md", "type": "file", "entry": [] },
                            { "_": "04-min-and-max-validators.md", "type": "file", "entry": [] },
                            { "_": "05-inheritance.md", "type": "file", "entry": [] },
                            { "_": "06-validating-concept-name.md", "type": "file", "entry": [] }
                        ]
                    }, {
                        "_": "05-arrays", "type": "directory", "entry": [
                            { "_": "01-declaring-an-array.md", "type": "file", "entry": [] },
                            { "_": "02-array-item-type.md", "type": "file", "entry": [] },
                            { "_": "03-object-arrays.md", "type": "file", "entry": [] }
                        ]
                    }, {
                        "_": "06-literals", "type": "directory", "entry": [
                            { "_": "01-concepts-under-a-literal.md", "type": "file", "entry": [] },
                            { "_": "02-literals-at-the-root.md", "type": "file", "entry": [] },
                            { "_": "03-multi-literals.md", "type": "file", "entry": [] },
                            { "_": "04-nested-literals.md", "type": "file", "entry": [] },
                            { "_": "05-nested-object-arrays.md", "type": "file", "entry": [] },
                            { "_": "06-only-literals.md", "type": "file", "entry": [] },
                            { "_": "07-escaping-special-characters.md", "type": "file", "entry": [] }
                        ]
                    }, {
                        "_": "07-concepts", "type": "directory", "entry": [
                            { "_": "01-inline-concepts.md", "type": "file", "entry": [] },
                            { "_": "02-multi-concepts.md", "type": "file", "entry": [] },
                            { "_": "03-explicit-concepts.md", "type": "file", "entry": [] }]
                    }, {
                        "_": "08-references", "type": "directory", "entry": [
                            { "_": "01-defining-a-reference.md", "type": "file", "entry": [] },
                            { "_": "02-merging-references.md", "type": "file", "entry": [] },
                            { "_": "03-nested-references.md", "type": "file", "entry": [] },
                            { "_": "04-include.md", "type": "file", "entry": [] },
                            { "_": "05-injections.md", "type": "file", "entry": [] }
                        ]
                    }, { "_": "README.md", "type": "file", "entry": [] },
                    {
                        "_": "XX-openapi-challenge", "type": "directory", "entry": [
                            { "_": "XX-extending-builtin-types.md", "type": "file", "entry": [] },
                            { "_": "XX-list-validator.md", "type": "file", "entry": [] },
                            { "_": "XX-literal-type.md", "type": "file", "entry": [] },
                            { "_": "XX-merging-reference-with-existing.md", "type": "file", "entry": [] },
                            { "_": "XX-multiple-includes.md", "type": "file", "entry": [] },
                            { "_": "XX-multiple-variable-types.md", "type": "file", "entry": [] },
                            { "_": "XX-variable-default-value.md", "type": "file", "entry": [] },
                            { "_": "XX-when-validator.md", "type": "file", "entry": [] }
                        ]
                    }, {
                        "_": "XX-options", "type": "directory", "entry": [
                            { "_": "XX-default-type.md", "type": "file", "entry": [] },
                            { "_": "XX-filters.md", "type": "file", "entry": [] },
                            { "_": "XX-key.md", "type": "file", "entry": [] },
                            { "_": "XX-overriding-options.md", "type": "file", "entry": [] },
                            { "_": "XX-validators.md", "type": "file", "entry": [] }
                        ]
                    }, {
                        "_": "XX-shadows", "type": "directory", "entry": [
                            { "_": "XX-concept-keys-in-shadows.md", "type": "file", "entry": [] },
                            { "_": "XX-enable-hash-in-shadows.md", "type": "file", "entry": [] },
                            { "_": "XX-move-all-shadows-here.md", "type": "file", "entry": [] }
                        ]
                    }, {
                        "_": "XX-transformation", "type": "directory", "entry": [
                            { "_": "XX-automatic-selection.md", "type": "file", "entry": [] },
                            { "_": "XX-concept-name-reference.md", "type": "file", "entry": [] },
                            { "_": "XX-custom-filters.md", "type": "file", "entry": [] },
                            { "_": "XX-filter-by-template-object.md", "type": "file", "entry": [] },
                            { "_": "XX-multiple-transformations.md", "type": "file", "entry": [] },
                            { "_": "XX-referring-concepts-within-file.md", "type": "file", "entry": [] },
                            { "_": "XX-select-default-value.md", "type": "file", "entry": [] },
                            { "_": "XX-value-transformation.md", "type": "file", "entry": [] },
                            { "_": "XX-wildcard-for-target-concept-path.md", "type": "file", "entry": [] }
                        ]
                    }
                ]
            },
            {
                "_": "use-cases", "type": "directory", "entry": [
                    { "_": "01-configuration-files.md", "type": "file", "entry": [] },
                    { "_": "02-client-code-generation.md", "type": "file", "entry": [] },
                    { "_": "README.md", "type": "file", "entry": [] },
                    { "_": "XX-render-text-using-a-template-with-any-json.md", "type": "file", "entry": [] },
                    { "_": "XX-transform-two-schemas-into-one.md", "type": "file", "entry": [] }
                ]
            }
        ]
};

const transformation = {
    "sidebar": {
        "from": "entry",
        "where": {
            "type": "directory"
        },
        "select": {
            "_": "_ | format '/%/'",
            "title": "_ | camelCase | capitalize",
            "collapsable": false
        }
    },
    "children": [
        {
            "from": "entry",
            "where": {
                "type": "file"
            },
            "select": "_ | format '/%/'"
        },
        {
            "from": "entry",
            "where": {
                "type": "directory"
            },
            "select": {
                "_": "_ | format '/%/'",
                "title": "_ | camelCase | capitalize",
                "collapsable": false
            }
        }
    ],
    "@source": "fs.concepts.json",
    "@target": "sidebar.concepts.json"
};