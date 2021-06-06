const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/custom-types/regex-validator', function () {
    const from = (path) => readTestCase(this, path);

    it('should validate value against given regex pattern', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting.service.json'))).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(
                    'say hello', 'identifier'
                )
            ).message
        );

        (() => concepts.validate({
            'service': {
                'name': 'sayHello'
            }
        })).should.not.throw();
    });

    it('should allow regex only for string based custom types', function () {
        (() => new Concepts({
            '@types': {
                'identifier': {
                    'type': 'number',
                    'regex': '^[a-zA-Z]*$'
                }
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.VALIDATOR_does_not_support_TYPE(
                    'regex', 'number'
                )
            ).message
        );

        (() => new Concepts({
            '@types': {
                'identifier': {
                    'regex': '^[a-zA-Z]*$'
                }
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.VALIDATOR_does_not_support_TYPE(
                    'regex', 'any'
                )
            ).message
        );
    });

    it('should give error for an unknown validator', function () {
        (() => new Concepts({
            '@types': {
                'identifier': {
                    'type': 'number',
                    'non-existing-validator': null
                }
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.VALIDATOR_does_not_exist(
                    'non-existing-validator'
                )
            ).message
        );
    });

    describe('short-hand', function () {
        const from = (path) => readTestCase(this, path);

        it('should validate against regex', function () {
            const longHand = new Concepts(from('../service.concepts.json'));

            const shortHand = new Concepts(from('service.concepts.json'));

            shortHand.definition.should.deep.equal(longHand.definition);
        });

        it('should give error for an unsupported shortcut', function () {
            (() => new Concepts({
                '@types': {
                    'identifier': 0
                }
            })).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.Cannot_create_a_validator_from_EXPRESSION(
                        '0'
                    )
                ).message
            );
        });
    });
});
