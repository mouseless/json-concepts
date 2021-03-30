const build = require('../../../../gazel-build');

const concepts = {
    api: build.concepts({ ref: "api" }),
    client: build.concepts({ name: 'client' })
};

const twitr = {};
twitr.api = build.schema({ name: "twitr", concept: concepts.api });
twitr.client = build.schema({ name: "twitr", concept: concepts.client, from: twitr.api });
twitr.services = build.code({ file: "./../src/client/services.js", template: "client.js", schema: twitr.client });
twitr.services = build.code({ file: "./../src/App.js", template: "App.js", schema: twitr.client });
