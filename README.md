# OPEN-SCHEMA

This is an experimental project to see if it is possible to create
an application with multiple tech stack, and still no duplication
of any concepts within a project.

## Tasks

- [x] in transformation files replace $path with $select
- [x] array support in transformation
- [ ] fix bug in buildr.js/after
- [ ] parent support in transformation views for further transformation possibilities
- [ ] make string functions extensible for further transformation possibilities
- [ ] migrate from mustache to handlebars
- [ ] template language to support in target file type
  - [ ] js: loops using comments `/* #each domain */`, variables underscore `_name_`
  - [ ] json: loops dollar sign `each$domain`, etc
- [ ] remove views, transform directly to schema (todoServer, todoClient)
- [ ] support /# in meta schema -> json merger
- [ ] build.js
  - [ ] directory structure config should be explicit
  - [ ] builder pattern may be applied
- [ ] ui sample project
  - [x] business (dotnet)
    - [ ] http:business (dotnet)
  - [ ] database (mongo)
    - [ ] business:database (dotnet)
  - [ ] rest:http (go)
  - [ ] graphql:http (node)
  - [ ] feed:rest (react)
  - [ ] feed:graphql (vue)
  - [ ] board:graphql (angular)

_PS: Any previous task was lost before converting this file to an .md file._
