const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/quantifiers/zero-or-more', function () {
    it('should allow a concept to have one or many instances in schema', function () {
        const concepts = new Concepts({
            "$service+": {
                "$parameter*": "$type"
            }
        });

        (() => concepts.validate({
            "sayHello": {
                "name": "string",
                "surname": "string"
            },
            "sayGoodbye": {}
        })).should.not.throw();
    });

    describe('key literals', function () {
        it('should allow a literal to not exist', function () {
            (() => new Concepts({
                "$service+": {
                    "$parameter*": "$type",
                    "tags*": "$tags"
                }
            })).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.LITERAL_cannot_have_QUANTIFIER(
                        'tags', '*'
                    )
                ).message
            );
        });
    });

    describe('concepts shadow', function () {
        it('should have set quantifier min to zero', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter*": "$type"
                }
            });

            concepts.shadow.should.deep.equal({
                "concept": {
                    "name": "service",
                    "quantifier": { "min": 1 },
                    "concept": {
                        "name": "parameter",
                        "quantifier": { "min": 0 },
                        "variable": {
                            "name": "type"
                        }
                    }
                }
            });
        });
    });

    describe('schema shadow', function () {
        it('should have empty arrays instead of null values', function () {
            const concepts = new Concepts({
                "$service+": {
                    "$parameter*": "$type"
                }
            });

            const schema = concepts.create({
                "sayHello": {
                    "name": "string",
                    "surname": "string"
                },
                "sayGoodbye": {}
            });

            schema.shadow.should.deep.equal({
                "service": [
                    {
                        "name": "sayHello",
                        "parameter": [
                            {
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "name": "surname",
                                "type": "string"
                            }
                        ]
                    },
                    {
                        "name": "sayGoodbye",
                        "parameter": []
                    }
                ]
            });
        });
    });
});
