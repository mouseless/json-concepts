const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const { should } = require('chai');
const { dimensions } = require('../../../src/util/arrayify');
const { readTestCase } = require('../../lib');

should();

describe('specs/arrays/object-arrays', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow object arrays for literals', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));
    });

    it('should give error when array does not have a definition', function () {
        (() => new Concepts({
            'array': []
        })).should.throw(
            error.Concepts_definition_is_not_valid__REASON(
                because => because.KEY_array_should_have_1_item__but_got_COUNT(
                    'array', 0
                )
            ).message
        );

        (() => new Concepts({
            'array': [{}]
        })).should.not.throw();
    });

    describe('schema', function () {
        const from = (path) => readTestCase(this, path);

        it('should validate object arrays', function () {
            const concepts = new Concepts(from('../service.concepts.json'));

            const schema = concepts.create(from('greeting.service.json'));

            schema.shadow.should.deep.equal(from('greeting.service-shadow.json'));
        });

        it('should validate every item in object array', function () {
            const concepts = new Concepts(from('../service.concepts.json'));

            (() => concepts.validate({
                'sayHello': {
                    'parameters': [{}]
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.LITERAL_is_missing('name')
                ).message
            );

            (() => concepts.validate({
                'sayHello': {
                    'parameters': [
                        { 'name': 'string', 'type': 'string' },
                        { 'type': 'string' }
                    ]
                }
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.LITERAL_is_missing('name')
                ).message
            );
        });

        it('should not accept arrays when object array is not expected', function () {
            const concepts = new Concepts({
                'zero': { 'value': '$value' }
            });

            (() => concepts.validate({
                'zero': [{}]
            })).should.throw(
                error.Schema_definition_is_not_valid__REASON(
                    because => because.VARIABLE_is_not_an_array(
                        'zero'
                    )
                ).message
            );
        });

        it('should treat the literal that holds the object array as a schema node', function () {
            const concepts = new Concepts({
                '$service+': {
                    'parameters?': [{
                        'name': '$pName'
                    }]
                }
            });

            const schema = concepts.create({
                'sayHello': {
                    'parameters': [{
                        'name': 'name'
                    }]
                }
            });

            const sayHello = schema._shadow.getSchemas('service')[0];
            const parameters = sayHello.getSchemas('parameters')[0];

            parameters.data.should.deep.equal({
                'pName': 'name'
            });
        });
    });

    describe('concepts-vs-arrays', function () {
        const from = (path) => readTestCase(this, path);

        it('should cast the same schema shadow', function () {
            const concepts = new Concepts(from('concepts/service.concepts.json'));
            const schema1 = concepts.create(from('concepts/greeting.service.json'));

            const objectArray = new Concepts(from('arrays/service.concepts.json'));
            const schema2 = objectArray.create(from('arrays/greeting.service.json'));

            schema1.shadow.should.deep.equal(from('greeting.service-shadow.json'));
            schema2.shadow.should.deep.equal(from('greeting.service-shadow.json'));
        });
    });

    describe('concepts-and-arrays', function () {
        const from = (path) => readTestCase(this, path);

        it('should allow concepts under object arrays', function () {
            (() => new Concepts(from('sample-1.concepts.json')))
                .should.not.throw();
        });

        it('should allow object arrays under concepts', function () {
            (() => new Concepts(from('sample-2.concepts.json')))
                .should.not.throw();
        });

        it('should concepts under object arrays under concepts', function () {
            (() => new Concepts(from('sample-3.concepts.json')))
                .should.not.throw();
        });
    });

    describe('multi-dimensional', function () {
        const from = (path) => readTestCase(this, path);

        it('should allow more than one dimensions', function () {
            const concepts = new Concepts(from('matrix.concepts.json'));

            const schema = concepts.create(from('two.matrix.json'));

            schema.shadow.should.deep.equal({
                'matrix': [[
                    { 'value': 1 },
                    { 'value': 2 }
                ]]
            });
        });

        it('should allow less dimensions in schema', function () {
            const concepts = new Concepts(from('matrix.concepts.json'));

            const two = concepts.create(from('two.matrix.json'));
            dimensions(two.shadow.matrix).should.equal(2);

            const one = concepts.create(from('one.matrix.json'));
            dimensions(one.shadow.matrix).should.equal(2);

            const zero = concepts.create(from('zero.matrix.json'));
            dimensions(zero.shadow.matrix).should.equal(2);
        });

        it('should not allow more dimensions than expected', function () {
            const concepts = new Concepts(from('matrix.concepts.json'));

            (() => concepts.create(from('invalid.matrix.json')))
                .should.throw(
                    error.Schema_definition_is_not_valid__REASON(
                        because => because.VARIABLE_expects_at_most_EXPECTED_dimensional_array__but_got_ACTUAL(
                            'matrix', 2, 3
                        )
                    ).message
                );
        });
    });
});
