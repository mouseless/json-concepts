const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should: buildShould } = require('chai');

const should = buildShould();

describe('spec/variables/variable-types', function () {
    it('should parse variable type', function () {
        const concepts = new Concepts({
            "$service+": {
                "$flag*": "$enabled:boolean"
            }
        });

        concepts.shadow.should.deep.equal({
            "concept": {
                "name": "service",
                "quantifier": { "min": 1 },
                "concept": {
                    "name": "flag",
                    "quantifier": { "min": 0 },
                    "variable": {
                        "name": "enabled",
                        "type": "boolean"
                    }
                }
            }
        });
    });

    it('should give error when type is not defined after :', function () {
        (() => new Concepts({
            "$service+": {
                "$flag*": "$enabled:"
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.Cannot_parse_EXPRESSION__a_type_was_expected_after_symbol(
                    '$enabled:'
                )
            ).message
        );
    });

    describe('available variable types', function () {
        it('should support any', function () {
            const concepts = new Concepts({
                "$key*": "$any:any"
            });

            (() => concepts.validate({
                "boolean": true,
                "number": 1,
                "string": "text"
            })).should.not.throw();
        });

        it('should support string', function () {
            const concepts = new Concepts({
                "key": "$string:string"
            });

            (() => concepts.validate({
                "key": "text"
            })).should.not.throw();

            (() => concepts.validate({
                "key": true
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        'true', 'string'
                    )
                ).message
            );
        });

        it('should support boolean', function () {
            const concepts = new Concepts({
                "key": "$boolean:boolean"
            });

            (() => concepts.validate({
                "key": true
            })).should.not.throw();

            (() => concepts.validate({
                "key": "string"
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        'string', 'boolean'
                    )
                ).message
            );
        });

        it('should support number', function () {
            const concepts = new Concepts({
                "key": "$number:number"
            });

            (() => concepts.validate({
                "key": 0
            })).should.not.throw();

            (() => concepts.validate({
                "key": "string"
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        'string', 'number'
                    )
                ).message
            );
        });

        it('should give error when given type is not supported', function () {
            (() => new Concepts({
                "$service+": {
                    "$flag*": "$enabled:text"
                }
            })).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.Unknown_type_TYPE_in_EXPRESSION(
                        'text', '$enabled:text'
                    )
                ).message
            );
        });

        it('should allow any value when type is not specified', function () {
            const concepts = new Concepts({
                "$key*": "$any"
            });

            (() => concepts.validate({
                "boolean": true,
                "number": 1,
                "string": "text"
            })).should.not.throw();
        });

        it('should include type only when type is given explicitly', function () {
            const concepts = new Concepts({
                "implicit": "$implicit",
                "explicit": "$explicit:any"
            });

            should.not.exist(concepts.shadow.literal[0].variable.type);
            concepts.shadow.literal[1].variable.type.should.equal('any');
        });

        it('should not allow objects for any type', function () {
            const concepts = new Concepts({
                "implicit?": "$implicit",
                "explicit?": "$explicit:any"
            });

            (() => concepts.validate({
                "implicit": {
                    "is": "invalid"
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.Object_not_expected(
                        { "is": "invalid" }
                    )
                ).message
            );

            (() => concepts.validate({
                "explicit": {
                    "is": "invalid"
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.Object_not_expected(
                        { "is": "invalid" }
                    )
                ).message
            );
        })
    });
});
