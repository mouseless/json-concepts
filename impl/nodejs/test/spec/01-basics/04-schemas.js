const { Schema } = require('../../../index');
const ERR = require('../../../src/err');
const fs = require('mock-fs');
const nock = require('nock');
const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);
should();

describe('basics', function () {
    describe('schemas', function () {
        after(function () {
            fs.restore();
        });

        describe('default case', function () {
            it('should validate', async function () {
                fs({
                    'service.concepts.json': JSON.stringify({
                        "$service": {
                            "$parameter": "$type",
                            "response": "$responseType"
                        }
                    }),
                    'greeting.service.json': JSON.stringify({
                        "sayHello": {
                            "name": "string",
                            "response": "string"
                        }
                    })
                });

                const actual = await Schema.load('greeting.service.json', 'service.concepts.json');

                actual.should.be.an.instanceof(Schema);
            });
            it('should not validate if it does not conform to its concepts', async function () {
                fs({
                    'service.concepts.json': JSON.stringify({
                        "$service": {
                            "$parameter": "$type",
                            "response": "$responseType"
                        }
                    }),
                    'greeting.service.json': JSON.stringify({
                        "sayHello": {
                            "name": "string",
                        }
                    })
                });

                await Schema.load('greeting.service.json', 'service.concepts.json')
                    .should.be.rejectedWith(ERR.SCHEMA_is_not_valid('greeting.service.json').message)
            });
        });
        describe('self-validating schema', function () {
            it('should validate', async function () {
                fs({
                    'service.concepts.json': JSON.stringify({
                        "$service": {
                            "$parameter": "$type",
                            "response": "$responseType"
                        }
                    }),
                    'greeting.service.json': JSON.stringify({
                        "@concepts": "service.concepts.json",
                        "sayHello": {
                            "name": "string",
                            "response": "string"
                        }
                    })
                });

                const actual = await Schema.load('greeting.service.json');

                actual.should.be.an.instanceof(Schema);
            });
            it('should not load if schema is not self-validating', async function () {
                fs({
                    'greeting.service.json': JSON.stringify({
                        "sayHello": {
                            "name": "string",
                            "response": "string"
                        }
                    })
                });

                await Schema.load('greeting.service.json')
                    .should.be.rejectedWith(ERR.Concepts_required_to_load_SCHEMA('greeting.service.json').message);
            });
        });
        describe('referring-to-a-remote-concepts-file', function () {
            it('should validate', async function () {
                nock("http://test.com")
                    .get("/service.concepts.json")
                    .reply(200, {
                        "$service": {
                            "$parameter": "$type",
                            "response": "$responseType"
                        }
                    });
                fs({
                    'greeting.service.json': JSON.stringify({
                        "@concepts": "http://test.com/service.concepts.json",
                        "sayHello": {
                            "name": "string",
                            "response": "string"
                        }
                    })
                });

                const actual = await Schema.load('greeting.service.json');

                actual.should.be.an.instanceof(Schema);
            });
        });
    });
});
