const build = require('../../../../buildrjs/src/buildr');

const concepts = {
    api: build.concepts({ ref: "api" }),
    client: build.concepts({ name: 'client' })
};

const twitr = {};
twitr.api = build.schema({ name: "twitr", concept: concepts.api });
twitr.client = build.schema({ name: "twitr", concept: concepts.client, from: twitr.api });

build.code({ file: "./../src/Services.js", template: "client.js", schema: twitr.client });
build.code({ file: "./../src/App.js", template: "App.js", schema: twitr.client });
