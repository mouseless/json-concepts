const { Schema, Concepts } = require('../../../index');
const { should } = require('chai');

should();

describe('spec/basics/shadows', function () {
    it('should cast shadow', async function () {
        const concepts = await Concepts.load({
            "$service": {
                "$parameter": "$type",
                "response": "$responseType"
            }
        });

        concepts.shadow.should.deep.equal({
            concept: {
                _: "service",
                literal: {
                    _: "response",
                    variable: {
                        _: "responseType"
                    }
                },
                concept: {
                    _: "parameter",
                    variable: {
                        "_": "type"
                    }
                }
            }
        })
    });

    describe('shadow schema', function () {
        it('should cast shadow', async function () {
            const schema = await Schema.load({
                "@concepts": {
                    "$service": {
                        "$parameter": "$type",
                        "response": "$responseType"
                    }
                },
                "sayHello": {
                    "name": "string",
                    "response": "string"
                }
            });

            schema.shadow.should.deep.equal({
                service: {
                    _: "sayHello",
                    parameter: {
                        _: "name",
                        type: "string"
                    },
                    responseType: "string"
                }
            });
        });
    });
});
