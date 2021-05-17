const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('specs/custom-types/inheritance', function () {
    it('should allow deriving a custom type from a custom type', function () {
        const concepts = new Concepts({
            "$service+": {
                "$parameter*": "$type:primitive"
            },
            "@types": {
                "primitive": {
                    "type": "type",
                    "enum": ["number", "boolean", "float"]
                },
                "type": {
                    "type": "identifier",
                    "enum": ["string", "number", "boolean", "date", "email"]
                },
                "identifier": "^[a-zA-Z][0-9a-zA-Z]*$"
            }
        });

        (() => concepts.validate({
            "sayGoodbye": {
                "cry": "boolean"
            }
        })).should.not.throw();

        (() => concepts.validate({
            "sayHello": {
                "name": "float"
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(
                    "float", "primitive"
                )
            ).message
        );
    });

    describe('circular dependency', function () {
        it('should not allow creating circular dependencies', function () {
            (() => new Concepts({
                "circular": "$type:a",
                "@types": {
                    "a": { "type": "b" },
                    "b": { "type": "c" },
                    "c": { "type": "a" }
                }
            })).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.TYPE_cannot_inherit_from_BASE__it_would_cause_a_circular_dependency(
                        'c', 'a'
                    )
                ).message
            );
        });
    });
});
