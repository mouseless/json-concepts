# OPEN-SCHEMA

This is an experimental project to see if it is possible to create
an application with multiple tech stack, and still no duplication
of any concepts within a project.

## Tasks

- [ ] in transformation files replace $path with $select
- [ ] migrate from mustache to handlebars
- [ ] template language to support in target file type
  - [ ] js: loops using comments `/* #each domain */`, variables underscore `_name_`
  - [ ] json: loops dollar sign "`each$domain`", etc
- [ ] remove views, transform directly to schema (todoServer, todoClient)
- [ ] parent support in transformation views for further transformation possibilities
- [ ] support /# in meta schema -> json merger
- [ ] array support in transformation
- [ ] build.js
  - [ ] directory structure config should be explicit
  - [ ] builder pattern may be applied
- [ ] ui sample project
  - [ ] business (dotnet)
  - [ ] http:business (dotnet)
  - [ ] rest:http (go)
  - [ ] graphql:http (node)
  - [ ] feed:rest (react)
  - [ ] feed:graphql (vue)
  - [ ] board:graphql (angular)

_PS: Any previous task was lost before converting this file to an .md file._
