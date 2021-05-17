const { Concepts, Schema } = require('../../..');
const { error } = require('../../../src/util');
const fs = require('mock-fs');
const { should } = require('chai');

should();

describe('spec/quantifiers/exactly-one', function () {
    after(function () {
        fs.restore();
    })

    it('should validate', function () {
        const concepts = new Concepts({
            "$service": {
                "$parameter": "$type"
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "name": "string"
            }
        })).should.not.throw();
    });

    it('should give error with file name', async function () {
        fs({
            'service.concepts.json': JSON.stringify({
                "$service": {
                    "$parameter": "$type"
                }
            }),
            'greeting.service.json': JSON.stringify({})
        });

        await Schema.load('greeting.service.json', 'service.concepts.json')
            .should.be.rejectedWith("'greeting.service.json'");
    });

    describe('missing a concept', function () {
        it('should give error', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type"
                }
            });

            (() => concepts.validate({
                "sayHello": {}
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.CONCEPT_is_missing('parameter')
                ).message
            );
        });
    });

    describe('missing more than one concept', function () {
        it('should give error', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type"
                }
            });

            (() => concepts.validate({})).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.CONCEPT_is_missing('service')
                ).message
            );
        });
    });

    describe('key literals', function () {
        it('should give error', function () {
            const concepts = new Concepts({
                "$service": {
                    "response": "$responseType"
                }
            });

            (() => concepts.validate({
                "sayHello": {}
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.LITERAL_is_missing('response')
                ).message
            );
        });
    });

    describe('null variables', function () {
        it('should set null to variables in shadow', function () {
            const concepts = new Concepts({
                "$service": {
                    "$parameter": "$type",
                    "response": "$responseType"
                }
            });

            const schema = concepts.create({
                "sayHello": {
                    "name": null,
                    "response": null
                }
            });

            schema.shadow.should.deep.equal({
                "service": {
                    "name": "sayHello",
                    "parameter": {
                        "name": "name",
                        "type": null
                    },
                    "responseType": null
                }
            });
        });
    });
});
