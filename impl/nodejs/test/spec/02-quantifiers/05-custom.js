const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/quantifiers/custom', function () {
    it('should support curly bracket syntax', function () {
        const concepts = new Concepts({
            "$service{1,3}": {
                "$parameter{,2}": "$type",
                "response{1}": {
                    "$status{0,}": "$responseType"
                }
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "_": "service",
                "quantifier": { "min": 1, "max": 3 },
                "literal": {
                    "_": "response",
                    "quantifier": { "min": 1, "max": 1 },
                    "concept": {
                        "_": "status",
                        "quantifier": { "min": 0 },
                        "variable": {
                            "_": "responseType"
                        }
                    }
                },
                "concept": {
                    "_": "parameter",
                    "quantifier": { "max": 2 },
                    "variable": {
                        "_": "type"
                    }
                }
            }
        });
    });

    it('should include check min max values and include them in error messages', function () {
        throw new Error('not revised');
        const concepts = new Concepts({
            "$service{1,3}": {
                "$parameter{,2}": "$type",
                "response{1}": {
                    "$status{0,}": "$responseType"
                }
            }
        });

        (() => concepts.validate({}))
            .should.throw(
                error.Schema_definition_is_not_valid__because__REASON(
                    because => because.Minimum_allowed_number_of_CONCEPT_is_MIN__but_got_COUNT(
                        'service', 1, 0
                    )
                ).message
            );

        (() => concepts.validate({
            "a": { "response": "string", "tags": ["readonly", "friendly"] },
            "b": { "response": "string", "tags": ["readonly", "friendly"] },
            "c": { "response": "string", "tags": ["readonly", "friendly"] },
            "d": { "response": "string", "tags": ["readonly", "friendly"] }
        })).should.throw(
            error.Schema_definition_is_not_valid__because__REASON(
                because => because.Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT(
                    'service', 3, 4
                )
            ).message
        );

        (() => concepts.validate({
            "sayHello": {
                "name": "string",
                "middle": "string",
                "surname": "string",
                "response": "string",
                "tags": ["readonly", "friendly"]
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__because__REASON(
                because => because.Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT(
                    'parameter', 2, 3
                )
            ).message
        );

        (() => concepts.validate({
            "sayHello": {}
        })).should.throw(
            error.Schema_definition_is_not_valid__because__REASON(
                because => because.LITERAL_is_missing('response')
            ).message
        );
    });

    it('should only allow quantifier max 1 for key literals', function() {
        throw new Error('not implemented');
    });
});