const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const fs = require('mock-fs');
const { should } = require('chai');

should();

describe('specs/quantifiers/one-or-more', function () {
    it('should allow more than one concept', function () {
        const concepts = new Concepts({
            "$service+": {
                "$parameter?": "$type"
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "name": "string"
            },
            "sayGoodbye": {}
        })).should.not.throw();
    });

    describe('requires at least one', function () {
        it('should give error when at least one of that concept was not given', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter?": "$type"
                }
            });

            (() => concepts.validate({}))
                .should.throw(
                    error.Schema_definition_is_not_valid__REASON(
                        because => because.Minimum_allowed_number_of_CONCEPT_is_MIN__but_got_COUNT(
                            'service', 1, 0
                        )
                    ).message
                );
        });
    });

    describe('key literals', function () {
        after(function () {
            fs.restore();
        });

        it('should allow arrays as values of key literals', function () {
            (() => new Concepts({
                "$service+": {
                    "$parameter?": "$type",
                    "tags+": "$tags"
                }
            })).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.LITERAL_cannot_have_QUANTIFIER('tags', '+')
                ).message
            );
        });

        it('should give error with file path when loaded from file', async function () {
            fs({
                'service.concepts.json': JSON.stringify({
                    "$service+": {
                        "$parameter?": "$type",
                        "tags+": "$tags"
                    }
                })
            });

            await Concepts.load('service.concepts.json').should.be.rejectedWith(
                error.CONCEPTS_is_not_valid__Error_is__ERROR(
                    'service.concepts.json',
                    error.Concepts_definition_is_not_valid__REASON(
                        because => because.LITERAL_cannot_have_QUANTIFIER(
                            'tags', '+'
                        )
                    ).message
                ).message
            );
        });
    });

    describe('concepts shadow', function () {
        it('should not have max quantifier in shadow', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter?": "$type"
                }
            });

            concepts.shadow.should.deep.equal({
                "concept": {
                    "name": "service",
                    "quantifier": { "min": 1 },
                    "concept": {
                        "name": "parameter",
                        "quantifier": { "min": 0, "max": 1 },
                        "variable": {
                            "name": "type"
                        }
                    }
                }
            })
        });
    });

    describe('schema shadow', function () {
        it('should have array instead of object for concept value of the shadow', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter?": "$type"
                }
            });

            const schema = concepts.create({
                "sayHello": {
                    "name": "string",
                },
                "sayGoodbye": {}
            });

            schema.shadow.should.deep.equal({
                "service": [
                    {
                        "name": "sayHello",
                        "parameter": {
                            "name": "name",
                            "type": "string"
                        }
                    },
                    {
                        "name": "sayGoodbye",
                        "parameter": null
                    }
                ]
            });
        });

        it('should have array even if there is only one item', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter?": "$type"
                }
            });

            const schema = concepts.create({
                "sayHello": {
                    "name": "string",
                }
            });

            schema.shadow.should.deep.equal({
                "service": [
                    {
                        "name": "sayHello",
                        "parameter": {
                            "name": "name",
                            "type": "string"
                        }
                    }
                ]
            });
        });
    });
});
