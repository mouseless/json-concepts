const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');

should();

describe('spec/custom-types/regex-validator', function () {
    it('should validate value against given regex pattern', function () {
        const concepts = new Concepts({
            "$service+": {
                "name": "$name:identifier"
            },
            "@types": {
                "identifier": {
                    "type": "string",
                    "regex": "/^[a-zA-Z]*$/g"
                }
            }
        });

        (() => concepts.validate({
            "service": {
                "name": "sayHello"
            }
        })).should.not.throw();

        (() => concepts.validate({
            "service": {
                "name": "say hello"
            }
        })).should.throw(
            error.Schema_definition_is_not_valid__because__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(
                    'say hello', 'identifier'
                )
            ).message
        );
    });

    it('should only allow regex for string based custom types', function () {
        (() => new Concepts({
            "@types": {
                "identifier": {
                    "type": "number",
                    "regex": "/^[a-zA-Z]*$/g"
                }
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__because__REASON(
                because => because.VALIDATOR_does_not_support_TYPE(
                    'regex', 'number'
                )
            ).message
        );

        (() => new Concepts({
            "@types": {
                "identifier": {
                    "regex": "/^[a-zA-Z]*$/g"
                }
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__because__REASON(
                because => because.VALIDATOR_does_not_support_TYPE(
                    'regex', 'any'
                )
            ).message
        );
    });

    it('should give error for an unknown validator', function () {
        (() => new Concepts({
            "@types": {
                "identifier": {
                    "type": "number",
                    "non-existing-validator": null
                }
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__because__REASON(
                because => because.VALIDATOR_does_not_exist(
                    'non-existing-validator'
                )
            ).message
        );
    });

    describe('short-hand usage', function () {
        it('should validate against regex', function () {
            const concepts = new Concepts({
                "$service+": {
                    "name": "$name:identifier"
                },
                "@types": {
                    "identifier": "/^[a-zA-Z]*$/g"
                }
            });

            (() => concepts.validate({
                "service": {
                    "name": "say hello"
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__because__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        'say hello', 'identifier'
                    )
                ).message
            );
        });

        it('should give error for an unsupported shortcut', function () {
            (() => new Concepts({
                "@types": {
                    "identifier": "invalid shortcut"
                }
            })).should.throw(
                error.Concepts_definition_is_not_valid__because__REASON(
                    because => because.Cannot_create_a_validator_from_EXPRESSION(
                        'invalid shortcut'
                    )
                ).message
            );
        });
    });
});