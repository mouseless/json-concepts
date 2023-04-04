const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/arrays/array-item-type', function () {
    const from = (path) => readTestCase(this, path);

    it('should validate array items against its type expression', function () {
        const concepts = new Concepts(from('tags.concepts.json'));

        (() => concepts.validate(from('invalid.tags.json'))).should.throw(
            error.Schema_definition_is_not_valid__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(
                    '0', 'string'
                )
            ).message
        );

        (() => concepts.validate({
            'tags': ['only', 'strings', 'allowed']
        })).should.not.throw();
    });

    describe('custom', function () {
        const from = (path) => readTestCase(this, path);

        it('should allow usage of custom type definitions', function () {
            const concepts = new Concepts(from('season.concepts.json'));

            (() => concepts.validate(from('invalid.season.json')))
                .should.throw(
                    error.Schema_definition_is_not_valid__REASON(
                        because => because.VALUE_is_not_a_valid_TYPE(
                            'AUH', 'month'
                        )
                    ).message
                );

            (() => concepts.validate({
                'summer': ['JUN', 'JUL', 'AUG']
            })).should.not.throw();
        });
    });
});
