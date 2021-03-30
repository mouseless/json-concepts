// --- in progress ---
// folder refactoring
// - doesn't seem clean or readable...
// - each layer may expose its own build logic
//  - `build('todo', ["businesslogic", "server", "client"]);`
// - remove all magic, to make it readable
// - directory structure config should be explicit

// --- todo ---
// in transformation files replace $path with $select
// migrate from mustache to handlebars
// template language to support in target file type
// - js: loops comments /* #each domain */ */, variables underscore _name_
// - json: loops dollar sign "each$domain", etc
// - remove views, transform directly to schema (todoServer, todoClient)
// parent support in transformation views for further transformation possibilities
// support /# in meta schema -> json merger
// array support in transformation
// todo.reflection.json from gazel sample code
// ui sample project
