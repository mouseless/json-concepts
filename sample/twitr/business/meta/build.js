const build = require('../../../../buildrjs/src/buildr');

const concepts = {
    business: build.concepts({ name: 'business' }),
    grpc: build.concepts({ name: 'grpc' })
}

const twitr = {};
twitr.business = build.schema({ name: 'twitr', concept: concepts.business });
twitr.grpc = build.schema({ name: 'twitr-grpc', concept: concepts.grpc, from: twitr.business });

build.code({ file: './../src/Twitr.Grpc/Protos/twitr.proto', template: 'proto', schema: twitr.grpc });
