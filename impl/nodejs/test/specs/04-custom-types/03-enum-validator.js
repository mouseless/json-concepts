const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/custom-types/enum-validator', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow only one of enum members', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting.service.json')))
            .should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VALUE_is_not_a_valid_TYPE(
                        '404', 'httpStatus'
                    )
                ).message
            );
    });

    it('should not give error when value is one of the items', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate({
            'sayHello': {
                'statusCode': 200
            }
        })).should.not.throw();
    });

    describe('short-hand', function () {
        const from = (path) => readTestCase(this, path);

        it('should recognize enum validator from array definition', function () {
            const longHand = new Concepts(from('../service.concepts.json'));

            const shortHand = new Concepts(from('service.concepts.json'));

            shortHand.definition.should.deep.equal(longHand.definition);
            shortHand.types.find(type => type.name === 'httpStatus')
                .base.name.should.equal('number');
        });

        it('should have common type of all values as a base type automatically', function () {
            const concepts = new Concepts({
                '@types': {
                    'numbers': [200, 400, 500],
                    'strings': ['A', 'B', 'C'],
                    'booleans': [true, false]
                }
            });

            concepts.types.find(type => type.name === 'numbers')
                .base.name.should.equal('number');
            concepts.types.find(type => type.name === 'strings')
                .base.name.should.equal('string');
            concepts.types.find(type => type.name === 'booleans')
                .base.name.should.equal('boolean');
        });
    });

    describe('any', function () {
        const from = (path) => readTestCase(this, path);

        it('should have any base type when multiple type of objects exist in enum array', function () {
            const concepts = new Concepts(from('service.concepts.json'));

            concepts.types.find(type => type.name === 'httpStatus')
                .base.name.should.be.equal('any');
        });
    });
});
