const build = require('../../../../buildrjs/src/buildr');

const concepts = {
    business: build.concepts({ name: 'business' }),
    grpc: build.concepts({ name: 'grpc' })
}

const twitr = {};
// twitr.business = build.schema({ name: 'twitr', concept: concepts.business });
