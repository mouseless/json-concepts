const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('specs/custom-types/defining-a-custom-type', function () {
    it('should parse custom type and include it in shadow', function () {
        const concepts = new Concepts({
            "$service+": {
                "name": "$name:identifier"
            },
            "@types": {
                "identifier": {}
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "name": "service",
                "quantifier": { "min": 1 },
                "literal": {
                    "name": "name",
                    "variable": {
                        "name": "name",
                        "type": "identifier"
                    }
                }
            }
        });

        concepts.validate({
            "sayHello": {
                "name": "sayHello"
            }
        });
    });

    describe('specifying a base type', function () {
        it('should use base type of custom type when validating values', function () {
            const concepts = new Concepts({
                "$service+": {
                    "name": "$name:identifier"
                },
                "@types": {
                    "identifier": {
                        "type": "string"
                    }
                }
            });

            (() => concepts.validate({
                "sayHello": {
                    "name": "sayHello"
                }
            })).should.not.throw();

            (() => concepts.validate({
                "sayHello": {
                    "name": 100
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE('100', 'identifier')
                ).message
            );
        });

        it('should use any type when no base type is specified', function () {
            const concepts = new Concepts({
                "$any*": "$value:x-any",
                "@types": {
                    "x-any": {}
                }
            });

            (() => concepts.validate({
                "string": "string",
                "number": 100,
                "boolean": true
            })).should.not.throw();
        });

        it('should allow built-in types as base type', function () {
            (() => new Concepts({
                "x-string": "$string:x-string",
                "x-boolean": "$boolean:x-boolean",
                "x-number": "$number:x-number",
                "x-any": "$any:x-any",
                "@types": {
                    "x-string": { "type": "string" },
                    "x-boolean": { "type": "boolean" },
                    "x-number": { "type": "number" },
                    "x-any": { "type": "any" }
                }
            })).should.not.throw();
        });

        it('should give error when base type is not defined', function () {
            (() => new Concepts({
                "$service+": {
                    "name": "$name:identifier"
                },
                "@types": {
                    "identifier": {
                        "type": "text"
                    }
                }
            })).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.Unknown_type_TYPE('text')
                ).message
            );
        });
    });
});
