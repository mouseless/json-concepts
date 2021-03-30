const { build, readJson } = require('./gazel-build');

const business = { name: 'business' };
const server = build({ concepts: 'server' });
const client = build({ concepts: 'client' });
const js = { name: 'js' };
const testJs = { name: 'test.js' };

const app = {};

app.business = { meta: business, schemaView: readJson('./layers/business/src/app.json') };
app.server = build({ schema: { source: app.business, target: server, name: 'app' } });
app.client = build({ schema: { source: app.server, target: client, name: 'app' } });
app.client.js = build({ code: { schema: app.client, template: js, name: 'app' } });
app.client.testJs = build({ code: { schema: app.client, template: testJs, name: 'test' } });

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
