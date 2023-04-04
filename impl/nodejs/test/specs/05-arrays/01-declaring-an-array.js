const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/arrays/declaring-an-array', function () {
    const from = (path) => readTestCase(this, path);

    it('should make variable one dimensional', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));
    });

    it('should give error when more than one item exists in array definition', function () {
        (() => new Concepts({
            '$service+': {
                'tags?': ['$tags', 'not allowed']
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.KEY_array_should_have_1_item__but_got_COUNT(
                    'tags', 2
                )
            ).message
        );
    });

    it('should expect variable inside an array', function () {
        (() => new Concepts({
            '$service+': {
                'tags?': ['tags']
            }
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.Expected_a_variable__but_got_a_literal__EXPRESSION(
                    'tags'
                )
            ).message
        );
    });

    describe('arrays', function () {
        const from = (path) => readTestCase(this, path);

        it('should make variable one dimensional', function () {
            const concepts = new Concepts(from('service.concepts.json'));

            concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));
        });
    });

    describe('schemas', function () {
        const from = (path) => readTestCase(this, path);

        it('should allow arrays as values', function () {
            const concepts = new Concepts(from('service.concepts.json'));

            const schema = concepts.create(from('greeting.service.json'));

            schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
        });

        it('should give error when value has more dimensions than definition', function () {
            const concepts = new Concepts({
                'zero?': '$zero',
                'one?': ['$one']
            });

            (() => concepts.validate({
                'zero': ['not valid']
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VARIABLE_is_not_an_array(
                        'zero'
                    )
                ).message
            );

            (() => concepts.validate({
                'one': [['not valid']]
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VARIABLE_expects_at_most_EXPECTED_dimensional_array__but_got_ACTUAL(
                        'one', 1, 2
                    )
                ).message
            );
        });
    });

    describe('single-item', function () {
        const from = (path) => readTestCase(this, path);

        it('should allow zero dimensions, but shadow should have it in array', function () {
            const concepts = new Concepts(from('../schemas/service.concepts.json'));

            const schema = concepts.create(from('greeting.service.json'));

            schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
        });

        it('should allow null, treat it as an empty array', function () {
            const concepts = new Concepts(from('../schemas/service.concepts.json'));

            const schema = concepts.create({
                'sayHello': {
                    'name': null,
                    'tags': null,
                }
            });

            schema.shadow.should.deep.equal({
                'service': [
                    {
                        'name': 'sayHello',
                        'parameter': [
                            {
                                'name': 'name',
                                'types': []
                            }
                        ],
                        'tags': []
                    }
                ]
            });
        });
    });

    describe('multi-dimensional', function () {
        const from = (path) => readTestCase(this, path);

        it('should make variable a multi-dimensional array', function () {
            const concepts = new Concepts(from('matrix.concepts.json'));

            concepts.shadow.should.deep.equal(from('matrix.concepts-shadow.json'));

            const schema = concepts.create(from('sample.matrix.json'));

            schema.shadow.should.deep.equal(from('sample.matrix-shadow.json'));
        });

        it('should give error when more than one item exists in array definition', function () {
            (() => new Concepts({
                '$matrix*': [['$value', 'not allowed']]
            })).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.KEY_array_should_have_1_item__but_got_COUNT(
                        'matrix', 2
                    )
                ).message
            );

            (() => new Concepts({
                '$matrix*': [['$value'], ['not allowed']]
            })).should.throw(
                error.Concepts_definition_is_not_valid__REASON(
                    because => because.KEY_array_should_have_1_item__but_got_COUNT(
                        'matrix', 2
                    )
                ).message
            );
        });

        it('should give error when value has more dimensions than definition', function () {
            const concepts = new Concepts({
                '$matrix*': [['$value']]
            });

            (() => concepts.validate({
                'matrix': [[[3]]]
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VARIABLE_expects_at_most_EXPECTED_dimensional_array__but_got_ACTUAL(
                        'value', 2, 3
                    )
                ).message
            );
        });

        it('should not allow objects in arrays', function () {
            const concepts = new Concepts({
                'explicit?': ['$explicit:any'],
                'implicit?': ['$implicit']
            });

            (() => concepts.validate({
                'explicit': [
                    { 'is': 'invalid' }
                ]
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.Object_not_expected(
                        { 'is': 'invalid' }
                    )
                ).message
            );

            (() => concepts.validate({
                'implicit': [
                    { 'is': 'invalid' }
                ]
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.Object_not_expected(
                        { 'is': 'invalid' }
                    )
                ).message
            );
        });
    });
});
