const { Schema, Concepts } = require('../../../index');
const { error } = require('../../../src/util');
const fs = require('mock-fs');
const nock = require('nock');
const { use, should } = require('chai');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);
should();

describe('spec/basics/schemas', function () {
    after(function () {
        fs.restore();
    });

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

        const schema1 = await (await Concepts.load('service.concepts.json')).load('greeting.service.json');
        schema1.should.be.an.instanceof(Schema);

        const schema2 = await Schema.load('greeting.service.json', 'service.concepts.json');
        schema2.should.be.an.instanceof(Schema);
    });

    it('should give error when path is not supplied to load methods', async function () {
        await Concepts.load()
            .should.be.rejectedWith(error.PARAMETER_is_required('path').message);

        const concepts = await Concepts.load('service.concepts.json');

        await concepts.load()
            .should.be.rejectedWith(error.PARAMETER_is_required('path').message);
            
        await Schema.load()
            .should.be.rejectedWith(error.PARAMETER_is_required('path').message);
    });

    it('should give error when definition or concepts is not supplied to constructor', function () {
        (() => new Schema())
            .should.throw(error.PARAMETER_is_required('definition').message);
        (() => new Schema({}))
            .should.throw(error.PARAMETER_is_required('concepts').message);
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
            .should.be.rejectedWith(error.SCHEMA_is_not_valid('greeting.service.json').message)
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
                .should.be.rejectedWith(error.Concepts_required_to_load_SCHEMA('greeting.service.json').message);
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
