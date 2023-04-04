const { Concepts } = require('../../..');
const { error } = require('../../../src/util');
const fs = require('mock-fs');
const { should } = require('chai');
const { readTestCase } = require('../../lib');

should();

describe('specs/quantifiers/one-or-more', function () {
    const from = (path) => readTestCase(this, path);

    it('should allow more than one concept', function () {
        const concepts = new Concepts(from('service.concepts.json'));

        (() => concepts.validate(from('greeting.service.json')))
            .should.not.throw();
    });

    describe('at-least-one', function () {
        const from = (path) => readTestCase(this, path);

        it('should give error when at least one of that concept was not given', function () {
            const concepts = new Concepts(from('../service.concepts.json'));

            (() => concepts.validate(from('greeting.service.json')))
                .should.throw(
                    error.Schema_definition_is_not_valid__REASON(
                        because => because.Minimum_allowed_number_of_CONCEPT_is_MIN__but_got_COUNT(
                            'service', 1, 0
                        )
                    ).message
                );
        });
    });

    describe('key-literals', function () {
        const from = (path) => readTestCase(this, path);

        after(function () {
            fs.restore();
        });

        it('should not allow key literals to have + quantifier', function () {
            (() => new Concepts(from('service.concepts.json')))
                .should.throw(
                    error.Concepts_definition_is_not_valid__REASON(
                        because => because.LITERAL_cannot_have_QUANTIFIER('tags', '+')
                    ).message
                );
        });

        it('should give error with file path when loaded from file', async function () {
            fs({
                'service.concepts.json': JSON.stringify(from('service.concepts.json'))
            });

            await Concepts.load('service.concepts.json').should.be.rejectedWith(
                error.CONCEPTS_is_not_valid__Error_is__ERROR(
                    'service.concepts.json',
                    error.Concepts_definition_is_not_valid__REASON(
                        because => because.LITERAL_cannot_have_QUANTIFIER(
                            'tags', '+'
                        )
                    ).message
                ).message
            );
        });
    });

    describe('concepts-shadow', function () {
        const from = (path) => readTestCase(this, path);

        it('should not have max quantifier in shadow', function () {
            const concepts = new Concepts(from('service.concepts.json'));

            concepts.shadow.should.deep.equal(from('service.concepts-shadow.json'));
        });
    });

    describe('schema-shadow', function () {
        const from = (path) => readTestCase(this, path);

        it('should have array instead of object for concept value of the shadow', function () {
            const concepts = new Concepts(from('../service.concepts.json'));

            const schema = concepts.create(from('greeting-1.service.json'));

            schema.shadow.should.deep.equal(from('greeting-1.service-shadow.json'));
        });

        it('should have array even if there is only one item', function () {
            const concepts = new Concepts(from('../service.concepts.json'));

            const schema = concepts.create(from('greeting-2.service.json'));

            schema.shadow.should.deep.equal(from('greeting-2.service-shadow.json'));
        });
    });
});
