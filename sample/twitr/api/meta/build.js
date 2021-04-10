const build = require('../../../../buildrjs/src/buildr');

const concepts = {
    business: build.concepts({ ref: 'business' }),
    api: build.concepts({ name: 'api' })
}

const twitr = {};
twitr.business = build.schema({ name: 'twitr', concept: concepts.business });
twitr.api = build.schema({ name: 'twitr', concept: concepts.api, from: twitr.business });
