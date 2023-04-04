# GitHub Actions

Build and deploy automation to be configured.

- [x] Website
- [ ] Build & Test
  - [x] Build specs
    - [x] Extract code blocks from specs to dist folder (code-blocks)
    - [x] Validate json files for errors
    - [x] Copy specs folders to dist folder
    - [x] Create a cheatsheet json that uses every feature, put it in dist
      folder
    - [ ] Spellcheck
  - [ ] Build node impl
    - [x] Remove json objects from test cases and use json files from specs
    - [x] Add coverage
    - [x] Add linter
    - [x] Include examples in tests
    - [ ] JS Doc into website
      - [ ] customize style (https://github.com/Nijikokun/minami or
        https://github.com/clenemt/docdash)
      - [ ] embed to website menu
      - [ ] build within deploy to website job
      - [ ] fix `import` errors
      - [x] exclude private functions
      - [ ] revise docs, enrich examples and descriptions
    - [ ] Design `jc` package usage
      - [ ] Move `validate.js` into `jc` and provide a cli
      - [ ] provide shortcuts for quick load and validate
      - [ ] add jsdoc to new api
  - [ ] Build website
    - [ ] separate website from specs
      - [ ] create a website folder
      - [ ] put everything specific to website into that folder e.g. .vuepress,
        README.md, package.json, usecase etc.
      - [ ] copy specs to website upon building
      - [ ] move proposals and roadmap to something like project management or
        issues or whatever, copy them as well to website upon building
      - [ ] separate package.json for specs and website
      - [ ] create a readme.md file for repository including badges etc, move
        existing readme to the website
        - [ ] badges: standard, coveralls, ...
    - [ ] website spellcheck
    - [ ] website broken link
    - [ ] website style fix (occured after an update)
  - [ ] Trigger build on pull requests
    - [ ] Make each build a github check (spec, impl/nodejs, website)
    - [ ] Build specs
    - [ ] Test node impl
    - [ ] Build website
- [ ] Release
  - [ ] Specs GitHub Release (website content)
  - [ ] NPM & GitHub Packages (nodejs impl)
