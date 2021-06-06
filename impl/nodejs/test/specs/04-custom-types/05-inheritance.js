const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/custom-types/inheritance', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow deriving a custom type from a custom type', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting.service.json')))
            .should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        'float', 'primitive'
                    )
                ).message
            );

        (() => concepts.validate({
            'sayGoodbye': {
                'cry': 'boolean'
            }
        })).should.not.throw();
    });

    describe('circular', function () {
        const from = (path) => readTestCase(this, path);

        it('should not allow creating circular dependencies', function () {
            (() => new Concepts(from('circular.concepts.json')))
                .should.throw(
                    error.Concepts_definition_is_not_valid__REASON(
                        because => because.TYPE_cannot_inherit_from_BASE__it_would_cause_a_circular_dependency(
                            'c', 'a'
                        )
                    ).message
                );
        });
    });
});
