const { build, readJson } = require('./gazel-build');

const businesslogic = { name: 'business' };
const server = build({ concepts: 'server' });
const client = build({ concepts: 'client' });
const js = { name: 'js' };

const app = {};

app.businesslogic = { meta: businesslogic, schemaView: readJson('./layers/business/src/app.json') };
app.server = build({ schema: { source: app.businesslogic, target: server, name: 'app' } });
app.client = build({ schema: { source: app.server, target: client, name: 'app' } });
app.client.js = build({ code: { source: app.client, target: js, name: 'app' } });

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
// - remove views, transform directly to schema (todoServer, todoClient)
// parent support in transformation views for further transformation possibilities
// support /# in meta schema -> json merger
// array support in transformation
// todo.reflection.json from gazel sample code
// ui sample project
